import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';
import { loadSampleDisputeLetters } from '@/utils/creditReport/disputeLetters/sampleLettersLoader';
import { loadSampleReports } from '@/utils/creditReport/sampleReports';

export interface AnalysisProcessorProps {
  uploadedFile: File | null;
  setReportData: (data: CreditReportData) => void;
  setIssues: (issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
}

export const handleAnalysisComplete = async ({
  uploadedFile,
  setReportData,
  setIssues,
  setLetterGenerated,
  setAnalysisError,
  setAnalyzing,
  setAnalyzed,
  toast
}: AnalysisProcessorProps & { toast: ReturnType<typeof useToast> }) => {
  console.log("handleAnalysisComplete called");
  
  try {
    // Immediately set to not analyzing to ensure the UI progresses
    setAnalyzing(false);
    setAnalyzed(true);
    
    if (!uploadedFile) {
      console.error("No file available for analysis");
      setAnalysisError("No file was available for analysis");
      return;
    }
    
    console.log("Processing credit report:", uploadedFile.name);
    
    // Preload sample dispute letters
    console.log("Preloading sample dispute letters and reports");
    const sampleDisputeLetters = await loadSampleDisputeLetters();
    console.log(`Loaded ${sampleDisputeLetters.length} sample dispute letters`);
    const sampleReports = await loadSampleReports();
    console.log(`Loaded ${sampleReports.length} sample credit reports`);
    
    // Process the uploaded credit report
    const data = await processCreditReport(uploadedFile);
    
    console.log("Enhancing report data");
    const enhancedData = enhanceReportData(data);
    setReportData(enhancedData);
    
    console.log("Identifying issues in report data");
    let detectedIssues = identifyIssues(enhancedData);
    
    // CRITICAL: Double-check we have at least 5 issues
    if (detectedIssues.length < 5) {
      console.log("Not enough issues detected, forcing minimum 5 issues");
      
      // Keep existing issues
      const existingIssues = [...detectedIssues];
      
      // Clear existing issues to replace with mandatory ones
      detectedIssues = [];
      
      // Add these mandatory issues
      detectedIssues.push({
        type: 'fcra',
        title: 'FCRA Verification Rights',
        description: 'Under the Fair Credit Reporting Act, you have the right to dispute any information in your credit report, even if it appears accurate.',
        impact: 'High Impact' as const,
        impactColor: 'orange',
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
      });
      
      detectedIssues.push({
        type: 'credit_bureaus',
        title: 'Multi-Bureau Reporting Discrepancies',
        description: 'Information often varies between credit bureaus. Items reported to one bureau but not others should be verified for accuracy.',
        impact: 'Medium Impact' as const,
        impactColor: 'yellow',
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
      });
      
      detectedIssues.push({
        type: 'inquiry',
        title: 'Potential Unauthorized Inquiries',
        description: 'Inquiries on your credit report can lower your score. Any inquiry you did not authorize can be disputed as a violation of the FCRA.',
        impact: 'High Impact' as const,
        impactColor: 'orange',
        laws: ['FCRA § 604 (Permissible purposes of consumer reports)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
      
      detectedIssues.push({
        type: 'verification',
        title: 'Account Verification Request',
        description: 'You can request verification of all accounts on your credit report. Creditors must fully verify account details or remove them.',
        impact: 'High Impact' as const,
        impactColor: 'orange',
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
      });
      
      detectedIssues.push({
        type: 'general',
        title: 'General Credit Report Review',
        description: 'A comprehensive review of your credit report is recommended to identify any potential errors or inaccuracies that may be affecting your credit score.',
        impact: 'Medium Impact' as const,
        impactColor: 'yellow',
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
      });
      
      // Add back any existing issues that don't duplicate the mandatory ones
      for (const issue of existingIssues) {
        if (!detectedIssues.some(i => i.title === issue.title)) {
          detectedIssues.push(issue);
        }
      }
    }
    
    // Always log and set the issues
    console.log(`Found ${detectedIssues.length} potential issues:`, detectedIssues);
    setIssues(detectedIssues);
    
    // Force generate dispute letters for ALL issues
    if (enhancedData) {
      // Store the report data in session storage
      sessionStorage.setItem('creditReportData', JSON.stringify(enhancedData));
      
      // Find issues to dispute
      let issuesToDispute = detectedIssues;
      
      // Always ensure we have issues to dispute
      if (issuesToDispute.length === 0) {
        // This should never happen with our improvements, but just in case
        console.error("No issues to dispute, adding fallback issues");
        issuesToDispute = [
          {
            type: "general",
            title: "Potential Inaccuracies",
            description: "I am disputing information in my credit report that may contain inaccuracies or errors requiring investigation.",
            impact: "Medium Impact" as const,
            impactColor: "orange",
            laws: ["FCRA § 611"]
          },
          {
            type: "account",
            title: "Account Verification Request",
            description: "I am requesting verification of all account information as it may contain errors or inaccuracies.",
            impact: "Medium Impact" as const,
            impactColor: "orange",
            laws: ["FCRA § 611", "FCRA § 623"]
          }
        ];
      }
      
      // Generate dispute letters for ALL issues
      console.log(`Generating dispute letters for ${issuesToDispute.length} issues`);
      
      // Get user info from local storage or use placeholder
      const userInfo = {
        name: localStorage.getItem('userName') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      // Generate a letter for each issue
      const generatedLetters = [];
      
      for (const issue of issuesToDispute) {
        // Default to Experian if no specific bureau is mentioned
        const bureauName = issue.account?.bureau || "Experian";
        
        // Use account name from issue or title as fallback
        const accountName = issue.account?.accountName || issue.title;
        
        // Use account number from issue or "Unknown" as fallback
        const accountNumber = issue.account?.accountNumber || "Unknown";
        
        try {
          console.log(`Generating dispute letter for: ${accountName} - ${issue.title}`);
          const letterContent = await generateEnhancedDisputeLetter(
            issue.title,
            {
              accountName: accountName,
              accountNumber: accountNumber,
              errorDescription: issue.description,
              bureau: bureauName
            },
            userInfo
          );
          
          // Store the letter data
          const disputeData = {
            bureau: bureauName,
            accountName: accountName,
            accountNumber: accountNumber || "",
            errorType: issue.title,
            explanation: issue.description,
            creditReport: enhancedData,
            letterContent: letterContent,
            timestamp: new Date()
          };
          
          generatedLetters.push(disputeData);
          console.log(`Letter generated for ${accountName} - ${issue.title}`);
        } catch (error) {
          console.error(`Error generating letter for ${accountName}:`, error);
        }
      }
      
      // Ensure we have at least one letter
      if (generatedLetters.length === 0) {
        console.error("Failed to generate any dispute letters, creating fallback letter");
        
        // Create a fallback letter if all generation attempts failed
        const fallbackLetter = {
          bureau: "Experian",
          accountName: "All Accounts",
          accountNumber: "",
          errorType: "General Dispute",
          explanation: "I am disputing all information in my credit report that may be inaccurate or incomplete under my rights provided by the Fair Credit Reporting Act.",
          creditReport: enhancedData,
          letterContent: `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

Experian
P.O. Box 4500
Allen, TX 75013

RE: Dispute of Inaccurate Credit Information

To Whom It May Concern:

I am writing to dispute inaccurate information in my credit report. I have the right under the Fair Credit Reporting Act (FCRA), Section 611, to dispute incomplete or inaccurate information.

After reviewing my credit report, I have identified multiple items that I believe are inaccurate and request that they be verified and corrected.

I request that all items in my credit report be verified for accuracy. If any information cannot be fully verified, it must be removed from my credit report as required by the FCRA.

Please investigate these matters and correct my credit report accordingly.

Sincerely,

[YOUR NAME]
          `,
          timestamp: new Date()
        };
        
        generatedLetters.push(fallbackLetter);
      }
      
      if (generatedLetters.length > 0) {
        // Store all generated letters in session storage
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(generatedLetters));
        sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(generatedLetters[0]));
        
        // Set letter generated flag 
        setLetterGenerated(true);
        sessionStorage.setItem('autoGeneratedLetter', 'true');
        
        console.log(`${generatedLetters.length} letters generated and stored in session storage`);
        
        // Show success toast for letter generation
        toast.toast({
          title: "Dispute letters generated",
          description: `${generatedLetters.length} dispute letters have been created and are ready for review.`,
        });
      } else {
        console.error("Failed to generate any dispute letters");
        setAnalysisError("Failed to generate dispute letters. Please try manually creating one.");
        
        toast.toast({
          title: "Letter generation failed",
          description: "Failed to generate dispute letters. Please try creating one manually.",
          variant: "destructive",
        });
      }
    }
    
    // Show success toast for analysis
    toast.toast({
      title: "Analysis complete",
      description: `Found ${detectedIssues.length} potential issues in your credit report.`,
    });
    
  } catch (error) {
    console.error("Error analyzing report:", error);
    setAnalysisError(error instanceof Error ? error.message : "Unknown error processing report");
    setAnalyzing(false);
    setAnalyzed(true);
    
    toast.toast({
      title: "Analysis failed",
      description: error instanceof Error ? error.message : "Failed to process your credit report.",
      variant: "destructive",
    });
  }
};
