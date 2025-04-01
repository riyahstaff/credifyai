
/**
 * Collection of data processing utilities for credit report analysis
 */

import { CreditReportAccount, CreditReportData } from '../creditReport/types';

// Process and categorize accounts
export const categorizeAccounts = (accounts: CreditReportAccount[]): Record<string, CreditReportAccount[]> => {
  const categories: Record<string, CreditReportAccount[]> = {
    negative: [],
    collections: [],
    creditCards: [],
    loans: [],
    mortgages: [],
    other: []
  };
  
  for (const account of accounts) {
    if (account.isNegative) {
      categories.negative.push(account);
    }
    
    const name = account.accountName.toLowerCase();
    const type = account.accountType?.toLowerCase() || '';
    
    if (name.includes('collection') || type.includes('collection')) {
      categories.collections.push(account);
    } else if (type.includes('credit card') || name.includes('credit card') || name.includes('card')) {
      categories.creditCards.push(account);
    } else if (type.includes('mortgage') || name.includes('mortgage')) {
      categories.mortgages.push(account);
    } else if (type.includes('loan') || name.includes('loan')) {
      categories.loans.push(account);
    } else {
      categories.other.push(account);
    }
  }
  
  return categories;
};

// Calculate credit utilization
export const calculateUtilization = (accounts: CreditReportAccount[]): number => {
  const creditCards = accounts.filter(account => {
    const type = account.accountType?.toLowerCase() || '';
    const name = account.accountName.toLowerCase();
    return (type.includes('credit card') || name.includes('credit card') || name.includes('card')) && 
           account.status?.toLowerCase() !== 'closed';
  });
  
  let totalBalance = 0;
  let totalLimit = 0;
  
  for (const card of creditCards) {
    // Parse balance and limit, handling string or number types
    const balance = typeof card.currentBalance === 'string' 
      ? parseFloat(card.currentBalance.replace(/[^0-9.-]+/g, '')) 
      : (card.currentBalance || 0);
      
    const limit = typeof card.creditLimit === 'string'
      ? parseFloat(card.creditLimit.replace(/[^0-9.-]+/g, ''))
      : (card.creditLimit || 0);
    
    if (!isNaN(balance)) totalBalance += balance;
    if (!isNaN(limit)) totalLimit += limit;
  }
  
  if (totalLimit === 0) return 0;
  return (totalBalance / totalLimit) * 100;
};
