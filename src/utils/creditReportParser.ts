
/**
 * Credit Report Parser Utility
 * This module parses uploaded credit reports to extract relevant information
 * for generating dispute letters and automatically identifies discrepancies and errors.
 */

import { listSampleReports, downloadSampleReport } from '@/lib/supabase';

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
}

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
 * Extract text content from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // In a real implementation, this would use a PDF parsing library
  // For now, we'll simulate text extraction
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated content from a credit report PDF
      resolve(`
CREDIT REPORT
===============
PERSONAL INFORMATION:
Name: John Smith
Address: 123 Main St, Anytown, CA 90210
Previous Address: 456 Oak Ave, Oldtown, CA 90211
Employer: ABC Corporation

ACCOUNTS:
------------------
BANK OF AMERICA
Account #: xxxx-xxxx-xxxx-1234
Type: Credit Card
Balance: $1,452.00
Status: Current
Opened: 05/2018
Last Reported: 06/2023
Reporting to: Experian, Equifax, TransUnion

CHASE MORTGAGE
Account #: xxxxx789
Type: Mortgage
Balance: $245,800.00
Status: 30 Days Late
Opened: 03/2015
Last Reported: 06/2023
Reporting to: Experian, Equifax, TransUnion
Remarks: Late payment Feb 2023

CAPITAL ONE
Account #: xxxx-xxxx-xxxx-5678
Type: Credit Card
Balance: $0
Status: Closed
Opened: 07/2014
Closed: 09/2020
Last Reported: 10/2020
Reporting to: Experian, TransUnion

INQUIRIES:
------------------
05/12/2023 - DISCOVER FINANCIAL
04/02/2023 - TESLA FINANCING
02/15/2023 - LENDING CLUB

PUBLIC RECORDS:
------------------
None
      `);
    }, 1000);
  });
};

/**
 * Parse text content from a credit report into structured data
 */
export const parseReportContent = (content: string): CreditReportData => {
  // In a real implementation, this would use regex or NLP to parse content
  // For now, we'll return mock data that simulates the parsed content
  
  // This is a simplified parsing algorithm that would be expanded in production
  const bureaus = {
    experian: content.includes('Experian'),
    equifax: content.includes('Equifax'),
    transunion: content.includes('TransUnion'),
  };
  
  const hasNameMatch = content.match(/Name:\s*(.*)/i);
  const hasAddressMatch = content.match(/Address:\s*(.*)/i);
  
  // Define personal info with proper type annotations
  const personalInfo: {
    name?: string;
    address?: string;
    bureauSpecificInfo?: {
      experian?: PersonalBureauData;
      equifax?: PersonalBureauData;
      transunion?: PersonalBureauData;
    };
    discrepancies?: PersonalInfoDiscrepancy[];
  } = {
    name: hasNameMatch ? hasNameMatch[1] : undefined,
    address: hasAddressMatch ? hasAddressMatch[1] : undefined,
    // Simulated cross-bureau personal info discrepancies
    bureauSpecificInfo: {
      experian: {
        name: "John A. Smith",
        address: "123 Main St, Anytown, CA 90210",
      },
      equifax: {
        name: "John Smith",
        address: "123 Main Street, Anytown, CA 90210", // Slight difference in format
      },
      transunion: {
        name: "John Smith",
        address: "123 Main St, Anytown, CA 90210",
      }
    },
    discrepancies: [
      {
        field: "name",
        bureaus: ["experian"],
        values: {
          "experian": "John A. Smith",
          "equifax": "John Smith",
          "transunion": "John Smith"
        },
        severity: 'low', // Using proper type literal
        suggestedDispute: "Name format inconsistency between bureaus"
      },
      {
        field: "address",
        bureaus: ["equifax"],
        values: {
          "experian": "123 Main St, Anytown, CA 90210",
          "equifax": "123 Main Street, Anytown, CA 90210",
          "transunion": "123 Main St, Anytown, CA 90210"
        },
        severity: 'low', // Using proper type literal
        suggestedDispute: "Address format inconsistency between bureaus"
      }
    ]
  };
  
  // Extract accounts (enhanced with cross-bureau analysis)
  const accounts: CreditReportAccount[] = [];
  
  // Enhanced BANK OF AMERICA account with cross-bureau discrepancies
  if (content.includes('BANK OF AMERICA')) {
    accounts.push({
      accountName: 'BANK OF AMERICA',
      accountNumber: 'xxxx-xxxx-xxxx-1234',
      accountType: 'Credit Card',
      currentBalance: '$1,452.00',
      paymentStatus: 'Current',
      dateOpened: '05/2018',
      dateReported: '06/2023',
      bureau: 'Experian, Equifax, TransUnion',
      bureauSpecificData: {
        experian: {
          accountNumber: 'xxxx-xxxx-xxxx-1234',
          currentBalance: '$1,452.00',
          paymentStatus: 'Current',
          dateOpened: '05/2018',
          dateReported: '06/2023',
          creditLimit: '$5,000',
        },
        equifax: {
          accountNumber: 'xxxx-xxxx-xxxx-1234',
          currentBalance: '$1,452.00',
          paymentStatus: 'Current',
          dateOpened: '05/2018',
          dateReported: '06/2023',
          creditLimit: '$5,000',
        },
        transunion: {
          accountNumber: 'xxxx-xxxx-xxxx-1234',
          currentBalance: '$1,452.00',
          paymentStatus: 'Current',
          dateOpened: '05/15/2018', // Date discrepancy
          dateReported: '06/2023',
          creditLimit: '$5,000',
        }
      },
      discrepancies: [
        {
          field: "dateOpened",
          bureaus: ["transunion"],
          values: {
            "experian": "05/2018",
            "equifax": "05/2018",
            "transunion": "05/15/2018"
          },
          severity: 'low',
          suggestedDispute: "Inconsistent account opening date reported by TransUnion"
        }
      ]
    });
  }
  
  // Enhanced CHASE MORTGAGE account with serious discrepancies
  if (content.includes('CHASE MORTGAGE')) {
    accounts.push({
      accountName: 'CHASE MORTGAGE',
      accountNumber: 'xxxxx789',
      accountType: 'Mortgage',
      currentBalance: '$245,800.00',
      paymentStatus: '30 Days Late',
      dateOpened: '03/2015',
      dateReported: '06/2023',
      bureau: 'Experian, Equifax, TransUnion',
      remarks: ['Late payment Feb 2023'],
      bureauSpecificData: {
        experian: {
          accountNumber: 'xxxxx789',
          currentBalance: '$245,800.00',
          paymentStatus: '30 Days Late',
          dateOpened: '03/2015',
          dateReported: '06/2023',
        },
        equifax: {
          accountNumber: 'xxxxx789',
          currentBalance: '$245,800.00',
          paymentStatus: '60 Days Late', // Major discrepancy - different late status
          dateOpened: '03/2015',
          dateReported: '06/2023',
        },
        transunion: {
          accountNumber: 'xxxxx789',
          currentBalance: '$245,800.00',
          paymentStatus: '30 Days Late',
          dateOpened: '03/2015',
          dateReported: '06/2023',
        }
      },
      discrepancies: [
        {
          field: "paymentStatus",
          bureaus: ["equifax"],
          values: {
            "experian": "30 Days Late",
            "equifax": "60 Days Late",
            "transunion": "30 Days Late"
          },
          severity: 'high',
          suggestedDispute: "Incorrect payment status reported by Equifax showing 60 days late instead of 30 days late as reported by other bureaus"
        }
      ]
    });
  }
  
  // Enhanced CAPITAL ONE account with balance discrepancy
  if (content.includes('CAPITAL ONE')) {
    accounts.push({
      accountName: 'CAPITAL ONE',
      accountNumber: 'xxxx-xxxx-xxxx-5678',
      accountType: 'Credit Card',
      currentBalance: '$0',
      paymentStatus: 'Closed',
      dateOpened: '07/2014',
      dateReported: '10/2020',
      bureau: 'Experian, TransUnion',
      bureauSpecificData: {
        experian: {
          accountNumber: 'xxxx-xxxx-xxxx-5678',
          currentBalance: '$0',
          paymentStatus: 'Closed',
          dateOpened: '07/2014',
          dateReported: '10/2020',
        },
        equifax: {
          // Not reported to Equifax (intentional omission)
        },
        transunion: {
          accountNumber: 'xxxx-xxxx-xxxx-5678',
          currentBalance: '$125', // Balance discrepancy
          paymentStatus: 'Closed',
          dateOpened: '07/2014',
          dateReported: '10/2020',
        }
      },
      discrepancies: [
        {
          field: "currentBalance",
          bureaus: ["transunion"],
          values: {
            "experian": "$0",
            "transunion": "$125"
          },
          severity: 'high',
          suggestedDispute: "Incorrect balance on closed account reported by TransUnion showing $125 instead of $0"
        }
      ]
    });
  }
  
  // Extract inquiries
  const inquiries = [];
  if (content.includes('DISCOVER FINANCIAL')) {
    inquiries.push({
      inquiryDate: '05/12/2023',
      creditor: 'DISCOVER FINANCIAL',
      bureau: 'Experian, Equifax'
    });
  }
  
  // Generate analysis and recommended disputes based on discrepancies
  const recommendedDisputes: RecommendedDispute[] = [];
  
  // Add disputes for account discrepancies
  accounts.forEach(account => {
    if (account.discrepancies && account.discrepancies.length > 0) {
      account.discrepancies.forEach(discrepancy => {
        discrepancy.bureaus.forEach(bureau => {
          recommendedDisputes.push({
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bureau: bureau,
            reason: `Incorrect ${discrepancy.field}`,
            description: discrepancy.suggestedDispute || `The ${discrepancy.field} reported by ${bureau} is inconsistent with other bureaus.`,
            severity: discrepancy.severity,
            discrepancyDetails: discrepancy,
            sampleDisputeLanguage: getSampleDisputeLanguage(account.accountName, discrepancy.field, bureau)
          });
        });
      });
    }
  });
  
  // Add disputes for personal info discrepancies if they exist
  if (personalInfo.discrepancies && personalInfo.discrepancies.length > 0) {
    personalInfo.discrepancies.forEach(discrepancy => {
      discrepancy.bureaus.forEach(bureau => {
        recommendedDisputes.push({
          accountName: "Personal Information",
          bureau: bureau,
          reason: `Incorrect ${discrepancy.field}`,
          description: discrepancy.suggestedDispute || `The ${discrepancy.field} reported by ${bureau} is inconsistent with other bureaus.`,
          severity: discrepancy.severity,
          sampleDisputeLanguage: getSampleDisputeLanguage("Personal Information", discrepancy.field, bureau)
        });
      });
    });
  }
  
  // Create analysis summary
  const analysisResults = {
    totalDiscrepancies: recommendedDisputes.length,
    highSeverityIssues: recommendedDisputes.filter(d => d.severity === 'high').length,
    accountsWithIssues: new Set(recommendedDisputes.map(d => d.accountName)).size,
    recommendedDisputes: recommendedDisputes
  };
  
  return { 
    bureaus, 
    personalInfo, 
    accounts, 
    inquiries,
    analysisResults 
  };
};

/**
 * Get sample dispute language from previously successful disputes
 */
function getSampleDisputeLanguage(accountName: string, field: string, bureau: string): string {
  // This would ideally search through sample reports for similar disputes
  // For now, we'll return sample language based on the field type
  
  const sampleLanguage: Record<string, string> = {
    'paymentStatus': 'This account is incorrectly reported as delinquent. According to my payment history and bank statements, all payments have been made on time. The other credit bureaus correctly report this account as current.',
    'currentBalance': 'The balance shown on this account is incorrect. This account was paid in full on [DATE] as confirmed by [EVIDENCE]. The balance should be $0.',
    'dateOpened': 'The account opening date is incorrectly reported. According to my records and statements, this account was opened on [CORRECT DATE], not [REPORTED DATE].',
    'name': 'My legal name is incorrectly reported on my credit file. My correct legal name is [CORRECT NAME] as evidenced by my government-issued ID and other official documents.',
    'address': 'The address information on my credit report is inaccurate. My correct current address is [CORRECT ADDRESS] as can be verified by my utility bills, lease agreement, and other documentation.'
  };
  
  // Get the specific language for the field if available, otherwise use a generic template
  const language = sampleLanguage[field] || 
    `The ${field} for this account is being inaccurately reported by ${bureau}. This information is incorrect and should be investigated and corrected to reflect accurate information.`;
  
  return language;
}

/**
 * Process uploaded credit report file
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  // First, ensure sample reports are loaded
  await loadSampleReports();
  
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'pdf') {
    const textContent = await extractTextFromPDF(file);
    return parseReportContent(textContent);
  } else if (fileExtension === 'txt' || fileExtension === 'text') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(parseReportContent(content));
      };
      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or TXT file.');
  }
};

/**
 * Compare data across bureaus and identify discrepancies
 * This would be used when analyzing multiple bureau reports
 */
export const analyzeMultipleBureauReports = (
  experianData?: CreditReportData,
  equifaxData?: CreditReportData,
  transunionData?: CreditReportData
): CreditReportData => {
  // In a real implementation, this would merge and compare reports from different bureaus
  // For now, we'll return a sample merged report with simulated discrepancies
  
  // Use the first available report as base
  const baseReport = experianData || equifaxData || transunionData;
  
  if (!baseReport) {
    throw new Error('No credit reports provided for analysis');
  }
  
  // Since we're simulating, return the enhanced report with discrepancies
  return parseReportContent(""); // Our mock implementation already includes discrepancies
};

/**
 * Get commonly successful dispute phrases from sample reports
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  await loadSampleReports();
  
  // In a real implementation, this would analyze sample dispute letters
  // to extract commonly successful phrases for different dispute types
  
  // For now, return sample successful phrases
  return {
    'balanceDisputes': [
      'Upon review of my financial records, I can confirm that the balance reported is incorrect.',
      'My records indicate that the balance was paid in full on [DATE].',
      'The balance shown on my credit report is inconsistent with the statements provided by the creditor.',
      'This balance discrepancy appears to be due to a failure to process my payment made on [DATE].'
    ],
    'latePaymentDisputes': [
      'I have never missed a payment on this account and have documentation to prove all payments were made on time.',
      'The reported late payment occurred during a time when the account was subject to a payment deferral program.',
      'I dispute this late payment as it occurred during a period of identified system errors acknowledged by the creditor.',
      'This late payment report is incorrect as I have received confirmation from the creditor that all payments have been properly applied.'
    ],
    'accountOwnershipDisputes': [
      'This account does not belong to me and I have never authorized or applied for this account.',
      'I am a victim of identity theft and this account was fraudulently opened in my name.',
      'This account appears to be confused with another individual with a similar name or identifying information.',
      'I request a full investigation to determine how this account was opened, as it was never authorized by me.'
    ],
    'closedAccountDisputes': [
      'This account was officially closed at my request on [DATE], but continues to be reported as open.',
      'I have documentation confirming this account was closed with a zero balance on [DATE].',
      'This account should be reported as "Closed by Consumer" rather than its current status.',
      'I have confirmation number [REFERENCE] from the creditor acknowledging this account was closed.'
    ],
    'personalInfoDisputes': [
      'The personal information reported is incorrect and requires immediate correction to prevent future confusion.',
      'My legal name is incorrectly reported, and I have attached documentation showing the correct information.',
      'My address information contains errors that must be corrected to ensure accurate credit reporting.',
      'The employment information listed in my file is outdated and should be updated as follows:'
    ]
  };
};

/**
 * Generate dispute letter for a specific discrepancy
 */
export const generateDisputeLetterForDiscrepancy = (
  dispute: RecommendedDispute,
  userInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }
): string => {
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureauName = dispute.bureau.charAt(0).toUpperCase() + dispute.bureau.slice(1);
  const bureauAddress = bureauAddresses[dispute.bureau.toLowerCase() as keyof typeof bureauAddresses];
  
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
  
  // Use sample language if available
  if (dispute.sampleDisputeLanguage) {
    disputeExplanation += " " + dispute.sampleDisputeLanguage;
  } else if (dispute.discrepancyDetails) {
    const { field, values, bureaus } = dispute.discrepancyDetails;
    
    // Add more specific details about the discrepancy
    const correctValue = Object.entries(values)
      .filter(([bureau]) => !bureaus.includes(bureau))
      .map(([_, value]) => value)[0];
    
    const incorrectValue = values[dispute.bureau];
    
    disputeExplanation += ` The correct ${field} should be ${correctValue}, not ${incorrectValue}.`;
    
    // Add evidence statement
    if (Object.keys(values).length > 2) {
      const otherBureaus = Object.keys(values)
        .filter(b => b !== dispute.bureau)
        .map(b => b.charAt(0).toUpperCase() + b.slice(1))
        .join(" and ");
      
      disputeExplanation += ` This is confirmed by ${otherBureaus}, which correctly report the ${field} as ${correctValue}.`;
    }
  }
  
  return `
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${bureauName}
${bureauAddress}

${subjectLine}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${bureauName}, I have identified the following item that is inaccurate and requires investigation and correction:

${dispute.accountName !== "Personal Information" 
  ? `Account Name: ${dispute.accountName}
Account Number: ${dispute.accountNumber || "[Account Number]"}
Reason for Dispute: ${dispute.reason}`
  : `Information Type: Personal Information
Reason for Dispute: ${dispute.reason}`
}

This information is inaccurate because: ${disputeExplanation}

Under ${fcraSections} of the FCRA, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this information
4. Remove or correct the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name}

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
`;
};
