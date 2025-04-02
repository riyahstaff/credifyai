/**
 * Generic Issue Identification
 * Functions for identifying generic credit report issues
 */

import { CreditReportAccount } from '@/utils/creditReport/types';

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
  cleanedAccounts: CreditReportAccount[] = []
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
 * Add fallback generic issues when no specific issues are found
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
      type: 'fcra_rights',
      title: 'FCRA Rights Verification',
      description: 'Under the Fair Credit Reporting Act (FCRA), you have the right to dispute any information in your credit report that you believe is inaccurate or incomplete.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    },
    {
      type: 'late_payments',
      title: 'Late Payment Verification',
      description: 'Late payments on your credit report must be reported with 100% accuracy. Any discrepancies in dates, amounts, or frequency can be grounds for dispute.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 611', 'FCRA § 623']
    },
    {
      type: 'inquiries',
      title: 'Unauthorized Hard Inquiries',
      description: 'Hard inquiries on your credit report that were made without your explicit permission are violations of the FCRA and can be disputed.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 604', 'FCRA § 611']
    },
    {
      type: 'account_verification',
      title: 'Account Information Verification',
      description: 'Credit reporting agencies must verify that all account information is accurate, including balances, payment history, credit limits, and account status.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 611', 'FCRA § 623']
    },
    {
      type: 'personal_info',
      title: 'Personal Information Verification',
      description: 'Personal information on your credit report must be accurate. This includes your name, addresses, employment history, and other identifying information.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 605']
    },
    {
      type: 'outdated_information',
      title: 'Outdated Negative Information',
      description: 'Most negative information must be removed after 7 years (10 years for bankruptcies). Ensure that old negative items have been properly removed.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 605']
    },
    {
      type: 'account_ownership',
      title: 'Account Ownership Verification',
      description: 'All accounts on your credit report must be verified as belonging to you. Inaccurate reporting of accounts that are not yours should be disputed.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 611', 'FCRA § 623']
    }
  ];
};
