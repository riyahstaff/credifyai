
/**
 * Credit Report Parser - Main Parser
 * This module handles parsing text content from credit reports into structured data
 */
import { CreditReportData, CreditReportInquiry, RecommendedDispute, AnalysisResults } from '../types';
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
  
  // Stronger detection of bureau information - first by specific header patterns
  const lowerContent = content.toLowerCase();
  
  // Look for very explicit bureau headers/logos first
  const experianLogo = /(e+\s*x+\s*p+\s*e+\s*r+\s*i+\s*a+\s*n+|e\s*x\s*p\s*e\s*r\s*i\s*a\s*n)/i;
  const equifaxLogo = /(e+\s*q+\s*u+\s*i+\s*f+\s*a+\s*x+|e\s*q\s*u\s*i\s*f\s*a\s*x)/i;
  const transunionLogo = /(t+\s*r+\s*a+\s*n+\s*s+\s*u+\s*n+\s*i+\s*o+\s*n+|t\s*r\s*a\s*n\s*s\s*u\s*n\s*i\s*o\s*n|trans\s*union)/i;
  
  reportData.bureaus.experian = 
    experianLogo.test(lowerContent) || 
    content.includes('EXPERIAN') || 
    lowerContent.includes('experian credit report') ||
    lowerContent.includes('experian.com');
    
  reportData.bureaus.equifax = 
    equifaxLogo.test(lowerContent) || 
    content.includes('EQUIFAX') || 
    lowerContent.includes('equifax credit report') ||
    lowerContent.includes('equifax.com');
    
  reportData.bureaus.transunion = 
    transunionLogo.test(lowerContent) || 
    content.includes('TRANSUNION') || 
    content.includes('TRANS UNION') || 
    lowerContent.includes('transunion credit report') ||
    lowerContent.includes('transunion.com') ||
    lowerContent.includes('tuc.com') ||
    lowerContent.includes('tu credit') ||
    lowerContent.includes('trans union');
  
  console.log("Detected bureaus:", reportData.bureaus);
  
  // Determine primary bureau with NO default - we must identify it from the report
  if (reportData.bureaus.transunion) {
    reportData.primaryBureau = "TransUnion";
  } else if (reportData.bureaus.equifax) {
    reportData.primaryBureau = "Equifax";
  } else if (reportData.bureaus.experian) {
    reportData.primaryBureau = "Experian";
  } else {
    // Deeper analysis - search for more specific bureau indicators
    if (lowerContent.includes('tu') && !lowerContent.includes('equifax') && !lowerContent.includes('experian')) {
      reportData.bureaus.transunion = true;
      reportData.primaryBureau = "TransUnion";
    } else if (lowerContent.includes('fico') && lowerContent.includes('score') && lowerContent.includes('tu')) {
      reportData.bureaus.transunion = true;
      reportData.primaryBureau = "TransUnion";
    } else {
      // Look for score types that might indicate the bureau
      if (lowerContent.includes('fico score 8 tu')) {
        reportData.bureaus.transunion = true;
        reportData.primaryBureau = "TransUnion";
      } else if (lowerContent.includes('fico score 8 eq')) {
        reportData.bureaus.equifax = true;
        reportData.primaryBureau = "Equifax";
      } else if (lowerContent.includes('fico score 8 ex')) {
        reportData.bureaus.experian = true;
        reportData.primaryBureau = "Experian";
      } else {
        // Leave primaryBureau undefined if we couldn't detect it
        // DO NOT SET A DEFAULT
        reportData.primaryBureau = undefined;
        console.log("WARNING: Could not determine primary bureau from credit report");
      }
    }
  }
  
  // Log the determined primary bureau
  console.log(`Determined primary bureau: ${reportData.primaryBureau || "UNKNOWN"}`);
  
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
    totalDiscrepancies: reportData.accounts.filter(a => a.isNegative).length,
    highSeverityIssues: reportData.accounts.filter(a => a.isNegative).length,
    accountsWithIssues: reportData.accounts.filter(a => a.isNegative).length,
    recommendedDisputes: [] // Will be populated below
  };
  
  // If we have actual account data, generate more accurate recommendedDisputes
  if (reportData.accounts.length > 0) {
    // Create properly typed RecommendedDispute objects
    const recommendedDisputes: RecommendedDispute[] = reportData.accounts
      .filter(acc => acc.isNegative)
      .map((account, index) => {
        let reason = "Inaccurate Information";
        let type = "Account Error";
        
        // Determine better reason based on account data
        if (account.paymentStatus?.toLowerCase().includes('late')) {
          reason = "Late Payment Dispute";
          type = "Late Payment";
        } else if (account.status?.toLowerCase().includes('collection')) {
          reason = "Collection Account Dispute";
          type = "Collection";
        } else if (account.remarks?.some(r => r.toLowerCase().includes('charge'))) {
          reason = "Charge-Off Dispute";
          type = "Charge-Off";
        }
        
        return {
          id: `dispute-${index}`,
          type: type,
          title: `Issue with ${account.accountName}`,
          bureau: reportData.primaryBureau || account.bureau || "Unknown",
          accountName: account.accountName,
          accountNumber: account.accountNumber || "",
          reason: reason,
          description: `This account contains information that may be inaccurate.`,
          impact: "High", // Using valid enum value
          severity: "high",
          sampleDisputeLanguage: `I am disputing this account as it contains inaccurate information.`
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
