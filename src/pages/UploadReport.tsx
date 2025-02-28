
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  FileUp, 
  Check, 
  Brain, 
  ChevronRight, 
  FileCheck, 
  Upload, 
  FileText 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { APP_ROUTES } from '@/lib/supabase';
import FileUploader from '@/components/disputes/uploader/FileUploader';
import FilePreview from '@/components/disputes/uploader/FilePreview';
import AnalysisProgress from '@/components/disputes/uploader/AnalysisProgress';
import CreditReportIssue from '@/components/disputes/uploader/CreditReportIssue';
import { formatFileSize } from '@/utils/fileUtils';

// Extract the issue identification logic to a separate component
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';

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
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full border-4 border-t-credify-teal border-r-credify-teal/40 border-b-credify-teal/10 border-l-credify-teal/40 animate-spin mx-auto mb-6"></div>
                  
                  <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
                    Analyzing Your Credit Report
                  </h3>
                  
                  <p className="text-credify-navy-light dark:text-white/70 mb-8 max-w-md mx-auto">
                    Our AI is carefully scanning your report for errors, inaccuracies, and potential FCRA violations.
                  </p>
                  
                  <AnalysisProgress steps={analysisSteps} />
                </div>
              ) : analyzed ? (
                // Analysis Complete
                <div>
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-credify-navy dark:text-white">
                      Analysis Complete
                    </h3>
                  </div>
                  
                  <div className="bg-credify-teal/5 border border-credify-teal/20 rounded-lg p-4 mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="text-credify-teal" size={20} />
                      <p className="font-medium text-credify-navy dark:text-white">AI Found {issues.length} Potential {issues.length === 1 ? 'Issue' : 'Issues'}</p>
                    </div>
                    <p className="text-credify-navy-light dark:text-white/70 text-sm">
                      {issues.length > 0 
                        ? `Our AI has identified ${issues.length} potential ${issues.length === 1 ? 'issue' : 'issues'} in your credit report that could ${issues.length === 1 ? 'be negatively impacting' : 'negatively impact'} your score. Review the findings below and generate dispute letters.`
                        : 'Our AI did not detect any obvious issues in your credit report. However, you may still want to review it carefully for any inaccuracies.'}
                    </p>
                  </div>
                  
                  {/* Findings */}
                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-semibold text-credify-navy dark:text-white border-b border-gray-200 dark:border-gray-700/30 pb-2">
                      Identified Issues
                    </h3>
                    
                    {issues.length > 0 ? (
                      issues.map((issue, index) => (
                        <CreditReportIssue
                          key={index}
                          title={issue.title}
                          description={issue.description}
                          impact={issue.impact}
                          impactColor={issue.impactColor}
                          account={issue.account}
                          laws={issue.laws}
                          onGenerateDispute={() => handleGenerateDispute(issue.account)}
                        />
                      ))
                    ) : (
                      <div className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5 text-center">
                        <p className="text-credify-navy-light dark:text-white/70">
                          No issues were detected in your credit report. This could mean your report is accurate or our system couldn't identify any obvious problems.
                        </p>
                        <p className="text-credify-navy-light dark:text-white/70 mt-2">
                          You may still want to review your report manually for any inaccuracies.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setFileUploaded(false);
                        setAnalyzed(false);
                        setReportData(null);
                        setIssues([]);
                        setUploadedFile(null);
                      }}
                      className="btn-outline flex items-center gap-1"
                    >
                      <Upload size={18} />
                      <span>Upload New Report</span>
                    </button>
                    
                    <Link
                      to={APP_ROUTES.CREATE_DISPUTE}
                      className="btn-primary flex items-center gap-1"
                      onClick={() => {
                        if (reportData) {
                          sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
                        }
                      }}
                    >
                      <FileCheck size={18} />
                      <span>Generate All Letters</span>
                    </Link>
                  </div>
                </div>
              ) : (
                // File Uploaded, Confirmation Step
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileUp className="text-green-600 dark:text-green-400" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
                    Credit Report Ready for Analysis
                  </h3>
                  
                  <p className="text-credify-navy-light dark:text-white/70 mb-6 max-w-md mx-auto">
                    Your report has been uploaded successfully. Click the button below to start the AI analysis process.
                  </p>
                  
                  <div className="flex items-center justify-center mb-6">
                    <FilePreview 
                      fileName={fileName}
                      fileSize={fileSize}
                      onRemove={() => {
                        setFileUploaded(false);
                        setUploadedFile(null);
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={startAnalysis}
                    className="btn-primary flex items-center justify-center gap-2 mx-auto"
                  >
                    <Brain size={18} />
                    <span>Start AI Analysis</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* What to Expect Section */}
            <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-semibold text-credify-navy dark:text-white mb-6">
                What to Expect
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-credify-teal/10 flex items-center justify-center mb-4">
                    <Brain className="text-credify-teal" size={24} />
                  </div>
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">AI Analysis</h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    Our AI scans your report for errors, duplicate accounts, inaccurate balances, and other issues.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-credify-teal/10 flex items-center justify-center mb-4">
                    <FileText className="text-credify-teal" size={24} />
                  </div>
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">Error Identification</h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    We'll identify potential errors and categorize them by impact level and relevant legal codes.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-credify-teal/10 flex items-center justify-center mb-4">
                    <FileCheck className="text-credify-teal" size={24} />
                  </div>
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">Dispute Generation</h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    Generate customized dispute letters citing specific FCRA violations and legal requirements.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Supported Credit Reports */}
            <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-credify-navy dark:text-white mb-6">
                Supported Credit Reports
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700/30">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">Experian</h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    Upload PDF or CSV report formats from Experian's consumer portal.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700/30">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">Equifax</h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    Upload PDF or CSV report formats from Equifax's consumer portal.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700/30">
                  <h3 className="font-medium text-credify-navy dark:text-white mb-2">TransUnion</h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/70">
                    Upload PDF or CSV report formats from TransUnion's consumer portal.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-credify-navy-light dark:text-white/70 mb-4">
                  We also support reports from Annual Credit Report, Credit Karma, and other major providers.
                </p>
                <Link to="/education/getting-reports" className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm transition-colors">
                  Learn how to get your free credit reports →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadReport;
