
/**
 * Credit Report Parser - Account Extractor - Detail Extractor
 * Extracts details from text that might be an account
 */
import { CreditReportAccount } from '../../types';

/**
 * Extract account details from a text block
 */
export const extractAccountDetails = (
  block: string, 
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
): CreditReportAccount => {
  // Initialize default account
  const account: CreditReportAccount = {
    accountName: "Unknown Account",
    accountNumber: "",
    accountType: "",
    currentBalance: "",
    creditLimit: "",
    paymentStatus: "",
    dateOpened: "",
    lastActivity: "",
    status: "",
    isNegative: false,
    dateReported: "",
    bureau: "",
    remarks: [],
    // Add new fields to match the enhanced type
    openDate: "",
    lastReportedDate: ""
  };
  
  try {
    // Extract account name
    const namePatterns = [
      /(?:account|creditor|subscriber|company)\s*(?:name|information)?[:;]\s*([A-Za-z0-9\s.,&'-]{3,50})/i,
      /([A-Za-z0-9\s.,&'-]{3,50})\s*(?:account|loan|card|mortgage)/i,
      /([A-Za-z0-9\s.,&'-]{3,50})\s*(?:\n|,)\s*account\s*#/i
    ];
    
    for (const pattern of namePatterns) {
      const match = block.match(pattern);
      if (match && match[1] && match[1].length > 3) {
        let name = match[1].trim();
        
        // If the name is too long or contains too many spaces, it's probably not an account name
        if (name.length > 50 || name.split(/\s+/).length > 7) continue;
        
        account.accountName = name;
        break;
      }
    }
    
    // Extract account number
    const accountNumberPatterns = [
      /(?:account|acct)(?:.|\s)+?(?:#|number|no)(?:.|\s)+?(?::\s*)?([a-z0-9*x#-]{4,})/i,
      /(?:account|loan)\s*(?:#|number|no\.?)\s*[:;]?\s*([a-z0-9*x#-]{4,})/i
    ];
    
    for (const pattern of accountNumberPatterns) {
      const match = block.match(pattern);
      if (match && match[1] && match[1].length >= 4) {
        account.accountNumber = match[1].trim();
        break;
      }
    }
    
    // Extract account type
    const typePatterns = [
      /(?:account|loan)\s*type\s*[:;]?\s*([A-Za-z\s]{3,25})/i,
      /type\s*(?:of\s*account)?\s*[:;]?\s*([A-Za-z\s]{3,25})/i
    ];
    
    for (const pattern of typePatterns) {
      const match = block.match(pattern);
      if (match && match[1] && match[1].length >= 3) {
        account.accountType = match[1].trim();
        break;
      }
    }
    
    // Extract current balance
    const balancePatterns = [
      /(?:current\s*)?balance\s*[:;]?\s*\$?\s*([0-9,.]{1,15})/i,
      /(?:balance|amount)(?:.|\s)+?(?::\s*)?[$]?\s*([0-9,.]{1,15})/i
    ];
    
    for (const pattern of balancePatterns) {
      const match = block.match(pattern);
      if (match && match[1]) {
        account.currentBalance = match[1].replace(/[,$]/g, '').trim();
        account.balance = account.currentBalance;
        break;
      }
    }
    
    // Extract credit limit
    const limitPatterns = [
      /(?:credit\s*)?limit\s*[:;]?\s*\$?\s*([0-9,.]{1,15})/i,
      /(?:high\s*credit|high\s*balance|original\s*amount)\s*[:;]?\s*\$?\s*([0-9,.]{1,15})/i
    ];
    
    for (const pattern of limitPatterns) {
      const match = block.match(pattern);
      if (match && match[1]) {
        account.creditLimit = match[1].replace(/[,$]/g, '').trim();
        break;
      }
    }
    
    // Extract payment status
    const statusPatterns = [
      /(?:payment\s*)?status\s*[:;]?\s*([A-Za-z0-9\s]{3,30})/i,
      /(?:status|condition)\s*[:;]?\s*([A-Za-z0-9\s]{3,30})/i
    ];
    
    for (const pattern of statusPatterns) {
      const match = block.match(pattern);
      if (match && match[1] && match[1].length >= 3) {
        account.paymentStatus = match[1].trim();
        
        // Set isNegative based on payment status
        const lowerStatus = account.paymentStatus.toLowerCase();
        if (lowerStatus.includes('late') || 
            lowerStatus.includes('delinq') || 
            lowerStatus.includes('charge') || 
            lowerStatus.includes('collection')) {
          account.isNegative = true;
        }
        
        break;
      }
    }
    
    // Extract date opened
    const openDatePatterns = [
      /(?:date\s*)?opened\s*[:;]?\s*([A-Za-z0-9\s\/.-]{4,12})/i,
      /(?:open\s*date|opened\s*on|opening\s*date)\s*[:;]?\s*([A-Za-z0-9\s\/.-]{4,12})/i
    ];
    
    for (const pattern of openDatePatterns) {
      const match = block.match(pattern);
      if (match && match[1]) {
        account.dateOpened = match[1].trim();
        account.openDate = match[1].trim(); // Set both date fields for compatibility
        break;
      }
    }
    
    // Extract last activity date
    const lastActivityPatterns = [
      /(?:last|recent)\s*activity\s*[:;]?\s*([A-Za-z0-9\s\/.-]{4,12})/i,
      /(?:last\s*payment|last\s*active)\s*(?:date|made)?\s*[:;]?\s*([A-Za-z0-9\s\/.-]{4,12})/i
    ];
    
    for (const pattern of lastActivityPatterns) {
      const match = block.match(pattern);
      if (match && match[1]) {
        account.lastActivity = match[1].trim();
        break;
      }
    }
    
    // Extract account status (open/closed)
    const accountStatusPatterns = [
      /(?:account|loan)\s*status\s*[:;]?\s*([A-Za-z\s]{3,15})/i,
      /(?:status|condition)\s*[:;]?\s*([A-Za-z\s]{3,15})/i
    ];
    
    for (const pattern of accountStatusPatterns) {
      const match = block.match(pattern);
      if (match && match[1] && match[1].length >= 3) {
        account.status = match[1].trim();
        break;
      }
    }
    
    // Extract date reported
    const reportedDatePatterns = [
      /(?:date|last)\s*reported\s*[:;]?\s*([A-Za-z0-9\s\/.-]{4,12})/i,
      /(?:reported\s*date|as\s*of)\s*[:;]?\s*([A-Za-z0-9\s\/.-]{4,12})/i
    ];
    
    for (const pattern of reportedDatePatterns) {
      const match = block.match(pattern);
      if (match && match[1]) {
        account.dateReported = match[1].trim();
        account.lastReportedDate = match[1].trim(); // Set both date fields for compatibility
        break;
      }
    }
    
    // Determine which bureau reported this account
    if (block.match(/experian/i)) {
      account.bureau = "Experian";
    } else if (block.match(/equifax/i)) {
      account.bureau = "Equifax";
    } else if (block.match(/transunion/i)) {
      account.bureau = "TransUnion";
    } else {
      // Assign a default bureau based on which ones are in the report
      if (bureaus.experian) {
        account.bureau = "Experian";
      } else if (bureaus.equifax) {
        account.bureau = "Equifax";
      } else if (bureaus.transunion) {
        account.bureau = "TransUnion";
      }
    }
    
    // Extract remarks/comments
    const remarksSection = block.match(/(?:remarks|comments|note)[^:]*:[^\n]*((?:\n.*){1,10})/i);
    if (remarksSection && remarksSection[1]) {
      account.remarks = remarksSection[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }
    
    // Finally, check if the account is clearly a collection
    if (account.accountName.toLowerCase().includes('collection') || 
        (account.accountType && account.accountType.toLowerCase().includes('collection'))) {
      account.isNegative = true;
      
      if (!account.accountType || account.accountType.toLowerCase().indexOf('collection') === -1) {
        account.accountType = "Collection Account";
      }
    }
    
    return account;
  } catch (error) {
    console.error("Error extracting account details:", error);
    return account;
  }
};
