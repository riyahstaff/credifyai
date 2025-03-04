
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditReportAccount } from '@/utils/creditReportParser';
import { useReportUploadState } from './report-upload/useReportUploadState';
import { useReportStorage } from './report-upload/useReportStorage';
import { useReportNavigation } from './report-upload/useReportNavigation';
import { useReportAnalysis } from './report-upload/useReportAnalysis';

export const useReportUpload = () => {
  // Compose the smaller hooks
  const {
    fileUploaded,
    fileName,
    fileSize,
    uploadedFile,
    analyzing,
    setAnalyzing,
    analyzed,
    setAnalyzed,
    analysisError,
    setAnalysisError,
    reportData,
    setReportData,
    issues,
    setIssues,
    letterGenerated,
    setLetterGenerated,
    analysisInProgress,
    analysisCompleted,
    handleFile,
    resetUpload
  } = useReportUploadState();

  const { 
    checkPendingLetters, 
    clearPendingLetters, 
    storeForDispute 
  } = useReportStorage();

  const { 
    navigateToDisputeLetters, 
    navigate, 
    toast 
  } = useReportNavigation();

  const {
    onAnalysisComplete,
    startAnalysis
  } = useReportAnalysis(
    uploadedFile,
    setReportData,
    setIssues,
    setLetterGenerated,
    setAnalysisError,
    setAnalyzing,
    setAnalyzed,
    analysisCompleted
  );

  // Add the letter generation effect
  useEffect(() => {
    if (letterGenerated && sessionStorage.getItem('pendingDisputeLetter')) {
      console.log("Letter has been generated, navigating to dispute letters page");
      const timer = setTimeout(() => {
        navigate('/dispute-letters');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [letterGenerated, navigate]);

  // Handle generate dispute (combines storeForDispute and navigation)
  const handleGenerateDispute = (account?: CreditReportAccount) => {
    if (reportData) {
      storeForDispute(reportData, account);
      navigateToDisputeLetters();
    }
  };

  // Add debug logging for state changes
  console.log("UploadReport state:", { 
    fileUploaded, 
    analyzing, 
    analyzed, 
    letterGenerated,
    analysisInProgress: analysisInProgress.current,
    analysisCompleted: analysisCompleted.current,
  });

  return {
    fileUploaded,
    analyzing,
    analyzed,
    fileName,
    fileSize,
    reportData,
    uploadedFile,
    issues,
    letterGenerated,
    analysisError,
    resetUpload,
    startAnalysis,
    handleGenerateDispute,
    onAnalysisComplete,
    handleFile,
    clearPendingLetters
  };
};
