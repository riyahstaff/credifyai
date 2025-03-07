
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
  if (data.rawText) {
    const accountMatches = extractAccountsFromRawText(data.rawText);
    
    if (accountMatches.length > 0) {
      console.log("Found account names in raw text:", accountMatches);
      
      // Replace generic or invalid account names with real ones
      const enhancedAccounts = data.accounts.map(account => {
        // Skip accounts that already have valid names
        if (isValidAccountName(account.accountName) && 
            account.accountName !== "Multiple Accounts" && 
            account.accountName !== "Unknown Account" &&
            !account.accountName.includes("obj") &&
            !account.accountName.includes("stream")) {
          return account;
        }
        
        // Try to find a real account name that might match this account's context
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
        if (accountMatches.length > 0) {
          return {
            ...account,
            accountName: accountMatches[0].name,
            accountNumber: accountMatches[0].number || account.accountNumber
          };
        }
        
        // Clean the existing account name as a last resort
        return {
          ...account,
          accountName: cleanAccountName(account.accountName)
        };
      });
      
      return {
        ...data,
        accounts: enhancedAccounts
      };
    }
  }
  
  // Even if we didn't find real account names, clean up any obviously bad ones
  const cleanedAccounts = data.accounts.map(account => {
    if (account.accountName === "Multiple Accounts" || 
        account.accountName === "Unknown Account" ||
        account.accountName.includes("obj") ||
        account.accountName.includes("stream")) {
      return {
        ...account,
        accountName: cleanAccountName(account.accountName) || "Credit Account"
      };
    }
    return account;
  });
  
  return {
    ...data,
    accounts: cleanedAccounts
  };
};

// Re-export extractAccountsFromRawText from accountExtraction
export { extractAccountsFromRawText } from './accountExtraction';
