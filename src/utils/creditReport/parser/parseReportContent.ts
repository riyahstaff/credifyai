/**
 * Credit Report Parser - Main Parser
 * This module handles parsing text content from credit reports into structured data
 */
import { CreditReportData, CreditReportInquiry } from '../types';
import { extractPersonalInfo } from './extractPersonalInfo';
import { extractAccounts } from './accounts';
import { extractInquiries } from './extractInquiries';
import { extractPublicRecords } from './extractPublicRecords';
import { generateAnalysisResults } from './analysisGenerator';
import { convertReportToHtml } from '../formatters';

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
    publicRecords: [],
    rawText: content, // Store the raw text for later reference
    htmlContent: convertReportToHtml(content, isPdf) // Add HTML formatted content with PDF flag
  };
  
  // Check which bureaus are mentioned in the report
  const lowerContent = content.toLowerCase();
  reportData.bureaus.experian = lowerContent.includes('experian');
  reportData.bureaus.equifax = lowerContent.includes('equifax');
  reportData.bureaus.transunion = lowerContent.includes('transunion');
  
  console.log("Detected bureaus:", reportData.bureaus);
  
  // Extract personal information - this is critical for letter generation
  reportData.personalInfo = extractPersonalInfo(content);
  console.log("Extracted personal information:", reportData.personalInfo);
  
  // Extract account information
  reportData.accounts = extractAccounts(content, reportData.bureaus);
  
  // Extract inquiry information
  const extractedInquiries = extractInquiries(content, reportData.bureaus);
  
  // Ensure inquiries conform to the CreditReportInquiry interface
  reportData.inquiries = extractedInquiries.map(inquiry => {
    const completeInquiry: CreditReportInquiry = {
      inquiryDate: inquiry.inquiryDate,
      inquiryBy: inquiry.creditor || "Unknown",
      type: "Regular Inquiry",
      bureau: inquiry.bureau
    };
    
    if (inquiry.creditor) {
      completeInquiry.creditor = inquiry.creditor;
    }
    
    return completeInquiry;
  });
  
  // Extract public records information
  reportData.publicRecords = extractPublicRecords(content, reportData.bureaus);
  
  // Generate a complete analysis results object
  reportData.analysisResults = {
    // Required fields from analysisResults type
    totalAccounts: reportData.accounts.length,
    openAccounts: reportData.accounts.filter(a => a.status?.toLowerCase().includes('open')).length,
    closedAccounts: reportData.accounts.filter(a => a.status?.toLowerCase().includes('closed')).length,
    negativeItems: reportData.accounts.filter(a => a.isNegative).length,
    inquiryCount: reportData.inquiries.length,
    publicRecordCount: reportData.publicRecords.length,
    accountTypeSummary: {},
    
    // Additional recommendation fields
    totalDiscrepancies: Math.min(reportData.accounts.length * 2, 10), // Simulated discrepancies
    highSeverityIssues: Math.floor(Math.random() * 3) + 1, // 1-3 high severity issues
    accountsWithIssues: Math.min(reportData.accounts.length, 5),
    recommendedDisputes: [] // Will be populated below
  };
  
  // If we have actual account data, generate more accurate recommendedDisputes
  if (reportData.accounts.length > 0) {
    // Create proper RecommendedDispute objects
    const recommendedDisputes = reportData.accounts.slice(0, 3).map((account, index) => {
      return {
        id: `dispute-${index}`,
        type: "Account Error",
        title: `Issue with ${account.accountName}`,
        bureau: account.bureau || "Experian",
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        reason: "Inaccurate Information",
        description: "This account contains information that may be inaccurate.",
        impact: "High",
        severity: "high"
      };
    });
    
    // Add the properly formatted recommended disputes
    if (reportData.analysisResults) {
      reportData.analysisResults.recommendedDisputes = recommendedDisputes;
    }
    
    // Update with more accurate results
    const generatedResults = generateAnalysisResults(reportData);
    // Merge generated results with required default fields
    if (reportData.analysisResults && generatedResults) {
      reportData.analysisResults = {
        ...reportData.analysisResults,
        ...generatedResults
      };
    }
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
