
/**
 * Dispute Letters Module
 * Main entry point for dispute letter generation functionality
 */

// Export letter generation functionality
export * from './letterGenerator';

// Export any additional dispute letter utilities
export * from './sampleLanguage';
export * from './samples';
export * from './fallbackTemplates/accountLetter';
export * from './fallbackTemplates/inquiryLetter';

// Add missing exports needed by other parts of the application
export { generateEnhancedDisputeLetter } from './generator';
export { generateDisputeLetterForDiscrepancy } from './generator';
