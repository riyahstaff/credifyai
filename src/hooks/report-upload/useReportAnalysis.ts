
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
          isTestMode // Pass the test mode flag to the handler
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
        
        // If in test mode, we can proceed anyway with dummy data
        if (isTestMode) {
          console.log("Test mode active - proceeding with dummy data despite error");
          setTimeout(() => onAnalysisComplete(), 1500);
        } else {
          toast({
            title: "Analysis Error",
            description: "Failed to start credit report analysis",
            variant: "destructive"
          });
        }
      }
    } else {
      console.error("Attempted to start analysis without an uploaded file");
      
      // If in test mode, we can proceed anyway with dummy data
      const isTestMode = sessionStorage.getItem('testModeSubscription') === 'true';
      if (isTestMode) {
        console.log("Test mode active - proceeding with dummy data despite missing file");
        setAnalyzing(true);
        setTimeout(() => onAnalysisComplete(), 1500);
      } else {
        setAnalysisError("No file was uploaded");
      }
    }
  }, [uploadedFile, setReportData, setIssues, setLetterGenerated, setAnalysisError, setAnalyzing, setAnalyzed, toast, analysisCompleted]);

  const onAnalysisComplete = useCallback(() => {
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
          accounts: [
            {
              accountName: "TEST ACCOUNT",
              accountNumber: "XXXX-XXXX-1234",
              accountType: "Credit Card",
              balance: "1000",
              dateOpened: "01/01/2020",
              lastReportedDate: "01/01/2023",
              status: "Open",
              bureau: "Experian"
            }
          ],
          inquiries: [],
          publicRecords: [],
          personalInfo: {
            name: "Test User",
            address: "123 Test St, Test City, TS 12345",
            dob: "01/01/1980",
            ssn: "XXX-XX-1234"
          },
          isSampleData: true,
          isTestMode: true
        };
        
        try {
          // First update state
          setReportData(dummyReportData);
          
          // Then also store in session storage
          sessionStorage.setItem('creditReportData', JSON.stringify(dummyReportData));
          
          // Create a dummy issue if none exist
          if (!sessionStorage.getItem('reportIssues')) {
            const dummyIssue = {
              type: "inaccurate_information",
              title: "Inaccurate Account Information",
              description: "This account contains information that appears to be inaccurate and should be verified.",
              impact: "Medium Impact",
              impactColor: "orange",
              account: dummyReportData.accounts[0],
              laws: ["FCRA § 611", "FCRA § 623"]
            };
            
            setIssues([dummyIssue]);
            sessionStorage.setItem('reportIssues', JSON.stringify([dummyIssue]));
          }
        } catch (e) {
          console.warn("Failed to store dummy report data:", e);
        }
      }
    }
  }, [setAnalyzed, setAnalyzing, setReportData, setIssues]);

  return {
    onAnalysisComplete,
    startAnalysis
  };
};
