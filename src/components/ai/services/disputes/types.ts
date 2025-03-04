
import { Profile } from '@/lib/supabase';
import { RecommendedDispute } from '@/utils/creditReport/types';

export type DisputeType = {
  bureau: string;
  accountName: string;
  accountNumber?: string;  // Added this property
  errorType: string;
  explanation: string;
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
