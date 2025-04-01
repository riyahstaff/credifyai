// Credit report issue detection

/**
 * Issue types
 */
export type IssueType = 
  | 'late_payment'
  | 'collection'
  | 'charge_off'
  | 'inquiry'
  | 'bankruptcy'
  | 'public_record'
  | 'high_balance'
  | 'incorrect_name'
  | 'incorrect_address'
  | 'incorrect_account';

/**
 * Issue detected in a credit report
 */
export interface CreditReportIssue {
  type: IssueType;
  description: string;
  bureau: string;
  accounts: Array<{
    accountName: string;
    accountNumber?: string;
    details: string;
  }>;
  raw_text?: string;
}

/**
 * Detect issues in a credit report
 * @param text The text content of the credit report
 * @returns Array of detected issues
 */
export function detect_issues(text: string): CreditReportIssue[] {
  console.log("Detecting issues in credit report text");
  
  const issues: CreditReportIssue[] = [];
  
  // Detect late payments
  const latePaymentIssues = detect_late_payments(text);
  issues.push(...latePaymentIssues);
  
  // Detect collections
  const collectionIssues = detect_collections(text);
  issues.push(...collectionIssues);
  
  // Detect inquiries
  const inquiryIssues = detect_inquiries(text);
  issues.push(...inquiryIssues);
  
  // Detect charge-offs
  const chargeOffIssues = detect_charge_offs(text);
  issues.push(...chargeOffIssues);
  
  // Detect public records
  const publicRecordIssues = detect_public_records(text);
  issues.push(...publicRecordIssues);
  
  // Detect bankruptcy
  const bankruptcyIssues = detect_bankruptcy(text);
  issues.push(...bankruptcyIssues);
  
  // Detect high balance
  const highBalanceIssues = detect_high_balance(text);
  issues.push(...highBalanceIssues);
  
  console.log(`Detected ${issues.length} issues in credit report`);
  
  return issues;
}

/**
 * Detect late payments in a credit report
 */
function detect_late_payments(text: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Define patterns for late payments
  const latePaymentPatterns = [
    /(\d+)\s*days?\s*late/gi,
    /late\s*payment/gi,
    /past\s*due/gi,
    /delinquent/gi,
    /late\s*(\d+)\s*days?/gi,
  ];
  
  // Check if any late payment pattern is found
  let hasLatePayment = false;
  for (const pattern of latePaymentPatterns) {
    if (pattern.test(lowerText)) {
      hasLatePayment = true;
      break;
    }
  }
  
  if (hasLatePayment) {
    // Try to extract account information
    const accounts = extract_account_info(text);
    
    // Determine which bureaus are mentioned
    const bureaus = [];
    if (lowerText.includes('experian')) bureaus.push('Experian');
    if (lowerText.includes('equifax')) bureaus.push('Equifax');
    if (lowerText.includes('transunion')) bureaus.push('TransUnion');
    
    // Create an issue for each bureau that has late payments
    for (const bureau of bureaus.length ? bureaus : ['All Bureaus']) {
      issues.push({
        type: 'late_payment',
        description: 'Late payment reported on credit report',
        bureau,
        accounts: accounts.length ? accounts : [{ 
          accountName: 'Unknown Account', 
          details: 'Late payment detected, but account details could not be extracted' 
        }],
      });
    }
  }
  
  return issues;
}

/**
 * Detect collections in a credit report
 */
function detect_collections(text: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Define patterns for collections
  const collectionPatterns = [
    /collection/gi,
    /in\s*collections/gi,
    /sent\s*to\s*collections/gi,
    /account\s*in\s*collection/gi,
    /placed\s*for\s*collection/gi,
  ];
  
  // Check if any collection pattern is found
  let hasCollection = false;
  for (const pattern of collectionPatterns) {
    if (pattern.test(lowerText)) {
      hasCollection = true;
      break;
    }
  }
  
  if (hasCollection) {
    // Try to extract account information
    const accounts = extract_account_info(text);
    
    // Determine which bureaus are mentioned
    const bureaus = [];
    if (lowerText.includes('experian')) bureaus.push('Experian');
    if (lowerText.includes('equifax')) bureaus.push('Equifax');
    if (lowerText.includes('transunion')) bureaus.push('TransUnion');
    
    // Create an issue for each bureau that has collections
    for (const bureau of bureaus.length ? bureaus : ['All Bureaus']) {
      issues.push({
        type: 'collection',
        description: 'Collection account reported on credit report',
        bureau,
        accounts: accounts.length ? accounts : [{ 
          accountName: 'Unknown Collection Account', 
          details: 'Collection account detected, but details could not be extracted' 
        }],
      });
    }
  }
  
  return issues;
}

/**
 * Detect inquiries in a credit report
 */
function detect_inquiries(text: string): CreditReportIssue[] {
  const issues: CreditReportIssue[] = [];
  const lowerText = text.toLowerCase();
  
  // Define patterns for inquiries
  const inquiryPatterns = [
    /inquir(y|ies)/gi,
    /credit\s*inquiry/gi,
    /hard\s*inquiry/gi,
    /recent\s*inquiry/gi,
  ];
  
  // Check if any inquiry pattern is found
  let hasInquiry = false;
  for (const pattern of inquiryPatterns) {
    if (pattern.test(lowerText)) {
      hasInquiry = true;
      break;
    }
  }
  
  if (hasInquiry) {
    // Try to extract creditor information
    const creditors = extract_inquiry_info(text);
    
    // Determine which bureaus are mentioned
    const bureaus = [];
    if (lowerText.includes('experian')) bureaus.push('Experian');
    if (lowerText.includes('equifax')) bureaus.push('Equifax');
    if (lowerText.includes('transunion')) bureaus.push('TransUnion');
    
    // Create an issue for each bureau that has inquiries
    for (const bureau of bureaus.length ? bureaus : ['All Bureaus']) {
      issues.push({
        type: 'inquiry',
        description: 'Inquiry detected on credit report',
        bureau,
        accounts: creditors.length ? creditors : [{ 
          accountName: 'Unknown Creditor', 
          details: 'Inquiry detected, but creditor details could not be extracted' 
        }],
      });
    }
  }
  
  return issues;
}

/**
 * Extract account information from credit report text
 */
function extract_account_info(text: string): Array<{ accountName: string; accountNumber?: string; details: string }> {
  const accounts = [];
  
  // Look for common account patterns in credit reports
  const accountNamePatterns = [
    /Account Name:\s*([^\n\r]+)/gi,
    /Creditor:\s*([^\n\r]+)/gi,
    /Account:\s*([^\n\r]+)/gi,
  ];
  
  for (const pattern of accountNamePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim()) {
        accounts.push({
          accountName: match[1].trim(),
          details: `Account found near ${match.index} in text`,
        });
      }
    }
  }
  
  // Try to match account numbers to already found accounts
  const accountNumberPatterns = [
    /Account\s*#:\s*([^\n\r]+)/gi,
    /Account\s*Number:\s*([^\n\r]+)/gi,
    /Account\s*No:\s*([^\n\r]+)/gi,
  ];
  
  for (const pattern of accountNumberPatterns) {
    let match;
    let matchIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim()) {
        const accountNumber = match[1].trim();
        
        // If we have an account at the same index, add the account number to it
        if (accounts[matchIndex]) {
          accounts[matchIndex].accountNumber = accountNumber;
          matchIndex++;
        } else {
          // Otherwise, create a new account
          accounts.push({
            accountName: 'Unknown Account',
            accountNumber,
            details: `Account number found near ${match.index} in text`,
          });
        }
      }
    }
  }
  
  return accounts;
}

/**
 * Extract inquiry information from credit report text
 */
function extract_inquiry_info(text: string): Array<{ accountName: string; details: string }> {
  const inquiries = [];
  
  // Look for common inquiry patterns in credit reports
  const inquiryPatterns = [
    /Inquir(?:y|ies) by:\s*([^\n\r]+)/gi,
    /Creditor:\s*([^\n\r]+)/gi,
    /Inquiry from:\s*([^\n\r]+)/gi,
  ];
  
  for (const pattern of inquiryPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim()) {
        inquiries.push({
          accountName: match[1].trim(),
          details: `Inquiry found near ${match.index} in text`,
        });
      }
    }
  }
  
  return inquiries;
}

// Implement additional issue detection functions
function detect_charge_offs(text: string): CreditReportIssue[] {
  // Similar implementation as other detection functions
  return [];
}

function detect_public_records(text: string): CreditReportIssue[] {
  return [];
}

function detect_bankruptcy(text: string): CreditReportIssue[] {
  return [];
}

function detect_high_balance(text: string): CreditReportIssue[] {
  return [];
}
