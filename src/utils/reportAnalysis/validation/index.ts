
/**
 * Validation Module
 * Main entry point that re-exports all validation functionality
 */

// Re-export validation functions with explicit naming to avoid conflicts
import { isValidAccountName as isValidAccountNameBase } from './accountNameValidator';
import { isValidAccountName as isAccountNameValid, cleanAccountName } from './accountNameCleaner';

// Export the cleaner version as the default implementation
export const isValidAccountName = isAccountNameValid;

// Export both implementations with specific names for when different validation is needed
export { 
  isValidAccountNameBase as isBaseAccountNameValid,
  isAccountNameValid,
  cleanAccountName
};
