/**
 * Credit Report Data Types
 */

/**
 * Personal information from credit report
 */
export interface PersonalInfo {
  name?: string;
  addresses?: string[];
  phoneNumbers?: string[];
  ssn?: string;
  dateOfBirth?: string;
  employmentInfo?: string[];
}

/**
 * Credit report account information
 */
export interface CreditReportAccount {
  accountName: string;
  accountNumber?: string;
  accountType?: string;
  dateOpened?: string;
  dateReported?: string;
  status?: string;
  paymentStatus?: string;
  balance?: string;
  currentBalance?: string;
  creditLimit?: string;
  highBalance?: string;
  monthlyPayment?: string;
  pastDue?: string;
  bureau?: string;
  remarks?: string[];
  paymentHistory?: string;
}

/**
 * Full credit report data structure
 */
export interface CreditReportData {
  personalInfo?: PersonalInfo;
  bureaus: {
    experian: boolean;
    equifax: boolean;
    transunion: boolean;
  };
  accounts: CreditReportAccount[];
  inquiries: Array<{
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
  reportSections?: Record<string, string>;
  fileContent?: string;
  rawText?: string;
  htmlContent?: string; // New field for HTML formatted content
  analysisResults?: {
    totalAccounts: number;
    openAccounts: number;
    closedAccounts: number;
    negativeItems: number;
    inquiryCount: number;
    publicRecordCount: number;
    creditUtilization?: number;
    accountTypeSummary: Record<string, number>;
  };
}
