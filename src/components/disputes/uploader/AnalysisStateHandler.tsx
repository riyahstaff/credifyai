
import React, { useState, useEffect } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';

interface AnalysisStateHandlerProps {
  fileUploaded: boolean;
  analyzing: boolean;
  analyzed: boolean;
  fileName: string;
  fileSize: string;
  reportData: CreditReportData | null;
  uploadedFile: File | null;
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>;
  letterGenerated: boolean;
  analysisError: string | null;
  onResetUpload: () => void;
  onStartAnalysis: () => void;
  onGenerateDispute: (account?: CreditReportAccount) => void;
  onAnalysisComplete: () => void;
}

const AnalysisStateHandler: React.FC<AnalysisStateHandlerProps> = ({
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
  onResetUpload,
  onStartAnalysis,
  onGenerateDispute,
  onAnalysisComplete
}) => {
  const [testMode, setTestMode] = useState(false);
  
  // Log important state changes for debugging
  useEffect(() => {
    console.log("AnalysisStateHandler state:", { 
      fileUploaded, 
      analyzing, 
      analyzed, 
      letterGenerated,
      issuesCount: issues.length,
      testMode
    });
  }, [fileUploaded, analyzing, analyzed, letterGenerated, issues, testMode]);
  
  // Check URL for test mode
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isTestMode = searchParams.get('testMode') === 'true';
    setTestMode(isTestMode);
  }, []);
  
  // Check the state and render appropriate component
  if (analyzing) {
    return <AnalyzingReport 
      onAnalysisComplete={onAnalysisComplete} 
    />;
  }
  
  if (analyzed && !analysisError) {
    return <ReportAnalysisResults 
      issues={issues} 
      reportData={reportData}
      onResetUpload={onResetUpload} 
      onGenerateDispute={onGenerateDispute} 
    />;
  }
  
  return (
    <div>
      <UploadConfirmation 
        fileName={fileName} 
        fileSize={fileSize} 
        onStartAnalysis={onStartAnalysis} 
        onRemoveFile={onResetUpload} 
      />
    </div>
  );
};

export default AnalysisStateHandler;
