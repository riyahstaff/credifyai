
/**
 * Report Enhancer Module
 * Functions for enhancing and cleaning report data
 */

import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { findMatchingAccount, extractAccountsFromRawText } from './accountExtraction';
import { isValidAccountName, cleanAccountName } from './validation';

/**
 * Enhance report data by extracting real account names
 */
export const enhanceReportData = (data: CreditReportData): CreditReportData => {
  // Extract account names from raw report text if available
  let accountMatches: Array<{ name: string, number?: string }> = [];
  
  if (data.rawText) {
    accountMatches = extractAccountsFromRawText(data.rawText);
    console.log("Found account names in raw text:", accountMatches);
  }
  
  // First pass - try to enhance accounts with real names from text
  let enhancedAccounts = data.accounts.map(account => {
    // Skip accounts that already have valid names that aren't "Multiple Accounts"
    if (isValidAccountName(account.accountName) && 
        account.accountName !== "Multiple Accounts" && 
        account.accountName !== "Unknown Account" &&
        !account.accountName.includes("obj") &&
        !account.accountName.includes("stream")) {
      return account;
    }
    
    // Try to find a real account name that might match this account's context
    if (accountMatches.length > 0) {
      const potentialMatch = findMatchingAccount(account, accountMatches);
      
      if (potentialMatch) {
        return {
          ...account,
          accountName: potentialMatch.name,
          accountNumber: potentialMatch.number || account.accountNumber
        };
      }
      
      // If we couldn't match this account but have real accounts available,
      // use the first unused real account name as a fallback
      if (accountMatches[0]) {
        return {
          ...account,
          accountName: accountMatches[0].name,
          accountNumber: accountMatches[0].number || account.accountNumber
        };
      }
    }
    
    // Clean the existing account name as a last resort
    const cleanedName = cleanAccountName(account.accountName);
    return {
      ...account,
      accountName: cleanedName || "Credit Account" // Never return empty string
    };
  });
  
  // Replace any remaining "Multiple Accounts" with generic account names
  enhancedAccounts = enhancedAccounts.map((account, index) => {
    if (account.accountName === "Multiple Accounts" || account.accountName === "Unknown Account") {
      // Use account type if available, or a generic name with index
      const accountType = account.accountType || "Credit Account";
      return {
        ...account,
        accountName: `${accountType} #${index + 1}`
      };
    }
    return account;
  });
  
  return {
    ...data,
    accounts: enhancedAccounts
  };
};

// Ensure we're properly exporting these functions
export { extractAccountsFromRawText } from './accountExtraction';
export { isValidAccountName, cleanAccountName } from './validation';
