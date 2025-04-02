
/**
 * Issue Identification
 * Main functionality for identifying and categorizing credit report issues
 */

import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { addPersonalInfoIssues, addGenericIssues, addFallbackGenericIssues } from './genericIssues';
import { identifyAccountIssues } from './accountIssues';
import { identifyTextIssues } from './textIssues';

// Define impact types for consistency
type ImpactLevel = 'High Impact' | 'Critical Impact' | 'Medium Impact';

// Issue interface for type safety
interface Issue {
  type: string;
  title: string;
  description: string;
  impact: ImpactLevel;
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
}

/**
 * Main function to identify issues in a credit report
 */
export const identifyIssues = (reportData: CreditReportData): Issue[] => {
  try {
    console.log("Starting issue identification on credit report data");
    
    // Initialize issues array
    const issues: Issue[] = [];
    
    // Extract accounts and raw text
    const { accounts = [], rawText = '' } = reportData;
    
    // Add personal information issues
    const personalInfoIssues = addPersonalInfoIssues();
    issues.push(...personalInfoIssues);
    
    // Analyze accounts for issues
    const { issues: accountIssues, cleanedAccounts } = identifyAccountIssues(accounts, rawText);
    
    // Add account-specific issues
    issues.push(...accountIssues);
    
    // Identify issues from text content
    const textIssues = identifyTextIssues(reportData);
    issues.push(...textIssues);
    
    // Ensure we have a minimum set of issues
    if (issues.length < 5) {
      console.log("Less than 5 issues found, adding generic issues");
      
      // Add generic fallback issues
      const fallbackIssues = addFallbackGenericIssues();
      
      // Add fallback issues until we have at least 5
      for (const issue of fallbackIssues) {
        // Check if we already have a similar issue
        if (!issues.some(i => i.type === issue.type)) {
          issues.push(issue);
          if (issues.length >= 10) {
            break;
          }
        }
      }
    }
    
    // Credit repair specific issues based on keywords in the text
    addCreditRepairSpecificIssues(issues, reportData);
    
    // Return the identified issues
    return issues;
  } catch (error) {
    console.error("Error identifying issues:", error);
    
    // Return fallback issues on error
    return addFallbackGenericIssues();
  }
};

/**
 * Add credit repair specific issues based on analysis of the text
 */
function addCreditRepairSpecificIssues(issues: Issue[], reportData: CreditReportData): void {
  const rawText = reportData.rawText || '';
  
  // Check for multiple names
  if (rawText.match(/also\s+known\s+as|a\.k\.a|alias|formerly\s+known\s+as|previous\s+name/i)) {
    issues.push({
      type: 'multiple_names',
      title: 'Multiple Names on Credit Report',
      description: 'Your credit report shows multiple names or aliases. This can be a sign of identity theft or credit file mixing.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['15 USC 1681c', '15 USC 1681g']
    });
  }
  
  // Check for multiple addresses
  const addressMatches = rawText.match(/address(?:es)?(?:\s|:)+.{1,50}(?:\n|$)/gi) || [];
  if (addressMatches.length > 3) {
    issues.push({
      type: 'multiple_addresses',
      title: 'Multiple Addresses Listed',
      description: 'Your credit report shows multiple addresses. Excessive or incorrect addresses should be disputed.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['15 USC 1681c', '15 USC 1681g']
    });
  }
  
  // Check for multiple employers
  if (rawText.match(/employer(?:s)?(?:\s|:)+.{1,50}(?:\n|$)/gi)?.length > 2) {
    issues.push({
      type: 'multiple_employers',
      title: 'Multiple Employers Listed',
      description: 'Your credit report shows multiple employers. Incorrect employment information should be disputed.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['15 USC 1681c', '15 USC 1681g']
    });
  }
  
  // Check for SSN issues
  if (rawText.match(/ssn|social security number/i) && 
      rawText.match(/issue|invalid|incorrect|different|multiple/i)) {
    issues.push({
      type: 'ssn_issues',
      title: 'Social Security Number Inconsistency',
      description: 'There may be issues with your Social Security Number reporting. Incorrect SSN information is a serious issue.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['15 USC 1681c', '15 USC 1681g', '18 USC 1028a']
    });
  }
  
  // Check for late payments
  if (rawText.match(/30(?:\s|-|_)day|60(?:\s|-|_)day|90(?:\s|-|_)day|late(?:\s|-|_)payment/i)) {
    issues.push({
      type: 'late_payments',
      title: 'Late Payment Reporting Issues',
      description: 'Your report shows late payments. These must be reported with 100% accuracy, and any discrepancies can be grounds for dispute.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)']
    });
  }
  
  // Check for student loans
  if (rawText.match(/student(?:\s|-|_)loan|dept(?:\s|-|_)of(?:\s|-|_)ed|navient|sallie(?:\s|-|_)mae/i)) {
    // Check for duplicate student loans
    const studentLoanAccounts = reportData.accounts.filter(acc => 
      acc.accountName.toLowerCase().includes('student') || 
      acc.accountName.toLowerCase().includes('edu') ||
      acc.accountName.toLowerCase().includes('navient') ||
      acc.accountName.toLowerCase().includes('sallie')
    );
    
    // Check for potential duplicates (similar balances)
    const balances = new Map<string, number>();
    studentLoanAccounts.forEach(acc => {
      const balance = typeof acc.balance === 'number' ? acc.balance : 
                    typeof acc.currentBalance === 'number' ? acc.currentBalance : 0;
      
      if (balance > 0) {
        const balanceStr = balance.toString();
        balances.set(balanceStr, (balances.get(balanceStr) || 0) + 1);
      }
    });
    
    // Find duplicate balances
    let hasDuplicates = false;
    balances.forEach((count, balance) => {
      if (count > 1) hasDuplicates = true;
    });
    
    if (hasDuplicates) {
      issues.push({
        type: 'duplicate_student_loans',
        title: 'Potentially Duplicate Student Loans',
        description: 'Your report may have duplicate student loans with identical balances. This often happens when loans are sold to different servicers but not properly updated.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['15 USC 1681e(b)', '15 USC 1681s-2(a)(3)']
      });
    } else {
      issues.push({
        type: 'student_loans',
        title: 'Student Loan Verification Needed',
        description: 'Your student loans should be verified for accurate reporting, including proper status updates and compliance with current Department of Education guidelines.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['15 USC 1681e(b)', '15 USC 1681s-2(a)(3)']
      });
    }
  }
  
  // Check for bankruptcy issues
  if (rawText.match(/bankruptcy|chapter(?:\s|-|_)7|chapter(?:\s|-|_)13/i)) {
    const bankruptcyDate = rawText.match(/bankruptcy(?:.{0,30})(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:.{0,10})(\d{1,2})(?:,|\s|-)(\d{4})/i);
    
    // Check if bankruptcy is older than 10 years
    let isOld = false;
    if (bankruptcyDate && bankruptcyDate[3]) {
      const year = parseInt(bankruptcyDate[3]);
      const currentYear = new Date().getFullYear();
      if (currentYear - year > 10) {
        isOld = true;
      }
    }
    
    if (isOld) {
      issues.push({
        type: 'old_bankruptcy',
        title: 'Outdated Bankruptcy Reporting',
        description: 'Your credit report shows a bankruptcy older than 10 years. Bankruptcies must be removed after 10 years according to the FCRA.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['15 USC 1681c', '15 USC 1681i']
      });
    } else {
      issues.push({
        type: 'bankruptcy_verification',
        title: 'Bankruptcy Information Verification',
        description: 'Your bankruptcy information should be verified for accuracy, including dates, accounts included, and current status.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['15 USC 1681c', '15 USC 1681i']
      });
    }
  }
  
  // Check for old inquiries (>2 years)
  if (reportData.inquiries && reportData.inquiries.length > 0) {
    const oldInquiries = reportData.inquiries.filter(inq => {
      if (!inq.inquiryDate) return false;
      
      try {
        const inquiryDate = new Date(inq.inquiryDate);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        
        return inquiryDate < twoYearsAgo;
      } catch (e) {
        return false;
      }
    });
    
    if (oldInquiries.length > 0) {
      issues.push({
        type: 'old_inquiries',
        title: 'Outdated Inquiries (Over 2 Years)',
        description: `Your credit report contains ${oldInquiries.length} inquiries that are over 2 years old. These should be removed as they're beyond the FCRA reporting period.`,
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['15 USC 1681b(a)(2)', '15 USC 1681m']
      });
    }
  }
}

/**
 * Add default generic issues when no specific issues are found
 * This is now implemented in the genericIssues.ts file
 */
export { addFallbackGenericIssues };
