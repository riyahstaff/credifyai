
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Add an effect to check for a pending letter and navigate accordingly
  useEffect(() => {
    // Check if we have generated letters
    const checkForGeneratedLetters = () => {
      console.log("Checking for generated letters, letterGenerated:", letterGenerated);
      
      if (letterGenerated) {
        console.log("Letters generated flag is true, navigating to dispute-letters page");
        
        // Check if we have letters in session storage
        const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
        const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
        
        if (pendingLetter || generatedLetters) {
          console.log("Found letters in session storage, navigating to letters page");
          
          // Short delay to ensure everything is ready
          setTimeout(() => {
            navigate('/dispute-letters');
          }, 300);
        } else {
          console.log("No letters found in session storage despite letterGenerated flag");
        }
      }
    };
    
    // Run the check immediately and then set a short timeout as fallback
    checkForGeneratedLetters();
    const timer = setTimeout(checkForGeneratedLetters, 500);
    
    return () => clearTimeout(timer);
  }, [letterGenerated, navigate]);

  // Add debug logging to track state changes
  console.log("AnalysisStateHandler state:", { fileUploaded, analyzing, analyzed, letterGenerated });

  // Ensure we have a valid upload before proceeding
  if (!fileUploaded) {
    return null;
  }

  // Show analyzing state
  if (analyzing) {
    return <AnalyzingReport onAnalysisComplete={onAnalysisComplete} />;
  }

  // Show analyzed state
  if (analyzed) {
    // If letterGenerated is true, immediately navigate
    if (letterGenerated) {
      console.log("Dispute letter generated, navigating to letters page");
      
      // Show loading state while navigation happens
      return (
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full border-4 border-t-credify-teal border-r-credify-teal/30 border-b-credify-teal/10 border-l-credify-teal/30 animate-spin mx-auto mb-6"></div>
          <p className="text-lg font-medium text-credify-navy dark:text-white">
            Redirecting to your generated dispute letters...
          </p>
        </div>
      );
    }
    
    // Show results if we have issues but no letters yet
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
              Dispute Letters Generated
            </h3>
            <p className="text-green-700 dark:text-green-400 mb-3">
              CLEO has automatically generated dispute letters based on the critical issues found in your report.
            </p>
            <button
              onClick={() => navigate('/dispute-letters')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              View Generated Letters
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default to upload confirmation
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
