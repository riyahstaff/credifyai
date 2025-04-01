
import { CreditReportData } from '@/utils/creditReport/types';
import { parseReportContent } from '@/utils/creditReport/parser/parseReportContent';
import { extractTextFromPDF } from '@/utils/creditReport/extractors/pdfExtractor';
import { Toast } from '@/hooks/use-toast';

export interface AnalysisHandlerProps {
  uploadedFile: File;
  setReportData: (data: CreditReportData) => void;
  setIssues: (issues: any[]) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
  toast: Toast;
}

// The main handler for analyzing uploaded credit reports
export const analyzeReport = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    // Report the start of processing
    onProgress?.(10);
    
    // Extract text from the file (PDF or text)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    let textContent = '';
    
    if (isPdf) {
      textContent = await extractTextFromPDF(file);
      onProgress?.(30);
    } else {
      textContent = await file.text();
      onProgress?.(40);
    }
    
    // Parse the text content into structured data
    onProgress?.(50);
    const reportData = parseReportContent(textContent, isPdf);
    
    // Additional processing and enhancement
    onProgress?.(70);
    
    // Further analyze for issues
    onProgress?.(90);
    
    // Complete the analysis
    onProgress?.(100);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw new Error(`Failed to analyze report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Handle the analysis completion
export const handleAnalysisComplete = async (params: AnalysisHandlerProps) => {
  const {
    uploadedFile,
    setReportData,
    setIssues,
    setLetterGenerated,
    setAnalysisError,
    setAnalyzing,
    setAnalyzed,
    toast
  } = params;

  try {
    console.log("Starting analysis of credit report:", uploadedFile.name);
    
    // Check if we have sample data loaded
    const useSample = sessionStorage.getItem('sampleReportsLoaded') === 'true';
    
    if (useSample) {
      console.log("Using sample credit report data for analysis");
      
      // Import sample data
      const { getSampleReportData } = await import('@/utils/creditReport/disputeLetters/sampleLetters');
      const sampleData = getSampleReportData();
      
      // Simulate analysis steps
      setTimeout(() => {
        setReportData(sampleData);
        setIssues([
          {
            type: 'Account Error',
            title: 'Late Payment Reporting Error',
            description: 'Account shows late payments that were actually paid on time.',
            impact: 'High Impact',
            impactColor: 'text-red-500',
            account: sampleData.accounts[0],
            laws: ['FCRA Section 623']
          }
        ]);
        setAnalyzing(false);
        setAnalyzed(true);
        
        console.log("Sample analysis complete");
        toast.toast({
          title: "Analysis Complete",
          description: "Sample report analyzed successfully.",
        });
      }, 2000);
      
      return;
    }
    
    // Process real report
    console.log("Processing uploaded report:", uploadedFile.name);
    const reportData = await analyzeReport(uploadedFile);
    
    if (!reportData) {
      throw new Error("Failed to parse credit report");
    }
    
    // Set the report data
    setReportData(reportData);
    
    // Generate issues from the report data
    const generatedIssues = extractIssuesFromReport(reportData);
    setIssues(generatedIssues);
    
    // Mark analysis as complete
    setAnalyzing(false);
    setAnalyzed(true);
    
    console.log("Credit report analysis complete");
    toast.toast({
      title: "Analysis Complete",
      description: "Credit report analyzed successfully.",
    });
    
  } catch (error) {
    console.error("Error in handleAnalysisComplete:", error);
    
    setAnalysisError(error instanceof Error ? error.message : "Unknown error occurred");
    setAnalyzing(false);
    setAnalyzed(true);
    
    toast.toast({
      title: "Analysis Error",
      description: error instanceof Error ? error.message : "Failed to analyze report",
      variant: "destructive",
    });
  }
};

// Helper function to extract issues from the report
function extractIssuesFromReport(reportData: CreditReportData): any[] {
  // This is a placeholder implementation
  const issues: any[] = [];
  
  if (reportData.accounts && reportData.accounts.length > 0) {
    // Check for late payments
    const accountsWithLatePayments = reportData.accounts.filter(
      account => account.paymentStatus && account.paymentStatus.toLowerCase().includes('late')
    );
    
    for (const account of accountsWithLatePayments) {
      issues.push({
        type: 'Late Payment',
        title: `Late Payment on ${account.accountName}`,
        description: `Account shows late payments that may be inaccurate.`,
        impact: 'High Impact',
        impactColor: 'text-red-500',
        account,
        laws: ['FCRA Section 623']
      });
    }
    
    // Check for high utilization
    const accountsWithHighBalance = reportData.accounts.filter(account => {
      const balance = account.currentBalance || account.balance || 0;
      const limit = account.creditLimit || 0;
      return limit > 0 && (balance / limit) > 0.7;
    });
    
    for (const account of accountsWithHighBalance) {
      issues.push({
        type: 'High Utilization',
        title: `High Balance on ${account.accountName}`,
        description: `Credit utilization ratio is over 70%.`,
        impact: 'Medium Impact',
        impactColor: 'text-amber-500',
        account,
        laws: ['Credit Scoring Guidelines']
      });
    }
  }
  
  return issues;
}

// Simplified analysis for testing without requiring a real file
export const analyzeTestReport = async (
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    // Simulate progress
    onProgress?.(20);
    
    // Import sample data
    const { getSampleReportData } = await import('@/utils/creditReport/disputeLetters/sampleLetters');
    const reportData = getSampleReportData();
    
    // Simulate analysis steps
    onProgress?.(50);
    setTimeout(() => onProgress?.(70), 500);
    setTimeout(() => onProgress?.(90), 1000);
    setTimeout(() => onProgress?.(100), 1500);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing test report:", error);
    throw new Error(`Failed to analyze test report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
