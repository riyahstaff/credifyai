<lov-code>
/**
 * Credit Report Parser Utility
 * This module parses uploaded credit reports to extract relevant information
 * for generating dispute letters and automatically identifies discrepancies and errors.
 */

import { listSampleReports, downloadSampleReport, listSampleDisputeLetters, downloadSampleDisputeLetter } from '@/lib/supabase';

export interface CreditReportAccount {
  accountName: string;
  accountNumber?: string;
  accountType?: string;
  currentBalance?: string;
  paymentStatus?: string;
  dateOpened?: string;
  dateReported?: string;
  bureau?: string;
  remarks?: string[];
  // New fields for cross-bureau analysis
  bureauSpecificData?: {
    experian?: AccountBureauData;
    equifax?: AccountBureauData;
    transunion?: AccountBureauData;
  };
  discrepancies?: AccountDiscrepancy[];
}

export interface AccountBureauData {
  accountNumber?: string;
  currentBalance?: string;
  paymentStatus?: string;
  dateOpened?: string;
  dateReported?: string;
  creditLimit?: string;
  highBalance?: string;
  paymentHistory?: Record<string, string>; // Month -> Status
  lastPaymentDate?: string;
  lastPaymentAmount?: string;
}

export interface AccountDiscrepancy {
  field: string; // e.g., "currentBalance", "paymentStatus"
  bureaus: string[]; // Which bureaus have different values
  values: Record<string, string>; // Bureau -> Value
  severity: 'high' | 'medium' | 'low';
  suggestedDispute?: string;
  legalBasis?: LegalReference[]; // Added legal basis for the dispute
}

// New interface for legal references
export interface LegalReference {
  law: string; // e.g., "FCRA", "METRO 2"
  section: string; // e.g., "Section 611(a)", "Format Rule 5.1"
  description: string; // Short description of the legal requirement
}

export interface CreditReportData {
  bureaus: {
    experian?: boolean;
    equifax?: boolean;
    transunion?: boolean;
  };
  personalInfo?: {
    name?: string;
    address?: string;
    previousAddresses?: string[];
    employers?: string[];
    // New fields for cross-bureau analysis
    bureauSpecificInfo?: {
      experian?: PersonalBureauData;
      equifax?: PersonalBureauData;
      transunion?: PersonalBureauData;
    };
    discrepancies?: PersonalInfoDiscrepancy[];
  };
  accounts: CreditReportAccount[];
  inquiries?: Array<{
    inquiryDate: string;
    creditor: string;
    bureau: string;
  }>;
  publicRecords?: Array<{
    recordType: string;
    bureau: string;
    dateReported: string;
    status: string;
  }>;
  // New field for analysis summary
  analysisResults?: {
    totalDiscrepancies: number;
    highSeverityIssues: number;
    accountsWithIssues: number;
    recommendedDisputes: RecommendedDispute[];
  };
}

export interface PersonalBureauData {
  name?: string;
  address?: string;
  previousAddresses?: string[];
  dateOfBirth?: string;
  socialSecurityNumber?: string;
}

export interface PersonalInfoDiscrepancy {
  field: string; // e.g., "address", "name"
  bureaus: string[]; // Which bureaus have different values
  values: Record<string, string>; // Bureau -> Value
  severity: 'high' | 'medium' | 'low';
  suggestedDispute?: string;
  legalBasis?: LegalReference[]; // Added legal basis for the dispute
}

export interface RecommendedDispute {
  accountName: string;
  accountNumber?: string;
  bureau: string;
  reason: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  discrepancyDetails?: AccountDiscrepancy;
  sampleDisputeLanguage?: string; // Added field for sample dispute language
  legalBasis?: LegalReference[]; // Added field for legal basis
}

// New interface for sample dispute letter data
export interface SampleDisputeLetter {
  content: string;
  disputeType: string; // e.g., "balance", "late_payment", "account_ownership"
  bureau?: string;
  successfulOutcome?: boolean;
  effectiveLanguage?: string[];
  legalCitations?: string[];
}

// Credit Laws and Regulations Database
export const CREDIT_LAWS = {
  FCRA: {
    name: "Fair Credit Reporting Act",
    sections: {
      "601": {
        title: "Short title",
        description: "Establishes the short title of the Act as the Fair Credit Reporting Act."
      },
      "602": {
        title: "Congressional findings and statement of purpose",
        description: "Outlines the purpose of the FCRA to ensure fair and accurate credit reporting."
      },
      "603": {
        title: "Definitions; rules of construction",
        description: "Provides definitions for terms used in the Act."
      },
      "605": {
        title: "Requirements relating to information contained in consumer reports",
        description: "Limits the time periods for reporting negative information in consumer credit reports."
      },
      "605A": {
        title: "Identity theft prevention and credit history restoration",
        description: "Outlines provisions for fraud alerts and active duty alerts."
      },
      "605B": {
        title: "Block of information resulting from identity theft",
        description: "Provides for blocking of information resulting from identity theft."
      },
      "609": {
        title: "Disclosures to consumers",
        description: "Requires consumer reporting agencies to disclose information to consumers."
      },
      "610": {
        title: "Conditions and form of disclosure to consumers",
        description: "Specifies the conditions and form of disclosures to consumers."
      },
      "611": {
        title: "Procedure in case of disputed accuracy",
        description: "Requires consumer reporting agencies to reinvestigate disputed information and correct or delete inaccurate information."
      },
      "623": {
        title: "Responsibilities of furnishers of information to consumer reporting agencies",
        description: "Outlines the responsibilities of those who furnish information to consumer reporting agencies."
      }
    }
  },
  METRO2: {
    name: "METRO 2 Format",
    sections: {
      "Compliance": {
        title: "Compliance with Metro 2 Format",
        description: "Requires furnishers to report information in the standard Metro 2 Format."
      },
      "Accuracy": {
        title: "Data Accuracy",
        description: "Requires furnishers to report accurate and complete information."
      },
      "PaymentHistory": {
        title: "Payment History Profile",
        description: "Standardizes reporting of account status and payment history."
      },
      "AccountStatus": {
        title: "Account Status Codes",
        description: "Defines standard codes for reporting account status."
      },
      "ConsumerInfo": {
        title: "Consumer Information Indicator",
        description: "Provides codes for special consumer situations such as bankruptcy or dispute."
      },
      "Dates": {
        title: "Date Reporting",
        description: "Standardizes reporting of dates including date opened, date of last payment, date reported."
      }
    }
  },
  ECOA: {
    name: "Equal Credit Opportunity Act",
    sections: {
      "701": {
        title: "Prohibited discrimination",
        description: "Prohibits discrimination in credit transactions."
      },
      "702": {
        title: "Definitions",
        description: "Provides definitions for terms used in the Act."
      },
      "704B": {
        title: "Small business loan data collection",
        description: "Requires collection of small business loan data."
      }
    }
  },
  FDCPA: {
    name: "Fair Debt Collection Practices Act",
    sections: {
      "803": {
        title: "Definitions",
        description: "Provides definitions for terms used in the Act."
      },
      "805": {
        title: "Communication in connection with debt collection",
        description: "Restricts communications with consumers in connection with debt collection."
      },
      "807": {
        title: "False or misleading representations",
        description: "Prohibits false or misleading representations in connection with debt collection."
      },
      "809": {
        title: "Validation of debts",
        description: "Requires debt collectors to validate debts when disputed by consumers."
      }
    }
  }
};

// Associate common dispute scenarios with applicable legal references
export const LEGAL_REFERENCES_BY_DISPUTE_TYPE: Record<string, LegalReference[]> = {
  "identity_theft": [
    { law: "FCRA", section: "Section 605B", description: "You have the right to block information resulting from identity theft." },
    { law: "FCRA", section: "Section 605A", description: "You can place a fraud alert on your credit file when you've been a victim of identity theft." }
  ],
  "not_mine": [
    { law: "FCRA", section: "Section 611(a)", description: "Credit bureaus must conduct a reasonable investigation of disputed information." },
    { law: "FCRA", section: "Section 623(b)", description: "Furnishers must investigate disputed information reported to them by a consumer reporting agency." }
  ],
  "late_payment": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate information about your payment history." },
    { law: "METRO 2", section: "Payment History Profile", description: "Creditors must accurately report payment history according to Metro 2 standards." }
  ],
  "balance": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate balance information." },
    { law: "METRO 2", section: "Accuracy", description: "Creditors must report the correct current balance per Metro 2 standards." }
  ],
  "account_status": [
    { law: "FCRA", section: "Section 623", description: "Furnishers must report accurate status information to credit bureaus." },
    { law: "METRO 2", section: "AccountStatus", description: "Account status must be reported using correct codes per Metro 2 standards." }
  ],
  "account_information": [
    { law: "FCRA", section: "Section 611(a)", description: "Credit bureaus must investigate disputed account information." },
    { law: "METRO 2", section: "Compliance", description: "Account information must be reported accurately according to Metro 2 standards." }
  ],
  "personal_information": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate personal information." },
    { law: "METRO 2", section: "ConsumerInfo", description: "Consumer information must be reported accurately per Metro 2 standards." }
  ],
  "closed_account": [
    { law: "FCRA", section: "Section 623", description: "Furnishers must report accurate information about account closure." },
    { law: "METRO 2", section: "AccountStatus", description: "Closed accounts must be reported with the correct status code." }
  ],
  "dates": [
    { law: "FCRA", section: "Section 611(a)", description: "You have the right to dispute inaccurate dates on your credit report." },
    { law: "METRO 2", section: "Dates", description: "Dates must be reported accurately according to Metro 2 standards." }
  ]
};

// Store sample reports data cache
let sampleReportsCache: CreditReportData[] = [];
// Store sample dispute letters cache
let sampleDisputeLettersCache: SampleDisputeLetter[] = [];
// Store successful dispute phrases cache
let successfulDisputePhrasesCache: Record<string, string[]> = {};

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
        const reportData = await processCreditReport(sampleFile);
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
 * Load all sample dispute letters from Supabase Storage
 */
export const loadSampleDisputeLetters = async (): Promise<SampleDisputeLetter[]> => {
  if (sampleDisputeLettersCache.length > 0) {
    return sampleDisputeLettersCache;
  }
  
  try {
    const sampleFiles = await listSampleDisputeLetters();
    const letters: SampleDisputeLetter[] = [];
    
    for (const file of sampleFiles) {
      const letterContent = await downloadSampleDisputeLetter(file.name);
      if (letterContent) {
        // Determine dispute type from file name or content
        const disputeType = determineDisputeTypeFromFileName(file.name);
        const bureau = determineBureauFromFileName(file.name);
        
        // Extract effective language and legal citations
        const { effectiveLanguage, legalCitations } = extractKeyComponentsFromLetter(letterContent);
        
        letters.push({
          content: letterContent,
          disputeType,
          bureau,
          successfulOutcome: file.name.toLowerCase().includes('successful'),
          effectiveLanguage,
          legalCitations
        });
      }
    }
    
    sampleDisputeLettersCache = letters;
    console.log(`Loaded ${letters.length} sample dispute letters`);
    return letters;
  } catch (error) {
    console.error('Error loading sample dispute letters:', error);
    return [];
  }
};

/**
 * Determine dispute type from file name
 */
function determineDisputeTypeFromFileName(fileName: string): string {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName.includes('balance') || lowerFileName.includes('amount')) {
    return 'balance';
  } else if (lowerFileName.includes('late') || lowerFileName.includes('payment')) {
    return 'late_payment';
  } else if (lowerFileName.includes('not_mine') || lowerFileName.includes('fraud') || lowerFileName.includes('identity')) {
    return 'not_mine';
  } else if (lowerFileName.includes('closed') || lowerFileName.includes('status')) {
    return 'account_status';
  } else if (lowerFileName.includes('date')) {
    return 'dates';
  } else if (lowerFileName.includes('personal') || lowerFileName.includes('address') || lowerFileName.includes('name')) {
    return 'personal_information';
  }
  
  return 'general';
}

/**
 * Determine bureau from file name
 */
function determineBureauFromFileName(fileName: string): string | undefined {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName.includes('experian')) {
    return 'experian';
  } else if (lowerFileName.includes('equifax')) {
    return 'equifax';
  } else if (lowerFileName.includes('transunion')) {
    return 'transunion';
  }
  
  return undefined;
}

/**
 * Extract key components from a dispute letter
 */
function extractKeyComponentsFromLetter(letterContent: string): { 
  effectiveLanguage: string[], 
  legalCitations: string[] 
} {
  const effectiveLanguage: string[] = [];
  const legalCitations: string[] = [];
  
  // Look for paragraphs that appear to be describing the dispute
  const paragraphs = letterContent.split(/\n\s*\n/);
  
  for (const paragraph of paragraphs) {
    // Check for legal citations
    if (paragraph.includes('FCRA') || 
        paragraph.includes('Fair Credit Reporting Act') || 
        paragraph.includes('Section') || 
        paragraph.includes('METRO') || 
        paragraph.includes('15 U.S.C')) {
      legalCitations.push(paragraph.trim());
    }
    
    // Check for dispute explanation paragraphs
    if ((paragraph.includes('inaccurate') || 
         paragraph.includes('incorrect') || 
         paragraph.includes('error') || 
         paragraph.includes('dispute')) && 
        paragraph.length > 50 && 
        paragraph.length < 500) {
      effectiveLanguage.push(paragraph.trim());
    }
  }
  
  return { effectiveLanguage, legalCitations };
}

/**
 * Find applicable legal references for a specific dispute type
 */
export const getLegalReferencesForDispute = (field: string, context?: string): LegalReference[] => {
  // Map the field to a dispute type
  let disputeType = 'account_information'; // default
  
  const fieldLower = field.toLowerCase();
  const contextLower = context?.toLowerCase() || '';
  
  if (fieldLower.includes('name') || fieldLower.includes('address')) {
    disputeType = 'personal_information';
  } else if (fieldLower.includes('balance') || contextLower.includes('balance')) {
    disputeType = 'balance';
  } else if (fieldLower.includes('payment') || fieldLower.includes('late') || contextLower.includes('late')) {
    disputeType = 'late_payment';
  } else if (fieldLower.includes('status') || contextLower.includes('closed') || contextLower.includes('open')) {
    disputeType = 'account_status';
  } else if (fieldLower.includes('date') || contextLower.includes('date')) {
    disputeType = 'dates';
  } else if (contextLower.includes('not mine') || contextLower.includes('not my account')) {
    disputeType = 'not_mine';
  } else if (contextLower.includes('identity theft') || contextLower.includes('fraud')) {
    disputeType = 'identity_theft';
  }
  
  return LEGAL_REFERENCES_BY_DISPUTE_TYPE[disputeType] || LEGAL_REFERENCES_BY_DISPUTE_TYPE['account_information'];
};

/**
 * Extract text content from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log(`Extracting text from file: ${file.name} (${file.type})`);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (!e.target?.result) {
        reject(new Error("Failed to read file content"));
        return;
      }
      
      try {
        let text = "";
        
        // For PDF files, we would ideally use a proper PDF parser library
        // Since we don't have direct access to one in this environment, we'll make our best
        // effort to extract the text from the binary data
        if (file.type === 'application/pdf') {
          console.log("Processing PDF file");
          // This is a simplified extraction that would be replaced with proper PDF parsing
          const content = e.target.result.toString();
          
          // Try to extract text content from the PDF binary data
          // In a real production environment, this would use a PDF parsing library
          text = extractTextFromBinaryPDF(content);
        } else {
          // For text files, we can just use the result directly
          console.log("Processing text file");
          text = e.target.result.toString();
        }
        
        console.log(`Extracted ${text.length} characters of text from the file`);
        
        // Log a sample of the text to help with debugging
        if (text.length > 0) {
          console.log("Sample of extracted text:", text.substring(0, 200) + "...");
        } else {
          console.log("No text was extracted from the file");
        }
        
        resolve(text);
      } catch (error) {
        console.error("Error processing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    if (file.type === 'application/pdf') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

/**
 * Very simple extraction of text from PDF binary data
 * This is a placeholder for a more sophisticated PDF parsing solution
 */
function extractTextFromBinaryPDF(binaryData: string): string {
  let extractedText = "";
  
  // Look for text markers in the PDF data
  const textMarkers = [
    { start: "BT", end: "ET" }, // Begin Text/End Text markers
    { start: "/Text", end: "EMC" }, // Text object markers
    { start: "(", end: ")" }, // Text inside parentheses
    { start: "<", end: ">" } // Text inside angle brackets
  ];
  
  for (const marker of textMarkers) {
    let startPos = 0;
    while ((startPos = binaryData.indexOf(marker.start, startPos)) !== -1) {
      const endPos = binaryData.indexOf(marker.end, startPos + marker.start.length);
      if (endPos !== -1) {
        const potentialText = binaryData.substring(startPos + marker.start.length, endPos);
        
        // Filter to only include printable ASCII characters and common separators
        const cleanText = potentialText.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
        
        if (cleanText.length > 3) { // Only add if it seems like actual text
          extractedText += cleanText + "\n";
        }
        
        startPos = endPos + marker.end.length;
      } else {
        break;
      }
    }
  }
  
  // Also look for words that may indicate relevant credit report sections
  const creditReportKeywords = [
    "CREDIT REPORT", "PERSONAL INFORMATION", "ACCOUNT SUMMARY", 
    "ACCOUNTS", "INQUIRIES", "PUBLIC RECORDS", "EXPERIAN", "EQUIFAX", 
    "TRANSUNION", "FICO", "SCORE", "TRADE", "TRADELINE", "CREDIT CARD",
    "MORTGAGE", "AUTO LOAN", "PAYMENT HISTORY", "LATE PAYMENT", "BALANCE",
    "CREDIT LIMIT", "DISPUTE"
  ];
  
  for (const keyword of creditReportKeywords) {
    let keywordPos = 0;
    while ((keywordPos = binaryData.indexOf(keyword, keywordPos)) !== -1) {
      // Extract a chunk of text around the keyword
      const startPos = Math.max(0, keywordPos - 50);
      const endPos = Math.min(binaryData.length, keywordPos + keyword.length + 100);
      const chunk = binaryData.substring(startPos, endPos);
      
      // Filter to only include printable ASCII characters and common separators
      const cleanChunk = chunk.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
      
      if (cleanChunk.length > keyword.length) {
        extractedText += cleanChunk + "\n";
      }
      
      keywordPos += keyword.length;
    }
  }
  
  return extractedText;
}

/**
 * Get sample dispute language for a specific dispute type
 * This function is now explicitly exported for use in DisputeAgent
 */
export const getSampleDisputeLanguage = async (accountName: string, field: string, bureau: string): Promise<string> => {
  // Get dispute type from field
  let disputeType = 'general';
  
  const fieldLower = field.toLowerCase();
  if (fieldLower.includes('balance')) {
    disputeType = 'balance';
  } else if (fieldLower.includes('payment') || fieldLower.includes('late')) {
    disputeType = 'late_payment';
  } else if (fieldLower.includes('status')) {
    disputeType = 'account_status';
  } else if (fieldLower.includes('date')) {
    disputeType = 'dates';
  } else if (accountName === "Personal Information") {
    disputeType = 'personal_information';
  }
  
  // Try to find a matching sample dispute letter
  const sampleLetter = await findSampleDispute(disputeType, bureau.toLowerCase());
  
  if (sampleLetter && sampleLetter.effectiveLanguage && sampleLetter.effectiveLanguage.length > 0) {
    // Return the first effective language paragraph
    return sampleLetter.effectiveLanguage[0];
  }
  
  // If no sample letter found, use default language
  const defaultLanguage: Record<string, string> = {
    'balance': 'The balance shown on this account is incorrect and does not reflect my actual financial obligation. This error violates Metro 2 reporting standards which require accurate balance reporting.',
    'late_payment': 'This account is incorrectly reported as delinquent. According to my records, all payments have been made on time. This error violates FCRA Section 623 which requires furnishers to report accurate information.',
    'account_status': 'The account status is being reported incorrectly. This violates FCRA accuracy requirements and Metro 2 standards for proper status code reporting.',
    'dates': 'The dates associated with this account are inaccurate and do not align with the actual account history. This violates Metro 2 standards for date reporting.',
    'personal_information': 'My personal information is reported incorrectly. This error affects my credit profile and violates FCRA requirements for accurate consumer information.'
  };
  
  // Get the specific language for the field if available, otherwise use a generic template
  const language = defaultLanguage[disputeType] || 
    `The ${field} for this account is being inaccurately reported by ${bureau}. This information is incorrect and should be investigated and corrected to reflect accurate information. This error violates both FCRA Section 611(a) accuracy requirements and Metro 2 Format standards.`;
  
  return language;
};

/**
 * Find the most appropriate sample dispute letter based on dispute type
 */
export const findSampleDispute = async (disputeType: string, bureau?: string): Promise<SampleDisputeLetter | null> => {
  const sampleLetters = await loadSampleDisputeLetters();
  
  // First try to find an exact match for both dispute type and bureau
  if (bureau) {
    const exactMatch = sampleLetters.find(
      l => l.disputeType === disputeType && 
           l.bureau === bureau && 
           l.successfulOutcome === true
    );
    
    if (exactMatch) return exactMatch;
  }
  
  // Then try to find a match just based on dispute type with successful outcome
  const disputeTypeMatch = sampleLetters.find(
    l => l.disputeType === disputeType && l.successfulOutcome === true
  );
  
  if (disputeTypeMatch) return disputeTypeMatch;
  
  // Finally, just find any letter with this dispute type
  const anyMatch = sampleLetters.find(l => l.disputeType === disputeType);
  
  return anyMatch || null;
};

/**
 * Parse text content from a credit report into structured data
 * This function is significantly improved to extract real account information
 */
export const parseReportContent = (content: string): CreditReportData => {
  console.log("Parsing credit report content, length:", content.length);
  
  // Create empty report structure
  const reportData: CreditReportData = {
    bureaus: {
      experian: false,
      equifax: false,
      transunion: false
    },
    accounts: [],
    inquiries: []
  };
  
  // Check which bureaus are mentioned in the report
  const lowerContent = content.toLowerCase();
  reportData.bureaus.experian = lowerContent.includes('experian');
  reportData.bureaus.equifax = lowerContent.includes('equifax');
  reportData.bureaus.transunion = lowerContent.includes('transunion');
  
  console.log("Detected bureaus:", reportData.bureaus);
  
  // Extract personal information
  const personalInfo: {
    name?: string;
    address?: string;
    previousAddresses?: string[];
    employers?: string[];
    bureauSpecificInfo?: {
      experian?: PersonalBureauData;
      equifax?: PersonalBureauData;
      transunion?: PersonalBureauData;
    };
    discrepancies?: PersonalInfoDiscrepancy[];
  } = {};
  
  // Look for name in the report
  const namePatterns = [
    /Name:?\s*([^\n\r]+)/i,
    /(?:Consumer|Customer|Client)(?:\s+Name)?:?\s*([^\n\r]+)/i,
    /Personal\s+Information[\s\S]{0,50}(?:Name|Consumer):?\s*([^\n\r]+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.name = match[1].trim();
      break;
    }
  }
  
  // Look for address in the report
  const addressPatterns = [
    /(?:Address|Current\s+Address|Residence):?\s*([^\n\r]+(?:\n[^\n\r]+){0,2})/i,
    /(?:Street|Location):?\s*([^\n\r]+(?:\n[^\n\r]+){0,2})/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.address = match[1].trim().replace(/\n/g, ', ');
      break;
    }
  }
  
  console.log("Extracted personal info:", personalInfo);
  
  // Add the personal info to the report data
  reportData.personalInfo = personalInfo;
  
  // Extract accounts from the content
  // Look for sections that might contain account information
  const accountSectionPatterns = [
    /(?:ACCOUNTS|TRADELINES|TRADE\s*LINES|ACCOUNT\s*INFORMATION|CREDIT\s*ACCOUNTS)(?:[\s\S]*?)(?=PUBLIC\s*RECORDS|INQUIRIES|CREDIT\s*SCORE|CONSUMER\s*STATEMENT|$)/i,
    /(?:TRADE|LOAN|ACCOUNT)[\s\S]*?(?:BALANCE|STATUS|TYPE|PAST\s*DUE|PAYMENT|OPEN|CLOSED)/i
  ];
  
  let accountSectionText = "";
  for (const pattern of accountSectionPatterns) {
    const match = content.match(pattern);
    if (match && match[0]) {
      accountSectionText += match[0] + "\n\n";
    }
  }
  
  if (!accountSectionText) {
    // If no account section found, use the whole content
    accountSectionText = content;
  }
  
  console.log("Account section identified, length:", accountSectionText.length);
  
  // Split the account section into individual accounts
  // This is tricky as formats vary, but we'll look for common patterns
  // that indicate the start of a new account
  
  // Common creditor names that often appear at the start of account listings
  const knownCreditors = [
    "AMERICAN EXPRESS", "AMEX", "BANK OF AMERICA", "BOA", "CAPITAL ONE", 
    "CHASE", "CITIBANK", "DISCOVER", "WELLS FARGO", "US BANK", "USAA", 
    "NAVY FEDERAL", "SYNCHRONY", "TD BANK", "PNC BANK", "BARCLAYS", 
    "COMERICA", "FIFTH THIRD", "REGIONS BANK", "CITIZENS BANK", "TRUIST", 
    "ALLY", "TOYOTA", "HONDA", "FORD", "NISSAN", "HYUNDAI", "MERCEDES", 
    "BMW", "LEXUS", "GM", "CHRYSLER", "CREDIT UNION", "MORTGAGE", "STUDENT LOAN",
    "SALLIE MAE", "NELNET", "DEPT OF ED", "NAVIENT", "GREAT LAKES", "FEDLOAN",
    "MOHELA", "AIDVANTAGE", "LOAN SERVICING", "BANK", "LENDING", "CREDIT", 
    "FINANCIAL", "SERVICES", "FUNDING", "FIRST", "PREMIER"
  ];
  
  // Split the text into lines and look for patterns that indicate the start of accounts
  const lines = accountSectionText.split('\n');
  let currentAccountLines: string[] = [];
  const accountTextSections: string[] = [];
  
  // Flags to help identify account sections
  let inAccountSection = false;
  let lastLineWasEmpty = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Empty line could be a separator between accounts
    if (line === '') {
      lastLineWasEmpty = true;
      
      // If we're in an account section and encounter an empty line,
      // consider saving the current account if it has enough content
      if (inAccountSection && currentAccountLines.length > 3) {
        accountTextSections.push(currentAccountLines.join('\n'));
        currentAccountLines = [];
        inAccountSection = false;
      }
      continue;
    }
    
    // Check if this line looks like the start of a new account
    const isAccountStart = 
      // Line starts with a known creditor name
      knownCreditors.some(creditor => line.toUpperCase().includes(creditor)) ||
      // Line contains account number pattern
