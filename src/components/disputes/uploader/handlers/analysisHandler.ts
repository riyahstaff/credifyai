
import { CreditReportData } from '@/utils/creditReportParser';
import { analyzeCreditReport } from '@/components/ai/services/creditReport/analysisService';
import { generateDisputeLetters } from '../utils/letterGenerator';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  reportData: CreditReportData | null;
  issues: any[];
  error: string | null;
}

export const handleCreditReportAnalysis = async (fileContent: string): Promise<AnalysisResult> => {
  try {
    console.log("Starting credit report analysis...");
    const { reportData, issues } = await analyzeCreditReport(fileContent);
    
    if (!reportData) {
      console.error("Credit report analysis failed: No report data returned");
      return { reportData: null, issues: [], error: "Credit report analysis failed: No report data returned" };
    }
    
    console.log("Credit report analysis completed successfully");
    return { reportData, issues, error: null };
  } catch (error: any) {
    console.error("Error during credit report analysis:", error);
    return { reportData: null, issues: [], error: error.message || "Credit report analysis failed" };
  }
};

interface LetterGenerationResult {
  lettersGenerated: boolean;
  error: string | null;
}

export const handleDisputeLetterGeneration = async (issues: any[], reportData: CreditReportData): Promise<LetterGenerationResult> => {
  try {
    console.log("Starting dispute letter generation...");
    await generateDisputeLetters(issues, reportData);
    console.log("Dispute letter generation completed successfully");
    return { lettersGenerated: true, error: null };
  } catch (error: any) {
    console.error("Error during dispute letter generation:", error);
    return { lettersGenerated: false, error: error.message || "Dispute letter generation failed" };
  }
};

// Adding the missing handleAnalysisComplete function
export const handleAnalysisComplete = async ({
  uploadedFile,
  setReportData,
  setIssues,
  setLetterGenerated,
  setAnalysisError,
  setAnalyzing,
  setAnalyzed,
  toast
}: {
  uploadedFile: File;
  setReportData: (data: CreditReportData) => void;
  setIssues: (issues: any[]) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
  toast: ReturnType<typeof useToast>;
}) => {
  try {
    // Read the file content
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result as string;
        
        // Analyze the credit report
        const { reportData, issues, error: analysisError } = await handleCreditReportAnalysis(fileContent);
        
        if (analysisError) {
          console.error("Analysis error:", analysisError);
          setAnalysisError(analysisError);
          setAnalyzing(false);
          setAnalyzed(true);
          toast.toast({
            title: "Analysis Failed",
            description: analysisError,
            variant: "destructive",
          });
          return;
        }
        
        if (reportData) {
          // Set the report data and issues
          setReportData(reportData);
          setIssues(issues);
          
          // Generate dispute letters
          try {
            const { lettersGenerated, error: letterError } = await handleDisputeLetterGeneration(issues, reportData);
            
            if (letterError) {
              console.warn("Letter generation warning:", letterError);
              toast.toast({
                title: "Letter Generation Issue",
                description: letterError,
                variant: "default", 
              });
            }
            
            setLetterGenerated(lettersGenerated);
          } catch (letterGenError: any) {
            console.error("Letter generation error:", letterGenError);
            toast.toast({
              title: "Letter Generation Failed",
              description: letterGenError.message || "Failed to generate dispute letters",
              variant: "default", 
            });
          }
          
          // Mark analysis as complete
          setAnalyzing(false);
          setAnalyzed(true);
          toast.toast({
            title: "Analysis Complete",
            description: "Your credit report has been analyzed successfully.",
            variant: "default",
          });
        }
      } catch (processingError: any) {
        console.error("File processing error:", processingError);
        setAnalysisError(processingError.message || "Error processing file");
        setAnalyzing(false);
        setAnalyzed(true);
        toast.toast({
          title: "Processing Error",
          description: processingError.message || "Error processing your credit report file",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      const errorMsg = "Error reading the file";
      console.error(errorMsg);
      setAnalysisError(errorMsg);
      setAnalyzing(false);
      setAnalyzed(true);
      toast.toast({
        title: "File Error",
        description: errorMsg,
        variant: "destructive",
      });
    };
    
    // Start reading the file
    reader.readAsText(uploadedFile);
  } catch (error: any) {
    console.error("Analysis process error:", error);
    setAnalysisError(error.message || "Error during analysis process");
    setAnalyzing(false);
    setAnalyzed(true);
    toast.toast({
      title: "Analysis Error",
      description: error.message || "An error occurred during the analysis process",
      variant: "destructive",
    });
  }
};
