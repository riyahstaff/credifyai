/**
 * Core types for credit report data and functionality
 */

// Credit report bureau information
export interface CreditReportBureaus {
  experian: boolean;
  equifax: boolean;
  transunion: boolean;
}

// Personal information extracted from credit report
export interface PersonalInfo {
  name?: string;
  address?: string;
  previousAddresses?: string[];
  ssn?: string;
  dob?: string;
  phones?: string[];
  employers?: string[];
}

// Account information from credit report
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
  
  // Adding explicitly the properties referenced in the code
  balance?: string;
  dateOpened?: string;
  dateReported?: string;
}

// Inquiry information from credit report
export interface CreditReportInquiry {
  inquiryDate: string;
  bureau: string;
  inquiryBy: string;
  type: string;
  
  // Adding missing property referenced in the code
  creditor?: string;
}

// Public record information from credit report
export interface CreditReportPublicRecord {
  recordType: string;
  dateReported: string;
  referenceNumber?: string;
  court?: string;
  status?: string;
  amount?: string;
  bureau: string;
  liabilityAmount?: string;
  assets?: string;
  filingDate?: string;
  dateSatisfied?: string;
}

// Analysis results for a credit report
export interface AnalysisResults {
  totalAccounts: number;
  openAccounts: number;
  closedAccounts: number;
  negativeItems: number;
  inquiryCount: number;
  publicRecordCount: number;
  creditUtilization?: number;
  accountTypeSummary: Record<string, number>;
  
  // Additional fields for recommendations
  totalDiscrepancies?: number;
  highSeverityIssues?: number;
  accountsWithIssues?: number;
  recommendedDisputes?: RecommendedDispute[];
}

// Overall credit report data structure
export interface CreditReportData {
  bureaus: CreditReportBureaus;
  personalInfo?: PersonalInfo;
  accounts: CreditReportAccount[];
  inquiries: CreditReportInquiry[];
  publicRecords: CreditReportPublicRecord[];
  rawText?: string;
  htmlContent?: string;
  analysisResults?: AnalysisResults;
}

// Legal reference structure
export interface LegalReference {
  law: string;
  section: string;
  title: string;
  text: string;
  applicability?: string[];
}

// User information for generating dispute letters
export interface UserInfo {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  email?: string;
  phone?: string;
}

// Recommended dispute information
export interface RecommendedDispute {
  id: string;
  type: string;
  title: string;
  bureau: string;
  accountName: string;
  accountNumber?: string;
  reason: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  legalBasis?: LegalReference[];
  disputeStrategy?: string;
  sampleDisputeLanguage?: string;
  successRate?: number;
  
  // Adding the severity property that's referenced in code
  severity?: 'high' | 'medium' | 'low';
}

// Sample dispute letter structure
export interface SampleDisputeLetter {
  content: string;
  disputeType: string;
  bureau?: string;
  successfulOutcome?: boolean;
  effectiveLanguage?: string[];
  legalCitations?: string[];
}
