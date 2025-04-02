/**
 * Account Extraction Module
 * Enhanced functions for extracting account information from raw text data
 */

import { CreditReportAccount } from '@/utils/creditReport/types';
import { isValidAccountName, cleanAccountName } from './validation';

/**
 * Extract account names and numbers from raw text
 */
export const extractAccountsFromRawText = (rawText: string): Array<{ name: string, number?: string, type?: string, balance?: string, status?: string }> => {
  const accounts: Array<{ name: string, number?: string, type?: string, balance?: string, status?: string }> = [];
  
  if (!rawText || rawText.length < 100) {
    console.warn("Text content too short for account extraction");
    return accounts;
  }
  
  console.log("Extracting accounts from raw text, length:", rawText.length);
  
  // Normalize the text for better extraction
  const normalizedText = rawText.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  
  // Enhanced detection patterns for finding real account/creditor names
  const accountHeaderPatterns = [
    // Look for explicit account/creditor labels
    /(?:account|creditor|lender)(?:\s+name)?s?[:\s]+([A-Z][A-Z0-9\s&',.-]{2,30})(?:[\s,#-]+(\d[\d-]+|[x*]+\d+))?/gi,
    
    // Common account format with account number - expanded
    /([A-Z][A-Z0-9\s&',.-]{2,30}(?:BANK|FINANCE|CREDIT|LOAN|AUTO|MORTGAGE|CARD|ONE|EXPRESS|AMEX|CAPITAL|CHASE|CITI))(?:[\s,#-]+(\d[\d-]+|[x*]+\d+))?/g,
    
    // Account sections with indented or structured format
    /account\s+information(?:[:\s]+)?(?:[\r\n]+\s*)([A-Z][A-Z0-9\s&',.-]{2,30})(?:[\s,#-]+(\d[\d-]+|[x*]+\d+))?/gi,
    
    // Names immediately after account type indicators - expanded
    /(?:credit card|auto loan|personal loan|mortgage|student loan|retail|collection|charge[ -]off)[:\s]+([A-Z][A-Z0-9\s&',.-]{2,30})/gi,
    
    // Common formatting in credit reports - expanded to include masked numbers
    /([A-Z][A-Z0-9\s&',.-]{2,30})\s+(?:account|loan|card)\s+(?:#|number|no\.?)[:\s]*([x*\d-]+\d{1,4})/gi,
    
    // Try to find account numbers with their creditors
    /(?:Account #|Acct:?|Acct #|Account Number:?|Account:)\s*[#:]?\s*([x*\d-]+\d{1,4})[\s\r\n]*(?:([A-Z][A-Z0-9\s&',.-]{2,30}))?/gi,
    
    // Look for creditor names near "tradeline"
    /tradeline(?:[^\n]{0,30})?(?:[\r\n]+\s*)?([A-Z][A-Z0-9\s&',.-]{2,30})/gi,
    
    // Look for creditor names in collection sections
    /(?:collection|collections)(?:[^\n]{0,30})?(?:[\r\n]+\s*)?([A-Z][A-Z0-9\s&',.-]{2,30})/gi,
    
    // Look for charge-offs
    /(?:charge[ -]off|charged[ -]off)(?:[^\n]{0,30})?(?:[\r\n]+\s*)?([A-Z][A-Z0-9\s&',.-]{2,30})/gi
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
    "KEYBANK", "CALIBER", "FREEDOM", "ONEMAIN", "UPGRADE", "MARINER"
  ];
  
  // Collection agencies that commonly appear
  const collectionAgencies = [
    "PORTFOLIO RECOVERY", "MIDLAND", "ENHANCED RECOVERY", "ERC", "LVNV", 
    "CONVERGENT", "CREDIT COLLECTION SERVICES", "CCS", "CBE GROUP", "IC SYSTEM", 
    "NATIONWIDE RECOVERY", "NCB", "PHOENIX FINANCIAL", "RADIUS", "RECEIVABLES PERFORMANCE",
    "TRANSWORLD", "TSI", "ALLIED INTERSTATE", "AFNI", "ASSET ACCEPTANCE",
    "CAVALRY", "CLIENT SERVICES", "DYNAMIC RECOVERY", "FIRST NATIONAL COLLECTION",
    "GC SERVICES", "HUNTER WARFIELD", "MRS ASSOCIATES", "NATIONWIDE CREDIT",
    "NORTHLAND GROUP", "PALISADES", "PENN CREDIT", "PROFESSIONAL BUREAU",
    "PROFESSIONAL RECOVERY", "RGS FINANCIAL", "UNITED COLLECTION BUREAU",
    "VERIBANC", "WAKEFIELD", "DIVERSIFIED CONSULTANTS"
  ];
  
  // Look for accounts using each pattern
  for (const pattern of accountHeaderPatterns) {
    let match;
    // Using while loop with exec() for global regex matching
    while ((match = pattern.exec(normalizedText)) !== null) {
      if (match[1] && match[1].trim().length > 3) {
        // Clean the account name to remove common artifacts
        const cleanedName = cleanAccountName(match[1].trim());
        
        if (isValidAccountName(cleanedName)) {
          // Try to extract account type, balance and status from nearby text
          const accountPosition = match.index;
          const contextWindow = normalizedText.substring(
            Math.max(0, accountPosition - 100), 
            Math.min(normalizedText.length, accountPosition + 300)
          );
          
          // Extract account type
          let accountType = '';
          const typeMatch = contextWindow.match(/type:?\s*([A-Za-z\s]+)(?:$|[,.\n])/i);
          if (typeMatch && typeMatch[1]) {
            accountType = typeMatch[1].trim();
          }
          
          // Extract balance
          let balance = '';
          const balanceMatch = contextWindow.match(/(?:balance|amount):?\s*[$]?(\d[\d,.]+)/i);
          if (balanceMatch && balanceMatch[1]) {
            balance = balanceMatch[1].trim();
          }
          
          // Extract status
          let status = '';
          const statusMatch = contextWindow.match(/(?:status|condition):?\s*([A-Za-z\s]+)(?:$|[,.\n])/i);
          if (statusMatch && statusMatch[1]) {
            status = statusMatch[1].trim();
          }
          
          accounts.push({
            name: cleanedName,
            number: match[2] ? match[2].trim() : undefined,
            type: accountType || undefined,
            balance: balance || undefined,
            status: status || undefined
          });
        }
      }
    }
  }
  
  // Direct search for known creditors by name
  const searchForKnownCreditors = (creditorList: string[]) => {
    for (const creditor of creditorList) {
      // Find creditor name in text, being careful to match whole words
      const creditorRegex = new RegExp(`\\b${creditor}\\b(?:[\\s,#-]+(\\d[\\d-]+|[x*]+\\d+))?`, 'gi');
      let match;
      while ((match = creditorRegex.exec(normalizedText)) !== null) {
        // Check if this creditor is already added
        if (!accounts.some(a => a.name === creditor)) {
          accounts.push({
            name: creditor,
            number: match[1] ? match[1].trim() : undefined
          });
        }
      }
    }
  };
  
  // Search for known creditors
  searchForKnownCreditors(commonCreditors);
  
  // Also search for collection agencies
  searchForKnownCreditors(collectionAgencies);
  
  // Look for student loan mentions with more specific patterns
  if (normalizedText.toLowerCase().includes('student loan') || 
      normalizedText.toLowerCase().includes('department of education') || 
      normalizedText.toLowerCase().includes('dept of ed') ||
      normalizedText.toLowerCase().includes('navient') ||
      normalizedText.toLowerCase().includes('nelnet') ||
      normalizedText.toLowerCase().includes('great lakes') ||
      normalizedText.toLowerCase().includes('fedloan')) {
    
    // Look for specific student loan servicers
    const studentLoanProviders = [
      "DEPARTMENT OF EDUCATION", "DEPT OF ED", "NAVIENT", "NELNET", 
      "GREAT LAKES", "FEDLOAN", "MOHELA", "AIDVANTAGE", "OSLA", "ECSI"
    ];
    
    searchForKnownCreditors(studentLoanProviders);
    
    // If no specific provider found but student loans mentioned
    if (!accounts.some(a => studentLoanProviders.includes(a.name))) {
      accounts.push({
        name: "STUDENT LOAN SERVICER",
        type: "Student Loan"
      });
    }
  }
  
  // Search for common account types
  const accountTypes = [
    { type: "Credit Card", keywords: ["credit card", "mastercard", "visa", "amex", "discover", "card"] },
    { type: "Auto Loan", keywords: ["auto loan", "car loan", "vehicle loan", "automobile"] },
    { type: "Mortgage", keywords: ["mortgage", "home loan", "heloc", "home equity"] },
    { type: "Personal Loan", keywords: ["personal loan", "signature loan", "unsecured loan"] },
    { type: "Student Loan", keywords: ["student loan", "education loan", "sallie mae"] },
    { type: "Collection", keywords: ["collection", "collections", "charged off", "charge off", "charged-off", "charge-off"] }
  ];
  
  // Try to determine account types for accounts that don't have one
  for (const account of accounts) {
    if (!account.type) {
      // Create a context window around account name mentions
      const nameRegex = new RegExp(`\\b${account.name}\\b`, 'gi');
      let match;
      while ((match = nameRegex.exec(normalizedText)) !== null) {
        const contextWindow = normalizedText.substring(
          Math.max(0, match.index! - 100), 
          Math.min(normalizedText.length, match.index! + account.name.length + 500)
        );
        
        // Check context for account type keywords
        for (const { type, keywords } of accountTypes) {
          if (keywords.some(keyword => contextWindow.toLowerCase().includes(keyword))) {
            account.type = type;
            break;
          }
        }
        
        if (account.type) break; // Stop looking once we find a type
      }
    }
  }
  
  // Remove duplicates based on name (case insensitive)
  const uniqueAccounts = Array.from(
    new Map(accounts.map(item => [item.name.toUpperCase(), item])).values()
  );
  
  console.log(`Found ${uniqueAccounts.length} unique accounts from raw text`);
  return uniqueAccounts;
};

/**
 * Try to find a matching real account for a parsed account based on context
 */
export const findMatchingAccount = (
  account: CreditReportAccount, 
  realAccounts: Array<{ name: string, number?: string, type?: string, balance?: string, status?: string }>
): { name: string, number?: string, type?: string, balance?: string, status?: string } | null => {
  // If account already has a valid-looking name that's not "Multiple Accounts", keep it
  if (isValidAccountName(account.accountName) && 
      account.accountName !== "Multiple Accounts" && 
      account.accountName !== "Unknown Account") {
    return null;
  }
  
  // If we have an account number, try to match by that first
  if (account.accountNumber) {
    const matchByNumber = realAccounts.find(real => 
      real.number && account.accountNumber && 
      (real.number.includes(account.accountNumber.slice(-4)) || account.accountNumber.includes(real.number.slice(-4)))
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
    
    // Match by account type if available
    if (realAccount.type && account.accountType && 
        realAccount.type.toUpperCase() === account.accountType.toUpperCase()) {
      return realAccount;
    }
    
    // Match by balance if available (approximate match)
    if (realAccount.balance && account.currentBalance) {
      const realBalance = parseFloat(realAccount.balance.replace(/[,$]/g, ''));
      const accountBalance = typeof account.currentBalance === 'number' ? 
        account.currentBalance : 
        parseFloat(String(account.currentBalance).replace(/[,$]/g, ''));
      
      if (!isNaN(realBalance) && !isNaN(accountBalance) && 
          Math.abs(realBalance - accountBalance) < 10) {
        return realAccount;
      }
    }
  }
  
  // If no match found, return the first available real account
  if (realAccounts.length > 0) {
    return realAccounts[0];
  }
  
  return null;
};

/**
 * Extract detailed account information from text around an account
 */
export const extractDetailedAccountInfo = (accountName: string, rawText: string): Partial<CreditReportAccount> => {
  const details: Partial<CreditReportAccount> = {};
  
  if (!rawText || !accountName) return details;
  
  // Find all instances of the account name in the text
  const nameRegex = new RegExp(`\\b${accountName}\\b`, 'gi');
  const matches = [...rawText.matchAll(nameRegex)];
  
  if (matches.length === 0) return details;
  
  // Extract from the largest context window (300 chars before, 500 after)
  let largestContextWindow = '';
  for (const match of matches) {
    const startPos = Math.max(0, match.index! - 300);
    const endPos = Math.min(rawText.length, match.index! + accountName.length + 500);
    const contextWindow = rawText.substring(startPos, endPos);
    
    if (contextWindow.length > largestContextWindow.length) {
      largestContextWindow = contextWindow;
    }
  }
  
  // Extract account details from context window
  const accountNumberMatch = largestContextWindow.match(/(?:Account|Acct)(?:.{0,20})(?:#|Number|No):?\s*([*xX\d-]{5,19})/i);
  if (accountNumberMatch) {
    details.accountNumber = accountNumberMatch[1].trim();
  }
  
  const balanceMatch = largestContextWindow.match(/(?:Balance|Amount):?\s*\$?(\d[\d,.]+)/i);
  if (balanceMatch) {
    details.currentBalance = parseFloat(balanceMatch[1].replace(/[,$]/g, ''));
  }
  
  const limitMatch = largestContextWindow.match(/(?:Limit|Credit Limit|High Credit):?\s*\$?(\d[\d,.]+)/i);
  if (limitMatch) {
    details.creditLimit = parseFloat(limitMatch[1].replace(/[,$]/g, ''));
  }
  
  const openDateMatch = largestContextWindow.match(/(?:Open|Opened|Date Opened):?\s*(\d{1,2}\/\d{1,2}\/\d{2,4}|\w{3}\s+\d{4})/i);
  if (openDateMatch) {
    details.dateOpened = openDateMatch[1].trim();
  }
  
  const statusMatch = largestContextWindow.match(/(?:Status|Account Status):?\s*([A-Za-z\s]+)(?:$|[,.\n])/i);
  if (statusMatch) {
    details.status = statusMatch[1].trim();
  }
  
  const paymentStatusMatch = largestContextWindow.match(/(?:Payment Status|Pay Status):?\s*([A-Za-z\s\d]+)(?:$|[,.\n])/i);
  if (paymentStatusMatch) {
    details.paymentStatus = paymentStatusMatch[1].trim();
  }
  
  const typeMatch = largestContextWindow.match(/(?:Type|Account Type):?\s*([A-Za-z\s]+)(?:$|[,.\n])/i);
  if (typeMatch) {
    details.accountType = typeMatch[1].trim();
  }
  
  // Check for negative indicators
  const isNegative = /(?:late|past due|charge.?off|collection|delinquent|derogatory)/i.test(largestContextWindow);
  if (isNegative) {
    details.isNegative = true;
  }
  
  return details;
};
