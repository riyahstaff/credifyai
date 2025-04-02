
/**
 * This file no longer loads sample credit reports - we only use real uploaded reports
 */
import { CreditReportData } from './types';
import { parseReportContent } from './parser';

// No sample reports cache - we only use real data
let sampleReportsCache: CreditReportData[] = [];

/**
 * This function now returns an empty array to ensure no mock data is used
 */
export const loadSampleReports = async (): Promise<CreditReportData[]> => {
  console.log("DISABLED: No sample reports will be loaded - only using real data");
  return [];
};

/**
 * Main function to process a credit report file
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  try {
    // Extract text from the file
    const text = await extractTextFromFile(file);
    
    // Parse the text content
    const reportData = parseReportContent(text);
    
    // Return the parsed data
    return reportData;
  } catch (error) {
    console.error("Error processing credit report:", error);
    throw error;
  }
};

/**
 * Extract text from a file by reading it as text
 */
async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          resolve(e.target.result.toString());
        } else {
          reject(new Error("Failed to read file content"));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
}
