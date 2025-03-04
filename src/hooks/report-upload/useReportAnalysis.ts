
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
  const { toast } = useToast();

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

  return {
    reportData,
    issues,
    letterGenerated,
    analysisError,
    analyzing,
    analyzed,
    analyzeReport
  };
};
