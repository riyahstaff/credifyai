
/**
 * Dispute Letters Module
 * Exports all dispute letter functionality
 */

// Re-export the letter generators
export * from './generator';

// Export sample letter functions with explicit naming
import { getSampleDisputeLanguage as getSampleDisputeLanguageOrig, findSampleDispute } from './samples';
export { findSampleDispute };
export { getSampleDisputeLanguage as getSampleDisputeLetterTemplate } from './samples';

// Export fallback templates
export * from './fallbackTemplates';

// Export sample language and phrases
export * from './sampleLanguage';

// Export utility types
export * from './types';
