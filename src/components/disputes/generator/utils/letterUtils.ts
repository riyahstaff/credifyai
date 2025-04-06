
import { CreditReportData, Issue } from '@/utils/creditReport/types';

/**
 * Process dispute data to prepare for letter generation
 * @param creditReportData Credit report data
 * @param issues Issues detected in credit report
 * @returns Processed dispute data
 */
export function processDisputeData(
  creditReportData: CreditReportData,
  issues: Issue[]
): any {
  // Group issues by account
  const issuesByAccount: Record<string, Issue[]> = {};
  
  for (const issue of issues) {
    const accountKey = issue.accountName || 'general';
    
    if (!issuesByAccount[accountKey]) {
      issuesByAccount[accountKey] = [];
    }
    
    issuesByAccount[accountKey].push(issue);
  }
  
  // Extract personal info
  const personalInfo = creditReportData.personalInfo || {};
  
  // Format dispute data
  return {
    personalInfo,
    issuesByAccount,
    issueCount: issues.length,
    bureau: issues[0]?.bureau || creditReportData.primaryBureau,
    reportNumber: creditReportData.reportNumber,
    reportDate: creditReportData.reportDate,
    accounts: creditReportData.accounts,
    inquiries: creditReportData.inquiries
  };
}

/**
 * Format account information for dispute letters
 * @param account Account information
 * @returns Formatted account information
 */
export function formatAccountInfo(account: any): string {
  if (!account) return '';
  
  const lines = [];
  
  if (account.accountName) {
    lines.push(`Account Name: ${account.accountName.toUpperCase()}`);
  }
  
  if (account.accountNumber) {
    // Mask account number for security
    const maskedNumber = account.accountNumber.length > 4 
      ? `xxxx-xxxx-${account.accountNumber.slice(-4)}`
      : account.accountNumber;
    lines.push(`Account Number: ${maskedNumber}`);
  }
  
  if (account.accountType) {
    lines.push(`Account Type: ${account.accountType}`);
  }
  
  if (account.balance || account.currentBalance) {
    lines.push(`Current Balance: $${account.balance || account.currentBalance}`);
  }
  
  if (account.openDate || account.dateOpened) {
    lines.push(`Date Opened: ${account.openDate || account.dateOpened}`);
  }
  
  return lines.join('\n');
}

/**
 * Format issue description for dispute letters
 * @param issue Issue information
 * @returns Formatted issue description
 */
export function formatIssueDescription(issue: Issue): string {
  let description = issue.description || '';
  
  if (issue.reason) {
    description += `\nReason: ${issue.reason}`;
  }
  
  if (issue.legalBasis) {
    description += `\nLegal Basis: ${Array.isArray(issue.legalBasis) ? issue.legalBasis.join(', ') : issue.legalBasis}`;
  }
  
  return description;
}
