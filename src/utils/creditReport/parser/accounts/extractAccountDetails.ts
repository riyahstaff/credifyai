
/**
 * Credit Report Parser - Account Extractor - Detail Extraction
 * Extracts specific details from account text blocks
 */
import { CreditReportAccount } from '../../types';

/**
 * Extract specific account details from an account text block
 */
export const extractAccountDetails = (
  block: string,
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
): CreditReportAccount => {
  const account: CreditReportAccount = {
    accountName: "Unknown Account", // Default value to be overridden
    remarks: []
  };
    
  // Try to extract account name
  const accountNamePatterns = [
    /(?:Creditor|Subscriber|Company|Bank|Account\s+Name):\s*([^\n\r]+)/i,
    /^([A-Z][A-Z0-9\s&.,'-]+)(?:\r?\n|\s{2,})/i,
    /([A-Z][A-Z0-9\s&.,'-]{2,}(?:BANK|CARD|AUTO|LOAN|MORTGAGE|FINANCE|CREDIT|FUND|HOME|SERVICES))/i
  ];
  
  for (const pattern of accountNamePatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim() && match[1].length > 3) {
      account.accountName = match[1].trim();
      break;
    }
  }
  
  // Try to extract account number
  const accountNumberPatterns = [
    /(?:Account|Loan|Card)\s+(?:#|Number|No\.?):?\s*([0-9X*]+(?:[-\s][0-9X*]+)*)/i,
    /(?:Account|Loan|Card)(?:\s+(?:#|Number|No\.?))?:?\s*([0-9X*]{4,})/i,
    /(?:#|Number|No\.?):?\s*([0-9X*]{4,})/i
  ];
  
  for (const pattern of accountNumberPatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.accountNumber = match[1].trim();
      break;
    }
  }
  
  // Try to extract account type
  const accountTypePatterns = [
    /(?:Account\s+Type|Loan\s+Type|Type\s+of\s+Loan|Type\s+of\s+Account):\s*([^\n\r]+)/i,
    /Type:\s*([^\n\r]+)/i
  ];
  
  for (const pattern of accountTypePatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.accountType = match[1].trim();
      break;
    }
  }
  
  // Try to extract current balance
  const balancePatterns = [
    /(?:Current\s+Balance|Balance|Balance\s+Amount|Current\s+Amount):\s*\$?([\d,.]+)/i,
    /(?:Balance|Amount):\s*\$?([\d,.]+)/i,
    /Balance(?:\s+as\s+of|\s+Date|\s+Amount)?:\s*\$?([\d,.]+)/i
  ];
  
  for (const pattern of balancePatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.currentBalance = `$${match[1].trim()}`;
      account.balance = `$${match[1].trim()}`; // Set both for compatibility
      break;
    }
  }
  
  // Try to extract payment status
  const paymentStatusPatterns = [
    /(?:Payment\s+Status|Status|Account\s+Status):\s*([^\n\r]+)/i,
    /Status:\s*([^\n\r]+)/i
  ];
  
  for (const pattern of paymentStatusPatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.paymentStatus = match[1].trim();
      break;
    }
  }
  
  // Try to extract date opened
  const dateOpenedPatterns = [
    /(?:Date\s+Opened|Opened\s+Date|Open\s+Date|Account\s+Opened\s+Date):\s*([^\n\r]+)/i,
    /Opened:\s*([^\n\r]+)/i,
    /Opened\s+(?:on|in|since):\s*([^\n\r]+)/i
  ];
  
  for (const pattern of dateOpenedPatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.dateOpened = match[1].trim();
      account.openDate = match[1].trim(); // Set both for compatibility
      break;
    }
  }
  
  // Try to extract date reported
  const dateReportedPatterns = [
    /(?:Date\s+Reported|Reported\s+Date|Last\s+Reported|Last\s+Updated|Report\s+Date):\s*([^\n\r]+)/i,
    /Reported:\s*([^\n\r]+)/i,
    /(?:Last|Recent)\s+Report(?:ed)?:\s*([^\n\r]+)/i
  ];
  
  for (const pattern of dateReportedPatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.dateReported = match[1].trim();
      account.lastReportedDate = match[1].trim(); // Set both for compatibility
      break;
    }
  }
  
  // Try to extract remarks
  const remarksPatterns = [
    /(?:Remarks|Comments|Notes|Comment):\s*([^\n\r]+)/i,
    /(?:Dispute|Disputed\s+Information):\s*([^\n\r]+)/i
  ];
  
  for (const pattern of remarksPatterns) {
    const match = block.match(pattern);
    if (match && match[1]?.trim()) {
      account.remarks?.push(match[1].trim());
    }
  }
  
  // Determine which bureau this account is from based on surrounding text
  if (block.toLowerCase().includes('experian')) {
    account.bureau = 'Experian';
  } else if (block.toLowerCase().includes('equifax')) {
    account.bureau = 'Equifax';
  } else if (block.toLowerCase().includes('transunion')) {
    account.bureau = 'TransUnion';
  } else if (bureaus.experian && !bureaus.equifax && !bureaus.transunion) {
    account.bureau = 'Experian';
  } else if (!bureaus.experian && bureaus.equifax && !bureaus.transunion) {
    account.bureau = 'Equifax';
  } else if (!bureaus.experian && !bureaus.equifax && bureaus.transunion) {
    account.bureau = 'TransUnion';
  }
  
  return account;
};
