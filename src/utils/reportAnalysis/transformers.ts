
/**
 * Collection of transformation utilities for credit report data
 */

// Basic data transformers
export const normalizeAccountName = (name: string): string => {
  if (!name) return '';
  return name.replace(/\s+/g, ' ').trim().toUpperCase();
};

export const extractAccountNumber = (text: string): string | null => {
  if (!text) return null;
  
  // Look for account number patterns like xxxx-xxxx-1234
  const accountNumberPattern = /(?:account|acct)(?:.|\s)+?(?:#|number|no)(?:.|\s)+?([a-z0-9*x#-]{4,})/i;
  const match = text.match(accountNumberPattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
};

export const formatCurrency = (amount: number | string | undefined): string => {
  if (amount === undefined || amount === null) return '$0.00';
  
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
    : amount;
  
  if (isNaN(numericAmount)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numericAmount);
};
