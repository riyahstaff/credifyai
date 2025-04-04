
import { useState, useRef, useEffect } from 'react';
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import { useReportAnalysis } from './report-upload/useReportAnalysis';
import { useToast } from './use-toast';
import { useReportStorage } from './report-upload/useReportStorage';

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
  const resetUpload = () => {
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
  };
  
  // Handle file upload
  const handleFile = (file: File) => {
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
  };
  
  // Generate dispute letter from the report data
  const handleGenerateDispute = async (account: CreditReportAccount | null = null) => {
    console.log("Generating dispute for account:", account);
    
    if (reportData) {
      // If no account is provided, use the first account from the report
      const targetAccount = account || (reportData.accounts.length > 0 ? reportData.accounts[0] : null);
      
      // Log detailed information about the account and report data for debugging
      console.log("Target account for dispute:", targetAccount);
      console.log("Report data personal info:", reportData.personalInfo);
      
      // Store data for dispute generation
      const stored = storeForDispute(reportData, targetAccount);
      
      if (stored) {
        setLetterGenerated(true);
        toast({
          title: "Dispute letter generated",
          description: "Your dispute letter has been generated. You'll be redirected to review it.",
        });
        return true;
      } else {
        toast({
          title: "Error generating letter",
          description: "There was a problem generating your dispute letter. Please try again.",
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
