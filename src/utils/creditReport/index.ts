
/**
 * Credit Report Parser Module
 * This module processes and analyzes credit reports for dispute identification
 */

// Re-export types
export * from './types';

// Re-export legal references
export * from './legalReferences';

// Re-export text extractors
export * from './extractors';

// Re-export parser functions
export * from './parser';

// Re-export dispute letter generators
export * from './disputeLetters';

// Re-export sample report loaders
export * from './sampleReports';

// Main processing function
import { processCreditReport } from './sampleReports';
export { processCreditReport };
