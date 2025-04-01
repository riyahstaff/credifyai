
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
  // Add missing fields that caused errors
  openDate?: string;
  lastReportedDate?: string;
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
  // Add missing fields that caused errors
  sampleDisputeLanguage?: string;
  legalBasis?: LegalReference[];
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

// Add missing types needed by other modules
export interface UserInfo {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface LegalReference {
  law: string;
  section: string;
  title: string;
  text: string;
}

export interface SampleDisputeLetter {
  content: string;
  disputeType: string;
  bureau: string;
  successfulOutcome: boolean;
  effectiveLanguage: string[];
  legalCitations: string[];
}

// Define type for CreditReportPublicRecord
export interface CreditReportPublicRecord {
  type: string;
  date: string;
  reference: string;
  status: string;
  bureau?: string;
}
