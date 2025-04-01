
/**
 * Credit Report Analysis Generator
 * This module generates analysis results based on parsed credit report data
 */

import { CreditReportData, RecommendedDispute } from '../types';
import { extractPersonalInfo } from './extractPersonalInfo';

export const generateAnalysisResults = (data: CreditReportData) => {
  console.log("Generating analysis results from credit report data");
  
  // Extract and save personal information
  if (data.rawText) {
    const personalInfo = extractPersonalInfo(data.rawText);
    console.log("Extracted personal information from report:", personalInfo);
    
    // Save this information to the report data
    data.personalInfo = personalInfo;
  }
  
  // Generate account type summary
  const accountTypeSummary: Record<string, number> = {};
  
  data.accounts.forEach(account => {
    if (account.accountType) {
      accountTypeSummary[account.accountType] = (accountTypeSummary[account.accountType] || 0) + 1;
    }
  });
  
  // Calculate open and closed accounts
  const openAccounts = data.accounts.filter(a => 
    (a.status && a.status.toLowerCase().includes('open')) || 
    (!a.status && !a.lastActivity) // Use lastActivity instead of dateClosed
  ).length;
  
  const closedAccounts = data.accounts.filter(a => 
    (a.status && a.status.toLowerCase().includes('closed')) || 
    a.lastActivity // Use lastActivity instead of dateClosed
  ).length;
  
  // Calculate negative items
  const negativeItems = data.accounts.filter(a => 
    a.isNegative || 
    (a.paymentStatus && (
      a.paymentStatus.toLowerCase().includes('late') || 
      a.paymentStatus.toLowerCase().includes('collection') || 
      a.paymentStatus.toLowerCase().includes('charged off')
    ))
  ).length;
  
  // Calculate total balances
  const totalBalances = data.accounts.reduce((sum, account) => {
    // Convert string to number and handle both currentBalance and balance properties
    const balanceStr = account.currentBalance || account.balance || '0';
    // Use Number() instead of parseFloat on a String object
    const balance = typeof balanceStr === 'string' ? parseFloat(balanceStr) : Number(balanceStr);
    return isNaN(balance) ? sum : sum + balance;
  }, 0);
  
  // Generate recommended disputes
  const recommendedDisputes: RecommendedDispute[] = [];
  
  // Look for late payments
  const lateAccounts = data.accounts.filter(a => 
    (a.paymentStatus && a.paymentStatus.toLowerCase().includes('late')) ||
    (a.paymentHistory && a.paymentHistory.toLowerCase?.includes('late'))
  );
  
  for (const account of lateAccounts) {
    recommendedDisputes.push({
      id: `late-${account.accountNumber || Math.random().toString(36).substring(2, 10)}`,
      type: 'late_payment',
      title: 'Late Payment Dispute',
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      reason: 'Late Payment Dispute',
      description: `Dispute late payments for ${account.accountName} account`,
      bureau: account.bureau || 'Experian',
      impact: 'High'
    });
  }
  
  // Look for collections
  const collectionAccounts = data.accounts.filter(a => 
    a.accountType?.toLowerCase().includes('collection') ||
    a.paymentStatus?.toLowerCase().includes('collection') ||
    a.accountName?.toLowerCase().includes('collection')
  );
  
  for (const account of collectionAccounts) {
    recommendedDisputes.push({
      id: `collection-${account.accountNumber || Math.random().toString(36).substring(2, 10)}`,
      type: 'collection',
      title: 'Collection Account Dispute',
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      reason: 'Collection Account Dispute',
      description: `Dispute collection account ${account.accountName}`,
      bureau: account.bureau || 'Experian',
      impact: 'High'
    });
  }
  
  // Look for inquiries
  if (data.inquiries && data.inquiries.length > 0) {
    recommendedDisputes.push({
      id: `inquiry-${Math.random().toString(36).substring(2, 10)}`,
      type: 'inquiry',
      title: 'Unauthorized Inquiry Dispute',
      accountName: 'Recent Inquiries',
      reason: 'Unauthorized Inquiry Dispute',
      description: 'Dispute unauthorized inquiries on your credit report',
      bureau: data.inquiries[0].bureau || 'Experian',
      impact: 'Medium'
    });
  }
  
  return {
    totalAccounts: data.accounts.length,
    openAccounts,
    closedAccounts,
    negativeItems,
    accountTypeSummary,
    totalBalances,
    recommendedDisputes,
    personalInfo: data.personalInfo
  };
};
