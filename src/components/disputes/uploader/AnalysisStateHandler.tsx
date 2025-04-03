
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
    
    // In test mode, if we've completed analysis but have no issues, try to generate one
    if (analyzed && testMode && issues.length === 0 && !letterGenerated) {
      console.log("Test mode with no issues - adding dummy issue");
      
      // Create a dummy issue if in test mode and no issues detected
      const dummyIssue = {
        type: "inaccurate_information",
        title: "Inaccurate Account Information (Test)",
        description: "This test account contains information that appears to be inaccurate.",
        impact: "Medium Impact" as const,
        impactColor: "orange",
        account: reportData?.accounts[0] || {
          accountName: "TEST ACCOUNT",
          accountNumber: "XXXX-XXXX-1234",
          bureau: "Experian"
        },
        laws: ["FCRA § 611", "FCRA § 623"]
      };
      
      // Instead of modifying the issues state directly, we'll just handle generating a dispute
      setTimeout(() => {
        console.log("Auto-generating dispute for test mode");
        toast({
          title: "Test Mode",
          description: "Automatically generating dispute letter for test mode"
        });
        onGenerateDispute(dummyIssue.account);
      }, 2000);
    }
  }, [fileUploaded, analyzing, analyzed, letterGenerated, issues, testMode, navigate, reportData, analysisError, onGenerateDispute, toast]);
  
  // Check the state and render appropriate component
  if (analyzing) {
    return <AnalyzingReport 
      onAnalysisComplete={onAnalysisComplete} 
      testMode={testMode}
    />;
  }
  
  // If analysis is complete but we have an error, but we're in test mode,
  // show results anyway with a warning
  if (analyzed && analysisError && testMode) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <h3 className="text-amber-800 font-medium">Test Mode Warning</h3>
          <p className="text-amber-700 text-sm">
            There was an error analyzing your report, but since you're in test mode, 
            you can proceed with test dispute letters.
          </p>
        </div>
        
        <ReportAnalysisResults 
          issues={issues.length > 0 ? issues : [
            {
              type: "inaccurate_information",
              title: "Inaccurate Account Information (Test)",
              description: "This test account contains information that appears to be inaccurate.",
              impact: "Medium Impact" as const,
              impactColor: "orange",
              account: reportData?.accounts[0] || {
                accountName: "TEST ACCOUNT",
                accountNumber: "XXXX-XXXX-1234",
                bureau: "Experian"
              },
              laws: ["FCRA § 611", "FCRA § 623"]
            }
          ]} 
          reportData={reportData}
          onResetUpload={onResetUpload} 
          onGenerateDispute={onGenerateDispute}
          testMode={testMode}
        />
      </div>
    );
  }
  
  if (analyzed && !analysisError) {
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
