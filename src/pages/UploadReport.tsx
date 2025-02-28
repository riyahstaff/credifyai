
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  FileUp, 
  X, 
  Check, 
  AlertCircle, 
  Upload, 
  FileCheck, 
  Brain, 
  ChevronRight, 
  FileText 
} from 'lucide-react';

const UploadReport = () => {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle the file upload
      setFileUploaded(true);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle the file upload
      setFileUploaded(true);
    }
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    
    // Simulate analysis completion after 3 seconds
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 3000);
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
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive 
                      ? 'border-credify-teal bg-credify-teal/5' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="w-20 h-20 bg-credify-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileUp className="text-credify-teal" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
                    Drag & Drop Your Credit Report
                  </h3>
                  
                  <p className="text-credify-navy-light dark:text-white/70 mb-6 max-w-md mx-auto">
                    Upload your credit report from Experian, Equifax, or TransUnion in PDF or CSV format
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <label className="btn-primary cursor-pointer flex items-center gap-2">
                      <Upload size={18} />
                      <span>Browse Files</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.csv"
                        onChange={handleFileInput}
                      />
                    </label>
                    
                    <button className="btn-outline">
                      Connect to Bureau
                    </button>
                  </div>
                </div>
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
                  
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="text-credify-teal" size={18} />
                      <p className="text-sm font-medium text-credify-navy dark:text-white">AI Analysis Progress</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-credify-navy-light dark:text-white/70 mb-1">
                          <span>Scanning personal information</span>
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Check size={12} />
                            Complete
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-credify-navy-light dark:text-white/70 mb-1">
                          <span>Analyzing account information</span>
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                            <Check size={12} />
                            Complete
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-credify-navy-light dark:text-white/70 mb-1">
                          <span>Checking for FCRA violations</span>
                          <span>75%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-credify-teal rounded-full animate-pulse-slow" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-credify-navy-light dark:text-white/70 mb-1">
                          <span>Preparing recommendations</span>
                          <span>10%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-credify-teal rounded-full" style={{ width: '10%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <AlertCircle className="text-credify-teal" size={20} />
                      <p className="font-medium text-credify-navy dark:text-white">AI Found 3 Potential Errors</p>
                    </div>
                    <p className="text-credify-navy-light dark:text-white/70 text-sm">
                      Our AI has identified 3 potential errors in your credit report that could negatively impact your score. Review the findings below and generate dispute letters.
                    </p>
                  </div>
                  
                  {/* Findings */}
                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-semibold text-credify-navy dark:text-white border-b border-gray-200 dark:border-gray-700/30 pb-2">
                      Identified Issues
                    </h3>
                    
                    {/* Issue 1 */}
                    <div className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <AlertCircle className="text-orange-500" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-credify-navy dark:text-white">Duplicate Account (Bank of America)</h4>
                            <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">
                              The same Bank of America credit card appears twice on your report with different account numbers. This is inaccurate and may be negatively affecting your utilization ratio.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
                          High Impact
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <h5 className="text-sm font-medium text-credify-navy dark:text-white mb-2">Applicable Laws:</h5>
                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm text-credify-navy-light dark:text-white/70">
                            FCRA § 611 (Procedure in case of disputed accuracy)
                          </div>
                          <div className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm text-credify-navy-light dark:text-white/70">
                            FCRA § 623 (Responsibilities of furnishers of information)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm flex items-center gap-1">
                          Generate Dispute Letter
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Issue 2 */}
                    <div className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <AlertCircle className="text-red-500" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-credify-navy dark:text-white">Incorrect Balance (Chase Card)</h4>
                            <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">
                              Your Chase credit card shows a balance of $8,450, but your actual balance is $4,225. This error is significantly increasing your credit utilization ratio.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                          Critical Impact
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <h5 className="text-sm font-medium text-credify-navy dark:text-white mb-2">Applicable Laws:</h5>
                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm text-credify-navy-light dark:text-white/70">
                            FCRA § 623 (Responsibilities of furnishers of information)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm flex items-center gap-1">
                          Generate Dispute Letter
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Issue 3 */}
                    <div className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="mt-1">
                            <AlertCircle className="text-yellow-500" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-credify-navy dark:text-white">Outdated Address Information</h4>
                            <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">
                              Your report shows an old address that you haven't lived at for over 3 years. This outdated information could potentially affect verification processes.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
                          Medium Impact
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <h5 className="text-sm font-medium text-credify-navy dark:text-white mb-2">Applicable Laws:</h5>
                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm text-credify-navy-light dark:text-white/70">
                            FCRA § 605 (Requirements relating to information contained in consumer reports)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <button className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm flex items-center gap-1">
                          Generate Dispute Letter
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setFileUploaded(false);
                        setAnalyzed(false);
                      }}
                      className="btn-outline flex items-center gap-1"
                    >
                      <Upload size={18} />
                      <span>Upload New Report</span>
                    </button>
                    
                    <Link
                      to="/dispute-letters/new"
                      className="btn-primary flex items-center gap-1"
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
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg px-4 py-3 flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-700/50 rounded-lg">
                        <FileText size={20} className="text-credify-navy-light dark:text-white/70" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-credify-navy dark:text-white">credit_report_may2023.pdf</p>
                        <p className="text-xs text-credify-navy-light dark:text-white/70">2.4 MB</p>
                      </div>
                      <button
                        onClick={() => setFileUploaded(false)}
                        className="ml-4 p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
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
                    <AlertCircle className="text-credify-teal" size={24} />
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
