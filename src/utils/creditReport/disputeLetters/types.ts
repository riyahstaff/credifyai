
/**
 * Types for dispute letter generation
 */
import { LegalReference } from '../types';

export interface SampleDisputeLetter {
  content: string;
  disputeType: string;
  bureau?: string;
  successfulOutcome?: boolean;
  effectiveLanguage?: string[];
  legalCitations?: string[];
}

export interface DisputePhrasesCache {
  balanceDisputes: string[];
  latePaymentDisputes: string[];
  accountOwnershipDisputes: string[];
  closedAccountDisputes: string[];
  personalInfoDisputes: string[];
  inquiryDisputes: string[];
  general: string[];
}
