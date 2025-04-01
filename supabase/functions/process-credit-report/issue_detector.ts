
/**
 * Advanced issue detector for credit reports
 * Identifies potential dispute issues and extracts account information
 */

import { extractPersonalInfo } from "./personal_info_extractor.ts";

export type IssueType = 
  'late_payment' | 
  'collection' | 
  'inquiry' | 
  'account_verification' | 
  'balance_dispute' | 
  'identity_theft' | 
  'outdated_information' | 
  'general';

export interface Account {
  accountName: string;
  accountNumber?: string;
  creditor?: string;
  balance?: string;
  openDate?: string;
  status?: string;
  paymentHistory?: string;
  lastReportedDate?: string;
}

export interface CreditReportIssue {
  type: IssueType;
  description: string;
  bureau: string;
  accounts: Account[];
}

// Helper function to extract account information
function extractAccounts(text: string): Account[] {
  console.log("Extracting accounts from credit report");
  
  const accounts: Account[] = [];
  const accountSections: string[] = [];
  
  // First, try to identify account sections
  // Look for patterns that typically appear at the start of an account section
  const accountStartPatterns = [
    /(?:CREDITOR|ACCOUNT|TRADELINE)[\s:]+([A-Z0-9\s&\.,'"\-]+?)(?:\n|$)/gi,
    /(?:Account Number|Account \#|Account No|Account ID)[\s:]+([A-Z0-9\s&\.,'"\-]+?)(?:\n|$)/gi
  ];
  
  for (const pattern of accountStartPatterns) {
    let match;
    let lastIndex = 0;
    
    while ((match = pattern.exec(text)) !== null) {
      const startIndex = Math.max(0, match.index - 100); // Include some context before the match
      const endIndex = Math.min(text.length, match.index + 1000); // Include a good chunk after the match
      
      // Avoid overlapping sections
      if (startIndex > lastIndex) {
        const section = text.substring(startIndex, endIndex);
        accountSections.push(section);
        lastIndex = endIndex;
      }
    }
  }
  
  console.log(`Found ${accountSections.length} potential account sections`);
  
  // If we couldn't identify clear account sections, fall back to splitting by keywords
  if (accountSections.length < 3) {
    // Split the text into chunks around account indicators
    const chunks = text.split(/(?:ACCOUNT INFORMATION|TRADELINE|ACCOUNT HISTORY|CREDIT CARD|PERSONAL LOAN|MORTGAGE|AUTO LOAN)/i);
    
    for (let i = 1; i < chunks.length; i++) { // Skip the first chunk (usually intro text)
      if (chunks[i].length > 100) { // Only process meaningful chunks
        accountSections.push(chunks[i].substring(0, 1000)); // Limit chunk size
      }
    }
    
    console.log(`After fallback splitting, found ${accountSections.length} potential account sections`);
  }
  
  // Process each account section
  for (const section of accountSections) {
    // Skip sections that don't look like account data
    if (section.length < 100 || !section.match(/(?:ACCOUNT|BALANCE|PAYMENT|CREDIT|LOAN|MORTGAGE|CARD)/i)) {
      continue;
    }
    
    const account: Account = {
      accountName: "Unknown Account"
    };
    
    // Extract account name
    const nameMatches = section.match(/(?:CREDITOR|ACCOUNT|TRADELINE)[\s:]+([A-Z0-9\s&\.,'"\-]+?)(?:\n|$)/i) ||
                         section.match(/([A-Z0-9\s&\.,'"\-]{5,30})(?:\n|ACCOUNT|\d{4})/i);
    
    if (nameMatches && nameMatches[1]) {
      account.accountName = nameMatches[1].trim();
    }
    
    // Extract account number (last 4 digits for security)
    const accountNumMatches = section.match(/(?:Account Number|Account \#|Account No|Account ID)[\s:]+[*xX]+(\d{4})/i) ||
                             section.match(/(?:Account Number|Account \#|Account No|Account ID)[\s:]+(\d{4})/i) ||
                             section.match(/(?:Account)[\s:]+[*xX]+(\d{4})/i);
    
    if (accountNumMatches && accountNumMatches[1]) {
      account.accountNumber = `xxxx-xxxx-xxxx-${accountNumMatches[1]}`;
    }
    
    // Extract creditor name if different from account name
    const creditorMatches = section.match(/(?:Creditor|Furnisher|Reported By|Reported From)[\s:]+([A-Z0-9\s&\.,'"\-]+?)(?:\n|$)/i);
    
    if (creditorMatches && creditorMatches[1] && creditorMatches[1] !== account.accountName) {
      account.creditor = creditorMatches[1].trim();
    }
    
    // Extract balance
    const balanceMatches = section.match(/(?:Balance|Current Balance|Amount)[\s:]+\$?([\d,\.]+)/i);
    
    if (balanceMatches && balanceMatches[1]) {
      account.balance = balanceMatches[1].trim();
    }
    
    // Extract open date
    const openDateMatches = section.match(/(?:Open Date|Date Opened|Opened)[\s:]+(\w+\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4})/i);
    
    if (openDateMatches && openDateMatches[1]) {
      account.openDate = openDateMatches[1].trim();
    }
    
    // Extract account status
    const statusMatches = section.match(/(?:Status|Account Status|Current Status)[\s:]+([A-Za-z0-9\s]+?)(?:\n|$)/i);
    
    if (statusMatches && statusMatches[1]) {
      account.status = statusMatches[1].trim();
    }
    
    // Extract last reported date
    const reportedDateMatches = section.match(/(?:Last Reported|Date Reported|Updated|As Of)[\s:]+(\w+\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{2,4})/i);
    
    if (reportedDateMatches && reportedDateMatches[1]) {
      account.lastReportedDate = reportedDateMatches[1].trim();
    }
    
    // Only add accounts that have at least a name and one other piece of information
    if (account.accountName !== "Unknown Account" && 
        (account.accountNumber || account.balance || account.status || account.openDate)) {
      accounts.push(account);
      console.log(`Extracted account: ${account.accountName}`);
    }
  }
  
  return accounts;
}

// Main issue detection function
export function detect_issues(text: string): CreditReportIssue[] {
  console.log("Detecting issues in credit report");
  
  // Extract all accounts first
  const accounts = extractAccounts(text);
  console.log(`Extracted ${accounts.length} accounts from credit report`);
  
  const issues: CreditReportIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Detect which bureaus are mentioned
  const bureaus = {
    experian: lowerText.includes('experian'),
    equifax: lowerText.includes('equifax'),
    transunion: lowerText.includes('transunion')
  };
  
  let defaultBureau = 'All Bureaus';
  if (bureaus.experian) defaultBureau = 'Experian';
  else if (bureaus.equifax) defaultBureau = 'Equifax';
  else if (bureaus.transunion) defaultBureau = 'TransUnion';
  
  console.log(`Detected credit bureaus: ${Object.entries(bureaus)
    .filter(([_, present]) => present)
    .map(([bureau]) => bureau)
    .join(', ')}`);
  
  // Issue 1: Late Payments
  if (lowerText.includes('late') || 
      lowerText.includes('past due') || 
      lowerText.includes('delinquent') || 
      lowerText.includes('30 day') || 
      lowerText.includes('60 day') || 
      lowerText.includes('90 day')) {
    
    // Find accounts with late payments
    const latePaymentAccounts = accounts.filter(account => {
      const accountText = JSON.stringify(account).toLowerCase();
      return accountText.includes('late') || 
             accountText.includes('past due') || 
             accountText.includes('delinquent') ||
             accountText.includes('30 day') || 
             accountText.includes('60 day') || 
             accountText.includes('90 day');
    });
    
    if (latePaymentAccounts.length > 0) {
      issues.push({
        type: 'late_payment',
        description: 'Late payments reported on your credit report',
        bureau: defaultBureau,
        accounts: latePaymentAccounts
      });
      console.log(`Found late payment issue with ${latePaymentAccounts.length} accounts`);
    } else if (accounts.length > 0) {
      // If we detect late payments in text but couldn't link to specific accounts
      issues.push({
        type: 'late_payment',
        description: 'Late payments reported on your credit report',
        bureau: defaultBureau,
        accounts: [accounts[0]] // Use the first account as an example
      });
      console.log('Found late payment issue but could not link to specific accounts');
    }
  }
  
  // Issue 2: Collections
  if (lowerText.includes('collection') || 
      lowerText.includes('charged off') || 
      lowerText.includes('charge-off') || 
      lowerText.includes('sold to') || 
      lowerText.includes('transferred to')) {
    
    // Find collection accounts
    const collectionAccounts = accounts.filter(account => {
      const accountText = JSON.stringify(account).toLowerCase();
      return accountText.includes('collection') || 
             accountText.includes('charged off') || 
             accountText.includes('charge-off') ||
             accountText.includes('charged-off') || 
             accountText.includes('sold to') || 
             accountText.includes('transferred to');
    });
    
    if (collectionAccounts.length > 0) {
      issues.push({
        type: 'collection',
        description: 'Collection accounts found on your credit report',
        bureau: defaultBureau,
        accounts: collectionAccounts
      });
      console.log(`Found collection issue with ${collectionAccounts.length} accounts`);
    }
  }
  
  // Issue 3: Inquiries
  if (lowerText.includes('inquiry') || 
      lowerText.includes('inquiries') || 
      lowerText.includes('credit check')) {
    
    // For inquiries, we may not have full account details
    // Create simplified account objects for inquiries
    const inquiryAccounts: Account[] = [];
    
    // Try to extract inquiry information using regex
    const inquiryPattern = /(?:INQUIRY|INQUIRIES).*?((?:[A-Z][A-Za-z\s\.&'\-,]{2,30})\s+(?:\d{1,2}\/\d{1,2}\/\d{2,4}|\w+\s+\d{1,2},?\s+\d{4}))/gi;
    let match;
    
    while ((match = inquiryPattern.exec(text)) !== null) {
      // Each match might contain both the creditor name and the date
      if (match[1]) {
        const inquiryText = match[1];
        const parts = inquiryText.split(/\s+(?=\d{1,2}\/|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
        
        if (parts.length >= 1) {
          inquiryAccounts.push({
            accountName: parts[0].trim(),
            lastReportedDate: parts.length > 1 ? parts[1].trim() : undefined
          });
        }
      }
    }
    
    // If we couldn't extract specific inquiries but know they exist, create a generic entry
    if (inquiryAccounts.length === 0 && lowerText.includes('inquiry')) {
      inquiryAccounts.push({
        accountName: 'Recent Inquiries',
        status: 'Multiple inquiries detected'
      });
    }
    
    if (inquiryAccounts.length > 0) {
      issues.push({
        type: 'inquiry',
        description: 'Inquiries found on your credit report',
        bureau: defaultBureau,
        accounts: inquiryAccounts
      });
      console.log(`Found inquiry issue with ${inquiryAccounts.length} inquiries`);
    }
  }
  
  // Issue 4: Account Verification (for all accounts)
  if (accounts.length > 0) {
    issues.push({
      type: 'account_verification',
      description: 'Account verification required under FCRA',
      bureau: defaultBureau,
      accounts: accounts.slice(0, 3) // Limit to first 3 accounts to avoid too many letters
    });
    console.log('Added account verification issue');
  }
  
  // If no issues were found but we have accounts, add a generic issue
  if (issues.length === 0 && accounts.length > 0) {
    issues.push({
      type: 'general',
      description: 'Potential inaccuracies in credit report',
      bureau: defaultBureau,
      accounts: accounts.slice(0, 2) // Limit to first 2 accounts
    });
    console.log('Added generic credit report issue');
  }
  
  // If still no issues or accounts, create a fallback issue
  if (issues.length === 0) {
    issues.push({
      type: 'general',
      description: 'Potential inaccuracies in credit report',
      bureau: defaultBureau,
      accounts: [{
        accountName: 'Credit Report Accounts',
        status: 'Request full verification of all accounts'
      }]
    });
    console.log('Added fallback generic issue');
  }
  
  return issues;
}
