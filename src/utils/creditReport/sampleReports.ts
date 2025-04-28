
/**
 * Credit Report Processing Module - Strictly for Real Reports
 * This file handles processing of uploaded credit reports only
 * NO MOCK DATA IS USED OR RETURNED
 */

import { CreditReportData } from './types';
import { parseReportContent } from './parser';

/**
 * Main function to process a credit report file
 * Extracts and parses the content from the uploaded file
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  try {
    console.log(`Processing uploaded credit report: ${file.name} (${file.type})`);
    
    // Extract text from the file
    const text = await extractTextFromFile(file);
    console.log(`Extracted ${text.length} characters from file`);
    
    // Parse the text content
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const reportData = parseReportContent(text, isPdf);
    
    // Verify data was successfully extracted
    validateReportData(reportData);
    
    // Log extraction results
    console.log("Credit report processing complete with results:", {
      accounts: reportData.accounts.length,
      inquiries: reportData.inquiries ? reportData.inquiries.length : 0,
      bureau: reportData.primaryBureau || "Unknown",
      personalInfo: reportData.personalInfo ? "Present" : "Missing"
    });
    
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
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  
  if (isPdf) {
    console.log("Extracting text from PDF file");
    // Import and use the specialized PDF extractor
    const { extractTextFromPDF } = await import('./extractors/pdfExtractor');
    return await extractTextFromPDF(file);
  } else {
    console.log("Extracting text from text file");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (e.target?.result) {
            const textContent = e.target.result.toString();
            console.log(`Extracted ${textContent.length} characters`);
            resolve(textContent);
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
}

/**
 * Validate that we actually extracted meaningful data from the report
 */
function validateReportData(reportData: CreditReportData): void {
  const issues: string[] = [];
  
  if (!reportData.accounts || reportData.accounts.length === 0) {
    issues.push("No accounts found in report");
  }
  
  if (!reportData.primaryBureau) {
    issues.push("Could not determine credit bureau");
  }
  
  if (!reportData.personalInfo || !reportData.personalInfo.name) {
    issues.push("No personal information found");
  }
  
  if (issues.length > 0) {
    console.warn("Report data validation issues:", issues);
    // We don't throw an error here, as partial data is still useful
  }
}

/**
 * This function exists only for backward compatibility
 * It ALWAYS returns an empty array - NO SAMPLE REPORTS
 */
export const loadSampleReports = async (): Promise<CreditReportData[]> => {
  console.log("REMOVED: Sample reports function called but returns empty array - only real reports are used");
  return [];
};
