
/**
 * Main Issue Identification Module
 * Enhanced functions for identifying potential credit report issues
 */

import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { identifyTextIssues } from './textIssues';
import { identifyAccountIssues } from './accountIssues';
import { addPersonalInfoIssues, addGenericIssues, addFallbackGenericIssues } from './genericIssues';
import { extractAccountsFromRawText, extractDetailedAccountInfo } from '../accountExtraction';

/**
 * Identify potential issues in the credit report
 */
export const identifyIssues = (data: CreditReportData): Array<{
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  account?: any;
  laws: string[];
}> => {
  const issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: any;
    laws: string[];
  }> = [];
  
  console.log("Starting enhanced issue identification with data:", {
    hasRawText: !!data.rawText,
    accountsLength: data.accounts?.length || 0,
    hasPersonalInfo: !!data.personalInfo,
    rawTextSample: data.rawText ? data.rawText.substring(0, 100) + '...' : 'none'
  });
  
  // ALWAYS add common credit report issues
  // Add basic issues, but don't replicate with too many of these
  console.log("Adding critical credit report issues based on FCRA requirements");
  
  // Only add issues that we can confirm from the data
  let addedCriticalIssues = 0;
  
  // Extract account information directly from raw text if available
  let extractedAccounts: Array<any> = [];
  if (data.rawText) {
    extractedAccounts = extractAccountsFromRawText(data.rawText);
    console.log(`Extracted ${extractedAccounts.length} accounts directly from raw text`);
  }
  
  // Look for late payment evidence in accounts
  let hasLatePayments = false;
  if (data.accounts && data.accounts.length > 0) {
    hasLatePayments = data.accounts.some(account => 
      account.paymentStatus && 
      (/late|past due|delinquent|charge.?off|collection/i.test(account.paymentStatus))
    );
  } else if (data.rawText) {
    // Check raw text for late payment indicators
    hasLatePayments = /(?:late|past due|delinquent|charge.?off|collection)\s+(?:payment|account|status)/i.test(data.rawText);
  }
  
  if (hasLatePayments) {
    issues.push({
      type: 'late_payment',
      title: 'Late Payment Reporting',
      description: 'Your credit report shows late payment history. Under the FCRA, late payments must be reported accurately with correct dates and amounts. Any inconsistencies can be disputed.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 611', 'FCRA § 623']
    });
    addedCriticalIssues++;
  }
  
  // Look for collections specifically
  let hasCollections = false;
  if (data.accounts && data.accounts.length > 0) {
    hasCollections = data.accounts.some(account => 
      (account.accountType && /collection/i.test(account.accountType)) ||
      (account.status && /collection/i.test(account.status)) ||
      (account.accountName && /(?:portfolio|midland|lvnv|recovery|collection)/i.test(account.accountName))
    );
  } else if (data.rawText) {
    // Check raw text for collection indicators
    hasCollections = /(?:collection|portfolio recovery|midland|lvnv|account.+collection|debt.+collection)/i.test(data.rawText);
  }
  
  if (hasCollections) {
    issues.push({
      type: 'collection',
      title: 'Collection Account Disputes',
      description: 'Your credit report contains collection accounts. Collection agencies must validate debts under the FDCPA, and these accounts can be disputed if they cannot provide proper documentation or if they\'re over 7 years old.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 611', 'FDCPA § 809']
    });
    addedCriticalIssues++;
  }
  
  // Check if there are inquiries
  let hasInquiries = false;
  if (data.inquiries && data.inquiries.length > 0) {
    hasInquiries = true;
  } else if (data.rawText) {
    // Check raw text for inquiry indicators
    hasInquiries = /(?:inquiry|inquiries|inquired|credit.+check)/i.test(data.rawText);
  }
  
  if (hasInquiries) {
    issues.push({
      type: 'unauthorized_inquiries',
      title: 'Potential Unauthorized Inquiries',
      description: 'Your credit report contains inquiries that may have been made without your explicit authorization. These can be disputed and removed if the creditor cannot prove you authorized them.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 604', 'FCRA § 611']
    });
    addedCriticalIssues++;
  }
  
  // Always add verification issue - this is always valid
  issues.push({
    type: 'account_verification',
    title: 'Account Verification Required',
    description: 'All accounts on your credit report must be fully verified by the creditor with complete records. Request verification of accounts to ensure accuracy and proper documentation.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 611', 'FCRA § 623']
  });
  
  // Only if we have enough critical issues already
  if (addedCriticalIssues < 2) {
    issues.push({
      type: 'reaging',
      title: 'Re-aging of Negative Items',
      description: 'Creditors sometimes illegally "re-age" old accounts to extend how long they appear on your report. Accounts older than 7 years from the original delinquency must be removed.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 605', 'FCRA § 611']
    });
  }
  
  // Look for old accounts
  let hasOldAccounts = false;
  if (data.accounts && data.accounts.length > 0) {
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);
    
    hasOldAccounts = data.accounts.some(account => {
      if (account.dateOpened) {
        try {
          const openDate = new Date(account.dateOpened);
          return openDate < sevenYearsAgo;
        } catch (e) {
          // If date parsing fails, ignore
          return false;
        }
      }
      return false;
    });
  }
  
  if (hasOldAccounts) {
    issues.push({
      type: 'old_accounts',
      title: 'Accounts Exceeding 7-Year Reporting Limit',
      description: 'Your credit report contains accounts that may be more than 7 years old. Negative information beyond the 7-year limit should be removed according to FCRA requirements.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 605', 'FCRA § 611']
    });
  }
  
  // Now process the actual report content
  // Analyze raw text for issues
  if (data.rawText) {
    const textIssues = identifyTextIssues(data);
    issues.push(...textIssues);
    console.log(`Found ${textIssues.length} text-based issues`);
  }
  
  // Identify issues based on account analysis if accounts are available
  if (data.accounts && data.accounts.length > 0) {
    try {
      const { issues: accountIssues, validAccounts, cleanedAccounts } = identifyAccountIssues(data.accounts, data.rawText);
      issues.push(...accountIssues);
      console.log(`Found ${accountIssues.length} account-based issues from ${validAccounts.length} valid accounts`);
      
      // Add generic issues for specific accounts
      const genericIssues = addGenericIssues(cleanedAccounts);
      issues.push(...genericIssues);
      console.log(`Added ${genericIssues.length} generic account-specific issues`);
    } catch (error) {
      console.error("Error identifying account issues:", error);
      
      // If we've extracted accounts directly from text, use those instead
      if (extractedAccounts.length > 0) {
        console.log("Using extracted accounts for issue identification");
        const textBasedIssues = extractedAccounts.map(account => {
          // Try to extract more details about this account
          let detailedInfo = {};
          if (data.rawText) {
            detailedInfo = extractDetailedAccountInfo(account.name, data.rawText);
          }
          
          const combinedAccount = {
            ...account,
            ...detailedInfo,
            accountName: account.name,
            isNegative: account.status?.toLowerCase().includes('late') || 
                        account.status?.toLowerCase().includes('collection') ||
                        account.type?.toLowerCase().includes('collection')
          };
          
          return {
            type: combinedAccount.isNegative ? 'negative_account' : 'account_verification',
            title: `Issue with ${account.name}`,
            description: combinedAccount.isNegative ? 
              `This account shows negative information that may be inaccurate or unverifiable.` :
              `This account requires verification of all reported information including balance, payment history, and dates.`,
            impact: combinedAccount.isNegative ? 'Critical Impact' : 'Medium Impact',
            impactColor: combinedAccount.isNegative ? 'red' : 'yellow',
            account: combinedAccount,
            laws: ['FCRA § 611', 'FCRA § 623']
          };
        });
        
        // Add up to 5 account-specific issues
        const accountIssues = textBasedIssues.slice(0, 5);
        issues.push(...accountIssues);
        console.log(`Added ${accountIssues.length} text-extracted account issues`);
      } else {
        // If we encounter an error with account analysis, add fallback issues
        const fallbackAccountIssues = addFallbackGenericIssues();
        issues.push(...fallbackAccountIssues);
        console.log(`Added ${fallbackAccountIssues.length} fallback issues due to account analysis error`);
      }
    }
  } else if (extractedAccounts.length > 0) {
    // If we have extracted accounts but no parsed accounts
    console.log("Using extracted accounts for issue identification (no parsed accounts)");
    const accountIssues = extractedAccounts.slice(0, 5).map(account => {
      // Try to extract more details
      let detailedInfo = {};
      if (data.rawText) {
        detailedInfo = extractDetailedAccountInfo(account.name, data.rawText);
      }
      
      return {
        type: 'account_verification',
        title: `Issue with ${account.name}`,
        description: `This account requires verification of all reported information.`,
        impact: 'Medium Impact',
        impactColor: 'yellow',
        account: {
          ...account,
          ...detailedInfo,
          accountName: account.name
        },
        laws: ['FCRA § 611', 'FCRA § 623']
      };
    });
    
    issues.push(...accountIssues);
    console.log(`Added ${accountIssues.length} extracted account issues`);
  } else {
    // If we couldn't find any accounts, ensure we have fallback issues
    const fallbackIssues = addFallbackGenericIssues();
    issues.push(...fallbackIssues);
    console.log(`Added ${fallbackIssues.length} fallback issues due to no accounts`);
  }
  
  // Check for personal info issues
  if (data.personalInfo) {
    const personalInfoIssues = addPersonalInfoIssues(data.personalInfo);
    issues.push(...personalInfoIssues);
    console.log(`Added ${personalInfoIssues.length} personal info issues`);
  }
  
  // Remove any duplicates based on title
  const uniqueIssues = issues.filter((issue, index, self) =>
    index === self.findIndex((t) => t.title === issue.title)
  );
  
  console.log(`Returning ${uniqueIssues.length} unique issues after deduplication (from ${issues.length} total)`);
  
  return uniqueIssues;
};
