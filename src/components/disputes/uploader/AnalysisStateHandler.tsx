
import React, { useState, useEffect } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';
import ReportPreview from './ReportPreview';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AnalysisStateHandlerProps {
  fileUploaded: boolean;
  analyzing: boolean;
  analyzed: boolean;
  fileName: string;
  fileSize: string;
  reportData: CreditReportData | null;
  uploadedFile: File | null;
  issues: IdentifiedIssue[];
  letterGenerated: boolean;
  analysisError: string | null;
  onResetUpload: () => void;
  onStartAnalysis: () => void;
  onGenerateDispute: (account?: CreditReportAccount) => void;
  onAnalysisComplete: () => void;
  testMode?: boolean;
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
  onAnalysisComplete,
  testMode
}) => {
  const [showReportPreview, setShowReportPreview] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Log important state changes for debugging
  useEffect(() => {
    console.log("AnalysisStateHandler state:", { 
      fileUploaded, 
      analyzing, 
      analyzed, 
      letterGenerated,
      issuesCount: issues.length,
      testMode,
      hasAnalysisError: !!analysisError
    });
    
    // If analysis is complete and letters are generated, navigate to the letters page
    if (analyzed && letterGenerated && sessionStorage.getItem('pendingDisputeLetter')) {
      console.log("Analysis complete with letters generated, redirecting to dispute-letters page");
      setTimeout(() => {
        navigate('/dispute-letters');
      }, 1000);
    }
  }, [fileUploaded, analyzing, analyzed, letterGenerated, issues, testMode, navigate, analysisError]);
  
  // Check the state and render appropriate component
  if (analyzing) {
    return <AnalyzingReport 
      onAnalysisComplete={onAnalysisComplete} 
      testMode={testMode}
    />;
  }
  
  // If analysis is complete but we have an error, show error state
  if (analyzed && analysisError) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <h3 className="text-red-800 font-medium">Analysis Error</h3>
          <p className="text-red-700 text-sm">
            {analysisError}
          </p>
          <button
            onClick={onResetUpload}
            className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (analyzed) {
    return <ReportAnalysisResults 
      issues={issues} 
      reportData={reportData}
      onResetUpload={onResetUpload} 
      onGenerateDispute={onGenerateDispute}
      testMode={testMode}
    />;
  }
  
  return (
    <div className="space-y-4">
      <UploadConfirmation 
        fileName={fileName} 
        fileSize={fileSize} 
        onStartAnalysis={onStartAnalysis} 
        onRemoveFile={onResetUpload} 
        testMode={testMode}
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
              <ReportPreview reportData={reportData} uploadedFile={uploadedFile} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisStateHandler;
