
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
  
  // Even if we don't have valid accounts, check for raw text and try to identify potential issues
  if (data.rawText) {
    console.log("Examining raw text for potential issues, length:", data.rawText.length);
    
    // Identify issues based on raw text analysis
    const textIssues = identifyTextIssues(data);
    issues.push(...textIssues);
  }
  
  // Identify issues based on account analysis
  const { issues: accountIssues, validAccounts, cleanedAccounts } = identifyAccountIssues(data.accounts, data.rawText);
  issues.push(...accountIssues);
  
  // If we have no valid accounts and no issues found from raw text extraction,
  // add a generic fallback issue
  if (validAccounts.length === 0 && issues.length <= 1) {
    // If we still couldn't find any accounts or issues, add generic dispute opportunities
    issues.push(...addFallbackGenericIssues());
    return issues;
  }
  
  // Check for personal information issues
  if (data.personalInfo) {
    issues.push(...addPersonalInfoIssues());
  }
  
  // If no issues found, add generic issues
  if (issues.length === 0) {
    issues.push(...addGenericIssues(cleanedAccounts));
  }
  
  return issues;
};
