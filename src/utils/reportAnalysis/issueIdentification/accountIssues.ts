
/**
 * Account-based Issue Identification
 * Functions for identifying issues from credit report accounts
 */

import { CreditReportAccount } from '@/utils/creditReport/types';

// Helper functions for validating and cleaning account data
export const isValidAccountName = (name?: string): boolean => {
  if (!name) return false;
  return name.length > 2 && name !== 'Unknown Account';
};

export const cleanAccountName = (name: string): string => {
  return name.replace(/\s+/g, ' ').trim();
};

// Extract accounts from raw text when account parsing fails
export const extractAccountsFromRawText = (rawText: string): Array<{name: string, number?: string}> => {
  const accounts: Array<{name: string, number?: string}> = [];
  
  // Look for account indicators followed by possible account names
  const accountNameRegexes = [
    /CREDITOR[:\s]+([A-Z0-9 .,&-]{3,30})/gi,
    /ACCOUNT[:\s]+([A-Z0-9 .,&-]{3,30})/gi,
    /([A-Z0-9 .,&-]{5,30})[:\s]+ACCOUNT/gi,
    /([A-Z]{3,}(?:\s+[A-Z]+){0,3})[:\s]+\d{4}/gi
  ];
  
  accountNameRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      if (match[1] && match[1].length > 3) {
        accounts.push({ name: match[1].trim() });
      }
    }
  });
  
  // Look for account numbers (last 4 digits)
  const accountNumberRegex = /(?:ACCOUNT|ACCT)[.\s:#]+(?:[X*\d-]+)(\d{4})/gi;
  let numberMatch;
  while ((numberMatch = accountNumberRegex.exec(rawText)) !== null) {
    if (numberMatch[1]) {
      // Try to associate with the closest account name
      if (accounts.length > 0) {
        const lastAccount = accounts[accounts.length - 1];
        if (!lastAccount.number) {
          lastAccount.number = numberMatch[1];
        } else {
          accounts.push({ name: `Account ending in ${numberMatch[1]}`, number: numberMatch[1] });
        }
      } else {
        accounts.push({ name: `Account ending in ${numberMatch[1]}`, number: numberMatch[1] });
      }
    }
  }
  
  // If we found no accounts but have credit card related text, create a generic credit card account
  if (accounts.length === 0 && 
      (rawText.toLowerCase().includes('credit card') || 
       rawText.toLowerCase().includes('visa') || 
       rawText.toLowerCase().includes('mastercard') || 
       rawText.toLowerCase().includes('discover') || 
       rawText.toLowerCase().includes('amex'))) {
    accounts.push({ name: 'Credit Card Account' });
  }
  
  // If we found no accounts but have loan related text, create a generic loan account
  if (accounts.length === 0 && 
      (rawText.toLowerCase().includes('loan') || 
       rawText.toLowerCase().includes('mortgage') || 
       rawText.toLowerCase().includes('auto') || 
       rawText.toLowerCase().includes('vehicle') || 
       rawText.toLowerCase().includes('car'))) {
    accounts.push({ name: 'Loan Account' });
  }
  
  // Add a fallback account if nothing else was found
  if (accounts.length === 0) {
    accounts.push({ name: 'Unidentified Account' });
  }
  
  return accounts;
};

/**
 * Identify issues based on account analysis
 */
export const identifyAccountIssues = (
  accounts: CreditReportAccount[],
  rawText?: string
): {
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>;
  validAccounts: CreditReportAccount[];
  cleanedAccounts: CreditReportAccount[];
} => {
  const issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }> = [];
  
  // Filter accounts to only include those with valid names
  const validAccounts = accounts.filter(acc => isValidAccountName(acc.accountName));
  
  // If no valid accounts but we have account data, add parsing issue
  if (validAccounts.length === 0 && accounts.length > 0) {
    issues.push({
      type: 'parsing',
      title: 'Credit Report Parsing Issue',
      description: 'We encountered difficulties reading account names from your credit report. This may be due to the file format or encryption. However, we can still help you create dispute letters.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: []
    });
    
    console.log("No valid account names found. Original account names:", 
      accounts.map(acc => acc.accountName).join(", "));
    
    // Try to use raw text to extract account information
    if (rawText) {
      const extractedAccounts = extractAccountsFromRawText(rawText);
      console.log("Extracted accounts from raw text:", extractedAccounts);
      
      if (extractedAccounts.length > 0) {
        // Use the extracted accounts for issue identification
        for (const account of extractedAccounts) {
          issues.push({
            type: 'general',
            title: `Review Account Information (${account.name})`,
            description: `We found ${account.name}${account.number ? ` (Account #${account.number})` : ''} in your report. Review this account for accuracy.`,
            impact: 'Medium Impact',
            impactColor: 'yellow',
            account: {
              accountName: account.name,
              accountNumber: account.number || '',
              currentBalance: '',
              dateOpened: '',
              dateReported: '',
              paymentStatus: '',
              remarks: []
            },
            laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
          });
        }
      }
    }
  }
  
  // Clean up account names for better presentation
  const cleanedAccounts = validAccounts.map(acc => ({
    ...acc,
    accountName: cleanAccountName(acc.accountName)
  }));
  
  console.log("Cleaned account names:", cleanedAccounts.map(acc => acc.accountName).join(", "));
  
  // Check for duplicate accounts (accounts with similar names)
  const duplicateNameMap = new Map<string, CreditReportAccount[]>();
  
  cleanedAccounts.forEach(account => {
    const simplifiedName = account.accountName.toLowerCase().replace(/\s+/g, '');
    if (!duplicateNameMap.has(simplifiedName)) {
      duplicateNameMap.set(simplifiedName, []);
    }
    duplicateNameMap.get(simplifiedName)?.push(account);
  });
  
  // Add duplicate accounts as issues
  for (const [name, accounts] of duplicateNameMap.entries()) {
    if (accounts.length > 1) {
      issues.push({
        type: 'duplicate',
        title: `Duplicate Account (${accounts[0].accountName})`,
        description: `The same ${accounts[0].accountName} account appears ${accounts.length} times on your report with different account numbers. This may be inaccurate and affecting your utilization ratio.`,
        impact: 'High Impact',
        impactColor: 'orange',
        account: accounts[0],
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
      });
    }
  }
  
  // Check individual accounts for issues
  cleanedAccounts.forEach(account => {
    // Check payment status
    if (account.paymentStatus && (
      account.paymentStatus.includes('Late') || 
      account.paymentStatus.includes('Delinquent') ||
      account.paymentStatus.includes('Collection')
    )) {
      issues.push({
        type: 'payment',
        title: `Late Payment Status (${account.accountName})`,
        description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score.`,
        impact: 'Critical Impact',
        impactColor: 'red',
        account: account,
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
      });
    }
    
    // Check for negative remarks
    if (account.remarks && account.remarks.length > 0) {
      issues.push({
        type: 'remarks',
        title: `Negative Remarks (${account.accountName})`,
        description: `Your ${account.accountName} account has the following remarks: ${account.remarks.join(', ')}. These could be disputed if inaccurate.`,
        impact: 'Critical Impact',
        impactColor: 'red',
        account: account,
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // Check for high utilization
    if (typeof account.currentBalance === 'number' && 
        typeof account.creditLimit === 'number' && 
        account.creditLimit > 0 && 
        (account.currentBalance / account.creditLimit) > 0.7) {
      const utilRate = Math.round((account.currentBalance / account.creditLimit) * 100);
      issues.push({
        type: 'utilization',
        title: `High Credit Utilization (${account.accountName})`,
        description: `Your ${account.accountName} account shows ${utilRate}% utilization. High utilization can significantly impact your credit score. Any inaccuracies in balance or limit should be disputed.`,
        impact: 'High Impact',
        impactColor: 'orange',
        account: account,
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
    
    // Always suggest reviewing each account for potential inaccuracies
    issues.push({
      type: 'account_review',
      title: `Review Account Details (${account.accountName})`,
      description: `All details of your ${account.accountName} account should be carefully reviewed. Creditors often report incorrect balances, payment history, or account status.`,
      impact: 'Medium Impact',
      impactColor: 'yellow',
      account: account,
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  });
  
  return { issues, validAccounts, cleanedAccounts };
};
