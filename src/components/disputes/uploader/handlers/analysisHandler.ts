
import { supabase } from '@/lib/supabase/client';
import { CreditReportData, Issue } from '@/utils/creditReport/types';
import { issueDetector } from '@/lib/analyzer/issueDetector';
import { letterTemplateSelector } from '@/lib/analyzer/letterTemplateSelector';
import { generateEnhancedDisputeLetter } from '@/utils/creditReport/disputeLetters';
import { processDisputeData } from '@/components/disputes/generator/utils/letterUtils';

/**
 * Handles the completion of credit report analysis
 * @param creditReportData The parsed credit report data
 * @param userId The ID of the user who uploaded the report
 */
export async function handleAnalysisComplete(
  creditReportData: CreditReportData,
  userId: string
): Promise<{
  success: boolean;
  issues: Issue[];
  letterIds: string[];
  message: string;
}> {
  try {
    // Step 1: Detect issues in the credit report
    const detectedIssues = issueDetector.detectIssues(creditReportData);
    
    // Step 2: Store the credit report data in Supabase
    await storeCreditReport(creditReportData, userId, detectedIssues);
    
    // Step 3: Generate dispute letters for each bureau with issues
    const letterIds = await generateDisputeLetters(creditReportData, detectedIssues, userId);
    
    return {
      success: true,
      issues: detectedIssues,
      letterIds,
      message: `Analysis complete. Detected ${detectedIssues.length} issues and generated ${letterIds.length} dispute letters.`
    };
  } catch (error) {
    console.error('Error handling analysis completion:', error);
    
    return {
      success: false,
      issues: [],
      letterIds: [],
      message: `Error analyzing credit report: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Stores the credit report data in Supabase
 * @param creditReportData The parsed credit report data
 * @param userId The ID of the user who uploaded the report
 * @param issues The detected issues in the credit report
 */
async function storeCreditReport(
  creditReportData: CreditReportData,
  userId: string,
  issues: Issue[]
): Promise<void> {
  try {
    // Create a record for the credit report
    const { error } = await supabase
      .from('credit_reports')
      .insert({
        user_id: userId,
        bureau: creditReportData.primaryBureau,
        report_number: creditReportData.reportNumber,
        report_date: creditReportData.reportDate,
        personal_info: creditReportData.personalInfo,
        accounts_count: creditReportData.accounts.length,
        inquiries_count: creditReportData.inquiries.length,
        issues_count: issues.length,
        issues_summary: issues.map(issue => issue.type),
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error storing credit report:', error);
    }
  } catch (error) {
    console.error('Error storing credit report:', error);
  }
}

/**
 * Generates dispute letters for each bureau with issues
 * @param creditReportData The parsed credit report data
 * @param issues The detected issues in the credit report
 * @param userId The ID of the user who uploaded the report
 * @returns Array of generated letter IDs
 */
async function generateDisputeLetters(
  creditReportData: CreditReportData,
  issues: Issue[],
  userId: string
): Promise<string[]> {
  try {
    // Group issues by bureau
    const issuesByBureau: Record<string, Issue[]> = {};
    
    for (const issue of issues) {
      if (!issuesByBureau[issue.bureau]) {
        issuesByBureau[issue.bureau] = [];
      }
      
      issuesByBureau[issue.bureau].push(issue);
    }
    
    // Generate a letter for each bureau
    const letterIds: string[] = [];
    
    for (const [bureau, bureauIssues] of Object.entries(issuesByBureau)) {
      if (bureauIssues.length === 0) {
        continue;
      }
      
      // Process the dispute data
      const processedData = processDisputeData(creditReportData, bureauIssues);
      
      // Generate the dispute letter
      const letter = await generateEnhancedDisputeLetter(
        creditReportData,
        bureauIssues,
        userId
      );
      
      if (letter && letter.id) {
        letterIds.push(letter.id);
      }
    }
    
    return letterIds;
  } catch (error) {
    console.error('Error generating dispute letters:', error);
    return [];
  }
}
