/**
 * Account Extraction Module
 * Functions for extracting account information from raw text data
 */

import { CreditReportAccount } from '@/utils/creditReportParser';
import { isValidAccountName } from './validation';

/**
 * Extract account names and numbers from raw text
 */
export const extractAccountsFromRawText = (rawText: string): Array<{ name: string, number?: string }> => {
  const accounts: Array<{ name: string, number?: string }> = [];
  
  // Look for common account sections
  const accountSectionRegexes = [
    /Accounts\s+(?:Overview|Information|Summary)[\s\S]*?((?:Account|Creditor)[\s\S]*?(?=\n\s*\n))/gi,
    /Credit\s+(?:Accounts|Cards|Lines)[\s\S]*?((?:Account|Creditor)[\s\S]*?(?=\n\s*\n))/gi,
    /(?:Open|Closed)\s+Accounts[\s\S]*?((?:Account|Creditor)[\s\S]*?(?=\n\s*\n))/gi
  ];
  
  // Common creditor names to look for
  const commonCreditors = [
    'AMEX', 'American Express', 'Bank of America', 'Capital One', 'Chase', 'Citibank', 'Discover',
    'Wells Fargo', 'USAA', 'US Bank', 'Synchrony', 'Barclays', 'TD Bank', 'HSBC', 'PNC Bank',
    'Navy Federal', 'Pentagon Federal', 'Goldman Sachs', 'Apple Card', 'Macy\'s', 'Target',
    'Walmart', 'Home Depot', 'Lowe\'s', 'Best Buy', 'Amazon', 'PayPal', 'Marcus'
  ];
  
  // Try to find account sections
  for (const regex of accountSectionRegexes) {
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      // Found an account section, try to extract account names
      const accountSection = match[1];
      const lines = accountSection.split('\n');
      
      for (const line of lines) {
        // Look for account name patterns
        const accountNameMatch = line.match(/(Account|Creditor)\s*(?:Name)?:\s*([^\n\r]+)/i) ||
                              line.match(/([A-Z][A-Za-z\s&']+(?:BANK|CREDIT|CARD|LOANS?|MORTGAGE|AUTO|FINANCIAL|FUNDING))(?:\s+#\s*\d+)?/i);
        
        if (accountNameMatch) {
          const potentialName = accountNameMatch[2] || accountNameMatch[1];
          if (isValidAccountName(potentialName)) {
            // Try to find account number on same line
            const accountNumberMatch = line.match(/#\s*(\d+)/i) || line.match(/Account\s*(?:Number|#):\s*([^\n\r]+)/i);
            accounts.push({
              name: potentialName.trim(),
              number: accountNumberMatch ? accountNumberMatch[1].trim() : undefined
            });
          }
        }
      }
    }
  }
  
  // If no account sections found, look for common creditor names throughout text
  if (accounts.length === 0) {
    for (const creditor of commonCreditors) {
      const regex = new RegExp(`\\b${creditor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'ig');
      if (regex.test(rawText)) {
        accounts.push({ name: creditor });
      }
    }
  }
  
  // Return unique accounts
  return accounts.filter((account, index, self) => 
    index === self.findIndex(a => a.name.toLowerCase() === account.name.toLowerCase())
  );
};

/**
 * Find a matching account name from extracted text
 */
export const findMatchingAccount = (
  account: CreditReportAccount, 
  extractedAccounts: Array<{ name: string, number?: string }>
): { name: string, number?: string } | undefined => {
  // If the account already has a valid name, return undefined
  if (isValidAccountName(account.accountName)) {
    return undefined;
  }
  
  // Try to find a match based on account number if available
  if (account.accountNumber) {
    const numberMatch = extractedAccounts.find(extracted => 
      extracted.number && extracted.number === account.accountNumber
    );
    if (numberMatch) return numberMatch;
  }
  
  // Otherwise return the first extracted account if any
  return extractedAccounts.length > 0 ? extractedAccounts[0] : undefined;
};
