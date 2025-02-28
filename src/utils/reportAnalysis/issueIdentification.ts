
/**
 * Issue Identification Module
 * Functions for identifying potential credit report issues
 */

import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';
import { isValidAccountName, cleanAccountName } from './validation';
import { extractAccountsFromRawText } from './accountExtraction';

/**
 * Identify potential issues in the credit report
 */
export const identifyIssues = (data: CreditReportData): Array<{
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
}> => {
  const issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }> = [];
  
  // Even if we don't have valid accounts, check for raw text and try to identify potential issues
  if (data.rawText) {
    console.log("Examining raw text for potential issues, length:", data.rawText.length);
    
    // Look for inquiries in raw text
    if (data.rawText.toLowerCase().includes('inquiry') || data.rawText.toLowerCase().includes('inquiries')) {
      issues.push({
        type: 'inquiry',
        title: 'Credit Inquiries Detected',
        description: 'Your report contains credit inquiries. These may be affecting your score and should be reviewed for accuracy and authorization.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 604 (Permissible purposes of consumer reports)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
    
    // Look for late payments in raw text
    if (data.rawText.toLowerCase().includes('late') || 
        data.rawText.toLowerCase().includes('30 day') || 
        data.rawText.toLowerCase().includes('60 day') || 
        data.rawText.toLowerCase().includes('90 day') ||
        data.rawText.toLowerCase().includes('delinquent')) {
      issues.push({
        type: 'payment',
        title: 'Late Payment Records Detected',
        description: 'Your report appears to contain late payment information. These negative items have a significant impact on your score and should be verified for accuracy.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
    
    // Look for multiple addresses
    if ((data.rawText.toLowerCase().match(/address/g) || []).length > 1) {
      issues.push({
        type: 'address',
        title: 'Multiple Addresses Detected',
        description: 'Your report appears to list multiple addresses. Outdated or inaccurate address information should be removed to maintain accurate records.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // Look for potential name variations or misspellings
    if (data.rawText.toLowerCase().includes('also known as') || 
        data.rawText.toLowerCase().includes('aka') ||
        data.rawText.toLowerCase().includes('aliases')) {
      issues.push({
        type: 'name',
        title: 'Name Variations Detected',
        description: 'Your report appears to contain multiple name variations or possible spelling errors. These should be corrected to maintain accurate records.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // Look for student loans
    if (data.rawText.toLowerCase().includes('student loan') || 
        data.rawText.toLowerCase().includes('dept of ed') || 
        data.rawText.toLowerCase().includes('department of education') ||
        data.rawText.toLowerCase().includes('navient') ||
        data.rawText.toLowerCase().includes('nelnet') ||
        data.rawText.toLowerCase().includes('great lakes') ||
        data.rawText.toLowerCase().includes('sallie mae')) {
      issues.push({
        type: 'student_loan',
        title: 'Student Loan Accounts Detected',
        description: 'Your report contains student loan accounts. Recent Department of Education changes may affect how these loans should be reported. These should be reviewed for compliance with current guidelines.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'Department of Education Guidelines']
      });
    }
    
    // Look for collections
    if (data.rawText.toLowerCase().includes('collection') || 
        data.rawText.toLowerCase().includes('collections')) {
      issues.push({
        type: 'collection',
        title: 'Collection Accounts Detected',
        description: 'Your report appears to contain collection accounts. These have a significant negative impact on your score and should be verified for accuracy and proper reporting.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
  }
  
  // Filter accounts to only include those with valid names
  const validAccounts = data.accounts.filter(acc => isValidAccountName(acc.accountName));
  
  if (validAccounts.length === 0 && data.accounts.length > 0) {
    // If we have accounts but none with valid names, add a notice about parsing issues
    issues.push({
      type: 'parsing',
      title: 'Credit Report Parsing Issue',
      description: 'We encountered difficulties reading account names from your credit report. This may be due to the file format or encryption. However, we can still help you create dispute letters.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: []
    });
    
    console.log("No valid account names found. Original account names:", 
      data.accounts.map(acc => acc.accountName).join(", "));
    
    // Try to use raw text to extract account information
    if (data.rawText) {
      const extractedAccounts = extractAccountsFromRawText(data.rawText);
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
              balance: '',
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
    
    // If we still couldn't find valid accounts but we found issues, don't add a generic issue
    if (issues.length > 1) {
      return issues;
    }
    
    // If we couldn't find any accounts or issues, add generic dispute opportunities
    issues.push({
      type: 'generic',
      title: 'Generic Credit Report Review',
      description: 'Even though we could not identify specific accounts in your report, we can create dispute letters addressing common credit reporting issues. We can help with inquiries, personal information, and more.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    return issues;
  }
  
  // Clean up account names for better presentation
  const cleanedAccounts = validAccounts.map(acc => ({
    ...acc,
    accountName: cleanAccountName(acc.accountName)
  }));
  
  console.log("Cleaned account names:", cleanedAccounts.map(acc => acc.accountName).join(", "));
  
  // Check for duplicate accounts (accounts with similar names)
  const accountNames = cleanedAccounts.map(acc => acc.accountName.toLowerCase());
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
  
  // Check for accounts with late payments or negative remarks
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
  
  // Check for personal information issues
  if (data.personalInfo) {
    issues.push({
      type: 'personal_info',
      title: 'Personal Information Review',
      description: 'Your personal information should be verified for accuracy, including name spelling, current and previous addresses, and employment information.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
    });
  }
  
  // If no issues found, add generic issues
  if (issues.length === 0) {
    // Add a few generic issues that are likely to apply to any credit report
    issues.push({
      type: 'inquiry',
      title: 'Credit Inquiries Review',
      description: 'All inquiries on your credit report should be reviewed to ensure they were authorized by you. Unauthorized inquiries can be disputed and removed.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 604 (Permissible purposes of consumer reports)']
    });
    
    issues.push({
      type: 'bureau_comparison',
      title: 'Cross-Bureau Data Comparison',
      description: 'Information often varies between credit bureaus. Accounts, balances, and status should be consistent across all three major bureaus.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    if (cleanedAccounts.length > 0) {
      const randomAccount = cleanedAccounts[Math.floor(Math.random() * cleanedAccounts.length)];
      issues.push({
        type: 'general',
        title: `Review Account Information (${randomAccount.accountName})`,
        description: `No obvious errors were detected, but you should carefully review your ${randomAccount.accountName} account details for accuracy.`,
        impact: 'Medium Impact',
        impactColor: 'yellow',
        account: randomAccount,
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
  }
  
  return issues;
};
