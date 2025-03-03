
/**
 * Credit Report Parser - Main Parser
 * This module handles parsing text content from credit reports into structured data
 */
import { CreditReportData } from '../types';
import { extractPersonalInfo } from './extractPersonalInfo';
import { extractAccounts } from './accounts';
import { extractInquiries } from './extractInquiries';
import { extractPublicRecords } from './extractPublicRecords';
import { generateAnalysisResults } from './analysisGenerator';
import { convertReportToHtml } from '../formatters/htmlFormatter';

/**
 * Parse text content from a credit report into structured data
 * @param content Text content to parse
 * @param isPdf Optional flag indicating if the source was a PDF
 */
export const parseReportContent = (content: string, isPdf: boolean = false): CreditReportData => {
  console.log("Parsing credit report content, length:", content.length);
  
  // Create empty report structure
  const reportData: CreditReportData = {
    bureaus: {
      experian: false,
      equifax: false,
      transunion: false
    },
    accounts: [],
    inquiries: [],
    rawText: content, // Store the raw text for later reference
    htmlContent: convertReportToHtml(content, isPdf) // Add HTML formatted content with PDF flag
  };
  
  // Check which bureaus are mentioned in the report
  const lowerContent = content.toLowerCase();
  reportData.bureaus.experian = lowerContent.includes('experian');
  reportData.bureaus.equifax = lowerContent.includes('equifax');
  reportData.bureaus.transunion = lowerContent.includes('transunion');
  
  console.log("Detected bureaus:", reportData.bureaus);
  
  // Extract personal information
  reportData.personalInfo = extractPersonalInfo(content);
  
  // Extract account information
  reportData.accounts = extractAccounts(content, reportData.bureaus);
  
  // Extract inquiry information
  reportData.inquiries = extractInquiries(content, reportData.bureaus);
  
  // Extract public records information
  reportData.publicRecords = extractPublicRecords(content, reportData.bureaus);
  
  // Generate a simplified analysis summary if we have accounts
  if (reportData.accounts.length > 0) {
    reportData.analysisResults = generateAnalysisResults(reportData);
  }
  
  return reportData;
};

// Helper to process raw file content including PDF detection
export const parseReportFile = async (file: File): Promise<CreditReportData> => {
  const isPdf = file.type === 'application/pdf';
  console.log(`Processing file as ${isPdf ? 'PDF' : 'text'}`);
  
  try {
    // Import extractors dynamically to prevent circular dependencies
    const { extractTextFromPDF } = await import('../extractors');
    const content = await extractTextFromPDF(file);
    
    return parseReportContent(content, isPdf);
  } catch (error) {
    console.error("Error parsing report file:", error);
    throw new Error(`Failed to parse report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

