
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
      
      // Replace gibberish account names with real ones if we can match by context
      const enhancedAccounts = data.accounts.map(account => {
        // Try to find a real account name that might match this account's context
        const potentialMatch = findMatchingAccount(account, accountMatches);
        
        if (potentialMatch) {
          return {
            ...account,
            accountName: potentialMatch.name,
            accountNumber: potentialMatch.number || account.accountNumber
          };
        }
        
        return account;
      });
      
      return {
        ...data,
        accounts: enhancedAccounts
      };
    }
  }
  
  return data;
};

// Re-export extractAccountsFromRawText from accountExtraction
export { extractAccountsFromRawText } from './accountExtraction';
