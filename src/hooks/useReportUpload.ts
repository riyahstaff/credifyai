import { useState, useRef, useEffect, useCallback } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import { useReportAnalysis } from './report-upload/useReportAnalysis';
import { useToast } from './use-toast';
import { useReportStorage } from './report-upload/useReportStorage';
import { useReportNavigation } from './report-upload/useReportNavigation';
import { generateAutomaticDisputeLetter } from '@/components/ai/services/disputes/automaticLetterGenerator';
import { analyzeReportForIssues } from '@/utils/creditReport/parser/analyzeReportIssues';
import { identifyIssues } from '@/utils/reportAnalysis/issueIdentification/identifyIssues';

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
    clearStoredReport(); // Clear any stored report data
  }, [clearStoredReport]);
  
  // Handle file upload
  const handleFile = useCallback((file: File) => {
    console.log("File selected:", file.name, "size:", file.size);
    
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
  }, [resetUpload, toast]);
  
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
    console.log("Generating dispute for account:", account);
    
    if (reportData) {
      // If no account is provided, use the first account from the report
      const targetAccount = account || (reportData.accounts && reportData.accounts.length > 0 ? reportData.accounts[0] : null);
      
      // Log detailed information about the account and report data for debugging
      console.log("Target account for dispute:", targetAccount);
      console.log("Report data personal info:", reportData.personalInfo);
      console.log("Report data accounts:", reportData.accounts?.length);
      
      // Analyze report for issues if not already done
      if (!reportData.issues || reportData.issues.length === 0) {
        console.log("No issues found in report data, analyzing now...");
        // Use the identifyIssues function instead which returns IdentifiedIssue[]
        const identifiedIssues = identifyIssues(reportData);
        if (identifiedIssues.length > 0) {
          reportData.issues = identifiedIssues;
          console.log(`Found ${identifiedIssues.length} issues in report`);
          setIssues(identifiedIssues);
        }
      }
      
      // Store data for dispute generation
      const stored = storeForDispute(reportData, targetAccount);
      
      if (stored) {
        console.log("Report data stored successfully, generating letter...");
        
        try {
          // Generate automatic dispute letter
          const letterContent = await generateAutomaticDisputeLetter(
            reportData,
            targetAccount?.accountName,
            reportData.personalInfo
          );
          
          if (letterContent && letterContent.length > 100) {
            console.log("Letter generated successfully with length:", letterContent.length);
            setLetterGenerated(true);
            
            toast({
              title: "Dispute letter generated",
              description: "Your dispute letter has been generated. You'll be redirected to review it.",
            });
            
            // Trigger navigation to letters page
            triggerNavigation();
            
            return true;
          } else {
            console.error("Letter generation failed or produced insufficient content");
            
            // Try a backup approach - set flags for the dispute letters page to generate on load
            sessionStorage.setItem('forceLetterGeneration', 'true');
            sessionStorage.setItem('reportReadyForLetters', 'true');
            sessionStorage.setItem('shouldNavigateToLetters', 'true');
            
            // Force navigation after a delay
            setTimeout(() => {
              window.location.href = '/dispute-letters';
            }, 1000);
            
            toast({
              title: "Processing report",
              description: "Redirecting to dispute letters page...",
            });
            
            return true;
          }
        } catch (error) {
          console.error("Error in automatic letter generation:", error);
          
          // Set flags for the dispute letters page to handle fallback
          sessionStorage.setItem('forceLetterGeneration', 'true');
          sessionStorage.setItem('reportReadyForLetters', 'true');
          sessionStorage.setItem('shouldNavigateToLetters', 'true');
          
          // Force navigation after a delay
          setTimeout(() => {
            window.location.href = '/dispute-letters';
          }, 1000);
          
          toast({
            title: "Processing report",
            description: "Redirecting to dispute letters page...",
          });
          
          return true;
        }
      } else {
        toast({
          title: "Error generating letter",
          description: "There was a problem storing your report data. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      toast({
        title: "Missing report data",
        description: "No credit report data is available. Please upload and analyze a report first.",
        variant: "destructive",
      });
      return false;
    }
  }, [reportData, storeForDispute, toast, triggerNavigation]);
  
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
