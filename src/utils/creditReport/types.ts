
export interface CreditReportAccount {
  accountName: string;
  accountNumber?: string;
  accountType?: string;
  balance?: number | string;
  currentBalance?: number | string;
  creditLimit?: number | string;
  paymentStatus?: string;
  dateOpened?: string;
  lastActivity?: string;
  status?: string;
  isNegative?: boolean;
  dateReported?: string;
  bureau?: string;
  remarks?: string[];
}

export interface CreditReportInquiry {
  inquiryDate: string;
  inquiryBy: string;
  type: string;
  bureau?: string;
  creditor?: string;
}

export interface RecommendedDispute {
  id: string;
  type: string;
  title: string;
  bureau: string;
  accountName: string;
  accountNumber: string;
  reason: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  severity: string;
}

export interface AnalysisResults {
  totalAccounts: number;
  openAccounts: number;
  closedAccounts: number;
  negativeItems: number;
  inquiryCount: number;
  publicRecordCount: number;
  accountTypeSummary: Record<string, number>;
  creditUtilization?: number;
  totalCreditLimit?: number;
  totalBalance?: number;
  totalDiscrepancies?: number;
  highSeverityIssues?: number;
  accountsWithIssues?: number;
  recommendedDisputes: RecommendedDispute[];
}

export interface CreditReportData {
  bureaus: {
    experian: boolean;
    equifax: boolean;
    transunion: boolean;
  };
  personalInfo?: {
    name?: string;
    address?: string;
    ssn?: string;
    dob?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  accounts: CreditReportAccount[];
  inquiries: CreditReportInquiry[];
  publicRecords: any[];
  rawText?: string;
  htmlContent?: string;
  analysisResults?: AnalysisResults;
}
