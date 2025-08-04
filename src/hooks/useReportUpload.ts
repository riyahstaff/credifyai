
import { useState, useRef, useEffect, useCallback } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import { useReportAnalysis } from './report-upload/useReportAnalysis';
import { useToast } from './use-toast';
import { useReportStorage } from './useReportStorage';
import { useReportNavigation } from './report-upload/useReportNavigation';

import { analyzeReportForIssues } from '@/utils/creditReport/parser/analyzeReportIssues';
import { identifyIssues } from '@/utils/reportAnalysis/issueIdentification/identifyIssues';
import { clearAllLetterData } from '@/utils/creditReport/clearLetterData';

export const useReportUpload = () => {
  const { toast } = useToast();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('0');
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [issues, setIssues] = useState<IdentifiedIssue[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [letterGenerated, setLetterGenerated] = useState(false);
  
  // Ref to track if analysis has completed
  const analysisCompleted = useRef(false);
  
  // Import report storage hooks
  const { storeForDispute, checkPendingLetters, clearStoredReport } = useReportStorage();
  
  // Import navigation hook
  const { triggerNavigation } = useReportNavigation();
  
  // Use report analysis hooks
  const { startAnalysis, onAnalysisComplete } = useReportAnalysis(
    uploadedFile,
    setReportData,
    setIssues,
    setLetterGenerated,
    setAnalysisError,
    setAnalyzing,
    setAnalyzed,
    analysisCompleted
  );
  
  // Reset the upload state
  const resetUpload = useCallback(() => {
    setFileUploaded(false);
    setAnalyzing(false);
    setAnalyzed(false);
    setFileName('');
    setFileSize('0');
    setReportData(null);
    setUploadedFile(null);
    setIssues([]);
    setAnalysisError(null);
    setLetterGenerated(false);
    analysisCompleted.current = false;
    
    // Clear ALL data - both report and letters
    clearStoredReport();
    clearAllLetterData();
    
    console.log("Reset complete - cleared all report data and letters");
  }, [clearStoredReport]);
  
  // Handle file upload
  const handleFile = useCallback((file: File) => {
    console.log("File selected:", file.name, "size:", file.size);
    
    // IMPORTANT: Clear ALL existing letters and data first
    clearAllLetterData();
    clearStoredReport();
    
    // Reset any existing state
    resetUpload();
    
    // Set the file information
    setFileName(file.name);
    setFileSize(file.size.toString());
    setUploadedFile(file);
    setFileUploaded(true);
    
    // Log file format for debugging
    console.log("File type:", file.type);
    
    toast({
      title: "File uploaded",
      description: `${file.name} uploaded successfully. Click "Analyze Report" to continue.`,
    });
  }, [resetUpload, toast, clearStoredReport]);
  
  // Effect to check if we should automatically generate a letter after analysis
  useEffect(() => {
    if (analyzed && reportData && !letterGenerated) {
      console.log("Report analyzed successfully, generating letter automatically");
      
      // Force a short delay to ensure all states are updated
      setTimeout(() => {
        handleGenerateDispute();
      }, 500);
    }
  }, [analyzed, reportData, letterGenerated]);
  
  // Generate dispute letter from the report data
  const handleGenerateDispute = useCallback(async (account: CreditReportAccount | null = null) => {
    console.log("=== Starting dispute letter generation ===");
    console.log("Target account:", account);
    console.log("Report data available:", !!reportData);
    console.log("Issues found:", issues.length);
    
    // Clear ALL existing letter data again to be 100% sure
    clearAllLetterData();
    
    if (!reportData) {
      console.error("No report data available for dispute generation");
      toast({
        title: "Missing report data",
        description: "No credit report data is available. Please upload and analyze a report first.",
        variant: "destructive",
      });
      return false;
    }

    // If no account is provided, use the first account from the report
    const targetAccount = account || (reportData.accounts && reportData.accounts.length > 0 ? reportData.accounts[0] : null);
    
    console.log("Target account for dispute:", targetAccount?.accountName);
    console.log("Report personal info:", reportData.personalInfo?.name);
    
    // Ensure we have identified issues
    let currentIssues = issues;
    if (!currentIssues || currentIssues.length === 0) {
      console.log("No issues in state, re-analyzing report...");
      const identifiedIssues = identifyIssues(reportData);
      currentIssues = identifiedIssues;
      setIssues(identifiedIssues);
      console.log(`Re-analysis found ${identifiedIssues.length} issues`);
    }
    
    if (currentIssues.length === 0) {
      console.warn("No issues found in credit report - creating default dispute");
      // Create a default issue if none found
      currentIssues = [{
        id: `default-${Date.now()}`,
        type: 'account_verification',
        title: 'Account Verification Required',
        description: 'Request verification of account information under FCRA',
        impact: 'Medium Impact',
        impactColor: 'orange',
        bureau: reportData.primaryBureau || 'Experian',
        severity: 'medium',
        laws: ['15 USC 1681e(b)', '15 USC 1681i'],
        account: targetAccount ? {
          accountName: targetAccount.accountName,
          accountNumber: targetAccount.accountNumber
        } : undefined
      }];
      setIssues(currentIssues);
    }
    
    try {
      console.log(`Generating letters for ${currentIssues.length} issues`);
      
      // Store data for dispute generation
      const stored = storeForDispute(reportData, targetAccount);
      
      if (!stored) {
        throw new Error("Failed to store report data for dispute generation");
      }
      
      console.log("Report data stored successfully, generating dispute letters...");
      
      // Generate dispute letters using the enhanced generator
      const { generateDisputeLettersFromIssues } = await import('@/utils/creditReport/disputeLetters/generator');
      
      const generatedLetters = await generateDisputeLettersFromIssues(
        currentIssues,
        reportData.personalInfo || { name: 'Credit Report User', address: 'Unknown Address' },
        reportData.primaryBureau || 'Experian'
      );
      
      console.log(`Generated ${generatedLetters.length} dispute letters`);
      
      if (generatedLetters.length > 0) {
        // Store letters in session storage
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(generatedLetters));
        sessionStorage.setItem('reportReadyForLetters', 'true');
        sessionStorage.setItem('lettersGeneratedTimestamp', Date.now().toString());
        
        console.log("Letters stored in session storage, setting navigation flags");
        setLetterGenerated(true);
        
        toast({
          title: "Dispute letters generated",
          description: `Generated ${generatedLetters.length} dispute letter(s). Redirecting to review them.`,
        });
        
        // Trigger navigation to letters page
        triggerNavigation();
        
        return true;
      } else {
        throw new Error("No letters were generated from the issues");
      }
      
    } catch (error) {
      console.error("Error in dispute letter generation:", error);
      
      // Fallback: Create a basic dispute letter manually
      console.log("Creating fallback dispute letter...");
      
      try {
        const fallbackLetter = {
          id: `fallback-${Date.now()}`,
          title: `Dispute Letter for ${targetAccount?.accountName || 'Credit Report'}`,
          content: createFallbackDisputeLetter(reportData, targetAccount, currentIssues[0]),
          bureau: reportData.primaryBureau || 'Experian',
          accountName: targetAccount?.accountName || 'Multiple Accounts',
          accountNumber: targetAccount?.accountNumber || '',
          issueType: currentIssues[0]?.type || 'account_verification',
          generatedAt: new Date().toISOString()
        };
        
        // Store the fallback letter
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([fallbackLetter]));
        sessionStorage.setItem('reportReadyForLetters', 'true');
        
        setLetterGenerated(true);
        
        toast({
          title: "Dispute letter created",
          description: "A dispute letter has been created. Redirecting to review it.",
        });
        
        // Force navigation after a delay
        setTimeout(() => {
          window.location.href = '/dispute-letters';
        }, 1000);
        
        return true;
      } catch (fallbackError) {
        console.error("Even fallback letter generation failed:", fallbackError);
        
        toast({
          title: "Letter generation failed",
          description: "Unable to generate dispute letter. Please try uploading your report again.",
          variant: "destructive",
        });
        
        return false;
      }
    }
  }, [reportData, issues, storeForDispute, toast, triggerNavigation, setIssues, setLetterGenerated]);
  
  // Helper function to create a fallback dispute letter
  const createFallbackDisputeLetter = (reportData: CreditReportData, account: CreditReportAccount | null, issue: any): string => {
    const userName = reportData.personalInfo?.name || 'Credit Report User';
    const userAddress = reportData.personalInfo?.address || 'Your Address';
    const accountName = account?.accountName || 'Credit Report Account';
    const bureau = reportData.primaryBureau || 'Credit Bureau';
    const currentDate = new Date().toLocaleDateString();
    
    return `${userName}
${userAddress}

${currentDate}

${bureau}
Credit Reporting Department

RE: Request for Investigation and Removal of Inaccurate Information

Dear Credit Reporting Agency,

I am writing to dispute inaccurate information on my credit report. Under the Fair Credit Reporting Act (FCRA), I have the right to request that you investigate and correct any inaccurate information.

DISPUTED ACCOUNT:
Account Name: ${accountName}
${account?.accountNumber ? `Account Number: ${account.accountNumber}` : ''}

REASON FOR DISPUTE:
${issue?.description || 'The information reported for this account appears to be inaccurate and requires verification. I request that you investigate this matter and provide me with the results of your investigation.'}

I request that you:
1. Investigate the disputed information
2. Contact the creditor to verify the accuracy of the reported information
3. Remove any information that cannot be verified as accurate
4. Provide me with the results of your investigation

Please send me an updated copy of my credit report after your investigation is complete.

Legal References:
- 15 U.S.C. § 1681e(b) - Requirement for accurate reporting
- 15 U.S.C. § 1681i - Procedure in case of disputed accuracy

Thank you for your prompt attention to this matter.

Sincerely,

${userName}`;
  };
  
  return {
    fileUploaded,
    analyzing,
    analyzed,
    fileName,
    fileSize,
    reportData,
    uploadedFile,
    issues,
    analysisError,
    letterGenerated,
    resetUpload,
    startAnalysis,
    onAnalysisComplete,
    handleFile,
    handleGenerateDispute
  };
};
