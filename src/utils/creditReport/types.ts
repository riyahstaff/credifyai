
export interface CreditReportAccount {
  accountName: string;
  accountNumber?: string;
  accountType?: string;
  creditor?: string;
  balance?: number | string;
  currentBalance?: number | string;
  status?: string;
  paymentStatus?: string;
  bureau?: string;
  dateOpened?: string;
  openDate?: string;
  dateReported?: string;
  lastReportedDate?: string;
  isNegative?: boolean;
  latestStatus?: string;
  creditorName?: string;
  paymentHistory?: string;
  creditLimit?: number | string;
  accountHolderName?: string;
  ssn?: string;
  remarks?: string[];
  lastActivity?: string;
  highBalance?: number | string;
}

export interface CreditReportInquiry {
  inquiryDate: string;
  creditor?: string;
  inquiryBy?: string;
  bureau?: string;
  type?: string;
  inquiryCompany?: string;
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
  sampleDisputeLanguage?: string;
  legalBasis?: LegalReference[];
  applicability?: string;
}

export interface IdentifiedIssue {
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact' | 'Low Impact';
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
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
  personalInfo?: PersonalInfo;
  accounts: CreditReportAccount[];
  inquiries: CreditReportInquiry[];
  publicRecords: any[];
  rawText?: string;
  htmlContent?: string;
  isSampleData?: boolean;
  isTestMode?: boolean;
  analysisResults?: AnalysisResults;
  primaryBureau?: string;
  reportNumber?: string;
  bureau?: string;
  reportDate?: string;
  isEmergencyFallback?: boolean;  // Added this property to fix the TypeScript error
}

export interface PersonalInfo {
  name?: string;
  address?: string;
  ssn?: string;
  dob?: string;
  city?: string;
  state?: string;
  zip?: string;
  employer?: string;
  phone?: string;
}

export interface LegalReference {
  law: string;
  section: string;
  title: string;
  text: string;
  applicability?: string;
}

export interface SampleDisputeLetter {
  content: string;
  disputeType: string;
  bureau: string;
  successfulOutcome: boolean;
  effectiveLanguage: string[];
  legalCitations: string[];
}

export interface CreditReportPublicRecord {
  type: string;
  date: string;
  reference: string;
  status: string;
  bureau?: string;
}

export interface UserInfo {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  ssn?: string;
  dob?: string;
}

export interface Issue {
  id?: string;
  type: string;
  description: string;
  bureau: string;
  accountName?: string;
  accountNumber?: string;
  date?: string;
  reason?: string;
  legalBasis?: LegalReference[] | string;
  severity: 'high' | 'medium' | 'low';
  details?: Record<string, any>;
}
