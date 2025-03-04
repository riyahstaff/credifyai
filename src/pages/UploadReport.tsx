
import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ReportUploadInfo from '@/components/disputes/uploader/ReportUploadInfo';
import UploadReportHeader from '@/components/disputes/uploader/UploadReportHeader';
import UploadReportContent from '@/components/disputes/uploader/UploadReportContent';
import { useReportUpload } from '@/hooks/useReportUpload';
import { useToast } from '@/hooks/use-toast';
import { verifyLetterStorage, forceNavigateToLetters } from '@/components/disputes/uploader/utils/bureauUtils';
import { useNavigate } from 'react-router-dom';
import { useDisputeGeneration } from '@/hooks/report-upload/useDisputeGeneration';
import { useLetterManagement } from '@/hooks/report-upload/useLetterManagement';
import PendingLettersNotification from '@/components/disputes/uploader/PendingLettersNotification';

const UploadReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    handleFile
  } = useReportUpload();

  const {
    letterGenerated,
    handleDisputeGeneration,
    handleContinueToLetters
  } = useDisputeGeneration();

  const {
    hasPendingLetters,
    handleStartNewReport
  } = useLetterManagement();

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
        
        const timer = setTimeout(() => {
          forceNavigateToLetters(navigate);
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
  }, [letterGenerated, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <UploadReportHeader />
            
            <PendingLettersNotification 
              hasPendingLetters={hasPendingLetters && !fileUploaded}
              onContinueToLetters={handleContinueToLetters}
              onStartNewReport={handleStartNewReport}
            />
            
            <UploadReportContent
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
              onResetUpload={resetUpload}
              onStartAnalysis={startAnalysis}
              onGenerateDispute={handleDisputeGeneration}
              onAnalysisComplete={onAnalysisComplete}
              onFileSelected={handleFile}
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
