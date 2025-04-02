
import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '@/utils/creditReport/types';
import { addFallbackGenericIssues } from './genericIssues';

// FCRA Laws reference for different dispute types
const FCRA_LAWS = {
  accuracy: {
    code: "15 U.S.C. § 1681i",
    text: "You have the right to dispute inaccurate information in your credit report."
  },
  verification: {
    code: "15 U.S.C. § 1681s-2",
    text: "Credit furnishers must provide accurate information to credit bureaus and verify disputed information."
  },
  investigation: {
    code: "15 U.S.C. § 1681i(a)",
    text: "Credit bureaus must conduct a reasonable investigation of disputed information."
  }
};

/**
 * Identifies potential issues in a credit report that can be disputed
 */
export function identifyIssues(report: CreditReportData): IdentifiedIssue[] {
  if (!report) {
    console.warn("No report data provided to identify issues");
    return [];
  }

  let issues: IdentifiedIssue[] = [];

  // Check if we actually have accounts data
  if (!report.accounts || report.accounts.length === 0) {
    console.log("No accounts found in report, using fallback issues");
    return addFallbackGenericIssues();
  }

  // Look for negative accounts
  const negativeAccounts = report.accounts.filter(account => 
    account.status?.toLowerCase().includes("negative") ||
    account.status?.toLowerCase().includes("collection") ||
    account.accountType?.toLowerCase().includes("collection") ||
    account.latestStatus?.toLowerCase().includes("charge off") ||
    account.latestStatus?.toLowerCase().includes("collection")
  );

  if (negativeAccounts.length > 0) {
    negativeAccounts.forEach(account => {
      issues.push({
        type: 'Negative Account',
        title: `Negative Account: ${account.creditorName || 'Unknown Creditor'}`,
        description: `Dispute the negative status of account ${account.accountNumber || 'Unknown Account'} with ${account.creditorName || 'creditor'}.`,
        impact: "High Impact",
        impactColor: 'text-red-500',
        laws: [FCRA_LAWS.accuracy, FCRA_LAWS.verification]
      });
    });
  }

  // Look for late payments
  const latePaymentAccounts = report.accounts.filter(account => 
    account.paymentHistory && 
    (account.paymentHistory.includes('30') || 
     account.paymentHistory.includes('60') || 
     account.paymentHistory.includes('90'))
  );

  if (latePaymentAccounts.length > 0) {
    latePaymentAccounts.forEach(account => {
      issues.push({
        type: 'Late Payment',
        title: `Late Payments: ${account.creditorName || 'Unknown Creditor'}`,
        description: `Dispute late payments for account ${account.accountNumber || 'Unknown Account'} with ${account.creditorName || 'creditor'}.`,
        impact: "High Impact",
        impactColor: 'text-red-500',
        laws: [FCRA_LAWS.accuracy, FCRA_LAWS.verification]
      });
    });
  }

  // Look for high balances
  const highUtilizationAccounts = report.accounts.filter(account => {
    if (account.creditLimit && account.balance) {
      const limit = parseFloat(account.creditLimit.replace(/[^0-9.]/g, ''));
      const balance = parseFloat(account.balance.replace(/[^0-9.]/g, ''));
      return limit > 0 && (balance / limit > 0.7);
    }
    return false;
  });

  if (highUtilizationAccounts.length > 0) {
    highUtilizationAccounts.forEach(account => {
      issues.push({
        type: 'High Utilization',
        title: `High Credit Utilization: ${account.creditorName || 'Unknown Creditor'}`,
        description: `Your credit utilization for ${account.accountNumber || 'this account'} is above 70%, which can negatively impact your score.`,
        impact: "Medium Impact",
        impactColor: 'text-amber-500',
        laws: []
      });
    });
  }

  // Look for possible identity issues by checking name variations
  if (report.personalInfo && report.personalInfo.name) {
    const nameVariants = findNameVariations(report.accounts, report.personalInfo.name);
    if (nameVariants.size > 1) {
      issues.push({
        type: 'Personal Info',
        title: 'Name Variations Found',
        description: `Multiple name variations found in your report: ${Array.from(nameVariants).join(', ')}.`,
        impact: "Medium Impact",
        impactColor: 'text-amber-500',
        laws: [FCRA_LAWS.accuracy]
      });
    }

    // Check for SSN variations
    const ssnVariants = findSSNVariations(report.accounts);
    if (ssnVariants.size > 1) {
      issues.push({
        type: 'Personal Info',
        title: 'Multiple Social Security Numbers',
        description: `Multiple SSN variations found in your report. This could indicate identity issues or reporting errors.`,
        impact: "Critical Impact",
        impactColor: 'text-red-600',
        laws: [FCRA_LAWS.accuracy, FCRA_LAWS.investigation]
      });
    }
  }

  // Check for inquiries
  if (report.inquiries && report.inquiries.length > 5) {
    issues.push({
      type: 'Inquiries',
      title: 'Excessive Credit Inquiries',
      description: `Your report shows ${report.inquiries.length} credit inquiries. Multiple inquiries can lower your score.`,
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: []
    });
  }

  // Add unauthorized inquiries if there are inquiries without recognizable names
  const potentialUnauthorizedInquiries = report.inquiries?.filter(inquiry => 
    !inquiry.inquiryCompany || 
    inquiry.inquiryCompany.includes("UNKNOWN") ||
    inquiry.inquiryCompany.includes("undefined")
  );

  if (potentialUnauthorizedInquiries && potentialUnauthorizedInquiries.length > 0) {
    issues.push({
      type: 'Inquiries',
      title: 'Potentially Unauthorized Inquiries',
      description: `Your report shows ${potentialUnauthorizedInquiries.length} inquiries from unrecognized sources that may be unauthorized.`,
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: [FCRA_LAWS.investigation]
    });
  }

  // If no issues were found, return some generic issues
  if (issues.length === 0) {
    console.log("No specific issues identified, adding generic issues");
    return addFallbackGenericIssues();
  }

  return issues;
}

/**
 * Finds name variations across accounts
 */
function findNameVariations(accounts: CreditReportAccount[], primaryName: string): Set<string> {
  const nameVariants = new Set<string>();
  nameVariants.add(primaryName.trim().toLowerCase());
  
  accounts.forEach(account => {
    if (account.accountHolderName) {
      const accountName = account.accountHolderName.trim().toLowerCase();
      if (accountName && accountName !== primaryName.toLowerCase()) {
        // Ignore minor variations (e.g., missing middle initial)
        if (!isSimilarName(accountName, primaryName.toLowerCase())) {
          nameVariants.add(account.accountHolderName.trim());
        }
      }
    }
  });
  
  return nameVariants;
}

/**
 * Checks if two names are similar (accounting for middle initials, etc.)
 */
function isSimilarName(name1: string, name2: string): boolean {
  const n1Parts = name1.split(' ').filter(p => p.length > 0);
  const n2Parts = name2.split(' ').filter(p => p.length > 0);
  
  // Check if first and last names match
  if (n1Parts.length > 0 && n2Parts.length > 0) {
    const n1First = n1Parts[0];
    const n1Last = n1Parts[n1Parts.length - 1];
    
    const n2First = n2Parts[0];
    const n2Last = n2Parts[n2Parts.length - 1];
    
    return n1First === n2First && n1Last === n2Last;
  }
  
  return false;
}

/**
 * Finds SSN variations across accounts
 */
function findSSNVariations(accounts: CreditReportAccount[]): Set<string> {
  const ssnVariants = new Set<string>();
  
  accounts.forEach(account => {
    if (account.ssn && account.ssn.length > 0) {
      // Only add the last 4 digits for privacy/security
      const last4 = account.ssn.slice(-4);
      if (last4.length === 4 && /^\d{4}$/.test(last4)) {
        ssnVariants.add(`xxx-xx-${last4}`);
      }
    }
  });
  
  return ssnVariants;
}
