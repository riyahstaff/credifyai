
import { CreditReportAccount } from '@/utils/creditReportParser';

export interface DisputeIssue {
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
  bureau?: string;
}

export interface DisputeLetter {
  id: number;
  title: string;
  bureau: string;
  recipient: string;
  accountName: string;
  accountNumber: string;
  errorType: string;
  explanation: string;
  letterContent: string;
  content: string;
  status: string;
  createdAt: string;
  bureaus: string[];
  laws: string[];
  timestamp: string;
}
