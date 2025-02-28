
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { APP_ROUTES } from '@/lib/supabase';
import FileUploader from '@/components/disputes/uploader/FileUploader';
import { formatFileSize } from '@/utils/fileUtils';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import UploadConfirmation from '@/components/disputes/uploader/UploadConfirmation';
import AnalyzingReport from '@/components/disputes/uploader/AnalyzingReport';
import ReportAnalysisResults from '@/components/disputes/uploader/ReportAnalysisResults';
import ReportUploadInfo from '@/components/disputes/uploader/ReportUploadInfo';

const UploadReport = () => {
  const { toast } = useToast();
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

  const handleFile = (file: File) => {
    // Update file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileUploaded(true);
    setUploadedFile(file);
  };

  const startAnalysis = async () => {
    if (!fileUploaded || !uploadedFile) {
      toast({
        title: "No file found",
        description: "Please upload a credit report file first.",
        variant: "destructive",
      });
      return;
    }
    
    setAnalyzing(true);
    
    try {      
      // Process the credit report
      const data = await processCreditReport(uploadedFile);
      
      // Extract real account names from the report
      const enhancedData = enhanceReportData(data);
      
      setReportData(enhancedData);
      
      // Identify potential issues
      const detectedIssues = identifyIssues(enhancedData);
      setIssues(detectedIssues);
      
      // Show success toast
      toast({
        title: "Analysis complete",
        description: `Found ${detectedIssues.length} potential issues in your credit report.`,
      });
      
      setAnalyzing(false);
      setAnalyzed(true);
    } catch (error) {
      console.error("Error analyzing report:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to process your credit report.",
        variant: "destructive",
      });
      setAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFileUploaded(false);
    setAnalyzed(false);
    setReportData(null);
    setIssues([]);
    setUploadedFile(null);
  };

  const handleGenerateDispute = (account?: CreditReportAccount) => {
    // Store the report data in session storage to use in the dispute letters page
    if (reportData) {
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // If account is provided, also store that
      if (account) {
        sessionStorage.setItem('selectedAccount', JSON.stringify(account));
      }
      
      // Use the corrected route from APP_ROUTES
      navigate(APP_ROUTES.CREATE_DISPUTE);
    }
  };

  // Define analysis progress steps
  const analysisSteps = [
    { name: 'Scanning personal information', progress: 100, isComplete: true },
    { name: 'Analyzing account information', progress: 100, isComplete: true },
    { name: 'Checking for FCRA violations', progress: 75, isComplete: false },
    { name: 'Preparing recommendations', progress: 10, isComplete: false },
  ];

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
              ) : analyzing ? (
                // Analyzing State
                <AnalyzingReport steps={analysisSteps} />
              ) : analyzed ? (
                // Analysis Complete
                <ReportAnalysisResults 
                  issues={issues}
                  reportData={reportData}
                  onResetUpload={resetUpload}
                  onGenerateDispute={handleGenerateDispute}
                />
              ) : (
                // File Uploaded, Confirmation Step
                <UploadConfirmation
                  fileName={fileName}
                  fileSize={fileSize}
                  onRemoveFile={resetUpload}
                  onStartAnalysis={startAnalysis}
                />
              )}
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
