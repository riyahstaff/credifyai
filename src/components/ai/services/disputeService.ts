
// This is now just a barrel file that re-exports from the new modular structure
import { 
  generateDisputeLetterForDiscrepancy,
  getSampleDisputeLanguage as getSampleDisputeLanguageUtil 
} from '@/utils/creditReport/disputeLetters';

export * from './disputes';
