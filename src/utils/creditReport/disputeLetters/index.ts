
/**
 * Dispute Letters Module
 * Main entry point for dispute letter generation functionality
 */

// Export letter generation functionality
export * from './letterGenerator';

// Export any additional dispute letter utilities
export { getSampleDisputeLanguage } from './sampleLanguage';
export * from './samples';
export * from './fallbackTemplates/accountLetter';
export * from './fallbackTemplates/inquiryLetter';

// Export from generator directly to fix the missing exports
export { generateEnhancedDisputeLetter, generateDisputeLetterForDiscrepancy } from './generator';
