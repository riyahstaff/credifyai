
import { MutableRefObject } from 'react';
import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';
import { handleAnalysisComplete } from '@/components/disputes/uploader/handlers/analysisHandler';
import { useToast } from '@/hooks/use-toast';

export const useReportAnalysis = (
  uploadedFile: File | null,
  setReportData: (data: CreditReportData) => void,
  setIssues: (issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>) => void,
  setLetterGenerated: (generated: boolean) => void,
  setAnalysisError: (error: string | null) => void,
  setAnalyzing: (analyzing: boolean) => void,
  setAnalyzed: (analyzed: boolean) => void,
  analysisCompleted: MutableRefObject<boolean>
) => {
  const toast = useToast();
  
  const startAnalysis = () => {
    if (uploadedFile) {
      console.log("Starting analysis of uploaded file:", uploadedFile.name);
      setAnalyzing(true);
      handleAnalysisComplete({
        uploadedFile,
        setReportData,
        setIssues,
        setLetterGenerated,
        setAnalysisError,
        setAnalyzing,
        setAnalyzed,
        toast
      });
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
  };

  return {
    onAnalysisComplete,
    startAnalysis
  };
};
