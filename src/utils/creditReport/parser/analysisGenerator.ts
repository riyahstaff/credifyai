
import { CreditReportData, CreditReportAccount, CreditReportAnalysisResults } from '../types';

/**
 * Generate analysis results from credit report data
 */
export const generateAnalysisResults = (reportData: CreditReportData): CreditReportAnalysisResults => {
  const { accounts, inquiries, publicRecords } = reportData;
  
  // Count account types
  const accountTypeSummary: Record<string, number> = {};
  const accountTypes = accounts.map(account => account.accountType?.toLowerCase() || "unknown");
  
  // Count each account type
  accountTypes.forEach(type => {
    if (!accountTypeSummary[type]) {
      accountTypeSummary[type] = 1;
    } else {
      accountTypeSummary[type] += 1;
    }
  });
  
  // Calculate total credit used and limits
  let totalBalance = 0;
  let totalCreditLimit = 0;
  
  accounts.forEach(account => {
    const balance = account.currentBalance || account.balance || 0;
    const limit = account.creditLimit || 0;
    
    if (typeof balance === 'number') {
      totalBalance += balance;
    }
    
    if (typeof limit === 'number') {
      totalCreditLimit += limit;
    }
  });
  
  // Find potential issues and create recommended disputes
  const accountsWithIssues = accounts.filter(account => {
    const hasPaymentIssue = account.paymentStatus && account.paymentStatus.toLowerCase().includes('late');
    const isHighUtilization = account.creditLimit && account.currentBalance && 
      (account.currentBalance / account.creditLimit > 0.8);
    const recentlyClosed = account.status?.toLowerCase().includes('closed') && 
      account.lastActivity && isRecentActivity(account.lastActivity);
    
    return hasPaymentIssue || isHighUtilization || recentlyClosed;
  });
  
  // Generate recommendations
  const recommendedDisputes = accountsWithIssues.map(account => {
    const accountName = account.accountName || 'Unknown account';
    let reason = '';
    let impact = '';
    
    if (account.paymentStatus && account.paymentStatus.toLowerCase().includes('late')) {
      reason = `Late payment reported for ${accountName}`;
      impact = 'high';
    } else if (account.creditLimit && account.currentBalance && 
      (account.currentBalance / account.creditLimit > 0.8)) {
      reason = `High utilization (${Math.round((account.currentBalance / account.creditLimit) * 100)}%) on ${accountName}`;
      impact = 'medium';
    } else if (account.status?.toLowerCase().includes('closed') && 
      account.lastActivity && isRecentActivity(account.lastActivity)) {
      reason = `Recently closed account (${accountName}) still showing impact`;
      impact = 'medium';
    }
    
    return {
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      reason,
      impact
    };
  });
  
  // Generate final analysis results
  return {
    totalAccounts: accounts.length,
    openAccounts: accounts.filter(a => a.status?.toLowerCase().includes('open')).length,
    closedAccounts: accounts.filter(a => a.status?.toLowerCase().includes('closed')).length,
    negativeItems: accounts.filter(a => a.isNegative).length,
    inquiryCount: inquiries.length,
    publicRecordCount: publicRecords.length,
    accountTypeSummary,
    creditUtilization: totalCreditLimit > 0 ? (totalBalance / totalCreditLimit) * 100 : 0,
    totalCreditLimit,
    totalBalance,
    totalDiscrepancies: accountsWithIssues.length,
    highSeverityIssues: accountsWithIssues.filter(a => a.isNegative).length,
    accountsWithIssues: accountsWithIssues.length,
    recommendedDisputes
  };
};

// Helper function to check if a date is recent (within last 6 months)
const isRecentActivity = (dateString: string): boolean => {
  try {
    const activityDate = new Date(dateString);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return activityDate > sixMonthsAgo;
  } catch (e) {
    // If date parsing fails, return false
    return false;
  }
};
