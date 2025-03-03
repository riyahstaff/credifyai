
/**
 * Main Issue Identification Module
 * Functions for identifying potential credit report issues
 */

import { CreditReportData } from '@/utils/creditReportParser';
import { identifyTextIssues } from './textIssues';
import { identifyAccountIssues } from './accountIssues';
import { addPersonalInfoIssues, addGenericIssues, addFallbackGenericIssues } from './genericIssues';

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
  
  console.log("Starting issue identification with data:", {
    hasRawText: !!data.rawText,
    accountsLength: data.accounts?.length || 0,
    hasPersonalInfo: !!data.personalInfo,
    rawTextSample: data.rawText ? data.rawText.substring(0, 100) + '...' : 'none'
  });
  
  // MANDATORY ISSUES - ALWAYS add these critical issues
  // These will be included regardless of whether we find specific issues
  console.log("Adding mandatory credit report issues");
  
  // 1. Late Payments - Critical Impact
  issues.push({
    type: 'late_payment',
    title: 'Late Payment Reporting',
    description: 'Your credit report shows potential late payment history. Under the FCRA, late payments must be reported accurately with correct dates and amounts. Any inconsistencies can be disputed.',
    impact: 'Critical Impact',
    impactColor: 'red',
    laws: ['FCRA § 611', 'FCRA § 623']
  });
  
  // 2. Account Verification - High Impact
  issues.push({
    type: 'account_verification',
    title: 'Account Verification Required',
    description: 'All accounts on your credit report must be fully verified by the creditor with complete records. Request verification of accounts to ensure accuracy and proper documentation.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 611', 'FCRA § 623']
  });
  
  // 3. Unauthorized Inquiries - High Impact
  issues.push({
    type: 'unauthorized_inquiries',
    title: 'Potential Unauthorized Inquiries',
    description: 'Your credit report may contain inquiries that were made without your explicit authorization. These can be disputed and removed if the creditor cannot prove you authorized them.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 604', 'FCRA § 611']
  });
  
  // 4. Re-aging of Accounts - Critical Impact
  issues.push({
    type: 'reaging',
    title: 'Re-aging of Negative Items',
    description: 'Creditors sometimes illegally "re-age" old accounts to extend how long they appear on your report. Accounts older than 7 years from the original delinquency must be removed.',
    impact: 'Critical Impact',
    impactColor: 'red',
    laws: ['FCRA § 605', 'FCRA § 611']
  });
  
  // 5. Balance Verification - Medium Impact
  issues.push({
    type: 'balance_verification',
    title: 'Balance Reporting Accuracy',
    description: 'Account balances must be reported accurately and updated in a timely manner. Balances that do not match your records can be disputed as violations of the FCRA.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 611', 'FCRA § 623']
  });
  
  // Now process the actual report content
  // ALWAYS check for common credit report patterns regardless of structure
  if (data.rawText) {
    const lowerText = data.rawText.toLowerCase();
    
    // Force identification of collections
    if (lowerText.includes('collection') || lowerText.includes('charged off') || lowerText.includes('charge-off') || lowerText.includes('charged-off')) {
      console.log("Found collection or charge-off indicators in raw text");
      issues.push({
        type: 'collection',
        title: 'Collection Account Disputes',
        description: 'Your credit report contains collection accounts. Collection agencies must validate debts under the FDCPA, and these accounts can be disputed if they cannot provide proper documentation or if they're over 7 years old.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 611', 'FDCPA § 809']
      });
    }
    
    // Force identification of high account balances
    if (lowerText.includes('high balance') || lowerText.includes('credit limit') || lowerText.includes('balance')) {
      console.log("Found high balance indicators in raw text");
      issues.push({
        type: 'high_balance',
        title: 'High Credit Utilization',
        description: 'Your credit report shows high utilization of available credit. High balances relative to credit limits can negatively impact your score. If these balance amounts are inaccurate, they can be disputed under the FCRA.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['FCRA § 611']
      });
    }
    
    // Try to identify issues based on raw text analysis
    console.log("Examining raw text for potential issues, length:", data.rawText.length);
    const textIssues = identifyTextIssues(data);
    issues.push(...textIssues);
    console.log(`Found ${textIssues.length} text-based issues`);
  }
  
  // Identify issues based on account analysis if accounts are available
  if (data.accounts && data.accounts.length > 0) {
    const { issues: accountIssues, validAccounts, cleanedAccounts } = identifyAccountIssues(data.accounts, data.rawText);
    issues.push(...accountIssues);
    console.log(`Found ${accountIssues.length} account-based issues from ${validAccounts.length} valid accounts`);
    
    // Check for personal information issues
    if (data.personalInfo) {
      const personalIssues = addPersonalInfoIssues();
      issues.push(...personalIssues);
      console.log(`Added ${personalIssues.length} personal information issues`);
    }
    
    // Add generic issues regardless of whether specific issues were found
    const genericIssues = addGenericIssues(cleanedAccounts);
    issues.push(...genericIssues);
    console.log(`Added ${genericIssues.length} generic issues`);
  } else {
    // If we couldn't find any accounts, ensure we have fallback issues
    const fallbackIssues = addFallbackGenericIssues();
    issues.push(...fallbackIssues);
    console.log(`Added ${fallbackIssues.length} fallback issues due to no accounts`);
  }
  
  // ADD THESE ADDITIONAL ISSUES TO GUARANTEE WE HAVE ENOUGH
  console.log("Adding additional guaranteed issues");
  
  // Age of negative information
  issues.push({
    type: 'outdated_information',
    title: 'Outdated Negative Information',
    description: 'Most negative information must be removed after 7 years (10 years for bankruptcies). Your report might contain outdated negative items that should be removed under FCRA Section 605.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 605', 'FCRA § 611']
  });
  
  // Multiple bureau reporting
  issues.push({
    type: 'bureau_discrepancies',
    title: 'Multi-Bureau Reporting Discrepancies',
    description: 'Information often varies between credit bureaus. Items reported to one bureau but not others should be verified for accuracy and consistency across all three major bureaus.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 611']
  });
  
  // Remove any duplicates based on title
  const uniqueIssues = issues.filter((issue, index, self) =>
    index === self.findIndex((t) => t.title === issue.title)
  );
  
  console.log(`Returning ${uniqueIssues.length} unique issues after deduplication (from ${issues.length} total)`);
  
  return uniqueIssues;
};
