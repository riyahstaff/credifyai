
import { MutableRefObject, useCallback } from 'react';
import { CreditReportData, IdentifiedIssue } from '@/utils/creditReport/types';
import { handleAnalysisComplete } from '@/components/disputes/uploader/handlers/analysisHandler';
import { useToast } from '@/hooks/use-toast';

export const useReportAnalysis = (
  uploadedFile: File | null,
  setReportData: (data: CreditReportData) => void,
  setIssues: (issues: IdentifiedIssue[]) => void,
  setLetterGenerated: (generated: boolean) => void,
  setAnalysisError: (error: string | null) => void,
  setAnalyzing: (analyzing: boolean) => void,
  setAnalyzed: (analyzed: boolean) => void,
  analysisCompleted: MutableRefObject<boolean>
) => {
  const { toast } = useToast();
  
  // Enhance startAnalysis to include a timeout mechanism
  const startAnalysis = useCallback(() => {
    if (uploadedFile) {
      console.log("Starting analysis of uploaded file:", uploadedFile.name);
      setAnalyzing(true);
      
      // Create a compatible toast object for the handler
      const toastObject = {
        toast: toast,
        dismiss: () => {},
        toasts: []
      };
      
      // Check if we're in test mode
      const isTestMode = sessionStorage.getItem('testModeSubscription') === 'true';
      console.log("Starting analysis with test mode:", isTestMode ? "enabled" : "disabled");
      
      // Set up a backup timeout to force complete if the analysis gets stuck
      const analysisTimeout = setTimeout(() => {
        console.log("Analysis timeout reached - forcing completion");
        if (!analysisCompleted.current) {
          console.log("Analysis did not complete in time - triggering manual completion");
          onAnalysisComplete();
        }
      }, 30000); // 30 second timeout
      
      try {
        handleAnalysisComplete({
          uploadedFile,
          setReportData,
          setIssues,
          setLetterGenerated,
          setAnalysisError,
          setAnalyzing,
          setAnalyzed,
          toast: toastObject,
          testMode: isTestMode
        });
        
        // Debug: Log current state of analysis
        console.log("Analysis initiated successfully");
        
        return () => {
          clearTimeout(analysisTimeout);
        };
      } catch (error) {
        console.error("Error initiating analysis:", error);
        clearTimeout(analysisTimeout);
        setAnalysisError(error instanceof Error ? error.message : "Unknown error occurred");
        setAnalyzing(false);
        
        toast({
          title: "Analysis Error",
          description: "Failed to start credit report analysis",
          variant: "destructive"
        });
      }
    } else {
      console.error("Attempted to start analysis without an uploaded file");
      setAnalysisError("No file was uploaded");
    }
  }, [uploadedFile, setReportData, setIssues, setLetterGenerated, setAnalysisError, setAnalyzing, setAnalyzed, toast, analysisCompleted]);

  const onAnalysisComplete = useCallback(() => {
    // Mark analysis as complete
    console.log("Analysis marked as complete");
    analysisCompleted.current = true;
    setAnalyzed(true);
    setAnalyzing(false);
  }, [setAnalyzed, setAnalyzing, analysisCompleted]);

  return {
    onAnalysisComplete,
    startAnalysis
  };
};
