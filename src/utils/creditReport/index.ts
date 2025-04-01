
/**
 * Credit Report Module
 * Main entry point for credit report processing utilities
 */
import { parseReportContent, parseReportFile } from './parser/parseReportContent';
import { extractAccounts } from './parser/accounts';
import { extractTextFromPDF } from './extractors/pdfExtractor';
import { convertReportToHtml } from './formatters';

// Export types
export type {
  CreditReportData,
  CreditReportAccount,
  CreditReportInquiry,
  CreditReportPublicRecord
} from './types';

// Export the extractPersonalInfo functionality directly to avoid ambiguity
import { extractPersonalInfo as extractInfo } from './parser/extractPersonalInfo';
export { extractInfo as extractPersonalInfo };

// Export main functionality
export {
  parseReportContent,
  parseReportFile,
  extractAccounts,
  extractTextFromPDF,
  convertReportToHtml
};

// Re-export utilities and dispute letters
export * from './helpers';
export * from './disputeLetters';
