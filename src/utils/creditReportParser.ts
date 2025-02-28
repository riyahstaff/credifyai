
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
      /ACCOUNT\s*(#|NUMBER|NO|ID):\s*\S+/i.test(line) ||
      // Line matches date opened pattern
      /(?:OPENED|OPEN\s*DATE):\s*\d{1,2}\/\d{1,2}\/\d{2,4}/i.test(line) ||
      // Line has account/tradeline header
      /^(?:ACCOUNT|TRADELINE|TRADE\s*LINE)\s*\d+\s*$/i.test(line) ||
      // Line has ALL CAPS text that might be an account name
      /^[A-Z\s\d#&\-\.]{10,}$/.test(line);
    
    if (isAccountStart && (lastLineWasEmpty || !inAccountSection)) {
      // If we already have account lines, save them first
      if (inAccountSection && currentAccountLines.length > 0) {
        accountTextSections.push(currentAccountLines.join('\n'));
        currentAccountLines = [];
      }
      
      inAccountSection = true;
      currentAccountLines = [line];
      lastLineWasEmpty = false;
    } else if (inAccountSection) {
      // Add this line to the current account
      currentAccountLines.push(line);
      lastLineWasEmpty = false;
    } else {
      // Not in an account section, but this line doesn't start a new one
      // If it has keywords that suggest it's account-related, start a new section
      const hasAccountKeywords = 
        /balance|payment|status|open|closed|credit|loan|account|date|repor/i.test(line);
      
      if (hasAccountKeywords) {
        inAccountSection = true;
        currentAccountLines = [line];
      }
      
      lastLineWasEmpty = false;
    }
  }
  
  // Add the last account if we have one
  if (currentAccountLines.length > 0) {
    accountTextSections.push(currentAccountLines.join('\n'));
  }
  
  console.log(`Identified ${accountTextSections.length} potential account sections`);
  
  // Process each account section to extract structured data
  const accounts: CreditReportAccount[] = [];
  
  for (let i = 0; i < accountTextSections.length; i++) {
    const accountText = accountTextSections[i];
    console.log(`Processing account section ${i + 1}`);
    
    // Extract account name - look at the first line or lines with all caps
    let accountName = "";
    const firstLine = accountText.split('\n')[0].trim();
    
    if (/^[A-Z\s&\.\-,#]{5,}$/.test(firstLine)) {
      accountName = firstLine;
    } else {
      // Look for creditor names in the text
      for (const creditor of knownCreditors) {
        if (accountText.toUpperCase().includes(creditor)) {
          // Look for the line containing the creditor name
          const lines = accountText.split('\n');
          for (const line of lines) {
            if (line.toUpperCase().includes(creditor)) {
              // Extract a reasonable account name
              const beforeCreditor = line.substring(0, line.toUpperCase().indexOf(creditor)).trim();
              const afterCreditor = line.substring(line.toUpperCase().indexOf(creditor) + creditor.length).trim();
              
              if (beforeCreditor.length < afterCreditor.length) {
                accountName = creditor + (afterCreditor.length > 20 ? ' ' + afterCreditor.substring(0, 20) : ' ' + afterCreditor);
              } else {
                accountName = (beforeCreditor.length > 20 ? beforeCreditor.substring(0, 20) + ' ' : beforeCreditor + ' ') + creditor;
              }
              
              break;
            }
          }
          if (accountName) break;
        }
      }
    }
    
    // If still no account name, use a generic one
    if (!accountName) {
      accountName = `Account ${i + 1}`;
    }
    
    // Extract account details
    const accountNumberPatterns = [
      /(?:ACCOUNT|ACCT)[\s#]*(?:NUMBER|NO|ID)?:?\s*([*x\d\-]+\d{1,4})/i,
      /(?:ACCOUNT|ACCT)[\s#]*(?:NUMBER|NO|ID)?:?\s*(\*+\d{1,4})/i,
      /(?:NUMBER|NO|ID):?\s*([*x\d\-]+\d{1,4})/i
    ];
    
    const accountTypePatterns = [
      /(?:ACCOUNT|TYPE):?\s*([^\n\r,\.;]+)/i,
      /(?:LOAN|CREDIT)\s+TYPE:?\s*([^\n\r,\.;]+)/i
    ];
    
    const balancePatterns = [
      /(?:CURRENT\s+)?BALANCE:?\s*(\$?[\d,]+\.?\d*)/i,
      /(?:BALANCE|AMOUNT):?\s*(\$?[\d,]+\.?\d*)/i,
      /(?:CURRENT\s+)?BAL:?\s*(\$?[\d,]+\.?\d*)/i
    ];
    
    const statusPatterns = [
      /STATUS:?\s*([^\n\r,\.;]+)/i,
      /PAYMENT\s+STATUS:?\s*([^\n\r,\.;]+)/i,
      /(?:CURRENT\s+)?STATUS:?\s*([^\n\r,\.;]+)/i
    ];
    
    const dateOpenedPatterns = [
      /(?:DATE\s+)?OPENED:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/i,
      /(?:OPEN\s+)?DATE:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/i,
      /OPENED:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/i
    ];
    
    const dateReportedPatterns = [
      /(?:LAST\s+)?REPORTED:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/i,
      /REPORT\s+DATE:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/i,
      /LAST\s+UPDATE:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/i
    ];
    
    // Apply patterns and extract data
    let accountNumber: string | undefined;
    for (const pattern of accountNumberPatterns) {
      const match = accountText.match(pattern);
      if (match && match[1]) {
        accountNumber = match[1].trim();
        break;
      }
    }
    
    let accountType: string | undefined;
    for (const pattern of accountTypePatterns) {
      const match = accountText.match(pattern);
      if (match && match[1]) {
        accountType = match[1].trim();
        break;
      }
    }
    
    let currentBalance: string | undefined;
    for (const pattern of balancePatterns) {
      const match = accountText.match(pattern);
      if (match && match[1]) {
        currentBalance = match[1].trim();
        break;
      }
    }
    
    let paymentStatus: string | undefined;
    for (const pattern of statusPatterns) {
      const match = accountText.match(pattern);
      if (match && match[1]) {
        paymentStatus = match[1].trim();
        break;
      }
    }
    
    let dateOpened: string | undefined;
    for (const pattern of dateOpenedPatterns) {
      const match = accountText.match(pattern);
      if (match && match[1]) {
        dateOpened = match[1].trim();
        break;
      }
    }
    
    let dateReported: string | undefined;
    for (const pattern of dateReportedPatterns) {
      const match = accountText.match(pattern);
      if (match && match[1]) {
        dateReported = match[1].trim();
        break;
      }
    }
    
    // Extract bureau reporting information
    let bureauReporting = "Unknown";
    if (accountText.match(/(?:REPORTED|REPORTING)\s+(?:TO|BY):?\s*([^\n\r]+)/i)) {
      bureauReporting = accountText.match(/(?:REPORTED|REPORTING)\s+(?:TO|BY):?\s*([^\n\r]+)/i)![1].trim();
    } else {
      // Determine from the context
      const bureauMentions = [];
      if (reportData.bureaus.experian && accountText.toLowerCase().includes('experian')) {
        bureauMentions.push('Experian');
      }
      if (reportData.bureaus.equifax && accountText.toLowerCase().includes('equifax')) {
        bureauMentions.push('Equifax');
      }
      if (reportData.bureaus.transunion && accountText.toLowerCase().includes('transunion')) {
        bureauMentions.push('TransUnion');
      }
      
      if (bureauMentions.length > 0) {
        bureauReporting = bureauMentions.join(', ');
      } else if (reportData.bureaus.experian && reportData.bureaus.equifax && reportData.bureaus.transunion) {
        // If all bureaus are in the report but not specifically mentioned for this account,
        // assume it's reported to all
        bureauReporting = "Experian, Equifax, TransUnion";
      }
    }
    
    // Look for remarks/comments
    const remarks: string[] = [];
    const remarkPatterns = [
      /(?:REMARKS|COMMENTS|NOTES?):?\s*([^\n\r]+)/ig,
      /(?:LATE|DELINQUENT|PAST\s+DUE)(?:\s+PAYMENT|\s+\d{1,2}\/\d{1,2}\/\d{2,4}|\s+\w+\s+\d{4})/ig,
      /(?:CHARGE[\s\-]OFF|COLLECTION|BANKRUPTCY|SETTLED|CHARGED)/ig
    ];
    
    for (const pattern of remarkPatterns) {
      const matches = [...accountText.matchAll(pattern)];
      for (const match of matches) {
        if (match[1]) {
          // Extract the remark text
          const remarkText = match[1].trim();
          if (remarkText && !remarks.includes(remarkText)) {
            remarks.push(remarkText);
          }
        } else if (match[0]) {
          // Extract the whole match if no capture group
          const remarkText = match[0].trim();
          if (remarkText && !remarks.includes(remarkText)) {
            remarks.push(remarkText);
          }
        }
      }
    }
    
    // Check for late payment mentions directly in the text
    if (accountText.toLowerCase().includes('late') || 
        accountText.toLowerCase().includes('delinquent') || 
        accountText.toLowerCase().includes('past due')) {
      
      // Find dates associated with late payments
      const lateDatePattern = /(?:LATE|DELINQUENT|PAST\s+DUE).*?(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\w+\s+\d{4})/i;
      const lateMatch = accountText.match(lateDatePattern);
      
      if (lateMatch && lateMatch[1] && !remarks.some(r => r.includes(lateMatch[1]))) {
        remarks.push(`Late payment reported ${lateMatch[1]}`);
      } else if (!remarks.some(r => r.toLowerCase().includes('late') || r.toLowerCase().includes('delinquent'))) {
        // If no specific date found but late payments mentioned, add a generic remark
        remarks.push('Late payment history reported');
      }
    }
    
    // Create account object with extracted data
    const account: CreditReportAccount = {
      accountName: accountName,
      accountNumber: accountNumber,
      accountType: accountType,
      currentBalance: currentBalance,
      paymentStatus: paymentStatus,
      dateOpened: dateOpened,
      dateReported: dateReported,
      bureau: bureauReporting,
      remarks: remarks.length > 0 ? remarks : undefined
    };
    
    // If we found at least some data, add the account
    if (accountName && (
      accountNumber || accountType || currentBalance || 
      paymentStatus || dateOpened || dateReported || 
      bureauReporting !== "Unknown" || remarks.length > 0
    )) {
      console.log(`Extracted account: ${accountName}`);
      accounts.push(account);
    }
  }
  
  // If we didn't find any accounts, look for them using direct keyword matching
  if (accounts.length === 0) {
    for (const creditor of knownCreditors) {
      // Look for sections with this creditor mentioned
      const creditorPattern = new RegExp(`(^|\\s)${creditor}[\\s\\S]{0,500}`, 'i');
      const match = content.match(creditorPattern);
      
      if (match && match[0]) {
        const accountText = match[0];
        
        // Extract basic information using the same patterns as above
        let accountNumber: string | undefined;
        const accountNumberMatch = accountText.match(/(?:ACCOUNT|ACCT)[\s#]*(?:NUMBER|NO|ID)?:?\s*([*x\d\-]+\d{1,4})/i);
        if (accountNumberMatch) accountNumber = accountNumberMatch[1];
        
        let currentBalance: string | undefined;
        const balanceMatch = accountText.match(/(?:CURRENT\s+)?BALANCE:?\s*(\$?[\d,]+\.?\d*)/i);
        if (balanceMatch) currentBalance = balanceMatch[1];
        
        let paymentStatus: string | undefined;
        const statusMatch = accountText.match(/STATUS:?\s*([^\n\r,\.;]+)/i);
        if (statusMatch) paymentStatus = statusMatch[1];
        
        accounts.push({
          accountName: creditor,
          accountNumber: accountNumber,
          currentBalance: currentBalance,
          paymentStatus: paymentStatus,
          bureau: "Unknown"
        });
        
        console.log(`Added account based on creditor keyword: ${creditor}`);
      }
    }
  }
  
  // Add the accounts to the report data
  reportData.accounts = accounts;
  
  // Extract inquiries
  const inquiriesSectionPatterns = [
    /(?:INQUIRIES|CREDIT\s+INQUIRIES)[:\s]*(?:\n|.)+?(?=ACCOUNTS|TRADELINES|PUBLIC\s+RECORDS|PERSONAL\s+INFORMATION|$)/i
  ];
  
  let inquiriesSection = "";
  for (const pattern of inquiriesSectionPatterns) {
    const match = content.match(pattern);
    if (match && match[0]) {
      inquiriesSection = match[0];
      break;
    }
  }
  
  const inquiries: Array<{inquiryDate: string; creditor: string; bureau: string}> = [];
  
  if (inquiriesSection) {
    console.log("Inquiries section found");
    
    // Look for patterns like "MM/DD/YYYY CREDITOR NAME"
    const inquiryPattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})[\s\-]+([A-Z][A-Za-z\s&,\.\-]+)/g;
    const inquiryMatches = [...inquiriesSection.matchAll(inquiryPattern)];
    
    for (const match of inquiryMatches) {
      if (match[1] && match[2]) {
        let bureau = "Unknown";
        
        // Try to determine which bureau reported this inquiry
        if (inquiriesSection.toLowerCase().includes('experian') && 
            !inquiriesSection.toLowerCase().includes('equifax') && 
            !inquiriesSection.toLowerCase().includes('transunion')) {
          bureau = "Experian";
        } else if (!inquiriesSection.toLowerCase().includes('experian') && 
                   inquiriesSection.toLowerCase().includes('equifax') && 
                   !inquiriesSection.toLowerCase().includes('transunion')) {
          bureau = "Equifax";
        } else if (!inquiriesSection.toLowerCase().includes('experian') && 
                   !inquiriesSection.toLowerCase().includes('equifax') && 
                   inquiriesSection.toLowerCase().includes('transunion')) {
          bureau = "TransUnion";
        } else if (reportData.bureaus.experian && reportData.bureaus.equifax && reportData.bureaus.transunion) {
          bureau = "All bureaus";
        }
        
        inquiries.push({
          inquiryDate: match[1].trim(),
          creditor: match[2].trim(),
          bureau: bureau
        });
      }
    }
    
    // If that didn't work, try a simpler approach
    if (inquiries.length === 0) {
      // Look for known creditors in the inquiries section
      for (const creditor of knownCreditors) {
        if (inquiriesSection.toUpperCase().includes(creditor)) {
          // Try to find dates near this creditor
          const creditorPosition = inquiriesSection.toUpperCase().indexOf(creditor);
          const potentialDateSection = inquiriesSection.substring(
            Math.max(0, creditorPosition - 20),
            Math.min(inquiriesSection.length, creditorPosition + creditor.length + 20)
          );
          
          const dateMatch = potentialDateSection.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}\/\d{2,4}|\d{1,2}\-\d{1,2}\-\d{2,4})/);
          
          if (dateMatch && dateMatch[1]) {
            inquiries.push({
              inquiryDate: dateMatch[1].trim(),
              creditor: creditor,
              bureau: "Unknown"
            });
          }
        }
      }
    }
  }
  
  // Add inquiries to the report data
  if (inquiries.length > 0) {
    reportData.inquiries = inquiries;
    console.log(`Extracted ${inquiries.length} inquiries`);
  }
  
  // Identify potential discrepancies and issues
  const recommendedDisputes: RecommendedDispute[] = [];
  
  // Check for accounts with late payments
  for (const account of accounts) {
    if (account.paymentStatus && (
      account.paymentStatus.toLowerCase().includes('late') ||
      account.paymentStatus.toLowerCase().includes('delinq') ||
      account.paymentStatus.toLowerCase().includes('past due') ||
      account.paymentStatus.toLowerCase().includes('charged off') ||
      account.paymentStatus.toLowerCase().includes('collection')
    )) {
      // This account has a negative payment status
      recommendedDisputes.push({
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bureau: account.bureau?.split(',')[0].trim() || "Unknown",
        reason: "Incorrect payment status",
        description: `The account is reported as "${account.paymentStatus}" which may be inaccurate or unverifiable.`,
        severity: 'high',
        legalBasis: getLegalReferencesForDispute("paymentStatus", "late payment")
      });
      
      console.log(`Added dispute for late payment status on ${account.accountName}`);
    }
    
    // Check for accounts with remarks indicating issues
    if (account.remarks && account.remarks.length > 0) {
      for (const remark of account.remarks) {
        if (remark.toLowerCase().includes('late') || 
            remark.toLowerCase().includes('delinq') || 
            remark.toLowerCase().includes('past due') ||
            remark.toLowerCase().includes('charge') ||
            remark.toLowerCase().includes('collection')) {
          
          // Add dispute for negative remark if not already added
          if (!recommendedDisputes.some(d => 
            d.accountName === account.accountName && 
            d.description.toLowerCase().includes(remark.toLowerCase())
          )) {
            recommendedDisputes.push({
              accountName: account.accountName,
              accountNumber: account.accountNumber,
              bureau: account.bureau?.split(',')[0].trim() || "Unknown",
              reason: "Incorrect remark or comment",
              description: `The account contains a negative remark: "${remark}" which may be inaccurate or unverifiable.`,
              severity: 'medium',
              legalBasis: getLegalReferencesForDispute("account_information")
            });
            
            console.log(`Added dispute for negative remark on ${account.accountName}: ${remark}`);
          }
        }
      }
    }
    
    // Look for duplicate accounts (same creditor with variations)
    const similarAccounts = accounts.filter(a => 
      a !== account && 
      (a.accountName.includes(account.accountName) || 
       account.accountName.includes(a.accountName) ||
       // Compare using a simplified name (remove common words)
       simplifyName(a.accountName) === simplifyName(account.accountName))
    );
    
    if (similarAccounts.length > 0) {
      const dupAccount = similarAccounts[0]; // Example: just take the first one
      
      // Only add if not already disputed
      if (!recommendedDisputes.some(d => 
        d.accountName === account.accountName && 
        d.reason.toLowerCase().includes('duplicate')
      )) {
        recommendedDisputes.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau?.split(',')[0].trim() || "Unknown",
          reason: "Duplicate account reporting",
          description: `This appears to be a duplicate of another ${simplifyName(account.accountName)} account on your report.`,
          severity: 'high', 
          legalBasis: getLegalReferencesForDispute("account_information")
        });
        
        console.log(`Added dispute for duplicate account: ${account.accountName}`);
      }
    }
    
    // Look for closed accounts still reporting a balance
    if (account.paymentStatus && 
        account.paymentStatus.toLowerCase().includes('closed') && 
        account.currentBalance && 
        !account.currentBalance.includes('0') && 
        !account.currentBalance.includes('$0')) {
      
      recommendedDisputes.push({
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bureau: account.bureau?.split(',')[0].trim() || "Unknown",
        reason: "Incorrect balance on closed account",
        description: `This account is closed but still showing a balance of ${account.currentBalance}, which violates proper reporting standards.`,
        severity: 'high',
        legalBasis: getLegalReferencesForDispute("balance")
      });
      
      console.log(`Added dispute for balance on closed account: ${account.accountName}`);
    }
  }
  
  // Look for inconsistencies in personal information
  if (personalInfo.name) {
    // Check for potential name variations in the report
    const nameVariations = findNameVariations(content, personalInfo.name);
    
    if (nameVariations.length > 0) {
      recommendedDisputes.push({
        accountName: "Personal Information",
        bureau: "All bureaus",
        reason: "Inconsistent name reporting",
        description: `Your name is reported in multiple variations: ${personalInfo.name}, ${nameVariations.join(', ')}`,
        severity: 'medium',
        legalBasis: getLegalReferencesForDispute("name")
      });
      
      console.log(`Added dispute for name variations: ${nameVariations.join(', ')}`);
    }
  }
  
  if (personalInfo.address) {
    // Check for potential address variations
    const addressVariations = findAddressVariations(content, personalInfo.address);
    
    if (addressVariations.length > 0) {
      recommendedDisputes.push({
        accountName: "Personal Information",
        bureau: "All bureaus",
        reason: "Outdated address information",
        description: `Multiple addresses are reported on your credit file: ${personalInfo.address}, ${addressVariations.join(', ')}`,
        severity: 'low',
        legalBasis: getLegalReferencesForDispute("address")
      });
      
      console.log(`Added dispute for address variations: ${addressVariations.join(', ')}`);
    }
  }
  
  // Check for excessive inquiries
  if (reportData.inquiries && reportData.inquiries.length > 5) {
    // Look for inquiries in the last 30 days
    const recentInquiries = reportData.inquiries.filter(inquiry => {
      try {
        // Parse the inquiry date
        const dateParts = inquiry.inquiryDate.split(/[\/\-]/);
        if (dateParts.length >= 3) {
          const inquiryDate = new Date(
            parseInt(dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2]),
            parseInt(dateParts[0]) - 1,
            parseInt(dateParts[1])
          );
          
          // Check if it's within last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          return inquiryDate > thirtyDaysAgo;
        }
        return false;
      } catch {
        return false;
      }
    });
    
    if (recentInquiries.length >= 3) {
      recommendedDisputes.push({
        accountName: "Credit Inquiries",
        bureau: "All bureaus",
        reason: "Excessive recent inquiries",
        description: `There are ${recentInquiries.length} inquiries within the last 30 days, which may indicate unauthorized credit pulls or identity theft.`,
        severity: 'medium',
        legalBasis: [
          { law: "FCRA", section: "Section 604", description: "Defines permissible purposes for accessing consumer credit information." },
          { law: "FCRA", section: "Section 611", description: "You have the right to dispute inquiries made without proper authorization." }
        ]
      });
      
      console.log(`Added dispute for excessive inquiries: ${recentInquiries.length} recent inquiries`);
    }
  }
  
  // Try to identify inquiries from the same creditor multiple times
  if (reportData.inquiries && reportData.inquiries.length > 0) {
    const inquiriesByCreditor: Record<string, number> = {};
    
    for (const inquiry of reportData.inquiries) {
      const simplifiedCreditor = simplifyName(inquiry.creditor);
      inquiriesByCreditor[simplifiedCreditor] = (inquiriesByCreditor[simplifiedCreditor] || 0) + 1;
    }
    
    // Check for creditors with multiple inquiries
    for (const [creditor, count] of Object.entries(inquiriesByCreditor)) {
      if (count > 2) {
        recommendedDisputes.push({
          accountName: "Credit Inquiries",
          bureau: "All bureaus",
          reason: "Multiple inquiries from same creditor",
          description: `${creditor} has made ${count} inquiries on your credit, which may be excessive and could be consolidated.`,
          severity: 'low',
          legalBasis: [
            { law: "FCRA", section: "Section 604", description: "Defines permissible purposes for accessing consumer credit information." },
            { law: "FCRA", section: "Section 611", description: "You have the right to dispute inquiries made without proper authorization." }
          ]
        });
        
        console.log(`Added dispute for multiple inquiries from same creditor: ${creditor} (${count} inquiries)`);
      }
    }
  }
  
  // Create analysis summary if we found any disputes
  if (recommendedDisputes.length > 0) {
    // Populate sample dispute language for all recommended disputes
    for (let i = 0; i < recommendedDisputes.length; i++) {
      try {
        recommendedDisputes[i].sampleDisputeLanguage = "The information reported is inaccurate and should be investigated according to the Fair Credit Reporting Act.";
      } catch (error) {
        console.error("Error getting sample dispute language:", error);
      }
    }
    
    reportData.analysisResults = {
      totalDiscrepancies: recommendedDisputes.length,
      highSeverityIssues: recommendedDisputes.filter(d => d.severity === 'high').length,
      accountsWithIssues: new Set(recommendedDisputes.map(d => d.accountName)).size,
      recommendedDisputes: recommendedDisputes
    };
    
    console.log(`Analysis complete: ${recommendedDisputes.length} issues found`);
  } else {
    // If no disputes were identified but we have some accounts, add a "no issues found" result
    if (accounts.length > 0) {
      reportData.analysisResults = {
        totalDiscrepancies: 0,
        highSeverityIssues: 0,
        accountsWithIssues: 0,
        recommendedDisputes: []
      };
    }
  }
  
  return reportData;
};

/**
 * Simplify an account/creditor name for comparison purposes
 */
function simplifyName(name: string): string {
  // Convert to uppercase and remove common words and punctuation
  return name.toUpperCase()
    .replace(/\b(BANK|OF|AMERICA|CARD|CREDIT|LOAN|FINANCIAL|SERVICES|INC|LLC|CO|CORP|NA|SSC|CORPORATION)\b/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find variations of a name in the text
 */
function findNameVariations(text: string, baseName: string): string[] {
  const variations: string[] = [];
  const baseNameParts = baseName.trim().split(/\s+/);
  
  // Only proceed if we have a multi-part name
  if (baseNameParts.length <= 1) return variations;
  
  // Look for patterns with the same first part but different rest
  const firstName = baseNameParts[0];
  const firstNamePattern = new RegExp(`(${firstName}\\s+[A-Za-z\\.\\s\\-]{2,30})\\b`, 'g');
  const firstNameMatches = [...text.matchAll(firstNamePattern)];
  
  for (const match of firstNameMatches) {
    const foundName = match[1].trim();
    if (foundName !== baseName && !variations.includes(foundName)) {
      variations.push(foundName);
    }
  }
  
  // Look for patterns with different initials
  if (baseNameParts.length >= 3) {
    const lastName = baseNameParts[baseNameParts.length - 1];
    const lastNamePattern = new RegExp(`([A-Za-z\\.]{1,2}\\s+[A-Za-z\\.\\s\\-]{0,20}\\s+${lastName})\\b`, 'g');
    const lastNameMatches = [...text.matchAll(lastNamePattern)];
    
    for (const match of lastNameMatches) {
      const foundName = match[1].trim();
      if (foundName !== baseName && !variations.includes(foundName)) {
        variations.push(foundName);
      }
    }
  }
  
  return variations;
}

/**
 * Find variations of an address in the text
 */
function findAddressVariations(text: string, baseAddress: string): string[] {
  const variations: string[] = [];
  
  // Look for address patterns
  const addressPatterns = [
    /(\d+\s+[A-Za-z\.\s]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|DR|DRIVE|BLVD|LN|LANE|WAY|CIR|CIRCLE|CT|COURT|PLZ|PLAZA|TER|TERRACE)\.?(?:\s*(?:APT|UNIT|#)\s*[A-Za-z0-9\-]+)?)/gi,
    /(\d+\s+[A-Za-z\.\s]+,\s*[A-Za-z\.\s]+,\s*[A-Z]{2}\s*\d{5})/gi
  ];
  
  for (const pattern of addressPatterns) {
    const matches = [...text.matchAll(pattern)];
    
    for (const match of matches) {
      const foundAddress = match[1].trim();
      if (foundAddress !== baseAddress && !variations.includes(foundAddress) && 
          // Make sure it doesn't look like a completely different address
          (foundAddress.includes(baseAddress.substring(0, 5)) || 
           baseAddress.includes(foundAddress.substring(0, 5)))) {
        variations.push(foundAddress);
      }
    }
  }
  
  return variations;
}

/**
 * Process uploaded credit report file
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  console.log(`Processing credit report file: ${file.name} (${file.type}), size: ${file.size} bytes`);
  
  try {
    // First, ensure sample reports and dispute letters are loaded
    await Promise.all([loadSampleReports(), loadSampleDisputeLetters()]);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let textContent = "";
    
    if (fileExtension === 'pdf' || file.type === 'application/pdf') {
      // Extract text from PDF
      console.log("Processing PDF file");
      textContent = await extractTextFromPDF(file);
    } else if (fileExtension === 'txt' || fileExtension === 'text' || file.type === 'text/plain') {
      // Read text file directly
      console.log("Processing text file");
      textContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error("Failed to read text file"));
          }
        };
        reader.onerror = () => reject(new Error("Error reading text file"));
        reader.readAsText(file);
      });
    } else {
      // Try to process as text anyway
      console.log("Processing unknown file type as text");
      textContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result.toString());
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsText(file);
      });
    }
    
    console.log(`Successfully extracted ${textContent.length} characters of text from the file`);
    
    if (textContent.length < 100) {
      console.error("Extracted text is too short, might be an unsupported format");
      throw new Error("Could not extract enough text from the file. Please upload a TXT or PDF file with text content.");
    }
    
    // Parse the text content into a structured credit report
    const reportData = parseReportContent(textContent);
    
    console.log("Credit report processing complete");
    return reportData;
  } catch (error) {
    console.error("Error in processCreditReport:", error);
    throw error;
  }
};

/**
 * Find applicable legal references for a specific dispute type
 */
export const generateLegalCitations = async (dispute: RecommendedDispute): Promise<string> => {
  let citations = "";
  
  // Try to find relevant citations from sample dispute letters
  let disputeType = 'general';
  if (dispute.reason.toLowerCase().includes('balance')) {
    disputeType = 'balance';
  } else if (dispute.reason.toLowerCase().includes('payment') || dispute.reason.toLowerCase().includes('late')) {
    disputeType = 'late_payment';
  } else if (dispute.reason.toLowerCase().includes('not mine') || dispute.reason.toLowerCase().includes('fraud')) {
    disputeType = 'not_mine';
  }
  
  const sampleLetter = await findSampleDispute(disputeType, dispute.bureau.toLowerCase());
  
  if (sampleLetter && sampleLetter.legalCitations && sampleLetter.legalCitations.length > 0) {
    // Use legal citations from sample letter
    citations = "I am asserting my rights under the following laws and regulations:\n\n";
    
    sampleLetter.legalCitations.forEach((citation, index) => {
      citations += `${index + 1}. ${citation}\n`;
    });
    
    citations += "\nThese laws and regulations require credit reporting agencies and furnishers of information to maintain and report accurate information.";
  } else if (dispute.legalBasis && dispute.legalBasis.length > 0) {
    // Use legal basis from dispute if no sample letter found
    citations = "I am asserting my rights under the following laws and regulations:\n\n";
    
    dispute.legalBasis.forEach((reference, index) => {
      citations += `${index + 1}. ${reference.law} ${reference.section}: ${reference.description}\n`;
    });
    
    citations += "\nThese laws and regulations require credit reporting agencies and furnishers of information to maintain and report accurate information.";
  } else {
    // Default legal references if none specifically provided
    citations = "I am asserting my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611(a) which requires consumer reporting agencies to conduct a reasonable investigation of disputed information and Section 623 which requires furnishers to provide accurate information to consumer reporting agencies.";
  }
  
  return citations;
};

/**
 * Generate dispute letter for a specific discrepancy
 */
export const generateDisputeLetterForDiscrepancy = async (
  dispute: RecommendedDispute,
  userInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }
): Promise<string> => {
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureauName = dispute.bureau.charAt(0).toUpperCase() + dispute.bureau.slice(1);
  const bureauAddress = bureauAddresses[dispute.bureau.toLowerCase() as keyof typeof bureauAddresses] || 
                        `${bureauName}\n[ADDRESS NEEDED]`;
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Generate a more specific subject line based on the dispute type
  let subjectLine = `Re: Dispute of Inaccurate Information`;
  if (dispute.accountName !== "Personal Information") {
    subjectLine += ` - Account #${dispute.accountNumber || "[Account Number]"}`;
  } else {
    subjectLine += ` - Personal Information`;
  }
  
  // Generate specific FCRA sections based on the dispute type
  let fcraSections = "Section 611(a)";
  if (dispute.reason.includes("balance") || dispute.reason.includes("payment")) {
    fcraSections += " and Section 623";
  }
  if (dispute.reason.includes("not mine") || dispute.reason.includes("fraud")) {
    fcraSections += " and Section 605B";
  }
  
  // Build the dispute explanation based on the discrepancy details
  let disputeExplanation = dispute.description;
  
  // Try to add some specific details to strengthen the dispute
  if (dispute.discrepancyDetails) {
    const { field, values, bureaus } = dispute.discrepancyDetails;
    
    // Add more specific details about the discrepancy
    const correctValue = Object.entries(values)
      .filter(([bureau]) => !bureaus.includes(bureau))
      .map(([_, value]) => value)[0];
    
    const incorrectValue = values[dispute.bureau];
    
    if (correctValue && incorrectValue) {
      disputeExplanation += ` The correct ${field} should be ${correctValue}, not ${incorrectValue}.`;
    }
    
    // Add evidence statement
    if (Object.keys(values).length > 2) {
      const otherBureaus = Object.keys(values)
        .filter(b => b !== dispute.bureau)
        .map(b => b.charAt(0).toUpperCase() + b.slice(1))
        .join(" and ");
      
      if (correctValue) {
        disputeExplanation += ` This is confirmed by ${otherBureaus}, which correctly report the ${field} as ${correctValue}.`;
      }
    }
  }
  
  // Check if we have a sampleDisputeLanguage to use
  if (dispute.sampleDisputeLanguage) {
    disputeExplanation += " " + dispute.sampleDisputeLanguage;
  }
  
  // Generate legal citations
  const legalCitations = await generateLegalCitations(dispute);
  
  // Default request items
  let requestItems = `1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this information
4. Remove or correct the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation`;
  
  // Build the letter with all components
  return `
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${bureauName}
${bureauAddress}

${subjectLine}

To Whom It May Concern:

I am writing to dispute inaccurate information appearing on my credit report. After reviewing my credit report from ${bureauName}, I have identified the following item that is inaccurate and requires investigation and correction:

${dispute.accountName !== "Personal Information" 
  ? `Account Name: ${dispute.accountName}
Account Number: ${dispute.accountNumber || "[Account Number]"}
Reason for Dispute: ${dispute.reason}`
  : `Information Type: Personal Information
Reason for Dispute: ${dispute.reason}`}

${disputeExplanation}

${legalCitations}

Under the provisions of the Fair Credit Reporting Act (FCRA), specifically ${fcraSections}, I formally request that you:

${requestItems}

I have attached copies of relevant documentation that supports my dispute. Please complete your investigation within 30 days as required by the FCRA.

If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name}

Enclosures: [List any attached documents]
`;
};
