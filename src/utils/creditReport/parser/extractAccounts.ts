
/**
 * Credit Report Parser - Account Extractor
 * This module handles extracting account information from credit reports
 */
import { CreditReportAccount } from '../types';

/**
 * Extract account information from credit report content
 */
export const extractAccounts = (content: string, bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }) => {
  const accounts: CreditReportAccount[] = [];
  
  // Look for sections that might contain account information
  const accountSectionPatterns = [
    /(?:Accounts|Trade(?:lines)?|Credit\s+Accounts)(?:(?:\s+Information)|(?:\s+History)|(?:\s+Summary))?[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i,
    /(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts)[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts|Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  let accountSections: string[] = [];
  
  for (const pattern of accountSectionPatterns) {
    // Make sure to use a global flag for matchAll
    const matches = content.match(pattern);
    if (matches && matches[1]) {
      accountSections.push(matches[1]);
    }
  }
  
  // If we didn't find any account sections using the patterns, try looking for account-specific keywords
  if (accountSections.length === 0) {
    const accountKeywords = [
      "Account Number", "Date Opened", "Payment Status", "Account Status",
      "High Credit", "Credit Limit", "Balance", "Monthly Payment", "Past Due",
      "Payment History", "Date of Last Payment", "Current Status"
    ];
    
    const potentialAccountSections = content.split(/\n\s*\n/);
    for (const section of potentialAccountSections) {
      if (section.length > 100 && accountKeywords.some(keyword => section.includes(keyword))) {
        accountSections.push(section);
      }
    }
  }
  
  console.log(`Found ${accountSections.length} potential account sections`);
  
  // Process each account section to extract account information
  for (const section of accountSections) {
    const extractedAccounts = extractAccountsFromSection(section, bureaus);
    accounts.push(...extractedAccounts);
  }
  
  // If we didn't find any accounts using our detailed extraction, try a very basic approach
  if (accounts.length === 0) {
    const fallbackAccounts = extractFallbackAccounts(content, bureaus);
    accounts.push(...fallbackAccounts);
  }
  
  return accounts;
};

/**
 * Extract accounts from a section of text
 */
const extractAccountsFromSection = (
  section: string, 
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
): CreditReportAccount[] => {
  const accounts: CreditReportAccount[] = [];
  
  // Split the section into potential account blocks
  const accountBlocks = section.split(/\n\s*\n/);
  
  for (const block of accountBlocks) {
    // Skip very short blocks that are unlikely to contain account information
    if (block.length < 50) continue;
    
    const account: CreditReportAccount = {
      accountName: "Unknown Account", // Default value to be overridden
      remarks: []
    };
    
    // Try to extract account name
    const accountNamePatterns = [
      /(?:Creditor|Subscriber|Company|Bank|Account\s+Name):\s*([^\n\r]+)/i,
      /^([A-Z][A-Z0-9\s&.,'-]+)(?:\r?\n|\s{2,})/i,
      /([A-Z][A-Z0-9\s&.,'-]{2,}(?:BANK|CARD|AUTO|LOAN|MORTGAGE|FINANCE|CREDIT|FUND|HOME|SERVICES))/i
    ];
    
    for (const pattern of accountNamePatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim() && match[1].length > 3) {
        account.accountName = match[1].trim();
        break;
      }
    }
    
    // Try to extract account number
    const accountNumberPatterns = [
      /(?:Account|Loan|Card)\s+(?:#|Number|No\.?):?\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i,
      /(?:Account|Loan|Card)(?:\s+(?:#|Number|No\.?))?:?\s*([0-9X*]{4,})/i,
      /(?:#|Number|No\.?):?\s*([0-9X*]{4,})/i
    ];
    
    for (const pattern of accountNumberPatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.accountNumber = match[1].trim();
        break;
      }
    }
    
    // Try to extract account type
    const accountTypePatterns = [
      /(?:Account\s+Type|Loan\s+Type|Type\s+of\s+Loan|Type\s+of\s+Account):\s*([^\n\r]+)/i,
      /Type:\s*([^\n\r]+)/i
    ];
    
    for (const pattern of accountTypePatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.accountType = match[1].trim();
        break;
      }
    }
    
    // Try to extract current balance
    const balancePatterns = [
      /(?:Current\s+Balance|Balance|Balance\s+Amount|Current\s+Amount):\s*\$?([\d,.]+)/i,
      /(?:Balance|Amount):\s*\$?([\d,.]+)/i,
      /Balance(?:\s+as\s+of|\s+Date|\s+Amount)?:\s*\$?([\d,.]+)/i
    ];
    
    for (const pattern of balancePatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.currentBalance = `$${match[1].trim()}`;
        account.balance = `$${match[1].trim()}`; // Set both for compatibility
        break;
      }
    }
    
    // Try to extract payment status
    const paymentStatusPatterns = [
      /(?:Payment\s+Status|Status|Account\s+Status):\s*([^\n\r]+)/i,
      /Status:\s*([^\n\r]+)/i
    ];
    
    for (const pattern of paymentStatusPatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.paymentStatus = match[1].trim();
        break;
      }
    }
    
    // Try to extract date opened
    const dateOpenedPatterns = [
      /(?:Date\s+Opened|Opened\s+Date|Open\s+Date|Account\s+Opened\s+Date):\s*([^\n\r]+)/i,
      /Opened:\s*([^\n\r]+)/i,
      /Opened\s+(?:on|in|since):\s*([^\n\r]+)/i
    ];
    
    for (const pattern of dateOpenedPatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.dateOpened = match[1].trim();
        break;
      }
    }
    
    // Try to extract date reported
    const dateReportedPatterns = [
      /(?:Date\s+Reported|Reported\s+Date|Last\s+Reported|Last\s+Updated|Report\s+Date):\s*([^\n\r]+)/i,
      /Reported:\s*([^\n\r]+)/i,
      /(?:Last|Recent)\s+Report(?:ed)?:\s*([^\n\r]+)/i
    ];
    
    for (const pattern of dateReportedPatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.dateReported = match[1].trim();
        break;
      }
    }
    
    // Try to extract remarks
    const remarksPatterns = [
      /(?:Remarks|Comments|Notes|Comment):\s*([^\n\r]+)/i,
      /(?:Dispute|Disputed\s+Information):\s*([^\n\r]+)/i
    ];
    
    for (const pattern of remarksPatterns) {
      const match = block.match(pattern);
      if (match && match[1]?.trim()) {
        account.remarks?.push(match[1].trim());
      }
    }
    
    // Check if we have enough information to consider this a valid account
    if (account.accountName !== "Unknown Account" && 
        (account.accountNumber || account.accountType || account.currentBalance || account.paymentStatus)) {
      // Determine which bureau this account is from based on surrounding text
      if (block.toLowerCase().includes('experian')) {
        account.bureau = 'Experian';
      } else if (block.toLowerCase().includes('equifax')) {
        account.bureau = 'Equifax';
      } else if (block.toLowerCase().includes('transunion')) {
        account.bureau = 'TransUnion';
      } else if (bureaus.experian && !bureaus.equifax && !bureaus.transunion) {
        account.bureau = 'Experian';
      } else if (!bureaus.experian && bureaus.equifax && !bureaus.transunion) {
        account.bureau = 'Equifax';
      } else if (!bureaus.experian && !bureaus.equifax && bureaus.transunion) {
        account.bureau = 'TransUnion';
      }
      
      accounts.push(account);
    }
  }
  
  return accounts;
};

/**
 * Extract accounts using fallback methods when detailed extraction fails
 */
const extractFallbackAccounts = (
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
