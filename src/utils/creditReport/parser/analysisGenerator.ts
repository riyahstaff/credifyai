
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
  const totalAccounts = reportData.accounts.length;
  
  // Find accounts with issues
  const accountsWithIssues = reportData.accounts.filter(
    account => (account.remarks && account.remarks.length > 0) || 
              (account.paymentStatus && 
              (account.paymentStatus.includes('Late') || 
               account.paymentStatus.includes('Delinquent') || 
               account.paymentStatus.includes('Collection')))
  ).length;
  
  const analysisResults = {
    totalDiscrepancies: accountsWithIssues,
    highSeverityIssues: Math.floor(accountsWithIssues / 2), // Just an estimate
    accountsWithIssues,
    recommendedDisputes: []
  };
  
  // Generate recommended disputes for accounts with issues
  for (const account of reportData.accounts) {
    if (account.remarks && account.remarks.length > 0) {
      // For each remark, create a separate dispute recommendation
      for (const remark of account.remarks) {
        analysisResults.recommendedDisputes.push({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bureau: account.bureau || 'Unknown',
          reason: 'Negative Remark',
          description: `Your ${account.accountName} account has the following remarks: "${remark}". This could be disputed if inaccurate.`,
          severity: 'high',
          legalBasis: getLegalReferencesForDispute('remarks', remark)
        });
      }
    }
    
    if (account.paymentStatus && 
        (account.paymentStatus.includes('Late') || 
         account.paymentStatus.includes('Delinquent') || 
         account.paymentStatus.includes('Collection'))) {
      analysisResults.recommendedDisputes.push({
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        bureau: account.bureau || 'Unknown',
        reason: 'Late Payment',
        description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score. This can be disputed if inaccurate.`,
        severity: 'high',
        legalBasis: getLegalReferencesForDispute('payment', account.paymentStatus)
      });
    }
  }
  
  // If there's no recommended disputes but we have at least one account,
  // add a generic dispute recommendation
  if (analysisResults.recommendedDisputes.length === 0 && reportData.accounts.length > 0) {
    const randomAccount = reportData.accounts[Math.floor(Math.random() * reportData.accounts.length)];
    analysisResults.recommendedDisputes.push({
      accountName: randomAccount.accountName,
      accountNumber: randomAccount.accountNumber,
      bureau: randomAccount.bureau || 'Unknown',
      reason: 'Account Review',
      description: `Review this ${randomAccount.accountName} account for any inaccuracies in balance, payment history, or account status.`,
      severity: 'medium',
      legalBasis: getLegalReferencesForDispute('account_information')
    });
  }
  
  return analysisResults;
};
