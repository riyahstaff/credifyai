
import React, { useState, useEffect } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';
import ReportPreview from './ReportPreview';
import { useNavigate } from 'react-router-dom';

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
  const [showReportPreview, setShowReportPreview] = useState(false);
  const navigate = useNavigate();
  
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
    
    // If analysis is complete and letters are generated, navigate to the letters page
    if (analyzed && letterGenerated && sessionStorage.getItem('pendingDisputeLetter')) {
      console.log("Analysis complete with letters generated, redirecting to dispute-letters page");
      setTimeout(() => {
        navigate('/dispute-letters');
      }, 1000);
    }
  }, [fileUploaded, analyzing, analyzed, letterGenerated, issues, testMode, navigate]);
  
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
    <div className="space-y-4">
      <UploadConfirmation 
        fileName={fileName} 
        fileSize={fileSize} 
        onStartAnalysis={onStartAnalysis} 
        onRemoveFile={onResetUpload} 
      />
      
      {reportData && (
        <div className="mt-4 p-4 border rounded-md border-gray-200 bg-gray-50">
          <button 
            onClick={() => setShowReportPreview(!showReportPreview)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            {showReportPreview ? "Hide Report Preview" : "Show Report Preview"}
          </button>
          
          {showReportPreview && (
            <div className="mt-4">
              <ReportPreview reportData={reportData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisStateHandler;
