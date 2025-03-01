
/**
 * Dispute letters module index
 * Re-exports all functionality for the dispute letters feature
 */

// Re-export types
export * from '../types'; // Import SampleDisputeLetter from parent types
export * from './types'; // Import other dispute-specific types

// Re-export letter generator
export { generateDisputeLetterForDiscrepancy } from './letterGenerator';

// Re-export sample language utilities
export { getSampleDisputeLanguage, getSuccessfulDisputePhrases } from './sampleLanguage';

// Re-export sample letter functions
export { findSampleDispute } from './sampleDisputes';
export { loadSampleDisputeLetters } from './sampleLettersLoader';

// Re-export utility functions
export { 
  determineDisputeTypeFromFileName, 
  determineBureauFromFileName, 
  extractKeyComponentsFromLetter 
} from './utils';

// Re-export fallback templates
export * from './fallbackTemplates';
