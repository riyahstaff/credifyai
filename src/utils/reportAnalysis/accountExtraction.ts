/**
 * Account Extraction Module
 * Functions for extracting account information from raw text data
 */

import { CreditReportAccount } from '@/utils/creditReportParser';
import { isValidAccountName, cleanAccountName } from './validation';

/**
 * Extract account names and numbers from raw text
 */
export const extractAccountsFromRawText = (rawText: string): Array<{ name: string, number?: string }> => {
  const accounts: Array<{ name: string, number?: string }> = [];
  
  // Enhanced detection patterns for finding real account/creditor names
  const accountHeaderPatterns = [
    // Look for explicit account/creditor labels
    /(?:account|creditor|lender)(?:\s+name)?s?[:\s]+([A-Z][A-Z0-9\s&',.-]{2,30})(?:[\s,#-]+(\d[\d-]+))?/gi,
    
    // Common account format with account number
    /([A-Z][A-Z0-9\s&',.-]{2,30}(?:BANK|FINANCE|CREDIT|LOAN|AUTO|MORTGAGE|CARD|ONE|EXPRESS|AMEX|CAPITAL|CHASE|CITI))(?:[\s,#-]+(\d[\d-]+))?/g,
    
    // Account sections with indented or structured format
    /account\s+information(?:[:\s]+)?(?:[\r\n]+\s*)([A-Z][A-Z0-9\s&',.-]{2,30})(?:[\s,#-]+(\d[\d-]+))?/gi,
    
    // Names immediately after account type indicators
    /(?:credit card|auto loan|personal loan|mortgage|student loan)[:\s]+([A-Z][A-Z0-9\s&',.-]{2,30})/gi,
    
    // Common formatting in credit reports
    /([A-Z][A-Z0-9\s&',.-]{2,30})\s+(?:account|loan|card)\s+(?:#|number|no\.?)[:\s]*(\d[\d-]+)/gi
  ];

  // Comprehensive list of known creditors that commonly appear in credit reports
  const commonCreditors = [
    "SANTANDER", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE", "USAA", "PNC", "NAVY FEDERAL", "REGIONAL FINANCE",
    "ALLY", "TOYOTA", "HONDA", "BMW", "FORD", "MERCEDES", "CHRYSLER", "LEXUS",
    "CARMAX", "CARVANA", "DRIVETIME", "WESTLAKE", "FIFTH THIRD", "JPMCB", "JPMCB CARD",
    "US BANK", "REGIONS", "BARCLAYS", "CITIZENS", "TRUIST", "SPS", "FLAGSTAR",
    "ROCKET MORTGAGE", "QUICKEN", "LENDING CLUB", "PROSPER", "AVANT", "UPSTART",
    "SOFI", "BEST BUY", "WALMART", "KOHL'S", "MACY'S", "HOME DEPOT", "LOWES",
    "PAYPAL", "AFFIRM", "KLARNA", "AFTERPAY", "COMERICA", "M&T", "HUNTINGTON",
    "KEYBANK", "CALIBER", "FREEDOM", "ONEMAIN", "UPGRADE", "MARINER", "SANTANDER"
  ];
  
  // Look for accounts using each pattern
  for (const pattern of accountHeaderPatterns) {
    let match;
    // Using while loop with exec() for global regex matching
    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[1].trim().length > 3) {
        // Clean the account name to remove common artifacts
        const cleanedName = cleanAccountName(match[1].trim());
        
        if (isValidAccountName(cleanedName)) {
          accounts.push({
            name: cleanedName,
            number: match[2] ? match[2].trim() : undefined
          });
        }
      }
    }
  }
  
  // Direct search for known creditors by name
  for (const creditor of commonCreditors) {
    // Find creditor name in text, being careful to match whole words
    const creditorRegex = new RegExp(`\\b${creditor}\\b(?:[\\s,#-]+(\\d[\\d-]+))?`, 'gi');
    let match;
    while ((match = creditorRegex.exec(rawText)) !== null) {
      accounts.push({
        name: creditor,
        number: match[1] ? match[1].trim() : undefined
      });
    }
  }
  
  // Look for student loan mentions with more specific patterns
  if (rawText.toLowerCase().includes('student loan') || 
      rawText.toLowerCase().includes('department of education') || 
      rawText.toLowerCase().includes('dept of ed') ||
      rawText.toLowerCase().includes('navient') ||
      rawText.toLowerCase().includes('nelnet') ||
      rawText.toLowerCase().includes('great lakes') ||
      rawText.toLowerCase().includes('fedloan')) {
    
    // Look for specific student loan servicers
    const studentLoanProviders = [
      "DEPARTMENT OF EDUCATION", "DEPT OF ED", "NAVIENT", "NELNET", 
      "GREAT LAKES", "FEDLOAN", "MOHELA", "AIDVANTAGE", "OSLA", "ECSI"
    ];
    
    for (const provider of studentLoanProviders) {
      if (rawText.toUpperCase().includes(provider)) {
        accounts.push({
          name: provider
        });
      }
    }
    
    // If no specific provider found but student loans mentioned
    if (!accounts.some(a => studentLoanProviders.includes(a.name))) {
      accounts.push({
        name: "STUDENT LOAN SERVICER"
      });
    }
  }
  
  // Remove duplicates based on name (case insensitive)
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
      real.number && account.accountNumber && 
      real.number.includes(account.accountNumber.slice(-4))
    );
    
    if (matchByNumber) {
      return matchByNumber;
    }
  }
  
  // Try to match based on balance, dates, or other contextual information
  for (const realAccount of realAccounts) {
    // If account text contains parts of the real account name
    if (account.remarks && account.remarks.some(remark => 
      remark.toUpperCase().includes(realAccount.name.toUpperCase())
    )) {
      return realAccount;
    }
  }
  
  // Otherwise, just return the first real account if available
  // This is imperfect but better than gibberish
  if (realAccounts.length > 0) {
    return realAccounts[0];
  }
  
  return null;
};
