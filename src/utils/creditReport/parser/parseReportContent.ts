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
import { analyzeReportForIssues } from './analyzeReportIssues';

/**
 * Parse text content from a credit report into structured data
 * @param content Text content to parse
 * @param isPdf Optional flag indicating if the source was a PDF
 */
export const parseReportContent = (content: string, isPdf: boolean = false): CreditReportData => {
  console.log("Parsing credit report content, length:", content.length);
  console.log("Raw content sample:", content.substring(0, 200));
  
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
    rawText: content,
    htmlContent: convertReportToHtml(content, isPdf)
  };
  
  // Advanced bureau detection system - more aggressive pattern matching
  const lowerContent = content.toLowerCase();
  
  // TransUnion detection - try multiple variations and patterns
  const transunionPatterns = [
    /trans\s*union/i,
    /transunion/i,
    /tu\s+credit/i,
    /credit\s+report\s+from\s+trans/i,
    /tu\s+consumer/i,
    /transunion\s+consumer/i,
    /tu\s+score/i,
    /tu\s+report/i,
    /transunion\.com/i,
    /tuc\.com/i,
    /tu\s+disclosure/i,
    /\btu\b(?!.*(?:equifax|experian))/i // TU mentioned but not other bureaus
  ];
  
  // Equifax detection
  const equifaxPatterns = [
    /equifax/i,
    /credit\s+report\s+from\s+equifax/i,
    /equifax\s+consumer/i,
    /eq\s+score/i,
    /eq\s+report/i,
    /equifax\.com/i,
    /\beq\b(?!.*(?:transunion|experian))/i
  ];
  
  // Experian detection
  const experianPatterns = [
    /experian/i,
    /credit\s+report\s+from\s+experian/i,
    /experian\s+consumer/i,
    /ex\s+score/i,
    /ex\s+report/i,
    /experian\.com/i,
    /\bex\b(?!.*(?:transunion|equifax))/i
  ];
  
  // Check TransUnion patterns
  for (const pattern of transunionPatterns) {
    if (pattern.test(lowerContent)) {
      reportData.bureaus.transunion = true;
      break;
    }
  }
  
  // Check Equifax patterns
  for (const pattern of equifaxPatterns) {
    if (pattern.test(lowerContent)) {
      reportData.bureaus.equifax = true;
      break;
    }
  }
  
  // Check Experian patterns
  for (const pattern of experianPatterns) {
    if (pattern.test(lowerContent)) {
      reportData.bureaus.experian = true;
      break;
    }
  }
  
  console.log("Detected bureaus:", reportData.bureaus);
  
  // Determine primary bureau strictly from detected patterns with NO defaults
  if (reportData.bureaus.transunion) {
    reportData.primaryBureau = "TransUnion";
  } else if (reportData.bureaus.equifax) {
    reportData.primaryBureau = "Equifax";
  } else if (reportData.bureaus.experian) {
    reportData.primaryBureau = "Experian";
  }
  
  // If no bureau detected, use more aggressive detection
  if (!reportData.primaryBureau) {
    // Look for format-specific indicators
    if (content.includes('PERSONAL PROFILE FOR:') || 
        content.includes('TRANSUNION CREDIT REPORT') || 
        content.includes('TU CREDIT PROFILE') ||
        content.includes('TU REPORT') ||
        content.includes('TRANS UNION')) {
      reportData.bureaus.transunion = true;
      reportData.primaryBureau = "TransUnion";
    } else if (content.includes('EQUIFAX CREDIT REPORT') || 
               content.includes('EQ CREDIT PROFILE') ||
               content.includes('EQUIFAX INFORMATION SERVICES')) {
      reportData.bureaus.equifax = true;
      reportData.primaryBureau = "Equifax";
    } else if (content.includes('EXPERIAN CREDIT REPORT') || 
               content.includes('EX CREDIT PROFILE') ||
               content.includes('NATIONAL CONSUMER ASSISTANCE CENTER')) {
      reportData.bureaus.experian = true;
      reportData.primaryBureau = "Experian";
    }
  }
  
  // If still no bureau detected, check for any mention of credit bureaus in the text
  if (!reportData.primaryBureau) {
    const tuCount = (content.match(/transunion|trans union|tu/gi) || []).length;
    const eqCount = (content.match(/equifax|eq/gi) || []).length;
    const exCount = (content.match(/experian|ex/gi) || []).length;
    
    console.log("Bureau mention counts:", { TransUnion: tuCount, Equifax: eqCount, Experian: exCount });
    
    if (tuCount > eqCount && tuCount > exCount && tuCount > 0) {
      reportData.bureaus.transunion = true;
      reportData.primaryBureau = "TransUnion";
    } else if (eqCount > tuCount && eqCount > exCount && eqCount > 0) {
      reportData.bureaus.equifax = true;
      reportData.primaryBureau = "Equifax";
    } else if (exCount > tuCount && exCount > eqCount && exCount > 0) {
      reportData.bureaus.experian = true;
      reportData.primaryBureau = "Experian";
    }
  }
  
  console.log("Determined primary bureau:", reportData.primaryBureau || "UNKNOWN");
  
  // Extract personal information first
  reportData.personalInfo = extractPersonalInfo(content);
  console.log("Extracted personal information:", reportData.personalInfo);
  
  // Extract account information
  reportData.accounts = extractAccounts(content, reportData.bureaus);
  console.log(`Extracted ${reportData.accounts.length} accounts from report`);
  
  // Data quality check - log the first account for debugging
  if (reportData.accounts.length > 0) {
    console.log("First account sample:", {
      name: reportData.accounts[0].accountName,
      number: reportData.accounts[0].accountNumber,
      type: reportData.accounts[0].accountType,
      status: reportData.accounts[0].status
    });
  }
  
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
  
  console.log(`Extracted ${reportData.inquiries.length} inquiries from report`);
  
  // Extract public records information
  reportData.publicRecords = extractPublicRecords(content, reportData.bureaus);
  console.log(`Extracted ${reportData.publicRecords.length} public records from report`);
  
  // Use our enhanced issue analyzer instead of the simple detection
  const identifiedIssues = analyzeReportForIssues(reportData);
  
  // Convert Issue[] to IdentifiedIssue[] format for storage in reportData
  const formattedIssues = identifiedIssues.map(issue => ({
    type: issue.type,
    title: issue.type.charAt(0).toUpperCase() + issue.type.slice(1).replace('_', ' '),
    description: issue.description,
    impact: issue.severity === 'high' ? 'High Impact' : 
           issue.severity === 'medium' ? 'Medium Impact' : 'Low Impact',
    impactColor: issue.severity === 'high' ? 'red' : 
                issue.severity === 'medium' ? 'orange' : 'yellow',
    account: issue.accountName ? { 
      accountName: issue.accountName,
      accountNumber: issue.accountNumber
    } : undefined,
    laws: typeof issue.legalBasis === 'string' ? 
      issue.legalBasis.split(', ') : 
      (Array.isArray(issue.legalBasis) ? issue.legalBasis.map(lb => typeof lb === 'string' ? lb : lb.law) : []),
    bureau: issue.bureau,
    severity: issue.severity
  }));
  
  // Add the identified issues to the report data
  if (formattedIssues.length > 0) {
    console.log(`Found ${formattedIssues.length} issues in credit report`);
    reportData.issues = formattedIssues;
  }
  
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
  
  // Create recommended disputes from actual accounts
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
