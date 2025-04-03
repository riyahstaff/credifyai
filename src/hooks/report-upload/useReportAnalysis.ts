
import { MutableRefObject } from 'react';
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
  
  const startAnalysis = () => {
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
      
      try {
        handleAnalysisComplete({
          uploadedFile,
          setReportData,
          setIssues,
          setLetterGenerated,
          setAnalysisError,
          setAnalyzing,
          setAnalyzed,
          toast: toastObject
        });
        
        // Debug: Log current state of analysis
        console.log("Analysis initiated successfully");
      } catch (error) {
        console.error("Error initiating analysis:", error);
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
  };

  const onAnalysisComplete = () => {
    // Mark analysis as complete
    console.log("Analysis marked as complete");
    analysisCompleted.current = true;
    setAnalyzed(true);
    setAnalyzing(false);
    
    // Force analysis to complete if it's stuck
    const isTestMode = sessionStorage.getItem('testModeSubscription') === 'true';
    
    // If this is test mode and we don't have issues yet, generate dummy issues
    if (isTestMode) {
      console.log("Test mode analysis complete - ensuring test data is available");
      
      // Add to local storage if it doesn't exist yet
      if (!sessionStorage.getItem('creditReportData')) {
        console.log("No report data in storage for test mode - adding placeholder");
        
        const dummyReportData = {
          bureaus: { experian: true, equifax: false, transunion: false },
          primaryBureau: "Experian",
          accounts: [],
          inquiries: [],
          publicRecords: [],
          personalInfo: {
            name: "Test User",
            address: "123 Test St, Test City, TS 12345",
            dob: "01/01/1980",
            ssn: "XXX-XX-1234"
          },
          isSampleData: true
        };
        
        try {
          sessionStorage.setItem('creditReportData', JSON.stringify(dummyReportData));
        } catch (e) {
          console.warn("Failed to store dummy report data:", e);
        }
      }
    }
  };

  return {
    onAnalysisComplete,
    startAnalysis
  };
};
