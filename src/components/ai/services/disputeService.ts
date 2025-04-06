
// This is just a barrel file that re-exports from the new modular structure
import { 
  generateDisputeLetterForDiscrepancy,
  getSampleDisputeLanguage,
  generateEnhancedDisputeLetter
} from '@/utils/creditReport/disputeLetters';

// Export adjusted manual generator that returns a Promise
import { generateManualDisputeLetter as originalGenerateManualDisputeLetter } from './disputes/manualLetterGenerator';

// Export the auto generator
export { generateAutomaticDisputeLetter } from './disputes/automaticLetterGenerator';

// Re-export everything else from disputes
export * from './disputes';

// Export updated manual generator function with async signature
export const generateManualDisputeLetter = originalGenerateManualDisputeLetter;

// Re-export utilities for sample language
export const getSampleDisputeLanguage_export = getSampleDisputeLanguage;

// Re-export the enhanced dispute letter generator with the correct name
export { generateEnhancedDisputeLetter };
