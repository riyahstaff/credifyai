
/**
 * Generic Issue Identification
 * Functions for identifying generic credit report issues
 */

import { CreditReportAccount } from '@/utils/creditReportParser';

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
  },
  {
    type: 'personal_info_addresses',
    title: 'Address History Verification',
    description: 'Credit reports often contain outdated or incorrect address information. Ensure all addresses listed are accurate and belong to you.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
  },
  {
    type: 'personal_info_employers',
    title: 'Employment Information Review',
    description: 'Employment information on credit reports is frequently outdated or incorrect. Verify all listed employers are accurate.',
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
  
  // Always add these generic issues that apply to any credit report
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
  
  issues.push({
    type: 'public_records',
    title: 'Public Records Verification',
    description: 'Any public records on your credit report should be verified for accuracy, completeness, and timeliness. Many public records contain errors or are reported beyond the legal time limit.',
    impact: 'Critical Impact',
    impactColor: 'red',
    laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
  });
  
  issues.push({
    type: 'reporting_timeframes',
    title: 'Reporting Timeframe Compliance',
    description: 'Negative information can only be reported for specific timeframes under the FCRA. Verify that all negative items are within legal reporting periods.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
  });
  
  // Add account-specific issues if we have accounts
  if (cleanedAccounts.length > 0) {
    // Add issues for multiple accounts if available
    const accountCount = Math.min(cleanedAccounts.length, 3);
    for (let i = 0; i < accountCount; i++) {
      const account = cleanedAccounts[i];
      issues.push({
        type: 'account_verification',
        title: `Verify Account Information (${account.accountName})`,
        description: `Request verification of all information related to your ${account.accountName} account, including payment history, balances, and account status.`,
        impact: 'High Impact',
        impactColor: 'orange',
        account: account,
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
      });
    }
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
  return [
    {
      type: 'generic',
      title: 'Credit Report Accuracy Review',
      description: 'Under FCRA §611, you have the right to dispute any information in your credit report. This letter requests verification of all credit data for accuracy and completeness.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    },
    {
      type: 'inquiry_verification',
      title: 'Hard Inquiry Verification',
      description: 'All hard inquiries on your credit report must be authorized by you. This letter disputes any inquiries that may have been made without proper authorization.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 604 (Permissible purposes of consumer reports)']
    },
    {
      type: 'account_verification',
      title: 'Account Information Verification',
      description: 'This letter disputes potential inaccuracies in account information, including balances, payment history, and account status across all reported accounts.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
    },
    {
      type: 'personal_info',
      title: 'Personal Information Verification',
      description: 'Personal information on your credit report must be accurate. This letter disputes any potential errors in your reported name, addresses, employment, or other personal details.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
    },
    {
      type: 'credit_age',
      title: 'Account Age Verification',
      description: 'The age of your credit accounts significantly impacts your score. This letter disputes any inaccuracies in account opening dates that may be affecting your credit history length.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
    }
  ];
};
