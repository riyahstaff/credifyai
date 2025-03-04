
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '@/utils/creditReport/types';

export type DisputeType = {
  bureau: string;
  accountName: string;
  accountNumber: string;
  errorType: string;
  explanation: string;
  letterContent: string; // Make letterContent required to match DisputeData
  [key: string]: any; // Allow additional properties
};

export interface SamplePhrases {
  balanceDisputes?: string[];
  latePaymentDisputes?: string[];
  accountOwnershipDisputes?: string[];
  closedAccountDisputes?: string[];
  inquiryDisputes?: string[];
  personalInfoDisputes?: string[];
  general?: string[];
}
