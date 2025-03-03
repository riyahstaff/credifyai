
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';
import { useToast } from '@/hooks/use-toast';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

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
  onAnalysisComplete: () => Promise<void>;
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
  const navigate = useNavigate();

  const viewGeneratedLetters = () => {
    navigate('/dispute-letters');
  };

  if (!fileUploaded) {
    return null;
  }

  if (analyzing) {
    return <AnalyzingReport onAnalysisComplete={onAnalysisComplete} />;
  }

  if (analyzed) {
    return (
      <div>
        <ReportAnalysisResults 
          issues={issues}
          reportData={reportData}
          onResetUpload={onResetUpload}
          onGenerateDispute={onGenerateDispute}
        />
        
        {letterGenerated && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
              Dispute Letter Generated
            </h3>
            <p className="text-green-700 dark:text-green-400 mb-3">
              CLEO has automatically generated a dispute letter based on the critical issues found in your report.
            </p>
            <button
              onClick={viewGeneratedLetters}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              View Generated Letter
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <UploadConfirmation
      fileName={fileName}
      fileSize={fileSize}
      onRemoveFile={onResetUpload}
      onStartAnalysis={onStartAnalysis}
    />
  );
};

export default AnalysisStateHandler;
