
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';

export interface LetterTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

export interface GeneratorState {
  reportData: CreditReportData | null;
  selectedAccount: CreditReportAccount | null;
  selectedTemplate: LetterTemplate | null;
  selectedBureau: string | null;
  generatedLetter: string;
}

export interface DisputeData {
  bureau: string;
  accountName: string;
  accountNumber: string;
  errorType: string;
  explanation: string;
  letterContent: string; // Make letterContent a required property
  actualAccountInfo: {
    name: string;
    number: string;
    balance?: number;
    openDate?: string;
    reportedDate?: string;
    status?: string;
  };
  // Allow additional properties for extensibility
  [key: string]: any;
}
