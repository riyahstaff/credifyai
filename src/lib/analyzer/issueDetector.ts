
import { CreditReportData, Issue } from '@/utils/creditReport/types';

/**
 * The issue detector module analyzes credit report data to detect issues
 */
class IssueDetector {
  /**
   * Detect issues in a credit report
   * @param creditReportData Credit report data to analyze
   * @returns Array of detected issues
   */
  detectIssues(creditReportData: CreditReportData): Issue[] {
    const issues: Issue[] = [];
    
    // Process accounts
    if (creditReportData.accounts?.length > 0) {
      for (const account of creditReportData.accounts) {
        this.detectAccountIssues(account, issues);
      }
    }
    
    // Process inquiries
    if (creditReportData.inquiries?.length > 0) {
      for (const inquiry of creditReportData.inquiries) {
        this.detectInquiryIssues(inquiry, issues);
      }
    }
    
    // Process personal information
    if (creditReportData.personalInfo) {
      this.detectPersonalInfoIssues(creditReportData.personalInfo, issues);
    }
    
    return issues;
  }
  
  /**
   * Detect issues with an account
   * @param account Account to analyze
   * @param issues Array to add detected issues to
   */
  private detectAccountIssues(account: any, issues: Issue[]): void {
    const bureau = account.bureau || 'unknown';
    
    // Check for late payments
    if (account.paymentStatus?.toLowerCase().includes('late') || 
        account.remarks?.some((remark: string) => remark.toLowerCase().includes('late'))) {
      issues.push({
        id: `late_payment_${account.accountNumber}_${Date.now()}`,
        type: 'late_payment',
        description: `Late payment reported on account ${account.accountName}`,
        bureau,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        severity: 'high',
        reason: 'Payment was made on time but incorrectly reported as late'
      });
    }
    
    // Check for collection accounts
    if (account.accountType?.toLowerCase().includes('collection') || 
        account.accountName?.toLowerCase().includes('collection')) {
      issues.push({
        id: `collection_${account.accountNumber}_${Date.now()}`,
        type: 'collection_account',
        description: `Collection account reported: ${account.accountName}`,
        bureau,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        severity: 'high',
        reason: 'This collection account may be inaccurate or unverifiable'
      });
    }
    
    // Additional checks can be added here
  }
  
  /**
   * Detect issues with an inquiry
   * @param inquiry Inquiry to analyze
   * @param issues Array to add detected issues to
   */
  private detectInquiryIssues(inquiry: any, issues: Issue[]): void {
    const bureau = inquiry.bureau || 'unknown';
    const inquiryName = inquiry.creditor || inquiry.inquiryBy || inquiry.inquiryName || 'Unknown Inquiry';
    
    // Check for hard inquiries
    if (inquiry.type?.toLowerCase() === 'hard' || !inquiry.type) {
      issues.push({
        id: `inquiry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: 'inquiry',
        description: `Hard inquiry from ${inquiryName} on ${inquiry.inquiryDate || 'unknown date'}`,
        bureau,
        accountName: inquiryName,
        date: inquiry.inquiryDate,
        severity: 'medium',
        reason: 'This inquiry was not authorized'
      });
    }
  }
  
  /**
   * Detect issues with personal information
   * @param personalInfo Personal information to analyze
   * @param issues Array to add detected issues to
   */
  private detectPersonalInfoIssues(personalInfo: any, issues: Issue[]): void {
    // Check for multiple addresses if present
    if (personalInfo.addresses && personalInfo.addresses.length > 1) {
      issues.push({
        id: `personal_info_addresses_${Date.now()}`,
        type: 'personal_information',
        description: `Multiple addresses reported on your credit report`,
        bureau: 'all',
        severity: 'medium',
        reason: 'Some of these addresses may be inaccurate or outdated'
      });
    }
    
    // Check for multiple names if present
    if (personalInfo.names && personalInfo.names.length > 1) {
      issues.push({
        id: `personal_info_names_${Date.now()}`,
        type: 'personal_information',
        description: `Multiple names or variations reported on your credit report`,
        bureau: 'all',
        severity: 'medium',
        reason: 'Some of these name variations may be inaccurate or related to identity issues'
      });
    }
  }
}

// Export singleton instance
export const issueDetector = new IssueDetector();
