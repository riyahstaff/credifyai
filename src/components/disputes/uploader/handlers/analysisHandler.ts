
import { CreditReportData } from '@/utils/creditReport/types';
import { processCreditReport } from '@/utils/creditReport';
import { parseReportContent } from '@/utils/creditReport/parser/parseReportContent';
import { extractTextFromPDF } from '@/utils/creditReport/extractors/pdfExtractor';
import { useToast } from '@/hooks/use-toast';

// The main handler for analyzing uploaded credit reports
export const analyzeReport = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    // Report the start of processing
    onProgress?.(10);
    
    // Extract text from the file (PDF or text)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    let textContent = '';
    
    if (isPdf) {
      textContent = await extractTextFromPDF(file);
      onProgress?.(30);
    } else {
      textContent = await file.text();
      onProgress?.(40);
    }
    
    // Parse the text content into structured data
    onProgress?.(50);
    const reportData = parseReportContent(textContent, isPdf);
    
    // Additional processing and enhancement
    onProgress?.(70);
    
    // Further analyze for issues
    onProgress?.(90);
    
    // Complete the analysis
    onProgress?.(100);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing report:", error);
    throw new Error(`Failed to analyze report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Simplified analysis for testing without requiring a real file
export const analyzeTestReport = async (
  onProgress?: (progress: number) => void
): Promise<CreditReportData> => {
  try {
    // Simulate progress
    onProgress?.(20);
    
    // Import sample data
    const { getSampleCreditReportData } = await import('@/utils/creditReport/sampleReports');
    const reportData = getSampleCreditReportData();
    
    // Simulate analysis steps
    onProgress?.(50);
    setTimeout(() => onProgress?.(70), 500);
    setTimeout(() => onProgress?.(90), 1000);
    setTimeout(() => onProgress?.(100), 1500);
    
    return reportData;
  } catch (error) {
    console.error("Error analyzing test report:", error);
    throw new Error(`Failed to analyze test report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
