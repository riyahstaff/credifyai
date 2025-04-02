
import React from 'react';
import { CreditReportData } from '@/utils/creditReport/types';
import { parseReportContent } from '@/utils/creditReport/parser/parseReportContent';
import { extractTextFromPDF } from '@/utils/creditReport/extractors/pdfExtractor';
import { ToastAction } from "@/components/ui/toast";
import { identifyIssues } from '@/utils/reportAnalysis/issueIdentification/identifyIssues';
import { addFallbackGenericIssues } from '@/utils/reportAnalysis/issueIdentification/genericIssues';

export interface AnalysisHandlerProps {
  uploadedFile: File;
  setReportData: (data: any) => void;
  setIssues: (issues: any[]) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
  toast: {
    toast: (props: { title: string; description?: string; variant?: "default" | "destructive"; action?: React.ReactNode }) => void;
    dismiss: (toastId?: string) => void;
    toasts: any[];
  };
}

export const analyzeReport = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    console.log("Starting credit report analysis for file:", file.name);
    onProgress?.(10);
    
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    let textContent = '';
    
    if (isPdf) {
      console.log("Processing PDF file, extracting text...");
      onProgress?.(20);
      
      // Load PDF.js library if needed
      if (!window.pdfjsLib && !window.loadingPdfJs) {
        window.loadingPdfJs = true;
        console.log("Loading PDF.js library for better extraction");
        
        try {
          // Try to dynamically load PDF.js
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
          document.head.appendChild(script);
          
          // Wait for script to load
          await new Promise((resolve) => {
            script.onload = resolve;
            // Timeout after 3 seconds
            setTimeout(resolve, 3000);
          });
          
          console.log("PDF.js library loaded:", !!window.pdfjsLib);
        } catch (e) {
          console.warn("Failed to load PDF.js:", e);
        }
      }
      
      onProgress?.(25);
      textContent = await extractTextFromPDF(file);
      console.log(`Extracted ${textContent.length} characters from PDF file`);
      
      if (textContent.startsWith('%PDF')) {
        console.warn("PDF extraction resulted in binary data, not text");
        
        // Try another extraction method as backup
        const rawText = await file.text();
        if (rawText.length > textContent.length && !rawText.startsWith('%PDF')) {
          console.log("Using raw text extraction as fallback");
          textContent = rawText;
        }
      }
      
      onProgress?.(30);
    } else {
      console.log("Processing text file, reading content...");
      textContent = await file.text();
      console.log(`Read ${textContent.length} characters from text file`);
      onProgress?.(40);
    }
    
    if (!textContent || textContent.length < 100) {
      console.error("Extracted text is too short to be a valid credit report");
      throw new Error("The file doesn't appear to contain valid credit report data");
    }
    
    // Check if extraction only returned PDF binary
    if (textContent.startsWith('%PDF') && textContent.length < 1000) {
      throw new Error("Could not extract readable text from the PDF file. Please try a different file format or convert your PDF to text.");
    }
    
    onProgress?.(50);
    console.log("Parsing report content, processing text...");
    const reportData = parseReportContent(textContent, isPdf);
    
    // Save the raw text to session storage for debugging and further analysis
    try {
      // Store first 50KB of text for debugging (to avoid storage limits)
      sessionStorage.setItem('lastReportText', textContent.substring(0, 50000));
      // Store whether the original was a PDF
      sessionStorage.setItem('lastReportWasPdf', String(isPdf));
      console.log("Saved report text to session storage (first 50KB)");
    } catch (e) {
      console.warn("Could not save report text to session storage:", e);
    }
    
    console.log("Report parsing complete. Found:", {
      accounts: reportData.accounts?.length || 0,
      inquiries: reportData.inquiries?.length || 0,
      publicRecords: reportData.publicRecords?.length || 0,
      personal: reportData.personalInfo ? 'Present' : 'Missing',
      bureaus: Object.entries(reportData.bureaus)
        .filter(([_, present]) => present)
        .map(([bureau]) => bureau)
        .join(', ')
    });
    
    onProgress?.(70);
    
    // Store the full report data in session storage for letter generation
    try {
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      console.log("Saved complete report data to session storage");
    } catch (storageError) {
      console.warn("Could not store full report data in session storage:", storageError);
    }
    
    onProgress?.(90);
    onProgress?.(100);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw new Error(`Failed to analyze report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const handleAnalysisComplete = async (params: AnalysisHandlerProps) => {
  const {
    uploadedFile,
    setReportData,
    setIssues,
    setLetterGenerated,
    setAnalysisError,
    setAnalyzing,
    setAnalyzed,
    toast
  } = params;

  try {
    console.log("Starting analysis of credit report:", uploadedFile.name);
    
    // Show a longer-running analysis toast for PDFs
    let analysisToastId = null;
    if (uploadedFile.type === 'application/pdf' || uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      analysisToastId = toast.toast({
        title: "PDF Processing",
        description: "Analyzing your credit report PDF. This may take a moment...",
      }).id;
    }
    
    console.log("Processing uploaded report:", uploadedFile.name);
    const reportData = await analyzeReport(uploadedFile);
    
    if (analysisToastId) {
      toast.dismiss(analysisToastId);
    }
    
    if (!reportData) {
      throw new Error("Failed to parse credit report");
    }
    
    reportData.isSampleData = false;
    setReportData(reportData);
    
    // Use the actual report data to identify real issues
    console.log("Identifying issues in the uploaded credit report");
    let generatedIssues = identifyIssues(reportData);
    
    if (generatedIssues.length === 0) {
      console.log("No issues were detected - adding fallback issues");
      generatedIssues = addFallbackGenericIssues();
    }
    
    // Always ensure we have at least 3 issues to show
    if (generatedIssues.length < 3) {
      const additionalIssues = addFallbackGenericIssues().slice(0, 3 - generatedIssues.length);
      generatedIssues = [...generatedIssues, ...additionalIssues];
    }
    
    setIssues(generatedIssues);
    
    setAnalyzing(false);
    setAnalyzed(true);
    
    console.log("Credit report analysis complete with", generatedIssues.length, "issues identified");
    toast.toast({
      title: "Analysis Complete",
      description: `Credit report analyzed successfully with ${generatedIssues.length} potential issues identified.`,
      action: generatedIssues.length <= 5 ? 
        <ToastAction altText="View Issues">View Issues</ToastAction> : undefined
    });
    
  } catch (error) {
    console.error("Error in handleAnalysisComplete:", error);
    
    setAnalysisError(error instanceof Error ? error.message : "Unknown error occurred");
    setAnalyzing(false);
    setAnalyzed(true);
    
    toast.toast({
      title: "Analysis Error",
      description: error instanceof Error ? error.message : "Failed to analyze report",
      variant: "destructive",
      action: <ToastAction altText="Try Again">Try Again</ToastAction>
    });
  }
};
