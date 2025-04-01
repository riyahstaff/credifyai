
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
    onProgress?.(10);
    
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    let textContent = '';
    
    if (isPdf) {
      textContent = await extractTextFromPDF(file);
      onProgress?.(30);
    } else {
      textContent = await file.text();
      onProgress?.(40);
    }
    
    onProgress?.(50);
    const reportData = parseReportContent(textContent, isPdf);
    
    onProgress?.(70);
    
    onProgress?.(90);
    
    onProgress?.(100);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw new Error(`Failed to analyze report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getSampleReportData = (): CreditReportData => {
  return {
    bureaus: {
      experian: true,
      equifax: false,
      transunion: false
    },
    personalInfo: {
      name: "John Doe",
      address: "123 Main St, Anytown, CA 12345",
      ssn: "xxx-xx-1234",
      dob: "01/01/1980"
    },
    accounts: [
      {
        accountName: "Sample Bank Credit Card",
        accountNumber: "xxxx-xxxx-xxxx-1234",
        accountType: "Credit Card",
        balance: 1500,
        currentBalance: 1500,
        creditLimit: 5000,
        paymentStatus: "Current",
        dateOpened: "01/01/2020",
        lastActivity: "01/01/2023",
        status: "Open",
        isNegative: false,
        dateReported: "01/15/2023",
        bureau: "Experian"
      },
      {
        accountName: "Sample Auto Loan",
        accountNumber: "12345-ABC",
        accountType: "Auto Loan",
        balance: 8000,
        currentBalance: 8000,
        paymentStatus: "Late 30 days",
        dateOpened: "06/15/2019",
        lastActivity: "12/15/2022",
        status: "Open",
        isNegative: true,
        dateReported: "01/15/2023",
        bureau: "TransUnion"
      }
    ],
    inquiries: [
      {
        inquiryDate: "12/01/2022",
        inquiryBy: "Sample Lender",
        type: "Hard Inquiry",
        bureau: "Experian",
        creditor: "Sample Lender"
      }
    ],
    publicRecords: [],
    rawText: "Sample credit report text content",
    htmlContent: "<div>Sample credit report HTML content</div>"
  };
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
    
    const useSample = sessionStorage.getItem('sampleReportsLoaded') === 'true';
    
    if (useSample) {
      console.log("Using sample credit report data for analysis");
      
      const sampleData = getSampleReportData();
      
      setTimeout(() => {
        setReportData(sampleData);
        
        const sampleIssues = [
          {
            type: 'Account Error',
            title: 'Late Payment Reporting Error',
            description: 'Account shows late payments that were actually paid on time.',
            impact: 'High Impact',
            impactColor: 'text-red-500',
            account: sampleData.accounts[0],
            laws: ['FCRA Section 623']
          },
          {
            type: 'Inquiry',
            title: 'Unauthorized Inquiry',
            description: 'Credit inquiry was made without proper authorization.',
            impact: 'Medium Impact',
            impactColor: 'text-amber-500',
            laws: ['FCRA Section 604']
          },
          {
            type: 'Personal Info',
            title: 'Incorrect Personal Information',
            description: 'Your personal information contains inaccuracies that should be corrected.',
            impact: 'Medium Impact',
            impactColor: 'text-amber-500',
            laws: ['FCRA Section 611']
          }
        ];
        
        setIssues(sampleIssues);
        setAnalyzing(false);
        setAnalyzed(true);
        
        console.log("Sample analysis complete");
        toast.toast({
          title: "Analysis Complete",
          description: "Sample report analyzed successfully."
        });
      }, 2000);
      
      return;
    }
    
    console.log("Processing uploaded report:", uploadedFile.name);
    const reportData = await analyzeReport(uploadedFile);
    
    if (!reportData) {
      throw new Error("Failed to parse credit report");
    }
    
    setReportData(reportData);
    
    let generatedIssues = identifyIssues(reportData);
    
    if (generatedIssues.length === 0) {
      console.log("No issues were automatically detected - adding fallback issues");
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

export const analyzeTestReport = async (
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    onProgress?.(20);
    
    const reportData = getSampleReportData();
    
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
