
/**
 * Sample Reports Loader
 * This module handles loading sample credit reports from Supabase
 */
import { CreditReportData } from './types';
import { parseReportContent } from './parser';
import { listSampleReports, downloadSampleReport } from '@/lib/supabase';

// Store sample reports data cache
let sampleReportsCache: CreditReportData[] = [];

/**
 * Load all sample credit reports from Supabase Storage
 * This helps CLEO learn from past successful disputes
 */
export const loadSampleReports = async (): Promise<CreditReportData[]> => {
  if (sampleReportsCache.length > 0) {
    return sampleReportsCache;
  }
  
  try {
    const sampleFiles = await listSampleReports();
    
    const reports: CreditReportData[] = [];
    
    for (const file of sampleFiles) {
      const sampleFile = await downloadSampleReport(file.name);
      if (sampleFile) {
        const reportData = await processCreditReport(new File([sampleFile], file.name));
        reports.push(reportData);
      }
    }
    
    sampleReportsCache = reports;
    console.log(`Loaded ${reports.length} sample credit reports`);
    return reports;
  } catch (error) {
    console.error('Error loading sample reports:', error);
    return [];
  }
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
 * Simplified version for the sample reports
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
