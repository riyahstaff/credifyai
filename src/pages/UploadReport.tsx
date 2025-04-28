
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ReportUploadInfo from '@/components/disputes/uploader/ReportUploadInfo';
import UploadReportHeader from '@/components/disputes/uploader/UploadReportHeader';
import UploadReportContent from '@/components/disputes/uploader/UploadReportContent';
import { useReportUpload } from '@/hooks/useReportUpload';
import { useBackendReportUpload } from '@/hooks/useBackendReportUpload';
import { useToast } from '@/hooks/use-toast';
import { verifyLetterStorage, forceNavigateToLetters } from '@/components/disputes/uploader/utils/bureauUtils';
import { useNavigate } from 'react-router-dom';
import { useDisputeGeneration } from '@/hooks/report-upload/useDisputeGeneration';
import { useLetterManagement } from '@/hooks/report-upload/useLetterManagement';
import { useReportNavigation } from '@/hooks/report-upload/useReportNavigation';
import PendingLettersNotification from '@/components/disputes/uploader/PendingLettersNotification';

const UploadReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  const {
    fileUploaded,
    analyzing,
    analyzed,
    fileName,
    fileSize,
    reportData,
    uploadedFile,
    issues,
    analysisError,
    resetUpload,
    startAnalysis,
    onAnalysisComplete,
    handleFile,
    handleGenerateDispute
  } = useReportUpload();

  const {
    uploadedReportId,
    handleUploadSuccess,
  } = useBackendReportUpload();

  const {
    letterGenerated,
    handleDisputeGeneration,
    handleContinueToLetters
  } = useDisputeGeneration(testMode);

  const {
    hasPendingLetters,
    handleStartNewReport
  } = useLetterManagement();
  
  // Use report navigation hook
  const reportNavigation = useReportNavigation();

  // Log test mode status
  useEffect(() => {
    console.log("UploadReport: Test mode is", testMode ? "active" : "inactive");
    
    // Clear any stale navigation flags
    sessionStorage.removeItem('navigationInProgress');
  }, [testMode]);

  // Check for existing letters on load
  useEffect(() => {
    const hasLetters = verifyLetterStorage();
    
    if (hasLetters) {
      console.log("Found pending dispute letters in storage, but staying on upload page");
    }
  }, []);

  // Navigate when letter is generated
  useEffect(() => {
    if (letterGenerated) {
      console.log("Letter generated flag is true, checking storage");
      const hasLetters = verifyLetterStorage();
      
      if (hasLetters) {
        console.log("Letters found in storage after generation, preparing to navigate");
        toast({
          title: "Dispute Letter Generated",
          description: "Your dispute letter has been created successfully. Navigating to letters page...",
          duration: 3000,
        });
        
        // Trigger navigation event
        console.log("ANALYSIS_COMPLETE_READY_FOR_NAVIGATION");
        
        const timer = setTimeout(() => {
          forceNavigateToLetters(navigate, testMode);
        }, 1500);
        
        return () => clearTimeout(timer);
      } else {
        console.error("Letter generated flag is true but no letters found in storage");
        toast({
          title: "Letter Generation Issue",
          description: "Your letter was generated but we couldn't find it in storage. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [letterGenerated, navigate, toast, testMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <UploadReportHeader />
            
            {testMode && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30 rounded-lg">
                <p className="text-amber-800 dark:text-amber-300">
                  <strong>Test Mode Active:</strong> You have full access to premium features for testing.
                </p>
              </div>
            )}
            
            <PendingLettersNotification 
              hasPendingLetters={hasPendingLetters && !fileUploaded}
              onContinueToLetters={handleContinueToLetters}
              onStartNewReport={handleStartNewReport}
              testMode={testMode}
            />
            
            <UploadReportContent
              fileUploaded={fileUploaded}
              analyzing={analyzing}
              analyzed={analyzed}
              fileName={fileName}
              fileSize={String(fileSize)}
              reportData={reportData}
              uploadedFile={uploadedFile}
              issues={issues}
              letterGenerated={letterGenerated}
              analysisError={analysisError}
              onResetUpload={resetUpload}
              onStartAnalysis={startAnalysis}
              onGenerateDispute={handleDisputeGeneration}
              onAnalysisComplete={onAnalysisComplete}
              onFileSelected={handleFile}
              onBackendUploadSuccess={handleUploadSuccess}
              useBackend={true}
              testMode={testMode}
            />
            
            <ReportUploadInfo />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadReport;
