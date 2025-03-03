
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
  
  // Check for common credit report patterns regardless of structure
  if (data.rawText) {
    const lowerText = data.rawText.toLowerCase();
    
    // Force identification of common issues based on raw text patterns
    if (lowerText.includes('late') || lowerText.includes('past due') || lowerText.includes('delinquent')) {
      console.log("Found late payment indicators in raw text");
      issues.push({
        type: 'late_payment',
        title: 'Late Payment Reporting',
        description: 'Your credit report shows late payment history. Under the FCRA, late payments can be disputed if they are inaccurately reported or the creditor cannot verify the exact delinquency.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 611', 'FCRA § 623']
      });
    }
    
    if (lowerText.includes('collection') || lowerText.includes('charged off')) {
      console.log("Found collection or charge-off indicators in raw text");
      issues.push({
        type: 'collection',
        title: 'Collection Account',
        description: 'Your credit report contains collection accounts. Collection agencies must validate debts under the FDCPA, and these accounts can be disputed if they cannot provide proper documentation.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 611', 'FDCPA § 809']
      });
    }
    
    if (lowerText.includes('inquir')) {
      console.log("Found inquiries in raw text");
      issues.push({
        type: 'inquiry',
        title: 'Unauthorized Hard Inquiries',
        description: 'Hard inquiries on your credit report can negatively impact your score. If you did not authorize these inquiries, they can be disputed under the FCRA.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['FCRA § 604', 'FCRA § 611']
      });
    }
  }
  
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
    const fallbackIssues = addFallbackGenericIssues();
    issues.push(...fallbackIssues);
    console.log(`Added ${fallbackIssues.length} fallback generic issues due to no raw text`);
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
    if (issues.length < 5) {
      const fallbackIssues = addFallbackGenericIssues();
      issues.push(...fallbackIssues);
      console.log(`Added ${fallbackIssues.length} fallback issues due to no accounts`);
    }
  }
  
  // CRITICAL: Always ensure we have at least some issues to present
  // This ensures we never have 0 issues returned
  if (issues.length === 0 || issues.length < 3) {
    console.log("Insufficient issues identified, adding mandatory fallback issues");
    
    // Always add FCRA verification rights
    issues.push({
      type: 'fcra',
      title: 'FCRA Verification Rights',
      description: 'Under the Fair Credit Reporting Act, you have the right to dispute any information in your credit report, even if it appears accurate.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    // Always add Multi-Bureau Reporting Discrepancies
    issues.push({
      type: 'credit_bureaus',
      title: 'Multi-Bureau Reporting Discrepancies',
      description: 'Information often varies between credit bureaus. Items reported to one bureau but not others should be verified for accuracy.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    // Always add Inquiry Disputes
    issues.push({
      type: 'inquiry',
      title: 'Potential Unauthorized Inquiries',
      description: 'Inquiries on your credit report can lower your score. Any inquiry you did not authorize can be disputed as a violation of the FCRA.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 604 (Permissible purposes of consumer reports)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    // Always add Account Verification
    issues.push({
      type: 'verification',
      title: 'Account Verification Request',
      description: 'You can request verification of all accounts on your credit report. Creditors must fully verify account details or remove them.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
    });
    
    // Always add General Credit Report Review
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
