
import { MutableRefObject, useCallback } from 'react';
import { CreditReportData, IdentifiedIssue } from '@/utils/creditReport/types';
import { handleAnalysisComplete } from '@/components/disputes/uploader/handlers/analysisHandler';
import { useToast } from '@/hooks/use-toast';

// Helper function to yield control back to the browser
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

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
  
  // Enhanced startAnalysis with better handling to prevent browser unresponsive errors
  const startAnalysis = useCallback(async () => {
    if (uploadedFile) {
      console.log("Starting analysis of uploaded file:", uploadedFile.name);
      setAnalyzing(true);
      
      // Create a compatible toast object for the handler
      const toastObject = {
        toast: toast,
        dismiss: () => {},
        toasts: []
      };
      
      // Monitor analysis progress with web worker if possible
      let analysisMonitor: number | null = null;
      
      // Set up a backup timeout to force complete if the analysis gets stuck
      const analysisTimeout = setTimeout(() => {
        console.log("Analysis timeout reached - forcing completion");
        if (!analysisCompleted.current) {
          console.log("Analysis did not complete in time - triggering manual completion");
          onAnalysisComplete();
        }
      }, 45000); // 45 second timeout
      
      try {
        // Periodically yield control back to main thread to prevent unresponsive dialog
        analysisMonitor = window.setInterval(async () => {
          await yieldToMain();
          console.log("Analysis monitor yielding control to main thread...");
        }, 2000); // Check every 2 seconds
        
        // Use setTimeout to allow the browser to update UI before starting analysis
        setTimeout(async () => {
          try {
            // Yield control once more before starting CPU-intensive task
            await yieldToMain();
            
            // Updated to pass the props object that handleAnalysisComplete expects
            await handleAnalysisComplete({
              uploadedFile,
              setReportData,
              setIssues,
              setLetterGenerated,
              setAnalysisError,
              setAnalyzing,
              setAnalyzed,
              toast: toastObject,
              testMode: false // Always use real mode, no test mode with per-letter payments
            });
            
            // Debug: Log current state of analysis
            console.log("Analysis initiated successfully");
          } catch (err) {
            console.error("Error in analysis:", err);
            setAnalysisError(err instanceof Error ? err.message : "Unknown error occurred");
            setAnalyzing(false);
          }
        }, 100);
        
        return () => {
          clearTimeout(analysisTimeout);
          if (analysisMonitor !== null) {
            clearInterval(analysisMonitor);
          }
        };
      } catch (error) {
        console.error("Error initiating analysis:", error);
        clearTimeout(analysisTimeout);
        if (analysisMonitor !== null) {
          clearInterval(analysisMonitor);
        }
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
