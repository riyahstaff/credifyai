
import { CreditReportData } from '@/utils/creditReportParser';

export interface DisputeGenerationResult {
  success: boolean;
  disputeData?: any;
}

export interface PendingLetterState {
  hasPendingLetters: boolean;
  onContinueToLetters: () => void;
  onStartNewReport: () => void;
}
