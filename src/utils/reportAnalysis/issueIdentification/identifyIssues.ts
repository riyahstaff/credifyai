
import { CreditReportData, IdentifiedIssue } from '@/utils/creditReport/types';
import { analyzeReportForIssues } from '@/utils/creditReport/parser/analyzeReportIssues';

/**
 * Identify issues in a credit report
 */
export function identifyIssues(reportData: CreditReportData): IdentifiedIssue[] {
  console.log("Identifying issues in credit report");
  
  if (!reportData) {
    console.error("No report data provided to issue identifier");
    return [];
  }
  
  try {
    // Use our enhanced analyzer to find issues
    const issues = analyzeReportForIssues(reportData);
    
    console.log(`Found ${issues.length} issues in credit report`);
    
    return issues;
  } catch (error) {
    console.error("Error identifying issues:", error);
    return [];
  }
}
