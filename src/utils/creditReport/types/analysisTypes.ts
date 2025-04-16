
/**
 * Types related to credit report analysis
 */

import { CreditReportData, CreditReportAccount, IdentifiedIssue } from './creditReportTypes';

export interface AnalysisProcessorProps {
  uploadedFile: File | null;
  setReportData: (data: CreditReportData) => void;
  setIssues: (issues: IdentifiedIssue[]) => void;
  setLetterGenerated: (generated: boolean) => void;
  setAnalysisError: (error: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setAnalyzed: (analyzed: boolean) => void;
}

export interface AnalysisHandlerProps extends AnalysisProcessorProps {
  toast: ReturnType<typeof import('@/hooks/use-toast').useToast>;
}

export type IssueItem = IdentifiedIssue;

export interface DisputeAnalysisResults {
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
  legalBasis?: any[];
  applicability?: string;
}

export interface IssueAnalysisResult {
  identifiedIssues: IdentifiedIssue[];
  recommendations: RecommendedDispute[];
  summaryData: {
    totalIssues: number;
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    accountsWithIssuesCount: number;
  };
}

export interface AccountIssue {
  account: CreditReportAccount;
  issues: IdentifiedIssue[];
}
