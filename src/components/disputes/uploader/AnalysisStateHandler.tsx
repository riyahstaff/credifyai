import React, { useState, useEffect } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import AnalyzingReport from './AnalyzingReport';
import ReportAnalysisResults from './ReportAnalysisResults';
import UploadConfirmation from './UploadConfirmation';
import ReportPreview from './ReportPreview';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { generateAutomaticDisputeLetter } from '@/components/ai/services/disputes/automaticLetterGenerator';

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
  const [attemptedLetterGeneration, setAttemptedLetterGeneration] = useState(false);
  const [isManuallyCompletingAnalysis, setIsManuallyCompletingAnalysis] = useState(false);
  
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
  }, [fileUploaded, analyzing, analyzed, letterGenerated, issues, testMode, analysisError]);
  
  const handleManualComplete = () => {
    setIsManuallyCompletingAnalysis(true);
    console.log("Manual analysis completion triggered by user");
    
    toast({
      title: "Completing Analysis",
      description: "Finalizing the analysis of your credit report...",
      duration: 3000,
    });
    
    setTimeout(() => {
      onAnalysisComplete();
    }, 1000);
  };
  
  useEffect(() => {
    const autoGenerateLetter = async () => {
      if (analyzed && reportData && !letterGenerated && !attemptedLetterGeneration) {
        console.log("Analysis complete, attempting to auto-generate dispute letter");
        setAttemptedLetterGeneration(true);
        
        try {
          setTimeout(async () => {
            const targetAccount = reportData.accounts && reportData.accounts.length > 0 
              ? reportData.accounts[0] 
              : null;
            
            console.log("Generating letter for account:", targetAccount?.accountName || "General Dispute");
            
            onGenerateDispute(targetAccount);
          }, 500);
        } catch (error) {
          console.error("Error in auto letter generation:", error);
          toast({
            title: "Letter Generation Issue",
            description: "There was a problem automatically generating your dispute letter. Please try manually.",
            variant: "destructive"
          });
        }
      }
    };
    
    autoGenerateLetter();
  }, [analyzed, reportData, letterGenerated, attemptedLetterGeneration, onGenerateDispute, toast]);
  
  useEffect(() => {
    if (letterGenerated) {
      console.log("Letter has been generated, navigating to dispute-letters page");
      
      sessionStorage.setItem('shouldNavigateToLetters', 'true');
      
      const timer = setTimeout(() => {
        console.log("Executing navigation to dispute-letters page");
        navigate('/dispute-letters');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [letterGenerated, navigate]);
  
  if (analyzing) {
    return (
      <>
        <AnalyzingReport 
          onAnalysisComplete={onAnalysisComplete} 
          testMode={testMode}
          timeout={10000}
        />
        
        <div className="mt-4 text-center">
          <button
            onClick={handleManualComplete}
            disabled={isManuallyCompletingAnalysis}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {isManuallyCompletingAnalysis ? "Completing..." : "Analysis taking too long? Click to continue"}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            This will proceed with the analysis results we've collected so far.
          </p>
        </div>
      </>
    );
  }
  
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
