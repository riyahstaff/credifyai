
/**
 * Credit report data structure types
 */

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
  id?: string; // Added id property
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact' | 'Low Impact';
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
  legalReferences?: string[]; // Added legal references array
  bureau?: string;  // Added bureau property
  severity?: string; // Added severity field
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
  isEmergencyFallback?: boolean;
  issues?: IdentifiedIssue[]; // Added issues property
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
  legalReferences?: string[]; // Added legal references array
}

// Define legal references for different issue types
export const FCRA_LAWS = {
  latePayments: ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)'],
  collections: ['15 USC 1692c', '15 USC 1681s-2(a)(3)'],
  inaccuracies: ['15 USC 1681e(b)', '15 USC 1681i'],
  inquiries: ['15 USC 1681b(a)(2)', '15 USC 1681m'],
  personalInfo: ['15 USC 1681c', '15 USC 1681g'],
  metro2: ['Metro 2® Compliance Guidelines'],
  bankruptcy: ['15 USC 1681c(a)(1)', '11 USC 525'],
  studentLoans: ['15 USC 1681s-2(a)(1)', '20 USC 1087'],
  generalCredit: ['15 USC 1681e(b)', '12 CFR 1026.13', '18 USC 1028a']
};
