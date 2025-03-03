
import React from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import FileUploader from '@/components/disputes/uploader/FileUploader';
import AnalysisStateHandler from '@/components/disputes/uploader/AnalysisStateHandler';
import AnalysisError from '@/components/disputes/uploader/AnalysisError';

interface UploadReportContentProps {
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
  onFileSelected: (file: File) => void;
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
  onFileSelected
}) => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 mb-8">
      {!fileUploaded ? (
        // File Upload Interface
        <FileUploader onFileSelected={onFileSelected} />
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
        />
      )}
      
      <AnalysisError error={analysisError} onReset={onResetUpload} />
    </div>
  );
};

export default UploadReportContent;
