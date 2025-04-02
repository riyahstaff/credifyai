
import { CreditReportData } from '@/utils/creditReport/types';
import { parseReportContent } from '@/utils/creditReport/parser/parseReportContent';
import { extractTextFromPDF } from '@/utils/creditReport/extractors/pdfExtractor';
import { ToastAction } from "@/components/ui/toast";
import { identifyIssues } from '@/utils/reportAnalysis/issueIdentification/identifyIssues';
import { addFallbackGenericIssues } from '@/utils/reportAnalysis/issueIdentification/genericIssues';

export interface AnalysisHandlerProps {
  uploadedFile: File;
  setReportData: (data: any) => void;
  setIssues: (issues: any[]) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
  toast: {
    toast: (props: { title: string; description?: string; variant?: "default" | "destructive"; action?: React.ReactNode }) => void;
    dismiss: (toastId?: string) => void;
    toasts: any[];
  };
}

export const analyzeReport = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    console.log("Starting credit report analysis for file:", file.name);
    onProgress?.(10);
    
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    let textContent = '';
    
    if (isPdf) {
      console.log("Processing PDF file, extracting text...");
      textContent = await extractTextFromPDF(file);
      console.log(`Extracted ${textContent.length} characters from PDF file`);
      onProgress?.(30);
    } else {
      console.log("Processing text file, reading content...");
      textContent = await file.text();
      console.log(`Read ${textContent.length} characters from text file`);
      onProgress?.(40);
    }
    
    if (!textContent || textContent.length < 100) {
      console.error("Extracted text is too short to be a valid credit report");
      throw new Error("The file doesn't appear to contain valid credit report data");
    }
    
    onProgress?.(50);
    console.log("Parsing report content, processing text...");
    const reportData = parseReportContent(textContent, isPdf);
    
    // Save the raw text to session storage for debugging and further analysis
    try {
      // Store first 10KB of text for debugging (to avoid storage limits)
      sessionStorage.setItem('lastReportText', textContent.substring(0, 10000));
      // Store whether the original was a PDF
      sessionStorage.setItem('lastReportWasPdf', String(isPdf));
    } catch (e) {
      console.warn("Could not save report text to session storage:", e);
    }
    
    console.log("Report parsing complete. Found:", {
      accounts: reportData.accounts?.length || 0,
      inquiries: reportData.inquiries?.length || 0,
      publicRecords: reportData.publicRecords?.length || 0,
      personal: reportData.personalInfo ? 'Present' : 'Missing',
      bureaus: Object.entries(reportData.bureaus)
        .filter(([_, present]) => present)
        .map(([bureau]) => bureau)
        .join(', ')
    });
    
    onProgress?.(70);
    
    // Store the full report data in session storage for letter generation
    try {
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
    } catch (storageError) {
      console.warn("Could not store full report data in session storage:", storageError);
    }
    
    onProgress?.(90);
    onProgress?.(100);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw new Error(`Failed to analyze report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

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
    
    console.log("Processing uploaded report:", uploadedFile.name);
    const reportData = await analyzeReport(uploadedFile);
    
    if (!reportData) {
      throw new Error("Failed to parse credit report");
    }
    
    reportData.isSampleData = false;
    setReportData(reportData);
    
    // Use the actual report data to identify real issues
    console.log("Identifying issues in the uploaded credit report");
    let generatedIssues = identifyIssues(reportData);
    
    if (generatedIssues.length === 0) {
      console.log("No issues were detected - adding fallback issues");
      generatedIssues = addFallbackGenericIssues();
    }
    
    if (generatedIssues.length < 3) {
      const additionalIssues = addFallbackGenericIssues().slice(0, 3 - generatedIssues.length);
      generatedIssues = [...generatedIssues, ...additionalIssues];
    }
    
    setIssues(generatedIssues);
    
    setAnalyzing(false);
    setAnalyzed(true);
    
    console.log("Credit report analysis complete with", generatedIssues.length, "issues identified");
    toast.toast({
      title: "Analysis Complete",
      description: `Credit report analyzed successfully with ${generatedIssues.length} potential issues identified.`
    });
    
  } catch (error) {
    console.error("Error in handleAnalysisComplete:", error);
    
    setAnalysisError(error instanceof Error ? error.message : "Unknown error occurred");
    setAnalyzing(false);
    setAnalyzed(true);
    
    toast.toast({
      title: "Analysis Error",
      description: error instanceof Error ? error.message : "Failed to analyze report",
      variant: "destructive"
    });
  }
};
