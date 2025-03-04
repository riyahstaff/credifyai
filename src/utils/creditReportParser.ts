
// This file contains types and utility functions for credit report parsing

export interface CreditReportData {
  bureaus: {
    experian: boolean;
    equifax: boolean;
    transunion: boolean;
  };
  personalInfo: {
    name: string;
    addresses: string[];
    phoneNumbers: string[];
    employments: string[];
    dateOfBirth: string;
  };
  accounts: CreditReportAccount[];
  inquiries: any[];
  publicRecords: any[];
  rawText?: string; // Optional raw text field
  htmlContent?: string; // Optional HTML content field
}

export interface CreditReportAccount {
  accountName: string;
  accountNumber: string;
  accountType: string;
  accountStatus: string;
  dateOpened: string;
  lastReported: string;
  balance: string;
  paymentHistory: any;
  bureauReporting: string[];
  // Add other fields as needed
}

// Placeholder implementation for functions used elsewhere
export const parseCreditReport = async (fileContent: string): Promise<CreditReportData> => {
  // This is a placeholder that would normally contain real implementation
  console.log("Parsing credit report content", fileContent.slice(0, 100) + "...");
  
  return {
    bureaus: {
      experian: false,
      equifax: false,
      transunion: false
    },
    personalInfo: {
      name: "John Doe",
      addresses: ["123 Main St, Anytown, USA"],
      phoneNumbers: ["555-123-4567"],
      employments: ["Example Corp"],
      dateOfBirth: "01/01/1980",
    },
    accounts: [],
    inquiries: [],
    publicRecords: [],
    rawText: fileContent,
  };
};

// Additional functions that are needed
export const processCreditReport = parseCreditReport; // Alias for backward compatibility

export const loadSampleReports = (): { [key: string]: string } => {
  return {
    "sample1": "This is a sample credit report content",
    "sample2": "This is another sample credit report content"
  };
};

export const getSuccessfulDisputePhrases = (): string[] => {
  return [
    "dispute resolved in your favor",
    "item deleted",
    "item updated",
    "item corrected",
    "dispute completed"
  ];
};
