
/**
 * Credit Report Parser - Account Extractor - Fallback Methods
 * Provides alternative methods when detailed extraction fails
 */
import { CreditReportAccount } from '../../types';

/**
 * Extract accounts using fallback methods when detailed extraction fails
 */
export const extractFallbackAccounts = (
  content: string, 
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
): CreditReportAccount[] => {
  const accounts: CreditReportAccount[] = [];
  
  // Look for common creditor names
  const commonCreditors = [
    "BANK OF AMERICA", "CHASE", "CAPITAL ONE", "DISCOVER", "AMERICAN EXPRESS", 
    "WELLS FARGO", "CITI", "US BANK", "PNC", "TD BANK", "SYNCHRONY", "BARCLAYS",
    "CREDIT ONE", "FIRST PREMIER", "GOLDMAN SACHS", "USAA", "NAVY FEDERAL",
    "CARMAX", "TOYOTA", "HONDA", "BMW", "MERCEDES", "FORD", "GM", "CHRYSLER"
  ];
  
  for (const creditor of commonCreditors) {
    if (content.includes(creditor)) {
      // Look for nearby account information
      const creditorIndex = content.indexOf(creditor);
      const surroundingText = content.substring(
        Math.max(0, creditorIndex - 100), 
        Math.min(content.length, creditorIndex + creditor.length + 300)
      );
      
      const account: CreditReportAccount = {
        accountName: creditor
      };
      
      // Try to extract an account number
      const accountNumberMatch = surroundingText.match(/(?:Account|Loan|Card)\s+(?:#|Number|No\.?):\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i);
      if (accountNumberMatch && accountNumberMatch[1]) {
        account.accountNumber = accountNumberMatch[1].trim();
      }
      
      // Try to extract a balance
      const balanceMatch = surroundingText.match(/(?:Balance|Amount):\s*\$?([\d,.]+)/i);
      if (balanceMatch && balanceMatch[1]) {
        account.currentBalance = `$${balanceMatch[1].trim()}`;
        account.balance = `$${balanceMatch[1].trim()}`; // Set both for compatibility
      }
      
      accounts.push(account);
    }
  }
  
  // If we still don't have any accounts, add generic placeholders based on detected account types
  if (accounts.length === 0) {
    const accountTypes = [
      { type: "Credit Card", regex: /credit\s+card/i },
      { type: "Mortgage", regex: /mortgage/i },
      { type: "Auto Loan", regex: /auto\s+loan/i },
      { type: "Personal Loan", regex: /personal\s+loan/i },
      { type: "Student Loan", regex: /student\s+loan/i },
      { type: "Collection", regex: /collection/i }
    ];
    
    for (const { type, regex } of accountTypes) {
      if (regex.test(content)) {
        accounts.push({
          accountName: `Generic ${type}`,
          accountType: type
        });
      }
    }
  }
  
  return accounts;
};
