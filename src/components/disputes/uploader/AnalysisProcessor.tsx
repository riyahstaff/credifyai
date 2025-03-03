
import { useToast } from '@/hooks/use-toast';
import { processCreditReport } from '@/utils/creditReportParser';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import { loadSampleDisputeLetters } from '@/utils/creditReport/disputeLetters/sampleLettersLoader';
import { loadSampleReports } from '@/utils/creditReport/sampleReports';
import { AnalysisProcessorProps, AnalysisHandlerProps } from './types/analysisTypes';
import { ensureMinimumIssues } from './utils/issueGenerator';
import { generateDisputeLetters, storeGeneratedLetters } from './utils/letterGenerator';
import { storeReportData } from './utils/reportStorage';

// Use 'export type' instead of just 'export' for re-exporting types
export type { AnalysisProcessorProps } from './types/analysisTypes';

export const handleAnalysisComplete = async ({
  uploadedFile,
  setReportData,
  setIssues,
  setLetterGenerated,
  setAnalysisError,
  setAnalyzing,
  setAnalyzed,
  toast
}: AnalysisHandlerProps) => {
  console.log("handleAnalysisComplete called");
  
  try {
    setAnalyzing(true);
    
    if (!uploadedFile) {
      console.error("No file available for analysis");
      setAnalysisError("No file was available for analysis");
      setAnalyzing(false);
      setAnalyzed(true);
      return;
    }
    
    // Preload sample data
    await preloadSampleData();
    
    // Process the credit report
    console.log("Processing credit report:", uploadedFile.name);
    const data = await processCreditReport(uploadedFile);
    
    // Enhance the data with additional context
    console.log("Enhancing report data");
    const enhancedData = enhanceReportData(data);
    setReportData(enhancedData);
    
    // Identify issues in the report
    console.log("Identifying issues in report data");
    let detectedIssues = identifyIssues(enhancedData);
    
    // Ensure we have at least 3 issues to present to the user
    detectedIssues = ensureMinimumIssues(detectedIssues, 3);
    
    console.log(`Found ${detectedIssues.length} potential issues:`, detectedIssues);
    setIssues(detectedIssues);
    
    // Store the report data in session storage
    if (enhancedData) {
      storeReportData(enhancedData);
      
      // Generate dispute letters
      console.log(`Generating dispute letters for ${detectedIssues.length} issues`);
      const generatedLetters = await generateDisputeLetters(detectedIssues);
      
      // Store the generated letters
      const lettersStored = storeGeneratedLetters(generatedLetters);
      
      if (lettersStored) {
        setLetterGenerated(true);
        
        toast.toast({
          title: "Dispute letters generated",
          description: `${generatedLetters.length} dispute letters have been created and are ready for review.`,
        });
      } else {
        setAnalysisError("Generated letters are too large for browser storage. Please try generating individual letters.");
        
        toast.toast({
          title: "Storage error",
          description: "Letters were generated but couldn't be stored due to browser limitations.",
          variant: "destructive",
        });
      }
    }
    
    toast.toast({
      title: "Analysis complete",
      description: `Found ${detectedIssues.length} potential issues in your credit report.`,
    });
    
    setAnalyzing(false);
    setAnalyzed(true);
    
  } catch (error) {
    console.error("Error analyzing report:", error);
    setAnalysisError(error instanceof Error ? error.message : "Unknown error processing report");
    setAnalyzing(false);
    setAnalyzed(true);
    
    toast.toast({
      title: "Analysis failed",
      description: error instanceof Error ? error.message : "Failed to process your credit report.",
      variant: "destructive",
    });
  }
};

/**
 * Preload sample data to assist with analysis
 */
const preloadSampleData = async () => {
  console.log("Preloading sample dispute letters and reports");
  const sampleDisputeLetters = await loadSampleDisputeLetters();
  console.log(`Loaded ${sampleDisputeLetters.length} sample dispute letters`);
  const sampleReports = await loadSampleReports();
  console.log(`Loaded ${sampleReports.length} sample credit reports`);
};
