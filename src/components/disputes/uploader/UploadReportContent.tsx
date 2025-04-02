import React from 'react';
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
