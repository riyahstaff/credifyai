
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
    hasPersonalInfo: !!data.personalInfo
  });
  
  // Always identify issues based on raw text analysis first
  if (data.rawText) {
    console.log("Examining raw text for potential issues, length:", data.rawText.length);
    
    // Identify issues based on raw text analysis
    const textIssues = identifyTextIssues(data);
    issues.push(...textIssues);
    console.log(`Found ${textIssues.length} text-based issues`);
  } else {
    console.log("No raw text available for analysis");
    // If no raw text, add generic issues
    issues.push(...addFallbackGenericIssues());
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
    console.log("No accounts available for analysis, adding fallback issues");
    // If we couldn't find any accounts, ensure we have fallback issues
    if (issues.length < 3) {
      const fallbackIssues = addFallbackGenericIssues();
      issues.push(...fallbackIssues);
      console.log(`Added ${fallbackIssues.length} fallback issues due to no accounts`);
    }
  }
  
  // CRITICAL: Always ensure we have at least some issues to present
  if (issues.length === 0) {
    console.log("No issues identified through regular methods, adding mandatory fallback issues");
    issues.push({
      type: 'fcra',
      title: 'FCRA Verification Rights',
      description: 'Under the Fair Credit Reporting Act, you have the right to dispute any information in your credit report, even if it appears accurate.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    issues.push({
      type: 'credit_bureaus',
      title: 'Multi-Bureau Reporting Discrepancies',
      description: 'Information often varies between credit bureaus. Items reported to one bureau but not others should be verified for accuracy.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    issues.push({
      type: 'general',
      title: 'General Credit Report Review',
      description: 'A comprehensive review of your credit report is recommended to identify any potential errors or inaccuracies that may be affecting your credit score.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
    });
  }
  
  // Remove any duplicates based on title
  const uniqueIssues = issues.filter((issue, index, self) =>
    index === self.findIndex((t) => t.title === issue.title)
  );
  
  console.log(`Returning ${uniqueIssues.length} unique issues after deduplication (from ${issues.length} total)`);
  
  return uniqueIssues;
};
