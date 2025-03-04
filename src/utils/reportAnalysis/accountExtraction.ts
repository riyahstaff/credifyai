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
  
  // Look for common account section headers followed by account names
  const accountHeaderPatterns = [
    /account(?:\s+name)?s?[:\s]+([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi,
    /creditor[:\s]+([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi,
    /([A-Z][A-Z\s&]+(?:BANK|FINANCE|CREDIT|LOAN|AUTO|MORTGAGE|CARD|ONE|EXPRESS|AMEX|CAPITAL|CHASE))(?:[\s,#-]+(\d[\d-]+))?/g,
    /account\s+information(?:[:\s]+)?(?:[\r\n]+)([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi
  ];

  // Common credit account providers to look for
  const commonCreditors = [
    "CARMAX AUTO FINANCE", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE", "STUDENT"
  ];
  
  // Look for accounts using each pattern
  for (const pattern of accountHeaderPatterns) {
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[1].length > 3) {
        accounts.push({
          name: match[1].trim(),
          number: match[2] ? match[2].trim() : undefined
        });
      }
    }
  }
  
  // Look for common creditors directly
  for (const creditor of commonCreditors) {
    // Find creditor name in text with potential account number following it
    const creditorRegex = new RegExp(`${creditor}(?:[\\s,#-]+(\\d[\\d-]+))?`, 'gi');
    let match;
    while ((match = creditorRegex.exec(rawText)) !== null) {
      accounts.push({
        name: creditor,
        number: match[1] ? match[1].trim() : undefined
      });
    }
  }
  
  // Look for inquiries
  const inquiryPatterns = [
    /inquir(?:y|ies)(?:[:\s]+)(?:[\r\n]+)?([A-Z][A-Z\s&]+)/gi,
    /(?:INQUIRY|INQUIRIES)(?:[:\s]+)(?:[\r\n]+)?([A-Z][A-Z\s&]+)/g
  ];
  
  for (const pattern of inquiryPatterns) {
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[1].length > 3) {
        accounts.push({
          name: `Inquiry: ${match[1].trim()}`
        });
      }
    }
  }
  
  // Look for personal information sections
  if (rawText.toLowerCase().includes('address') || 
      rawText.toLowerCase().includes('personal information') || 
      rawText.toLowerCase().includes('consumer information')) {
    accounts.push({
      name: "Personal Information"
    });
  }
  
  // Look for student loan mentions
  if (rawText.toLowerCase().includes('student loan') || 
      rawText.toLowerCase().includes('department of education') || 
      rawText.toLowerCase().includes('dept of ed')) {
    accounts.push({
      name: "Student Loan"
    });
  }
  
  // Remove duplicates based on name
  const uniqueAccounts = Array.from(
    new Map(accounts.map(item => [item.name.toUpperCase(), item])).values()
  );
  
  return uniqueAccounts;
};

/**
 * Try to find a matching real account for a parsed account based on context
 */
export const findMatchingAccount = (
  account: CreditReportAccount, 
  realAccounts: Array<{ name: string, number?: string }>
): { name: string, number?: string } | null => {
  // If account already has a valid-looking name, keep it
  if (isValidAccountName(account.accountName)) {
    return null;
  }
  
  // If we have an account number, try to match by that first
  if (account.accountNumber) {
    const matchByNumber = realAccounts.find(real => 
      real.number && real.number === account.accountNumber
    );
    
    if (matchByNumber) {
      return matchByNumber;
    }
  }
  
  // Otherwise, just return the first real account we haven't matched yet
  // This is imperfect but better than gibberish
  // In a real implementation, we would use more context like balance, dates, etc.
  if (realAccounts.length > 0) {
    return realAccounts[0];
  }
  
  return null;
};
