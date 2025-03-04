
import { useState, useRef } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { formatFileSize } from '@/utils/fileUtils';

export const useReportUploadState = () => {
  // File states
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Analysis states
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Report data states
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [issues, setIssues] = useState<Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>>([]);
  
  const [letterGenerated, setLetterGenerated] = useState(false);
  
  // Refs for tracking analysis state
  const analysisInProgress = useRef(false);
  const analysisCompleted = useRef(false);
  
  const handleFile = (file: File) => {
    // Reset analysis state when a new file is uploaded
    analysisCompleted.current = false;
    
    // Update file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileUploaded(true);
    setUploadedFile(file);
    setAnalyzed(false);
    setAnalyzing(false);
    setAnalysisError(null);
    setLetterGenerated(false);
  };

  const resetUpload = () => {
    setFileUploaded(false);
    setAnalyzed(false);
    setAnalyzing(false);
    setReportData(null);
    setIssues([]);
    setUploadedFile(null);
    setLetterGenerated(false);
    setAnalysisError(null);
    analysisInProgress.current = false;
    analysisCompleted.current = false;
  };

  return {
    // File states
    fileUploaded,
    fileName,
    fileSize,
    uploadedFile,
    setFileUploaded,
    
    // Analysis states
    analyzing,
    setAnalyzing,
    analyzed,
    setAnalyzed,
    analysisError,
    setAnalysisError,
    
    // Report data states
    reportData,
    setReportData,
    issues,
    setIssues,
    
    // Letter states
    letterGenerated,
    setLetterGenerated,
    
    // Refs
    analysisInProgress,
    analysisCompleted,
    
    // Methods
    handleFile,
    resetUpload
  };
};
