
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { APP_ROUTES } from '@/lib/supabase';
import FileUploader from '@/components/disputes/uploader/FileUploader';
import { formatFileSize } from '@/utils/fileUtils';
import ReportUploadInfo from '@/components/disputes/uploader/ReportUploadInfo';
import AnalysisStateHandler from '@/components/disputes/uploader/AnalysisStateHandler';
import AnalysisError from '@/components/disputes/uploader/AnalysisError';
import { handleAnalysisComplete } from '@/components/disputes/uploader/AnalysisProcessor';

const UploadReport = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [issues, setIssues] = useState<Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>>([]);
  
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    // Update file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileUploaded(true);
    setUploadedFile(file);
  };

  const onAnalysisComplete = async () => {
    await handleAnalysisComplete({
      uploadedFile,
      setReportData,
      setIssues,
      setLetterGenerated,
      setAnalysisError,
      setAnalyzing,
      setAnalyzed,
      toast
    });
  };

  const resetUpload = () => {
    setFileUploaded(false);
    setAnalyzed(false);
    setAnalyzing(false);
    setReportData(null);
    setIssues([]);
    setUploadedFile(null);
    setLetterGenerated(false);
    setAnalysisError(null);
  };

  const handleGenerateDispute = (account?: CreditReportAccount) => {
    // Store the report data in session storage to use in the dispute letters page
    if (reportData) {
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // If account is provided, also store that
      if (account) {
        sessionStorage.setItem('selectedAccount', JSON.stringify(account));
      }
      
      // Navigate to dispute letters page
      navigate('/dispute-letters');
    }
  };

  const startAnalysis = async () => {
    if (!fileUploaded || !uploadedFile) {
      toast.toast({
        title: "No file found",
        description: "Please upload a credit report file first.",
        variant: "destructive",
      });
      return;
    }
    
    setAnalyzing(true);
    setAnalysisError(null);
    // The actual analysis will happen in onAnalysisComplete
    // which is called after the progress animation completes
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-4">Upload Your Credit Report</h1>
              <p className="text-lg text-credify-navy-light dark:text-white/70 max-w-2xl mx-auto">
                Our AI will analyze your credit report to identify errors, inaccuracies, and potential FCRA violations that can be disputed.
              </p>
            </div>
            
            {/* Upload Container */}
            <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 mb-8">
              {!fileUploaded ? (
                // File Upload Interface
                <FileUploader onFileSelected={handleFile} />
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
                  onResetUpload={resetUpload}
                  onStartAnalysis={startAnalysis}
                  onGenerateDispute={handleGenerateDispute}
                  onAnalysisComplete={onAnalysisComplete}
                />
              )}
              
              <AnalysisError error={analysisError} onReset={resetUpload} />
            </div>
            
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
