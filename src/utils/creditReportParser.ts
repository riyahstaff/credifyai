
// This is a simplified version of the CreditReportData interface
// Normally this would be more complex and detailed

export interface CreditReportAccount {
  accountName: string;
  accountNumber?: string;
  accountType?: string;
  openDate?: string;
  status?: string;
  lastReportedDate?: string;
  creditLimit?: string;
  highBalance?: string;
  currentBalance?: string;
  balance?: string;
  paymentStatus?: string;
  paymentHistory?: Record<string, string>;
  isNegative?: boolean;
  remarks?: string[];
  bureau?: string;
  lastActivity?: string;
  accountDesignation?: string; // Individual, Joint, Authorized User
  creditorContactInfo?: string;
  isCollection?: boolean;
  chargeOffAmount?: string;
  dateOpened?: string;
  dateReported?: string;
}

export interface CreditReportData {
  bureaus: {
    experian: boolean;
    equifax: boolean;
    transunion: boolean;
  };
  personalInfo?: {
    name: string;
    addresses: string[];
    phoneNumbers: string[];
    employments: string[];
    dateOfBirth: string;
  };
  accounts: CreditReportAccount[];
  inquiries: any[];
  publicRecords: any[];
  rawText?: string;
  htmlContent?: string;
  analysisResults?: any;
}

export const parseCreditReport = (fileContent: string): CreditReportData | null => {
  // This is a placeholder implementation
  // In a real implementation, this would parse the file content and return a structured report
  try {
    console.log("Parsing credit report content...");
    return {
      bureaus: {
        experian: false,
        equifax: false,
        transunion: false
      },
      personalInfo: {
        name: "",
        addresses: [],
        phoneNumbers: [],
        employments: [],
        dateOfBirth: "",
      },
      accounts: [],
      inquiries: [],
      publicRecords: [],
      rawText: fileContent,
    };
  } catch (error) {
    console.error("Error parsing credit report:", error);
    return null;
  }
};

// Add these functions to fix import errors in other files
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  try {
    const fileContent = await readFileAsText(file);
    return parseCreditReport(fileContent) || {
      bureaus: {
        experian: false,
        equifax: false,
        transunion: false
      },
      accounts: [],
      inquiries: [],
      publicRecords: [],
      rawText: fileContent
    };
  } catch (error) {
    console.error("Error processing credit report:", error);
    throw new Error(`Failed to process report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const loadSampleReports = async (): Promise<CreditReportData[]> => {
  console.log("Loading sample reports (placeholder)");
  return [];
};

export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  return {
    'general': ['I dispute this item as inaccurate', 'Please verify this information'],
    'late_payment': ['This payment was made on time', 'I have proof of timely payment'],
    'collection': ['This debt is not mine', 'This account has been paid in full']
  };
};

// Helper function to read file content
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Could not read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
