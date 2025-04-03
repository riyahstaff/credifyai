
import React, { useEffect } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import FileUploader from '@/components/disputes/uploader/FileUploader';
import AnalysisStateHandler from '@/components/disputes/uploader/AnalysisStateHandler';
import AnalysisError from '@/components/disputes/uploader/AnalysisError';
import BackendUploadSection from './BackendUploadSection';

interface UploadReportContentProps {
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
  onFileSelected: (file: File) => void;
  onBackendUploadSuccess?: (reportId: string) => void;
  useBackend?: boolean;
  testMode?: boolean;
}

const UploadReportContent: React.FC<UploadReportContentProps> = ({
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
  onFileSelected,
  onBackendUploadSuccess,
  useBackend = true,
  testMode
}) => {
  // Ensure test mode subscription is set when in test mode
  useEffect(() => {
    if (testMode) {
      console.log("Test mode detected in UploadReportContent - enabling test subscription");
      sessionStorage.setItem('testModeSubscription', 'true');
      
      // Additional debugging for test mode
      console.log("Current session storage state:", {
        testModeSubscription: sessionStorage.getItem('testModeSubscription'),
        pendingDisputeLetter: sessionStorage.getItem('pendingDisputeLetter') ? 'exists' : 'missing',
        creditReportData: sessionStorage.getItem('creditReportData') ? 'exists' : 'missing'
      });
    }
  }, [testMode]);

  // When file is uploaded, also ensure test subscription is enabled
  useEffect(() => {
    if (fileUploaded && testMode) {
      console.log("File uploaded in test mode - ensuring test subscription is enabled");
      sessionStorage.setItem('testModeSubscription', 'true');
      
      // Additional logging when file is uploaded in test mode
      console.log("Upload state in test mode:", { analyzing, analyzed, letterGenerated });
    }
  }, [fileUploaded, testMode, analyzing, analyzed, letterGenerated]);
  
  // Add additional logging for analysis state changes
  useEffect(() => {
    console.log("Analysis state changed:", { 
      analyzing, 
      analyzed, 
      error: analysisError ? 'present' : 'none',
      issues: issues.length,
      letterGenerated
    });
  }, [analyzing, analyzed, analysisError, issues, letterGenerated]);

  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 mb-8">
      {!fileUploaded ? (
        <div>
          {useBackend && onBackendUploadSuccess && (
            <BackendUploadSection 
              onUploadSuccess={onBackendUploadSuccess}
              testMode={testMode}
            />
          )}
          
          <div className={useBackend ? "mt-10 pt-6 border-t border-gray-200 dark:border-gray-700/30" : ""}>
            <div className="border-b border-gray-200 dark:border-gray-700/30 pb-4 mb-6">
              <h3 className="text-xl font-semibold text-credify-navy dark:text-white">
                {useBackend ? "Or Process Locally" : "Upload Credit Report"}
                {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
              </h3>
              <p className="text-credify-navy-light dark:text-white/70 text-sm mt-1">
                {useBackend 
                  ? "Process your credit report directly in your browser without uploading to our servers." 
                  : "Upload your credit report to analyze and generate personalized dispute letters."}
              </p>
            </div>
            
            <FileUploader onFileSelected={onFileSelected} />
          </div>
        </div>
      ) : (
        <AnalysisStateHandler
          fileUploaded={fileUploaded}
          analyzing={analyzing}
          analyzed={analyzed}
          fileName={fileName}
          fileSize={fileSize}
          reportData={reportData}
          uploadedFile={uploadedFile}
          issues={issues}
          letterGenerated={letterGenerated}
          analysisError={analysisError}
          onResetUpload={onResetUpload}
          onStartAnalysis={onStartAnalysis}
          onGenerateDispute={onGenerateDispute}
          onAnalysisComplete={onAnalysisComplete}
          testMode={testMode}
        />
      )}
      
      <AnalysisError error={analysisError} onReset={onResetUpload} />
    </div>
  );
};

export default UploadReportContent;
