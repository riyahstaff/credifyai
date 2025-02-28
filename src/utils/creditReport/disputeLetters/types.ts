
/**
 * Types for dispute letter generation
 */
import { LegalReference } from '../types';

// Using type from parent module to avoid duplication
export interface DisputePhrasesCache {
  balanceDisputes: string[];
  latePaymentDisputes: string[];
  accountOwnershipDisputes: string[];
  closedAccountDisputes: string[];
  personalInfoDisputes: string[];
  inquiryDisputes: string[];
  general: string[];
}
