
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CreditReportData } from '@/utils/creditReportParser';
import { handleAnalysisComplete } from '@/components/disputes/uploader/handlers/analysisHandler';

export const useReportAnalysis = () => {
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const toast = useToast();

  const analyzeReport = async (uploadedFile: File) => {
    setAnalyzing(true);
    setAnalyzed(false);
    setAnalysisError(null);

    await handleAnalysisComplete({
      uploadedFile,
      setReportData,
      setIssues,
      setLetterGenerated,
      setAnalysisError,
      setAnalyzing,
      setAnalyzed,
      toast
    });
  };

  // Add these methods that are expected by the useReportUpload hook
  const onAnalysisComplete = () => {
    setAnalyzed(true);
    setAnalyzing(false);
  };

  const startAnalysis = () => {
    if (reportData) {
      setAnalyzing(true);
      // Simulate analysis completion after a delay
      setTimeout(() => {
        setAnalyzing(false);
        setAnalyzed(true);
      }, 2000);
    }
  };

  return {
    reportData,
    issues,
    letterGenerated,
    analysisError,
    analyzing,
    analyzed,
    analyzeReport,
    onAnalysisComplete,
    startAnalysis
  };
};
