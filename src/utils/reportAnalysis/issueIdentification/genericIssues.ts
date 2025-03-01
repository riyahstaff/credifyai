
/**
 * Generic Issue Identification
 * Functions for identifying generic credit report issues
 */

import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';

/**
 * Add personal information issues
 */
export const addPersonalInfoIssues = (): Array<{
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  laws: string[];
}> => {
  return [{
    type: 'personal_info',
    title: 'Personal Information Review',
    description: 'Your personal information should be verified for accuracy, including name spelling, current and previous addresses, and employment information.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
  }];
};

/**
 * Add generic issues when no specific issues are found
 */
export const addGenericIssues = (
  cleanedAccounts: CreditReportAccount[]
): Array<{
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
  
  return issues;
};

/**
 * Add fallback generic issues when no accounts could be found or parsed
 */
export const addFallbackGenericIssues = (): Array<{
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  laws: string[];
}> => {
  return [{
    type: 'generic',
    title: 'Generic Credit Report Review',
    description: 'Even though we could not identify specific accounts in your report, we can create dispute letters addressing common credit reporting issues. We can help with inquiries, personal information, and more.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
  }];
};
