
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

// Advanced account extraction using multiple parsing strategies
function extractAccounts(text: string): Account[] {
  console.log("Extracting accounts using advanced parsing strategies");
  
  const accounts: Account[] = [];
  const accountSections = [];
  
  // Strategy 1: Look for structured account blocks
  const structuredAccountPattern = /(?:ACCOUNT[\s:]+([^\n]{1,50})[\s\S]{1,800}?(?=ACCOUNT|$))/gi;
  let match;
  while ((match = structuredAccountPattern.exec(text)) !== null) {
    accountSections.push(match[0]);
  }
  
  // Strategy 2: Look for creditor/furnisher blocks
  const creditorPattern = /(?:CREDITOR|FURNISHER|COMPANY)[\s:]+([^\n]{1,50})[\s\S]{1,600}?(?=CREDITOR|FURNISHER|COMPANY|ACCOUNT|$)/gi;
  while ((match = creditorPattern.exec(text)) !== null) {
    accountSections.push(match[0]);
  }
  
  // Strategy 3: Look for payment history blocks (common in credit reports)
  const paymentPattern = /([A-Z\s&'\.]{3,40})[\s]*(?:PAYMENT HISTORY|TRADELINE|ACCOUNT HISTORY)[\s\S]{1,500}?(?=[A-Z\s&'\.]{3,40}[\s]*(?:PAYMENT HISTORY|TRADELINE|ACCOUNT HISTORY)|$)/gi;
  while ((match = paymentPattern.exec(text)) !== null) {
    accountSections.push(match[0]);
  }
  
  // Strategy 4: Look for lines with company names followed by account details
  const companyAccountPattern = /([A-Z\s&'\.]{3,50})\s*\n[\s\S]{1,400}?(?:ACCOUNT|BALANCE|PAYMENT|STATUS|LIMIT)/gi;
  while ((match = companyAccountPattern.exec(text)) !== null) {
    accountSections.push(match[0]);
  }
  
  console.log(`Found ${accountSections.length} potential account sections using advanced parsing`);
  
  // Process each potential account section
  for (const section of accountSections) {
    const account = extractAccountFromSection(section);
    if (account && account.accountName !== "Unknown Account") {
      // Check for duplicates
      const isDuplicate = accounts.some(existing => 
        existing.accountName === account.accountName && 
        existing.accountNumber === account.accountNumber
      );
      
      if (!isDuplicate) {
        accounts.push(account);
        console.log(`Successfully extracted account: ${account.accountName}`);
      }
    }
  }
  
  // If we still have few accounts, try line-by-line parsing for company names
  if (accounts.length < 3) {
    console.log("Running fallback line-by-line account extraction");
    const fallbackAccounts = extractAccountsFromLines(text);
    fallbackAccounts.forEach(account => {
      const isDuplicate = accounts.some(existing => 
        existing.accountName === account.accountName
      );
      if (!isDuplicate) {
        accounts.push(account);
      }
    });
  }
  
  console.log(`Final account extraction result: ${accounts.length} unique accounts found`);
  return accounts;
}

// Extract account details from a specific section
function extractAccountFromSection(section: string): Account | null {
  const account: Account = {
    accountName: "Unknown Account"
  };
  
  // Advanced account name extraction - try multiple patterns
  const namePatterns = [
    /(?:CREDITOR|COMPANY|FURNISHER)[\s:]+([A-Z\s&'\.]{3,50})(?:\n|$)/i,
    /(?:ACCOUNT[\s:]+)?([A-Z\s&'\.]{3,50})(?:\s*(?:ACCOUNT|CREDIT|CARD|LOAN|MORTGAGE|BANK))/i,
    /^([A-Z\s&'\.]{3,50})(?:\s*\n.*(?:ACCOUNT|PAYMENT|BALANCE|STATUS))/im,
    /([A-Z\s&'\.]{3,50})(?:\s+(?:VISA|MASTERCARD|AMEX|DISCOVER|CREDIT|CARD))/i
  ];
  
  for (const pattern of namePatterns) {
    const match = section.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      account.accountName = cleanAccountName(match[1].trim());
      break;
    }
  }
  
  // Enhanced account number extraction
  const accountNumberPatterns = [
    /(?:ACCOUNT[\s#:]*(?:NUMBER|NO|NUM)?[\s:]*)((?:[*X]{4,})?(\d{4,}))/i,
    /(?:ACCT[\s#:]*(?:NUMBER|NO|NUM)?[\s:]*)((?:[*X]{4,})?(\d{4,}))/i,
    /(?:CARD[\s#:]*(?:NUMBER|NO|NUM)?[\s:]*)((?:[*X]{4,})?(\d{4,}))/i
  ];
  
  for (const pattern of accountNumberPatterns) {
    const match = section.match(pattern);
    if (match && match[1]) {
      const accountNum = match[1].trim();
      if (accountNum.length >= 4) {
        // Format account number safely
        const lastFour = accountNum.slice(-4);
        account.accountNumber = `****${lastFour}`;
        break;
      }
    }
  }
  
  // Extract balance with currency symbols
  const balancePatterns = [
    /(?:BALANCE|AMOUNT|LIMIT|DEBT)[\s:]*\$?([\d,]+(?:\.\d{2})?)/i,
    /\$\s*([\d,]+(?:\.\d{2})?)/,
    /(?:CURRENT|OUTSTANDING|OWED)[\s:]*\$?([\d,]+(?:\.\d{2})?)/i
  ];
  
  for (const pattern of balancePatterns) {
    const match = section.match(pattern);
    if (match && match[1]) {
      account.balance = match[1];
      break;
    }
  }
  
  // Enhanced status detection
  const statusPatterns = [
    /(?:STATUS|CONDITION)[\s:]*([A-Z\s]+?)(?:\n|$)/i,
    /(?:CURRENT|LATE|PAST\s+DUE|DELINQUENT|CLOSED|PAID|CHARGE[\s-]?OFF)/i,
    /(?:COLLECTION|DISPUTED|TRANSFERRED|SOLD)/i
  ];
  
  for (const pattern of statusPatterns) {
    const match = section.match(pattern);
    if (match && match[1]) {
      account.status = match[1].trim();
      break;
    } else if (match && match[0]) {
      account.status = match[0].trim();
      break;
    }
  }
  
  // Extract dates
  const datePatterns = [
    /(?:OPENED|OPEN[\s:]+DATE)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:REPORTED|LAST[\s:]+REPORTED)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i
  ];
  
  datePatterns.forEach(pattern => {
    const match = section.match(pattern);
    if (match && match[1]) {
      if (pattern.source.includes('OPENED')) {
        account.openDate = match[1];
      } else {
        account.lastReportedDate = match[1];
      }
    }
  });
  
  // Only return if we have at least a meaningful account name
  if (account.accountName !== "Unknown Account" && account.accountName.length > 2) {
    return account;
  }
  
  return null;
}

// Fallback: Extract accounts from individual lines
function extractAccountsFromLines(text: string): Account[] {
  const accounts: Account[] = [];
  const lines = text.split('\n');
  
  // Look for lines that might be company names
  const companyLinePattern = /^([A-Z\s&'\.]{3,50})(?:\s+(?:ACCOUNT|CREDIT|CARD|BANK|FINANCIAL|SERVICES|CORP|INC|LLC))?$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(companyLinePattern);
    
    if (match && match[1]) {
      const companyName = cleanAccountName(match[1].trim());
      
      // Look ahead in next few lines for account details
      let accountDetails = '';
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        accountDetails += lines[j] + ' ';
      }
      
      // Check if the following lines contain account-related information
      if (accountDetails.match(/(?:ACCOUNT|BALANCE|PAYMENT|STATUS|LIMIT|\$\d)/i)) {
        accounts.push({
          accountName: companyName,
          status: extractStatusFromText(accountDetails)
        });
      }
    }
  }
  
  return accounts;
}

// Clean and normalize account names
function cleanAccountName(name: string): string {
  return name.replace(/\s+/g, ' ')
             .replace(/[^\w\s&'\.]/g, '')
             .trim()
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
             .join(' ');
}

// Extract status information from text
function extractStatusFromText(text: string): string | undefined {
  const statusKeywords = ['CURRENT', 'LATE', 'PAST DUE', 'DELINQUENT', 'CLOSED', 'PAID', 'CHARGE OFF', 'COLLECTION'];
  
  for (const keyword of statusKeywords) {
    if (text.toUpperCase().includes(keyword)) {
      return keyword;
    }
  }
  
  return undefined;
}

// Advanced issue detection using sophisticated pattern recognition
export function detect_issues(text: string): CreditReportIssue[] {
  console.log("Starting advanced credit report issue detection");
  
  // Extract all accounts using enhanced parsing
  const accounts = extractAccounts(text);
  console.log(`Successfully extracted ${accounts.length} accounts for analysis`);
  
  const issues: CreditReportIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Detect which bureau(s) this report is from
  const bureauDetection = detectCreditBureaus(text);
  const defaultBureau = bureauDetection.primary || 'Unknown Bureau';
  
  console.log(`Credit bureau analysis: Primary=${bureauDetection.primary}, Secondary=${bureauDetection.secondary.join(', ')}`);
  
  // Advanced Issue Detection Strategy 1: Late Payments & Delinquencies
  const latePaymentIssues = detectLatePaymentIssues(text, accounts, defaultBureau);
  issues.push(...latePaymentIssues);
  
  // Advanced Issue Detection Strategy 2: Collection Accounts
  const collectionIssues = detectCollectionIssues(text, accounts, defaultBureau);
  issues.push(...collectionIssues);
  
  // Advanced Issue Detection Strategy 3: Charge-offs
  const chargeOffIssues = detectChargeOffIssues(text, accounts, defaultBureau);
  issues.push(...chargeOffIssues);
  
  // Advanced Issue Detection Strategy 4: Inquiries
  const inquiryIssues = detectInquiryIssues(text, accounts, defaultBureau);
  issues.push(...inquiryIssues);
  
  // Advanced Issue Detection Strategy 5: Account Inaccuracies
  const inaccuracyIssues = detectAccountInaccuracies(text, accounts, defaultBureau);
  issues.push(...inaccuracyIssues);
  
  // Advanced Issue Detection Strategy 6: Identity/Personal Info Issues
  const identityIssues = detectIdentityIssues(text, defaultBureau);
  issues.push(...identityIssues);
  
  console.log(`Issue detection complete: Found ${issues.length} total issues`);
  
  // If we found very few issues despite having accounts, add verification requests
  if (issues.length < 2 && accounts.length > 0) {
    console.log("Adding verification issues for thorough dispute coverage");
    issues.push({
      type: 'account_verification',
      description: 'Request complete verification of all reported accounts under FCRA Section 611',
      bureau: defaultBureau,
      accounts: accounts.slice(0, 5) // Verify up to 5 accounts
    });
  }
  
  // Ensure we always have at least one issue to dispute
  if (issues.length === 0) {
    console.log("No specific issues found - creating general dispute request");
    issues.push({
      type: 'general',
      description: 'Request verification of all information on credit report',
      bureau: defaultBureau,
      accounts: accounts.length > 0 ? accounts.slice(0, 3) : [{
        accountName: 'All Credit Report Information',
        status: 'Requires complete verification'
      }]
    });
  }
  
  return issues;
}

// Detect which credit bureau(s) the report is from
function detectCreditBureaus(text: string): { primary: string | null, secondary: string[] } {
  const lowerText = text.toLowerCase();
  const detected = [];
  
  if (lowerText.includes('experian')) detected.push('Experian');
  if (lowerText.includes('equifax')) detected.push('Equifax');
  if (lowerText.includes('transunion') || lowerText.includes('trans union')) detected.push('TransUnion');
  
  return {
    primary: detected[0] || null,
    secondary: detected.slice(1)
  };
}

// Sophisticated late payment detection
function detectLatePaymentIssues(text: string, accounts: Account[], bureau: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Multiple patterns for detecting late payments
  const latePatterns = [
    /late[\s]*payment/gi,
    /past[\s]*due/gi,
    /delinquent/gi,
    /30[\s]*day/gi,
    /60[\s]*day/gi,
    /90[\s]*day/gi,
    /120[\s]*day/gi,
    /\b[1-9]\d*[\s]*days?[\s]*late/gi
  ];
  
  let hasLatePayments = false;
  for (const pattern of latePatterns) {
    if (pattern.test(text)) {
      hasLatePayments = true;
      break;
    }
  }
  
  if (hasLatePayments) {
    // Find specific accounts with late payment indicators
    const affectedAccounts = accounts.filter(account => {
      const accountData = JSON.stringify(account).toLowerCase();
      return latePatterns.some(pattern => pattern.test(accountData));
    });
    
    if (affectedAccounts.length > 0) {
      issues.push({
        type: 'late_payment',
        description: `Late payment history reported - ${affectedAccounts.length} account(s) affected`,
        bureau: bureau,
        accounts: affectedAccounts
      });
      console.log(`Detected late payment issues on ${affectedAccounts.length} accounts`);
    } else {
      // Create generic late payment issue
      issues.push({
        type: 'late_payment',
        description: 'Late payment history detected in credit report',
        bureau: bureau,
        accounts: accounts.slice(0, 2) // Use first 2 accounts as examples
      });
      console.log('Detected late payment references but could not link to specific accounts');
    }
  }
  
  return issues;
}

// Sophisticated collection account detection
function detectCollectionIssues(text: string, accounts: Account[], bureau: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  
  const collectionPatterns = [
    /collection[\s]*account/gi,
    /collection[\s]*agency/gi,
    /sent[\s]*to[\s]*collection/gi,
    /placed[\s]*for[\s]*collection/gi,
    /sold[\s]*to[\s]*collection/gi,
    /transferred[\s]*to/gi
  ];
  
  let hasCollections = false;
  for (const pattern of collectionPatterns) {
    if (pattern.test(text)) {
      hasCollections = true;
      break;
    }
  }
  
  if (hasCollections) {
    // Look for collection-specific accounts
    const collectionAccounts = accounts.filter(account => {
      const accountData = JSON.stringify(account).toLowerCase();
      return collectionPatterns.some(pattern => pattern.test(accountData)) ||
             accountData.includes('collection') ||
             account.accountName.toLowerCase().includes('collection');
    });
    
    if (collectionAccounts.length > 0) {
      issues.push({
        type: 'collection',
        description: `Collection account(s) reported - ${collectionAccounts.length} found`,
        bureau: bureau,
        accounts: collectionAccounts
      });
      console.log(`Detected ${collectionAccounts.length} collection accounts`);
    }
  }
  
  return issues;
}

// Detect charge-off issues
function detectChargeOffIssues(text: string, accounts: Account[], bureau: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  
  const chargeOffPatterns = [
    /charge[\s]*off/gi,
    /charged[\s]*off/gi,
    /profit[\s]*and[\s]*loss/gi,
    /written[\s]*off/gi
  ];
  
  let hasChargeOffs = false;
  for (const pattern of chargeOffPatterns) {
    if (pattern.test(text)) {
      hasChargeOffs = true;
      break;
    }
  }
  
  if (hasChargeOffs) {
    const chargeOffAccounts = accounts.filter(account => {
      const accountData = JSON.stringify(account).toLowerCase();
      return chargeOffPatterns.some(pattern => pattern.test(accountData));
    });
    
    if (chargeOffAccounts.length > 0) {
      issues.push({
        type: 'general', // We'll treat charge-offs as general disputes for now
        description: `Charge-off status reported - ${chargeOffAccounts.length} account(s) affected`,
        bureau: bureau,
        accounts: chargeOffAccounts
      });
      console.log(`Detected ${chargeOffAccounts.length} charge-off accounts`);
    }
  }
  
  return issues;
}

// Detect inquiry issues
function detectInquiryIssues(text: string, accounts: Account[], bureau: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  
  const inquiryPatterns = [
    /credit[\s]*inquir/gi,
    /hard[\s]*inquir/gi,
    /credit[\s]*check/gi,
    /inquiry[\s]*from/gi
  ];
  
  let hasInquiries = false;
  for (const pattern of inquiryPatterns) {
    if (pattern.test(text)) {
      hasInquiries = true;
      break;
    }
  }
  
  if (hasInquiries) {
    // Try to extract specific inquiry information
    const inquiryAccounts: Account[] = [];
    
    // Enhanced inquiry extraction
    const inquiryExtractPattern = /(?:inquiry|credit[\s]*check)[\s]*(?:from|by)?[\s]*([A-Z\s&'\.]{3,40})(?:\s*(?:on|date)?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}))?/gi;
    let match;
    
    while ((match = inquiryExtractPattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 2) {
        inquiryAccounts.push({
          accountName: cleanAccountName(match[1].trim()),
          lastReportedDate: match[2] || undefined,
          status: 'Credit Inquiry'
        });
      }
    }
    
    // If no specific inquiries found, create a general inquiry issue
    if (inquiryAccounts.length === 0) {
      inquiryAccounts.push({
        accountName: 'Credit Inquiries',
        status: 'Multiple unauthorized inquiries detected'
      });
    }
    
    issues.push({
      type: 'inquiry',
      description: `Credit inquiries found - ${inquiryAccounts.length} inquiry/inquiries detected`,
      bureau: bureau,
      accounts: inquiryAccounts
    });
    console.log(`Detected ${inquiryAccounts.length} credit inquiry issues`);
  }
  
  return issues;
}

// Detect account inaccuracies and verification needs
function detectAccountInaccuracies(text: string, accounts: Account[], bureau: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  
  // Look for indicators of potential inaccuracies
  const inaccuracyIndicators = [
    /incorrect/gi,
    /inaccurate/gi,
    /not[\s]*mine/gi,
    /never[\s]*opened/gi,
    /dispute/gi,
    /error/gi,
    /wrong[\s]*balance/gi,
    /outdated/gi
  ];
  
  let hasInaccuracies = false;
  for (const indicator of inaccuracyIndicators) {
    if (indicator.test(text)) {
      hasInaccuracies = true;
      break;
    }
  }
  
  // Always request verification for accounts that lack complete information
  const incompleteAccounts = accounts.filter(account => 
    !account.balance || !account.status || !account.accountNumber || account.accountName.length < 3
  );
  
  if (hasInaccuracies || incompleteAccounts.length > 0) {
    const targetAccounts = incompleteAccounts.length > 0 ? incompleteAccounts : accounts.slice(0, 3);
    
    issues.push({
      type: 'account_verification',
      description: 'Account information requires verification and validation',
      bureau: bureau,
      accounts: targetAccounts
    });
    console.log(`Added verification request for ${targetAccounts.length} accounts`);
  }
  
  return issues;
}

// Detect identity and personal information issues
function detectIdentityIssues(text: string, bureau: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  
  const identityPatterns = [
    /wrong[\s]*name/gi,
    /incorrect[\s]*address/gi,
    /identity[\s]*theft/gi,
    /fraud/gi,
    /not[\s]*authorized/gi,
    /unknown[\s]*account/gi
  ];
  
  let hasIdentityIssues = false;
  for (const pattern of identityPatterns) {
    if (pattern.test(text)) {
      hasIdentityIssues = true;
      break;
    }
  }
  
  if (hasIdentityIssues) {
    issues.push({
      type: 'general',
      description: 'Personal information or identity-related issues detected',
      bureau: bureau,
      accounts: [{
        accountName: 'Personal Information',
        status: 'Requires verification and correction'
      }]
    });
    console.log('Detected potential identity or personal information issues');
  }
  
  return issues;
}
