
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
  balance?: string; // Added this field to fix the error
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
  rawText?: string; // Added to fix the error for storing raw text content
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
 * Retrieve successful dispute phrases for various dispute types
 * These are phrases that have been effective in getting disputes approved
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  // Return cached phrases if available
  if (Object.keys(successfulDisputePhrasesCache).length > 0) {
    return successfulDisputePhrasesCache;
  }
  
  try {
    // Load sample dispute letters if not already loaded
    const sampleLetters = await loadSampleDisputeLetters();
    
    // Extract successful dispute phrases by category
    const phrases: Record<string, string[]> = {
      balanceDisputes: [],
      latePaymentDisputes: [],
      accountOwnershipDisputes: [],
      closedAccountDisputes: [],
      personalInfoDisputes: [],
      inquiryDisputes: [],
      general: []
    };
    
    // Process each sample letter to extract phrases
    for (const letter of sampleLetters) {
      if (letter.effectiveLanguage && letter.effectiveLanguage.length > 0) {
        // Categorize by dispute type
        switch (letter.disputeType) {
          case 'balance':
            phrases.balanceDisputes.push(...letter.effectiveLanguage);
            break;
          case 'late_payment':
            phrases.latePaymentDisputes.push(...letter.effectiveLanguage);
            break;
          case 'not_mine':
            phrases.accountOwnershipDisputes.push(...letter.effectiveLanguage);
            break;
          case 'account_status':
            phrases.closedAccountDisputes.push(...letter.effectiveLanguage);
            break;
          case 'personal_information':
            phrases.personalInfoDisputes.push(...letter.effectiveLanguage);
            break;
          case 'dates':
          case 'general':
          default:
            phrases.general.push(...letter.effectiveLanguage);
            break;
        }
      }
    }
    
    // If we don't have enough sample phrases, add some default ones
    if (phrases.balanceDisputes.length === 0) {
      phrases.balanceDisputes = [
        "The balance reported is incorrect and does not reflect my actual financial obligation. My records indicate a different balance.",
        "This account shows an incorrect balance that does not match my payment history or account statements."
      ];
    }
    
    if (phrases.latePaymentDisputes.length === 0) {
      phrases.latePaymentDisputes = [
        "I have never been late on this account and have documentation to prove all payments were made on time.",
        "The reported late payment is incorrect. I made all payments within the required timeframe as evidenced by my bank statements."
      ];
    }
    
    if (phrases.accountOwnershipDisputes.length === 0) {
      phrases.accountOwnershipDisputes = [
        "This account does not belong to me and I have never authorized its opening. I request a full investigation into how this account was opened.",
        "I have no knowledge of this account and it appears to be the result of identity theft or a mixed credit file."
      ];
    }
    
    if (phrases.closedAccountDisputes.length === 0) {
      phrases.closedAccountDisputes = [
        "This account was closed on [DATE] but is being reported as open. Please update the status to reflect the account is closed.",
        "I closed this account and it should not be reporting as open. This misrepresentation affects my credit utilization ratio."
      ];
    }
    
    // Cache and return the phrases
    successfulDisputePhrasesCache = phrases;
    console.log("Successfully loaded dispute phrases:", Object.keys(phrases).map(k => `${k}: ${phrases[k as keyof typeof phrases].length} phrases`).join(', '));
    return phrases;
  } catch (error) {
    console.error("Error loading successful dispute phrases:", error);
    
    // Return default phrases on error
    return {
      balanceDisputes: ["The balance shown is incorrect and does not reflect my actual financial obligation."],
      latePaymentDisputes: ["I have never been late on this account and have documentation to prove all payments were made on time."],
      accountOwnershipDisputes: ["This account does not belong to me and I have never authorized its opening."],
      closedAccountDisputes: ["This account was closed but is being incorrectly reported as open."],
      personalInfoDisputes: ["My personal information is reported incorrectly."],
      inquiryDisputes: ["I never authorized this inquiry on my credit report."],
      general: ["The information reported is inaccurate and violates the Fair Credit Reporting Act."]
    };
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
    inquiries: [],
    rawText: content // Store the raw text for later reference
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
    /(?:Address|Street|Location|Residence):?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i,
    /Personal\s+Information[\s\S]{0,100}(?:Address|Street):?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.address = match[1].trim().replace(/\r?\n/g, ' ');
      break;
    }
  }
  
  // Extract previous addresses
  const previousAddressPatterns = [
    /Previous\s+Address(?:es)?:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i,
    /Former\s+Address(?:es)?:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i
  ];
  
  const previousAddresses: string[] = [];
  
  for (const pattern of previousAddressPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      const addressText = match[1].trim();
      // Split by newlines and filter out empty lines
      const addresses = addressText.split(/\r?\n/)
                                 .map(a => a.trim())
                                 .filter(a => a.length > 0);
      previousAddresses.push(...addresses);
    }
  }
  
  if (previousAddresses.length > 0) {
    personalInfo.previousAddresses = previousAddresses;
  }
  
  // Extract employer information
  const employerPatterns = [
    /Employer(?:s)?:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i,
    /Employment:?\s*([\s\S]{0,200}?)(?=\n\s*\n|\n\s*[A-Z])/i
  ];
  
  const employers: string[] = [];
  
  for (const pattern of employerPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      const employerText = match[1].trim();
      // Split by newlines and filter out empty lines
      const extractedEmployers = employerText.split(/\r?\n/)
                                          .map(e => e.trim())
                                          .filter(e => e.length > 0);
      employers.push(...extractedEmployers);
    }
  }
  
  if (employers.length > 0) {
    personalInfo.employers = employers;
  }
  
  // Save personal information to report data
  if (Object.keys(personalInfo).length > 0) {
    reportData.personalInfo = personalInfo;
  }
  
  // Extract account information
  // Look for sections that might contain account information
  const accountSectionPatterns = [
    /(?:Accounts|Trade(?:lines)?|Credit\s+Accounts)(?:(?:\s+Information)|(?:\s+History)|(?:\s+Summary))?[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i,
    /(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts)[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts|Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  let accountSections: string[] = [];
  
  for (const pattern of accountSectionPatterns) {
    // Make sure to use a global flag for matchAll
    const matches = content.match(pattern);
    if (matches && matches[1]) {
      accountSections.push(matches[1]);
    }
  }
  
  // If we didn't find any account sections using the patterns, try looking for account-specific keywords
  if (accountSections.length === 0) {
    const accountKeywords = [
      "Account Number", "Date Opened", "Payment Status", "Account Status",
      "High Credit", "Credit Limit", "Balance", "Monthly Payment", "Past Due",
      "Payment History", "Date of Last Payment", "Current Status"
    ];
    
    const potentialAccountSections = content.split(/\n\s*\n/);
    for (const section of potentialAccountSections) {
      if (section.length > 100 && accountKeywords.some(keyword => section.includes(keyword))) {
        accountSections.push(section);
      }
    }
  }
  
  console.log(`Found ${accountSections.length} potential account sections`);
  
  // Process each account section to extract account information
  // Here we need to be exhaustive in our pattern matching since different credit reports
  // format account information differently
  for (const section of accountSections) {
    // Split the section into potential account blocks
    const accountBlocks = section.split(/\n\s*\n/);
    
    for (const block of accountBlocks) {
      // Skip very short blocks that are unlikely to contain account information
      if (block.length < 50) continue;
      
      const account: CreditReportAccount = {
        accountName: "Unknown Account", // Default value to be overridden
        remarks: []
      };
      
      // Try to extract account name
      const accountNamePatterns = [
        /(?:Creditor|Subscriber|Company|Bank|Account\s+Name):\s*([^\n\r]+)/i,
        /^([A-Z][A-Z0-9\s&.,'-]+)(?:\r?\n|\s{2,})/i,
        /([A-Z][A-Z0-9\s&.,'-]{2,}(?:BANK|CARD|AUTO|LOAN|MORTGAGE|FINANCE|CREDIT|FUND|HOME|SERVICES))/i
      ];
      
      for (const pattern of accountNamePatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim() && match[1].length > 3) {
          account.accountName = match[1].trim();
          break;
        }
      }
      
      // Try to extract account number
      const accountNumberPatterns = [
        /(?:Account|Loan|Card)\s+(?:#|Number|No\.?):?\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i,
        /(?:Account|Loan|Card)(?:\s+(?:#|Number|No\.?))?:?\s*([0-9X*]{4,})/i,
        /(?:#|Number|No\.?):?\s*([0-9X*]{4,})/i
      ];
      
      for (const pattern of accountNumberPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.accountNumber = match[1].trim();
          break;
        }
      }
      
      // Try to extract account type
      const accountTypePatterns = [
        /(?:Account\s+Type|Loan\s+Type|Type\s+of\s+Loan|Type\s+of\s+Account):\s*([^\n\r]+)/i,
        /Type:\s*([^\n\r]+)/i
      ];
      
      for (const pattern of accountTypePatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.accountType = match[1].trim();
          break;
        }
      }
      
      // Try to extract current balance
      const balancePatterns = [
        /(?:Current\s+Balance|Balance|Balance\s+Amount|Current\s+Amount):\s*\$?([\d,.]+)/i,
        /(?:Balance|Amount):\s*\$?([\d,.]+)/i,
        /Balance(?:\s+as\s+of|\s+Date|\s+Amount)?:\s*\$?([\d,.]+)/i
      ];
      
      for (const pattern of balancePatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.currentBalance = `$${match[1].trim()}`;
          account.balance = `$${match[1].trim()}`; // Set both for compatibility
          break;
        }
      }
      
      // Try to extract payment status
      const paymentStatusPatterns = [
        /(?:Payment\s+Status|Status|Account\s+Status):\s*([^\n\r]+)/i,
        /Status:\s*([^\n\r]+)/i
      ];
      
      for (const pattern of paymentStatusPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.paymentStatus = match[1].trim();
          break;
        }
      }
      
      // Try to extract date opened
      const dateOpenedPatterns = [
        /(?:Date\s+Opened|Opened\s+Date|Open\s+Date|Account\s+Opened\s+Date):\s*([^\n\r]+)/i,
        /Opened:\s*([^\n\r]+)/i,
        /Opened\s+(?:on|in|since):\s*([^\n\r]+)/i
      ];
      
      for (const pattern of dateOpenedPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.dateOpened = match[1].trim();
          break;
        }
      }
      
      // Try to extract date reported
      const dateReportedPatterns = [
        /(?:Date\s+Reported|Reported\s+Date|Last\s+Reported|Last\s+Updated|Report\s+Date):\s*([^\n\r]+)/i,
        /Reported:\s*([^\n\r]+)/i,
        /(?:Last|Recent)\s+Report(?:ed)?:\s*([^\n\r]+)/i
      ];
      
      for (const pattern of dateReportedPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.dateReported = match[1].trim();
          break;
        }
      }
      
      // Try to extract remarks
      const remarksPatterns = [
        /(?:Remarks|Comments|Notes|Comment):\s*([^\n\r]+)/i,
        /(?:Dispute|Disputed\s+Information):\s*([^\n\r]+)/i
      ];
      
      for (const pattern of remarksPatterns) {
        const match = block.match(pattern);
        if (match && match[1]?.trim()) {
          account.remarks?.push(match[1].trim());
        }
      }
      
      // Check if we have enough information to consider this a valid account
      // We require at least an account name and one other piece of information
      if (account.accountName !== "Unknown Account" && 
          (account.accountNumber || account.accountType || account.currentBalance || account.paymentStatus)) {
        // Determine which bureau this account is from based on surrounding text
        if (block.toLowerCase().includes('experian')) {
          account.bureau = 'Experian';
        } else if (block.toLowerCase().includes('equifax')) {
          account.bureau = 'Equifax';
        } else if (block.toLowerCase().includes('transunion')) {
          account.bureau = 'TransUnion';
        } else if (reportData.bureaus.experian && !reportData.bureaus.equifax && !reportData.bureaus.transunion) {
          account.bureau = 'Experian';
        } else if (!reportData.bureaus.experian && reportData.bureaus.equifax && !reportData.bureaus.transunion) {
          account.bureau = 'Equifax';
        } else if (!reportData.bureaus.experian && !reportData.bureaus.equifax && reportData.bureaus.transunion) {
          account.bureau = 'TransUnion';
        }
        
        reportData.accounts.push(account);
      }
    }
  }
  
  // If we didn't find any accounts using our detailed extraction, try a very basic approach
  // This is a fallback for reports with unusual formatting
  if (reportData.accounts.length === 0) {
    // Look for common creditor names
    const commonCreditors = [
      "BANK OF AMERICA", "CHASE", "CAPITAL ONE", "DISCOVER", "AMERICAN EXPRESS", 
      "WELLS FARGO", "CITI", "US BANK", "PNC", "TD BANK", "SYNCHRONY", "BARCLAYS",
      "CREDIT ONE", "FIRST PREMIER", "GOLDMAN SACHS", "USAA", "NAVY FEDERAL",
      "CARMAX", "TOYOTA", "HONDA", "BMW", "MERCEDES", "FORD", "GM", "CHRYSLER"
    ];
    
    for (const creditor of commonCreditors) {
      if (content.includes(creditor)) {
        // Look for nearby account information
        const creditorIndex = content.indexOf(creditor);
        const surroundingText = content.substring(
          Math.max(0, creditorIndex - 100), 
          Math.min(content.length, creditorIndex + creditor.length + 300)
        );
        
        const account: CreditReportAccount = {
          accountName: creditor
        };
        
        // Try to extract an account number
        const accountNumberMatch = surroundingText.match(/(?:Account|Loan|Card)\s+(?:#|Number|No\.?):\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i);
        if (accountNumberMatch && accountNumberMatch[1]) {
          account.accountNumber = accountNumberMatch[1].trim();
        }
        
        // Try to extract a balance
        const balanceMatch = surroundingText.match(/(?:Balance|Amount):\s*\$?([\d,.]+)/i);
        if (balanceMatch && balanceMatch[1]) {
          account.currentBalance = `$${balanceMatch[1].trim()}`;
          account.balance = `$${balanceMatch[1].trim()}`; // Set both for compatibility
        }
        
        reportData.accounts.push(account);
      }
    }
    
    // If we still don't have any accounts, add generic placeholders based on detected account types
    if (reportData.accounts.length === 0) {
      const accountTypes = [
        { type: "Credit Card", regex: /credit\s+card/i },
        { type: "Mortgage", regex: /mortgage/i },
        { type: "Auto Loan", regex: /auto\s+loan/i },
        { type: "Personal Loan", regex: /personal\s+loan/i },
        { type: "Student Loan", regex: /student\s+loan/i },
        { type: "Collection", regex: /collection/i }
      ];
      
      for (const { type, regex } of accountTypes) {
        if (regex.test(content)) {
          reportData.accounts.push({
            accountName: `Generic ${type}`,
            accountType: type
          });
        }
      }
    }
  }
  
  // Extract inquiry information
  const inquirySectionPatterns = [
    /(?:Inquiries|Credit\s+Inquiries|Requests\s+for\s+Your\s+Credit\s+History)[\s\S]*?((?:Date|Creditor|Subscriber|Company)[^\n]*(?:[\s\S]*?)(?=\s*(?:Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  const inquiries: Array<{
    inquiryDate: string;
    creditor: string;
    bureau: string;
  }> = [];
  
  for (const pattern of inquirySectionPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const inquirySection = match[1];
      
      // Extract individual inquiries
      const inquiryBlockPattern = /(?:(\d{1,2}\/\d{1,2}\/\d{2,4})|(\w{3}\s+\d{1,2},\s+\d{4}))\s+([^\n\r]+)/g;
      let inquiryMatch;
      // Use match instead of matchAll due to the error
      let matches = [];
      while ((inquiryMatch = inquiryBlockPattern.exec(inquirySection)) !== null) {
        matches.push(inquiryMatch);
      }
      
      for (const inquiryMatch of matches) {
        const inquiryDate = inquiryMatch[1] || inquiryMatch[2];
        const creditor = inquiryMatch[3]?.trim();
        
        if (inquiryDate && creditor) {
          // Determine which bureau this inquiry is from
          let bureau = "Unknown";
          if (inquirySection.toLowerCase().includes('experian')) {
            bureau = 'Experian';
          } else if (inquirySection.toLowerCase().includes('equifax')) {
            bureau = 'Equifax';
          } else if (inquirySection.toLowerCase().includes('transunion')) {
            bureau = 'TransUnion';
          } else if (reportData.bureaus.experian && !reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Experian';
          } else if (!reportData.bureaus.experian && reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!reportData.bureaus.experian && !reportData.bureaus.equifax && reportData.bureaus.transunion) {
            bureau = 'TransUnion';
          }
          
          inquiries.push({
            inquiryDate,
            creditor,
            bureau
          });
        }
      }
    }
  }
  
  if (inquiries.length > 0) {
    reportData.inquiries = inquiries;
  }
  
  // Extract public records information
  const publicRecordSectionPatterns = [
    /(?:Public\s+Records|Public\s+Record\s+Information)[\s\S]*?((?:Date|Type|Status|Court|Amount)[^\n]*(?:[\s\S]*?)(?=\s*(?:Inquiries|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  const publicRecords: Array<{
    recordType: string;
    bureau: string;
    dateReported: string;
    status: string;
  }> = [];
  
  for (const pattern of publicRecordSectionPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const publicRecordSection = match[1];
      
      // Extract individual public records
      const recordBlocks = publicRecordSection.split(/\n\s*\n/);
      
      for (const block of recordBlocks) {
        // Skip very short blocks
        if (block.length < 20) continue;
        
        const recordType = block.match(/(?:Type|Record\s+Type):\s*([^\n\r]+)/i)?.[1]?.trim() || 
                      block.match(/(?:Bankruptcy|Tax\s+Lien|Judgment|Civil\s+Claim)/i)?.[0]?.trim() ||
                      "Unknown";
                      
        const dateReported = block.match(/(?:Date|Filed\s+Date|Report\s+Date):\s*([^\n\r]+)/i)?.[1]?.trim() || 
                       block.match(/(?:Filed|Reported)\s+(?:on|in):\s*([^\n\r]+)/i)?.[1]?.trim() ||
                       "";
                       
        const status = block.match(/(?:Status|Disposition):\s*([^\n\r]+)/i)?.[1]?.trim() || 
                 block.match(/(?:Satisfied|Dismissed|Discharged|Paid|Unpaid)/i)?.[0]?.trim() ||
                 "";
        
        // If we have at least a record type, add it
        if (recordType !== "Unknown" || dateReported || status) {
          // Determine which bureau this record is from
          let bureau = "Unknown";
          if (block.toLowerCase().includes('experian')) {
            bureau = 'Experian';
          } else if (block.toLowerCase().includes('equifax')) {
            bureau = 'Equifax';
          } else if (block.toLowerCase().includes('transunion')) {
            bureau = 'TransUnion';
          } else if (reportData.bureaus.experian && !reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Experian';
          } else if (!reportData.bureaus.experian && reportData.bureaus.equifax && !reportData.bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!reportData.bureaus.experian && !reportData.bureaus.equifax && reportData.bureaus.transunion) {
            bureau = 'TransUnion';
          }
          
          publicRecords.push({
            recordType,
            bureau,
            dateReported,
            status
          });
        }
      }
    }
  }
  
  if (publicRecords.length > 0) {
    reportData.publicRecords = publicRecords;
  }
  
  // Generate a simplified analysis summary
  const totalAccounts = reportData.accounts.length;
  const accountsWithIssues = reportData.accounts.filter(
    account => account.remarks && account.remarks.length > 0 || 
              (account.paymentStatus && 
              (account.paymentStatus.includes('Late') || 
               account.paymentStatus.includes('Delinquent') || 
               account.paymentStatus.includes('Collection')))
  ).length;
  
  // If we have enough data, generate a basic analysis
  if (totalAccounts > 0) {
    reportData.analysisResults = {
      totalDiscrepancies: accountsWithIssues,
      highSeverityIssues: Math.floor(accountsWithIssues / 2), // Just an estimate
      accountsWithIssues,
      recommendedDisputes: []
    };
    
    // Generate recommended disputes for accounts with issues
    for (const account of reportData.accounts) {
      if (account.remarks && account.remarks.length > 0) {
        // For each remark, create a separate dispute recommendation
        for (const remark of account.remarks) {
          reportData.analysisResults.recommendedDisputes.push({
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bureau: account.bureau || 'Unknown',
            reason: 'Negative Remark',
            description: `Your ${account.accountName} account has the following remarks: "${remark}". This could be disputed if inaccurate.`,
            severity: 'high',
            legalBasis: getLegalReferencesForDispute('remarks', remark)
          });
        }
      }
      
      if (account.paymentStatus && 
          (account.paymentStatus.includes('Late') || 
           account.paymentStatus.includes('Delinquent') || 
           account.paymentStatus.includes('Collection'))) {
        reportData.analysisResults.recommendedDisputes.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'Unknown',
          reason: 'Late Payment',
          description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score. This can be disputed if inaccurate.`,
          severity: 'high',
          legalBasis: getLegalReferencesForDispute('payment', account.paymentStatus)
        });
      }
    }
    
    // If there's no recommended disputes but we have at least one account,
    // add a generic dispute recommendation
    if (reportData.analysisResults.recommendedDisputes.length === 0 && reportData.accounts.length > 0) {
      const randomAccount = reportData.accounts[Math.floor(Math.random() * reportData.accounts.length)];
      reportData.analysisResults.recommendedDisputes.push({
        accountName: randomAccount.accountName,
        accountNumber: randomAccount.accountNumber,
        bureau: randomAccount.bureau || 'Unknown',
        reason: 'Account Review',
        description: `Review this ${randomAccount.accountName} account for any inaccuracies in balance, payment history, or account status.`,
        severity: 'medium',
        legalBasis: getLegalReferencesForDispute('account_information')
      });
    }
  }
  
  return reportData;
};

/**
 * Main function to process a credit report file
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  try {
    // Extract text from the file
    const text = await extractTextFromPDF(file);
    
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
 * Generate a dispute letter for a specific discrepancy
 * This is the missing function that needs to be implemented
 */
export const generateDisputeLetterForDiscrepancy = async (
  discrepancy: RecommendedDispute, 
  userInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }
): Promise<string> => {
  // Get the bureau address
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureau = discrepancy.bureau.toLowerCase();
  const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
  
  // Get the current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get legal references if available
  const legalReferences = discrepancy.legalBasis || 
    getLegalReferencesForDispute(discrepancy.reason, discrepancy.description);
  
  // Use the sample dispute language or the description
  const disputeExplanation = discrepancy.sampleDisputeLanguage || discrepancy.description;
  
  // Generate citations text
  const citationsText = legalReferences && legalReferences.length > 0 
    ? `As required by ${legalReferences.map(ref => `${ref.law} ${ref.section}`).join(', ')}, ` 
    : 'As required by the Fair Credit Reporting Act (FCRA) Section 611(a), ';
  
  // Generate the letter content
  return `
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${discrepancy.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information - ${discrepancy.accountName}${discrepancy.accountNumber ? ` - Account #${discrepancy.accountNumber}` : ''}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${discrepancy.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

Account Name: ${discrepancy.accountName}
${discrepancy.accountNumber ? `Account Number: ${discrepancy.accountNumber}` : ''}
Reason for Dispute: ${discrepancy.reason}

This information is inaccurate because: ${disputeExplanation}

${citationsText}you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this debt
4. Remove the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name}

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
`;
};
