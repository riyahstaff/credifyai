
/**
 * Credit Report Parser - Analysis Generator
 * This module handles generating analysis results from credit report data
 */
import { CreditReportData } from '../types';
import { getLegalReferencesForDispute } from '../legalReferences';

/**
 * Generate analysis results from credit report data
 */
export const generateAnalysisResults = (reportData: CreditReportData) => {
  console.log("Generating analysis results from credit report data");
  
  const totalAccounts = reportData.accounts.length;
  
  // Find accounts with issues - expanded to catch more negative items
  const accountsWithIssues = reportData.accounts.filter(
    account => {
      // Check for explicit remarks
      if (account.remarks && account.remarks.length > 0) {
        return true;
      }
      
      // Check for negative payment status
      if (account.paymentStatus) {
        const status = account.paymentStatus.toLowerCase();
        if (status.includes('late') || 
            status.includes('delinquent') || 
            status.includes('collection') ||
            status.includes('charged') ||
            status.includes('settled') ||
            status.includes('past due')) {
          return true;
        }
      }
      
      // Check for excessive balance compared to limit
      if (account.currentBalance && account.creditLimit) {
        const balance = parseFloat(account.currentBalance.replace(/[^0-9.]/g, ''));
        const limit = parseFloat(account.creditLimit.replace(/[^0-9.]/g, ''));
        if (!isNaN(balance) && !isNaN(limit) && limit > 0 && (balance / limit) > 0.7) {
          return true;
        }
      }
      
      // Check for potentially negative account types
      if (account.accountType) {
        const type = account.accountType.toLowerCase();
        if (type.includes('collection') || 
            type.includes('charged off') ||
            type.includes('settlement')) {
          return true;
        }
      }
      
      return false;
    }
  ).length;
  
  const analysisResults = {
    totalDiscrepancies: accountsWithIssues,
    highSeverityIssues: Math.floor(accountsWithIssues / 2), // Just an estimate
    accountsWithIssues,
    recommendedDisputes: []
  };
  
  // Generate recommended disputes for accounts with issues
  for (const account of reportData.accounts) {
    const accountIssues = [];
    
    // Check for remarks
    if (account.remarks && account.remarks.length > 0) {
      // For each remark, create a separate dispute recommendation
      for (const remark of account.remarks) {
        accountIssues.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'All Bureaus',
          reason: 'Negative Remark',
          description: `Your ${account.accountName} account has the following remarks: "${remark}". This could be disputed if inaccurate.`,
          severity: 'high',
          legalBasis: getLegalReferencesForDispute('remarks', remark)
        });
      }
    }
    
    // Check for payment status issues
    if (account.paymentStatus) {
      const status = account.paymentStatus.toLowerCase();
      if (status.includes('late') || 
          status.includes('delinquent') || 
          status.includes('collection')) {
        accountIssues.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'All Bureaus',
          reason: 'Late Payment',
          description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score. This can be disputed if inaccurate.`,
          severity: 'high',
          legalBasis: getLegalReferencesForDispute('payment', account.paymentStatus)
        });
      }
    }
    
    // Check for high balance
    if (account.currentBalance && account.creditLimit) {
      const balance = parseFloat(account.currentBalance.replace(/[^0-9.]/g, ''));
      const limit = parseFloat(account.creditLimit.replace(/[^0-9.]/g, ''));
      if (!isNaN(balance) && !isNaN(limit) && limit > 0 && (balance / limit) > 0.7) {
        accountIssues.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'All Bureaus',
          reason: 'High Balance-to-Limit Ratio',
          description: `Your ${account.accountName} account shows a high balance-to-limit ratio, which may be negatively affecting your credit score. Consider disputing the current balance if inaccurate.`,
          severity: 'medium',
          legalBasis: getLegalReferencesForDispute('balance', 'high utilization')
        });
      }
    }
    
    // Check for negative account types
    if (account.accountType) {
      const type = account.accountType.toLowerCase();
      if (type.includes('collection') || 
          type.includes('charged off') ||
          type.includes('settlement')) {
        accountIssues.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'All Bureaus',
          reason: 'Account Status',
          description: `Your ${account.accountName} account is reported as a ${account.accountType}, which is significantly damaging to your credit score. This can be disputed if inaccurate or if the debt is past the statute of limitations.`,
          severity: 'high',
          legalBasis: getLegalReferencesForDispute('account_type', account.accountType)
        });
      }
    }
    
    // If no specific issues were found but the account exists, add a generic verification dispute
    if (accountIssues.length === 0) {
      accountIssues.push({
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bureau: account.bureau || 'All Bureaus',
        reason: 'Account Verification',
        description: `I request verification of all information for this ${account.accountName} account, including balance, payment history, and account status.`,
        severity: 'medium',
        legalBasis: getLegalReferencesForDispute('account_information')
      });
    }
    
    // Add all identified issues to the recommended disputes
    analysisResults.recommendedDisputes.push(...accountIssues);
  }
  
  // If there's no recommended disputes but we have at least one account,
  // add a generic dispute recommendation
  if (analysisResults.recommendedDisputes.length === 0 && reportData.accounts.length > 0) {
    const randomAccount = reportData.accounts[Math.floor(Math.random() * reportData.accounts.length)];
    analysisResults.recommendedDisputes.push({
      accountName: randomAccount.accountName,
      accountNumber: randomAccount.accountNumber,
      bureau: randomAccount.bureau || 'All Bureaus',
      reason: 'Account Review',
      description: `Review this ${randomAccount.accountName} account for any inaccuracies in balance, payment history, or account status.`,
      severity: 'medium',
      legalBasis: getLegalReferencesForDispute('account_information')
    });
  }
  
  // If we still don't have any recommended disputes (e.g., no accounts),
  // add a generic dispute for unknown accounts
  if (analysisResults.recommendedDisputes.length === 0) {
    analysisResults.recommendedDisputes.push({
      accountName: "All Accounts",
      bureau: "All Bureaus",
      reason: "General Credit Report Review",
      description: "I dispute all negative items on my credit report as potentially inaccurate and request full verification of all accounts under the FCRA.",
      severity: "high",
      legalBasis: getLegalReferencesForDispute('general_dispute')
    });
  }
  
  console.log(`Analysis generated ${analysisResults.recommendedDisputes.length} recommended disputes`);
  
  return analysisResults;
};
