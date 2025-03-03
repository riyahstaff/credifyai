
import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { APP_ROUTES } from '@/lib/supabase';
import ReportUploadInfo from '@/components/disputes/uploader/ReportUploadInfo';
import UploadReportHeader from '@/components/disputes/uploader/UploadReportHeader';
import UploadReportContent from '@/components/disputes/uploader/UploadReportContent';
import { useReportUpload } from '@/hooks/useReportUpload';

const UploadReport = () => {
  const {
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
    resetUpload,
    startAnalysis,
    handleGenerateDispute,
    onAnalysisComplete,
    handleFile
  } = useReportUpload();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <UploadReportHeader />
            
            {/* Upload Container */}
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
              onGenerateDispute={handleGenerateDispute}
              onAnalysisComplete={onAnalysisComplete}
              onFileSelected={handleFile}
            />
            
            {/* Information Sections */}
            <ReportUploadInfo />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadReport;
