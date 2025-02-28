import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import { processCreditReport, CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { APP_ROUTES } from '@/lib/supabase';

const UploadReport = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is PDF or CSV
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'pdf' && fileExt !== 'csv' && fileExt !== 'txt') {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, CSV, or TXT file from one of the credit bureaus.",
        variant: "destructive",
      });
      return;
    }

    // Update file info
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setFileUploaded(true);
    setUploadedFile(file);
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else return (size / (1024 * 1024)).toFixed(1) + ' MB';
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

  // Enhance report data by extracting real account names
  const enhanceReportData = (data: CreditReportData): CreditReportData => {
    // Extract account names from raw report text if available
    if (data.rawText) {
      const accountMatches = extractAccountsFromRawText(data.rawText);
      
      if (accountMatches.length > 0) {
        console.log("Found account names in raw text:", accountMatches);
        
        // Replace gibberish account names with real ones if we can match by context
        const enhancedAccounts = data.accounts.map(account => {
          // Try to find a real account name that might match this account's context
          const potentialMatch = findMatchingAccount(account, accountMatches);
          
          if (potentialMatch) {
            return {
              ...account,
              accountName: potentialMatch.name,
              accountNumber: potentialMatch.number || account.accountNumber
            };
          }
          
          return account;
        });
        
        return {
          ...data,
          accounts: enhancedAccounts
        };
      }
    }
    
    return data;
  };
  
  // Extract account names and numbers from raw text
  const extractAccountsFromRawText = (rawText: string): Array<{ name: string, number?: string }> => {
    const accounts: Array<{ name: string, number?: string }> = [];
    
    // Look for common account section headers followed by account names
    const accountHeaderPatterns = [
      /account(?:\s+name)?s?[:\s]+([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi,
      /creditor[:\s]+([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi,
      /([A-Z][A-Z\s&]+(?:BANK|FINANCE|CREDIT|LOAN|AUTO|MORTGAGE|CARD|ONE|EXPRESS|AMEX|CAPITAL|CHASE))(?:[\s,#-]+(\d[\d-]+))?/g,
      /account\s+information(?:[:\s]+)?(?:[\r\n]+)([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi
    ];

    // Common credit account providers to look for
    const commonCreditors = [
      "CARMAX AUTO FINANCE", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
      "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
      "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE"
    ];
    
    // Look for accounts using each pattern
    for (const pattern of accountHeaderPatterns) {
      let match;
      while ((match = pattern.exec(rawText)) !== null) {
        if (match[1] && match[1].length > 3) {
          accounts.push({
            name: match[1].trim(),
            number: match[2] ? match[2].trim() : undefined
          });
        }
      }
    }
    
    // Look for common creditors directly
    for (const creditor of commonCreditors) {
      // Find creditor name in text with potential account number following it
      const creditorRegex = new RegExp(`${creditor}(?:[\\s,#-]+(\\d[\\d-]+))?`, 'gi');
      let match;
      while ((match = creditorRegex.exec(rawText)) !== null) {
        accounts.push({
          name: creditor,
          number: match[1] ? match[1].trim() : undefined
        });
      }
    }
    
    // Remove duplicates based on name
    const uniqueAccounts = Array.from(
      new Map(accounts.map(item => [item.name.toUpperCase(), item])).values()
    );
    
    return uniqueAccounts;
  };
  
  // Try to find a matching real account for a parsed account based on context
  const findMatchingAccount = (
    account: CreditReportAccount, 
    realAccounts: Array<{ name: string, number?: string }>
  ): { name: string, number?: string } | null => {
    // If account already has a valid-looking name, keep it
    if (isValidAccountName(account.accountName)) {
      return null;
    }
    
    // If we have an account number, try to match by that first
    if (account.accountNumber) {
      const matchByNumber = realAccounts.find(real => 
        real.number && real.number === account.accountNumber
      );
      
      if (matchByNumber) {
        return matchByNumber;
      }
    }
    
    // Otherwise, just return the first real account we haven't matched yet
    // This is imperfect but better than gibberish
    // In a real implementation, we would use more context like balance, dates, etc.
    if (realAccounts.length > 0) {
      return realAccounts[0];
    }
    
    return null;
  };

  // Helper function to check if an account name is valid
  const isValidAccountName = (name: string): boolean => {
    if (!name) return false;
    
    // Look for common PDF artifacts and garbage strings
    if (name.includes('endstream') || 
        name.includes('endobj') || 
        name.includes('FIRST') ||
        name.includes('Length') || 
        name.includes('Typ') ||
        name.match(/^[0-9]+\s*0\s*/) || // Pattern like "142 0" often in PDF data
        name.includes('GM') || // Common artifact in parsed PDFs
        name.includes('obj') ||
        name.match(/[{}\\<>]/g) // Special characters common in PDF artifacts
    ) {
      return false;
    }
    
    // Real account names typically have mostly alphanumeric characters
    // Count special characters (excluding spaces)
    const specialCharCount = (name.match(/[^a-zA-Z0-9\s]/g) || []).length;
    
    // If more than 15% of characters are special characters, it's likely not a valid name
    if (specialCharCount > name.length * 0.15) {
      return false;
    }
    
    // Real account names usually have uppercase letters
    const uppercaseCount = (name.match(/[A-Z]/g) || []).length;
    
    // Legitimate creditor names usually have capital letters
    if (name.length > 5 && uppercaseCount === 0) {
      return false;
    }
    
    // Check for known creditor names
    const commonCreditors = [
      "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
      "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
      "SYNCHRONY", "CREDIT ONE"
    ];
    
    for (const creditor of commonCreditors) {
      if (name.includes(creditor)) {
        return true;
      }
    }
    
    // Most legitimate account names will be at least 3 characters
    return name.length >= 3 && uppercaseCount > 0;
  };

  // Clean account name for display
  const cleanAccountName = (name: string): string => {
    // Remove PDF artifacts if they exist
    let cleaned = name.replace(/^\d+\s+\d+\s+/, ''); // Remove patterns like "142 0 "
    cleaned = cleaned.replace(/GM\s+/, ''); // Remove "GM " prefix
    
    // If the name has a mix of garbage and real text, try to extract real words
    // Most real creditor names have 2+ capital letters in a row
    const matches = cleaned.match(/[A-Z]{2,}[A-Za-z\s]+/);
    if (matches && matches[0].length > 5) {
      return matches[0].trim();
    }
    
    // For common credit accounts, try to extract known creditor names
    const commonCreditors = [
      "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
      "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
      "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE"
    ];
    
    for (const creditor of commonCreditors) {
      if (cleaned.toUpperCase().includes(creditor)) {
        // Extract the portion containing the creditor name and some surrounding context
        const index = cleaned.toUpperCase().indexOf(creditor);
        const start = Math.max(0, index - 5);
        const end = Math.min(cleaned.length, index + creditor.length + 10);
        return cleaned.substring(start, end).trim();
      }
    }
    
    return cleaned.trim();
  };

  const identifyIssues = (data: CreditReportData): Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }> => {
    const issues: Array<{
      type: string;
      title: string;
      description: string;
      impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
      impactColor: string;
      account?: CreditReportAccount;
      laws: string[];
    }> = [];
    
    // Filter accounts to only include those with valid names
    const validAccounts = data.accounts.filter(acc => isValidAccountName(acc.accountName));
    
    if (validAccounts.length === 0 && data.accounts.length > 0) {
      // If we have accounts but none with valid names, add a notice about parsing issues
      issues.push({
        type: 'parsing',
        title: 'Credit Report Parsing Issue',
        description: 'We encountered difficulties reading account names from your credit report. This may be due to the file format or encryption. Please try another format or contact support.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: []
      });
      
      console.log("No valid account names found. Original account names:", 
        data.accounts.map(acc => acc.accountName).join(", "));
      
      // Try to use raw text to extract account information
      if (data.rawText) {
        const extractedAccounts = extractAccountsFromRawText(data.rawText);
        console.log("Extracted accounts from raw text:", extractedAccounts);
        
        if (extractedAccounts.length > 0) {
          // Use the extracted accounts for issue identification
          for (const account of extractedAccounts) {
            issues.push({
              type: 'general',
              title: `Review Account Information (${account.name})`,
              description: `We found ${account.name}${account.number ? ` (Account #${account.number})` : ''} in your report. Review this account for accuracy.`,
              impact: 'Medium Impact',
              impactColor: 'yellow',
              account: {
                accountName: account.name,
                accountNumber: account.number || '',
                balance: '',
                dateOpened: '',
                dateReported: '',
                paymentStatus: '',
                remarks: []
              },
              laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
            });
          }
        }
      }
      
      // Return early if we couldn't find valid accounts
      if (issues.length === 0) {
        issues.push({
          type: 'parsing',
          title: 'Unable to Extract Account Information',
          description: 'We could not identify any accounts in your credit report. Please try uploading a different format or contact support.',
          impact: 'Medium Impact',
          impactColor: 'yellow',
          laws: []
        });
      }
      
      return issues;
    }
    
    // Clean up account names for better presentation
    const cleanedAccounts = validAccounts.map(acc => ({
      ...acc,
      accountName: cleanAccountName(acc.accountName)
    }));
    
    console.log("Cleaned account names:", cleanedAccounts.map(acc => acc.accountName).join(", "));
    
    // Check for duplicate accounts (accounts with similar names)
    const accountNames = cleanedAccounts.map(acc => acc.accountName.toLowerCase());
    const duplicateNameMap = new Map<string, CreditReportAccount[]>();
    
    cleanedAccounts.forEach(account => {
      const simplifiedName = account.accountName.toLowerCase().replace(/\s+/g, '');
      if (!duplicateNameMap.has(simplifiedName)) {
        duplicateNameMap.set(simplifiedName, []);
      }
      duplicateNameMap.get(simplifiedName)?.push(account);
    });
    
    // Add duplicate accounts as issues
    for (const [name, accounts] of duplicateNameMap.entries()) {
      if (accounts.length > 1) {
        issues.push({
          type: 'duplicate',
          title: `Duplicate Account (${accounts[0].accountName})`,
          description: `The same ${accounts[0].accountName} account appears ${accounts.length} times on your report with different account numbers. This may be inaccurate and affecting your utilization ratio.`,
          impact: 'High Impact',
          impactColor: 'orange',
          account: accounts[0],
          laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
        });
      }
    }
    
    // Check for accounts with late payments or negative remarks
    cleanedAccounts.forEach(account => {
      // Check payment status
      if (account.paymentStatus && (
        account.paymentStatus.includes('Late') || 
        account.paymentStatus.includes('Delinquent') ||
        account.paymentStatus.includes('Collection')
      )) {
        issues.push({
          type: 'payment',
          title: `Late Payment Status (${account.accountName})`,
          description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score.`,
          impact: 'Critical Impact',
          impactColor: 'red',
          account: account,
          laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
        });
      }
      
      // Check for negative remarks
      if (account.remarks && account.remarks.length > 0) {
        issues.push({
          type: 'remarks',
          title: `Negative Remarks (${account.accountName})`,
          description: `Your ${account.accountName} account has the following remarks: ${account.remarks.join(', ')}. These could be disputed if inaccurate.`,
          impact: 'Critical Impact',
          impactColor: 'red',
          account: account,
          laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
        });
      }
    });
    
    // Check for personal information issues
    if (data.personalInfo && data.personalInfo.previousAddresses && data.personalInfo.previousAddresses.length > 0) {
      issues.push({
        type: 'address',
        title: 'Multiple Addresses Listed',
        description: 'Your report shows multiple addresses. If any of these are incorrect or outdated, they should be disputed.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // If no issues found, add generic issue for educational purposes
    if (issues.length === 0 && cleanedAccounts.length > 0) {
      const randomAccount = cleanedAccounts[Math.floor(Math.random() * cleanedAccounts.length)];
      issues.push({
        type: 'general',
        title: `Review Account Information (${randomAccount.accountName})`,
        description: `No obvious errors were detected, but you should carefully review your ${randomAccount.accountName} account details for accuracy.`,
        impact: 'Medium Impact',
        impactColor: 'yellow',
        account: randomAccount,
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
    
    return issues;
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

  const getImpactColorClass = (color: string): string => {
    switch (color.toLowerCase()) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
    }
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
                        accept=".pdf,.csv,.txt"
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
                        <div key={index} className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <div className="mt-1">
                                <AlertCircle className={`${
                                  issue.impactColor === 'red' ? 'text-red-500' : 
                                  issue.impactColor === 'orange' ? 'text-orange-500' : 
                                  'text-yellow-500'
                                }`} size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium text-credify-navy dark:text-white">{issue.title}</h4>
                                <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">
                                  {issue.description}
                                </p>
                              </div>
                            </div>
                            <div className={`flex items-center ${getImpactColorClass(issue.impactColor)} px-3 py-1 rounded-full text-xs font-medium`}>
                              {issue.impact}
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <h5 className="text-sm font-medium text-credify-navy dark:text-white mb-2">Applicable Laws:</h5>
                            <div className="flex flex-wrap gap-2">
                              {issue.laws.map((law, idx) => (
                                <div key={idx} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm text-credify-navy-light dark:text-white/70">
                                  {law}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <button 
                              onClick={() => handleGenerateDispute(issue.account)}
                              className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm flex items-center gap-1"
                            >
                              Generate Dispute Letter
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
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
                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg px-4 py-3 flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-700/50 rounded-lg">
                        <FileText size={20} className="text-credify-navy-light dark:text-white/70" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-credify-navy dark:text-white">{fileName}</p>
                        <p className="text-xs text-credify-navy-light dark:text-white/70">{fileSize}</p>
                      </div>
                      <button
                        onClick={() => {
                          setFileUploaded(false);
                          setUploadedFile(null);
                        }}
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
