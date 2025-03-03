
import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

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
    // Always transition out of analyzing state first to prevent UI artifacts
    setAnalyzing(false);
    
    if (!uploadedFile) {
      console.error("No file available for analysis");
      setAnalysisError("No file was available for analysis");
      setAnalyzed(true);
      return;
    }
    
    console.log("Processing credit report:", uploadedFile.name);
    const data = await processCreditReport(uploadedFile);
    
    console.log("Enhancing report data");
    const enhancedData = enhanceReportData(data);
    setReportData(enhancedData);
    
    console.log("Identifying issues in report data");
    const detectedIssues = identifyIssues(enhancedData);
    setIssues(detectedIssues);
    
    // Auto-generate dispute letters for the most critical issues
    if (detectedIssues.length > 0 && enhancedData) {
      // Store the report data in session storage
      sessionStorage.setItem('creditReportData', JSON.stringify(enhancedData));
      
      // Find highest impact issues first
      const criticalIssues = detectedIssues.filter(issue => 
        issue.impact === 'Critical Impact' || issue.impact === 'High Impact'
      );
      
      const issueToDispute = criticalIssues.length > 0 ? criticalIssues[0] : detectedIssues[0];
      
      const bureauName = issueToDispute.account?.bureau || "Experian";
      const accountName = issueToDispute.account?.accountName || "Identified Account";
      const accountNumber = issueToDispute.account?.accountNumber;
      
      // Get user info from local storage or use placeholder
      const userInfo = {
        name: localStorage.getItem('userName') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      try {
        // Generate letter automatically
        console.log("Generating dispute letter for:", accountName);
        const letterContent = await generateEnhancedDisputeLetter(
          issueToDispute.title,
          {
            accountName: accountName,
            accountNumber: accountNumber,
            errorDescription: issueToDispute.description,
            bureau: bureauName
          },
          userInfo
        );
        
        // Store the letter data to create it in the letter page
        const disputeData = {
          bureau: bureauName,
          accountName: accountName,
          accountNumber: accountNumber,
          errorType: issueToDispute.title,
          explanation: issueToDispute.description,
          creditReport: enhancedData,
          letterContent: letterContent,
          timestamp: new Date()
        };
        
        // Store dispute data in session storage to create the letter when navigating
        sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(disputeData));
        setLetterGenerated(true);
        
        // Set a flag to indicate a letter has been generated and is ready
        sessionStorage.setItem('autoGeneratedLetter', 'true');
      } catch (error) {
        console.error("Error auto-generating dispute letter:", error);
        // Even if letter generation fails, we continue with the analysis
      }
    }
    
    // Show success toast
    toast.toast({
      title: "Analysis complete",
      description: `Found ${detectedIssues.length} potential issues in your credit report.`,
    });
    
    console.log("Setting analyzed to true");
    // This is critical - set analyzed to true to show the results
    setAnalyzed(true);
    
  } catch (error) {
    console.error("Error analyzing report:", error);
    setAnalysisError(error instanceof Error ? error.message : "Unknown error processing report");
    toast.toast({
      title: "Analysis failed",
      description: error instanceof Error ? error.message : "Failed to process your credit report.",
      variant: "destructive",
    });
    
    // Even on error, ensure we set analyzed to true
    setAnalyzed(true);
  } finally {
    // Double ensure both state flags are correctly set
    setAnalyzing(false);
    setAnalyzed(true);
  }
};
