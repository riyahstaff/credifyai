
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '@/utils/creditReport/types';

export type DisputeType = {
  bureau: string;
  accountName: string;
  accountNumber: string;  // Made required to match other interfaces
  errorType: string;
  explanation: string;
  letterContent?: string; // Added to match updated DisputeData interface
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
