
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
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

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
  
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    // Update file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileUploaded(true);
    setUploadedFile(file);
  };

  const handleAnalysisComplete = async () => {
    if (!uploadedFile) {
      setAnalyzing(false);
      setAnalysisError("No file was available for analysis");
      return;
    }
    
    try {      
      // Process the credit report
      console.log("Processing credit report:", uploadedFile.name);
      const data = await processCreditReport(uploadedFile);
      
      // Extract real account names from the report
      console.log("Enhancing report data");
      const enhancedData = enhanceReportData(data);
      
      setReportData(enhancedData);
      
      // Identify potential issues
      console.log("Identifying issues in report data");
      const detectedIssues = identifyIssues(enhancedData);
      setIssues(detectedIssues);
      
      // Auto-generate dispute letters for the most critical issues
      if (detectedIssues.length > 0 && enhancedData) {
        // Store the report data in session storage
        sessionStorage.setItem('creditReportData', JSON.stringify(enhancedData));
        
        // Find highest impact issues first
        const criticalIssues = detectedIssues.filter(issue => 
          issue.impact === 'Critical Impact' || issue.impact === 'High Impact'
        );
        
        const issueToDispute = criticalIssues.length > 0 ? criticalIssues[0] : detectedIssues[0];
        
        const bureauName = issueToDispute.account?.bureau || "Experian";
        const accountName = issueToDispute.account?.accountName || "Identified Account";
        const accountNumber = issueToDispute.account?.accountNumber;
        
        // Get user info from local storage or use placeholder
        const userInfo = {
          name: localStorage.getItem('userName') || "[YOUR NAME]",
          address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
          city: localStorage.getItem('userCity') || "[CITY]",
          state: localStorage.getItem('userState') || "[STATE]",
          zip: localStorage.getItem('userZip') || "[ZIP]"
        };
        
        // Generate letter automatically
        try {
          console.log("Generating dispute letter for:", accountName);
          const letterContent = await generateEnhancedDisputeLetter(
            issueToDispute.title,
            {
              accountName: accountName,
              accountNumber: accountNumber,
              errorDescription: issueToDispute.description,
              bureau: bureauName
            },
            userInfo
          );
          
          // Store the letter data to create it in the letter page
          const disputeData = {
            bureau: bureauName,
            accountName: accountName,
            accountNumber: accountNumber,
            errorType: issueToDispute.title,
            explanation: issueToDispute.description,
            creditReport: enhancedData,
            letterContent: letterContent,
            timestamp: new Date()
          };
          
          // Store dispute data in session storage to create the letter when navigating
          sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(disputeData));
          setLetterGenerated(true);
          
          // Set a flag to indicate a letter has been generated and is ready
          sessionStorage.setItem('autoGeneratedLetter', 'true');
          
        } catch (error) {
          console.error("Error auto-generating dispute letter:", error);
        }
      }
      
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
      setAnalysisError(error instanceof Error ? error.message : "Unknown error processing report");
      setAnalyzing(false);
    }
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
    setAnalysisError(null);
    // The actual analysis will happen in handleAnalysisComplete
    // which is called after the progress animation completes
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

  const viewGeneratedLetters = () => {
    navigate('/dispute-letters');
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
              ) : analyzing ? (
                // Analyzing State
                <AnalyzingReport onAnalysisComplete={handleAnalysisComplete} />
              ) : analyzed ? (
                // Analysis Complete
                <div>
                  <ReportAnalysisResults 
                    issues={issues}
                    reportData={reportData}
                    onResetUpload={resetUpload}
                    onGenerateDispute={handleGenerateDispute}
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
              ) : (
                // File Uploaded, Confirmation Step
                <UploadConfirmation
                  fileName={fileName}
                  fileSize={fileSize}
                  onRemoveFile={resetUpload}
                  onStartAnalysis={startAnalysis}
                />
              )}
              
              {analysisError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400">
                  <p className="font-medium mb-1">Error analyzing report:</p>
                  <p>{analysisError}</p>
                  <button 
                    onClick={resetUpload}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
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
