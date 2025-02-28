
import { CreditReportData, CreditReportAccount } from './creditReportParser';

/**
 * Enhance report data by extracting real account names
 */
export const enhanceReportData = (data: CreditReportData): CreditReportData => {
  // Extract account names from raw report text if available
  if (data.rawText) {
    const accountMatches = extractAccountsFromRawText(data.rawText);
    
    if (accountMatches.length > 0) {
      console.log("Found account names in raw text:", accountMatches);
      
      // Replace gibberish account names with real ones if we can match by context
      const enhancedAccounts = data.accounts.map(account => {
        // Try to find a real account name that might match this account's context
        const potentialMatch = findMatchingAccount(account, accountMatches);
        
        if (potentialMatch) {
          return {
            ...account,
            accountName: potentialMatch.name,
            accountNumber: potentialMatch.number || account.accountNumber
          };
        }
        
        return account;
      });
      
      return {
        ...data,
        accounts: enhancedAccounts
      };
    }
  }
  
  return data;
};

/**
 * Extract account names and numbers from raw text
 */
export const extractAccountsFromRawText = (rawText: string): Array<{ name: string, number?: string }> => {
  const accounts: Array<{ name: string, number?: string }> = [];
  
  // Look for common account section headers followed by account names
  const accountHeaderPatterns = [
    /account(?:\s+name)?s?[:\s]+([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi,
    /creditor[:\s]+([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi,
    /([A-Z][A-Z\s&]+(?:BANK|FINANCE|CREDIT|LOAN|AUTO|MORTGAGE|CARD|ONE|EXPRESS|AMEX|CAPITAL|CHASE))(?:[\s,#-]+(\d[\d-]+))?/g,
    /account\s+information(?:[:\s]+)?(?:[\r\n]+)([A-Z][A-Z\s&]+)(?:[\s,#-]+(\d[\d-]+))?/gi
  ];

  // Common credit account providers to look for
  const commonCreditors = [
    "CARMAX AUTO FINANCE", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE", "STUDENT"
  ];
  
  // Look for accounts using each pattern
  for (const pattern of accountHeaderPatterns) {
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[1].length > 3) {
        accounts.push({
          name: match[1].trim(),
          number: match[2] ? match[2].trim() : undefined
        });
      }
    }
  }
  
  // Look for common creditors directly
  for (const creditor of commonCreditors) {
    // Find creditor name in text with potential account number following it
    const creditorRegex = new RegExp(`${creditor}(?:[\\s,#-]+(\\d[\\d-]+))?`, 'gi');
    let match;
    while ((match = creditorRegex.exec(rawText)) !== null) {
      accounts.push({
        name: creditor,
        number: match[1] ? match[1].trim() : undefined
      });
    }
  }
  
  // Look for inquiries
  const inquiryPatterns = [
    /inquir(?:y|ies)(?:[:\s]+)(?:[\r\n]+)?([A-Z][A-Z\s&]+)/gi,
    /(?:INQUIRY|INQUIRIES)(?:[:\s]+)(?:[\r\n]+)?([A-Z][A-Z\s&]+)/g
  ];
  
  for (const pattern of inquiryPatterns) {
    let match;
    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[1].length > 3) {
        accounts.push({
          name: `Inquiry: ${match[1].trim()}`
        });
      }
    }
  }
  
  // Look for personal information sections
  if (rawText.toLowerCase().includes('address') || 
      rawText.toLowerCase().includes('personal information') || 
      rawText.toLowerCase().includes('consumer information')) {
    accounts.push({
      name: "Personal Information"
    });
  }
  
  // Look for student loan mentions
  if (rawText.toLowerCase().includes('student loan') || 
      rawText.toLowerCase().includes('department of education') || 
      rawText.toLowerCase().includes('dept of ed')) {
    accounts.push({
      name: "Student Loan"
    });
  }
  
  // Remove duplicates based on name
  const uniqueAccounts = Array.from(
    new Map(accounts.map(item => [item.name.toUpperCase(), item])).values()
  );
  
  return uniqueAccounts;
};

/**
 * Try to find a matching real account for a parsed account based on context
 */
export const findMatchingAccount = (
  account: CreditReportAccount, 
  realAccounts: Array<{ name: string, number?: string }>
): { name: string, number?: string } | null => {
  // If account already has a valid-looking name, keep it
  if (isValidAccountName(account.accountName)) {
    return null;
  }
  
  // If we have an account number, try to match by that first
  if (account.accountNumber) {
    const matchByNumber = realAccounts.find(real => 
      real.number && real.number === account.accountNumber
    );
    
    if (matchByNumber) {
      return matchByNumber;
    }
  }
  
  // Otherwise, just return the first real account we haven't matched yet
  // This is imperfect but better than gibberish
  // In a real implementation, we would use more context like balance, dates, etc.
  if (realAccounts.length > 0) {
    return realAccounts[0];
  }
  
  return null;
};

/**
 * Helper function to check if an account name is valid
 */
export const isValidAccountName = (name: string): boolean => {
  if (!name) return false;
  
  // Look for common PDF artifacts and garbage strings
  if (name.includes('endstream') || 
      name.includes('endobj') || 
      name.includes('FIRST') ||
      name.includes('Length') || 
      name.includes('Typ') ||
      name.match(/^[0-9]+\s*0\s*/) || // Pattern like "142 0" often in PDF data
      name.includes('GM') || // Common artifact in parsed PDFs
      name.includes('obj') ||
      name.match(/[{}\\<>]/g) // Special characters common in PDF artifacts
  ) {
    return false;
  }
  
  // Real account names typically have mostly alphanumeric characters
  // Count special characters (excluding spaces)
  const specialCharCount = (name.match(/[^a-zA-Z0-9\s]/g) || []).length;
  
  // If more than 15% of characters are special characters, it's likely not a valid name
  if (specialCharCount > name.length * 0.15) {
    return false;
  }
  
  // Real account names usually have uppercase letters
  const uppercaseCount = (name.match(/[A-Z]/g) || []).length;
  
  // Legitimate creditor names usually have capital letters
  if (name.length > 5 && uppercaseCount === 0) {
    return false;
  }
  
  // Check for known creditor names
  const commonCreditors = [
    "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE"
  ];
  
  for (const creditor of commonCreditors) {
    if (name.includes(creditor)) {
      return true;
    }
  }
  
  // Most legitimate account names will be at least 3 characters
  return name.length >= 3 && uppercaseCount > 0;
};

/**
 * Clean account name for display
 */
export const cleanAccountName = (name: string): string => {
  // Remove PDF artifacts if they exist
  let cleaned = name.replace(/^\d+\s+\d+\s+/, ''); // Remove patterns like "142 0 "
  cleaned = cleaned.replace(/GM\s+/, ''); // Remove "GM " prefix
  
  // If the name has a mix of garbage and real text, try to extract real words
  // Most real creditor names have 2+ capital letters in a row
  const matches = cleaned.match(/[A-Z]{2,}[A-Za-z\s]+/);
  if (matches && matches[0].length > 5) {
    return matches[0].trim();
  }
  
  // For common credit accounts, try to extract known creditor names
  const commonCreditors = [
    "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE"
  ];
  
  for (const creditor of commonCreditors) {
    if (cleaned.toUpperCase().includes(creditor)) {
      // Extract the portion containing the creditor name and some surrounding context
      const index = cleaned.toUpperCase().indexOf(creditor);
      const start = Math.max(0, index - 5);
      const end = Math.min(cleaned.length, index + creditor.length + 10);
      return cleaned.substring(start, end).trim();
    }
  }
  
  return cleaned.trim();
};

/**
 * Identify potential issues in the credit report
 */
export const identifyIssues = (data: CreditReportData): Array<{
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
}> => {
  const issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }> = [];
  
  // Even if we don't have valid accounts, check for raw text and try to identify potential issues
  if (data.rawText) {
    console.log("Examining raw text for potential issues, length:", data.rawText.length);
    
    // Look for inquiries in raw text
    if (data.rawText.toLowerCase().includes('inquiry') || data.rawText.toLowerCase().includes('inquiries')) {
      issues.push({
        type: 'inquiry',
        title: 'Credit Inquiries Detected',
        description: 'Your report contains credit inquiries. These may be affecting your score and should be reviewed for accuracy and authorization.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 604 (Permissible purposes of consumer reports)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
    
    // Look for late payments in raw text
    if (data.rawText.toLowerCase().includes('late') || 
        data.rawText.toLowerCase().includes('30 day') || 
        data.rawText.toLowerCase().includes('60 day') || 
        data.rawText.toLowerCase().includes('90 day') ||
        data.rawText.toLowerCase().includes('delinquent')) {
      issues.push({
        type: 'payment',
        title: 'Late Payment Records Detected',
        description: 'Your report appears to contain late payment information. These negative items have a significant impact on your score and should be verified for accuracy.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
    
    // Look for multiple addresses
    if ((data.rawText.toLowerCase().match(/address/g) || []).length > 1) {
      issues.push({
        type: 'address',
        title: 'Multiple Addresses Detected',
        description: 'Your report appears to list multiple addresses. Outdated or inaccurate address information should be removed to maintain accurate records.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // Look for potential name variations or misspellings
    if (data.rawText.toLowerCase().includes('also known as') || 
        data.rawText.toLowerCase().includes('aka') ||
        data.rawText.toLowerCase().includes('aliases')) {
      issues.push({
        type: 'name',
        title: 'Name Variations Detected',
        description: 'Your report appears to contain multiple name variations or possible spelling errors. These should be corrected to maintain accurate records.',
        impact: 'Medium Impact',
        impactColor: 'yellow',
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // Look for student loans
    if (data.rawText.toLowerCase().includes('student loan') || 
        data.rawText.toLowerCase().includes('dept of ed') || 
        data.rawText.toLowerCase().includes('department of education') ||
        data.rawText.toLowerCase().includes('navient') ||
        data.rawText.toLowerCase().includes('nelnet') ||
        data.rawText.toLowerCase().includes('great lakes') ||
        data.rawText.toLowerCase().includes('sallie mae')) {
      issues.push({
        type: 'student_loan',
        title: 'Student Loan Accounts Detected',
        description: 'Your report contains student loan accounts. Recent Department of Education changes may affect how these loans should be reported. These should be reviewed for compliance with current guidelines.',
        impact: 'High Impact',
        impactColor: 'orange',
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'Department of Education Guidelines']
      });
    }
    
    // Look for collections
    if (data.rawText.toLowerCase().includes('collection') || 
        data.rawText.toLowerCase().includes('collections')) {
      issues.push({
        type: 'collection',
        title: 'Collection Accounts Detected',
        description: 'Your report appears to contain collection accounts. These have a significant negative impact on your score and should be verified for accuracy and proper reporting.',
        impact: 'Critical Impact',
        impactColor: 'red',
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
  }
  
  // Filter accounts to only include those with valid names
  const validAccounts = data.accounts.filter(acc => isValidAccountName(acc.accountName));
  
  if (validAccounts.length === 0 && data.accounts.length > 0) {
    // If we have accounts but none with valid names, add a notice about parsing issues
    issues.push({
      type: 'parsing',
      title: 'Credit Report Parsing Issue',
      description: 'We encountered difficulties reading account names from your credit report. This may be due to the file format or encryption. However, we can still help you create dispute letters.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: []
    });
    
    console.log("No valid account names found. Original account names:", 
      data.accounts.map(acc => acc.accountName).join(", "));
    
    // Try to use raw text to extract account information
    if (data.rawText) {
      const extractedAccounts = extractAccountsFromRawText(data.rawText);
      console.log("Extracted accounts from raw text:", extractedAccounts);
      
      if (extractedAccounts.length > 0) {
        // Use the extracted accounts for issue identification
        for (const account of extractedAccounts) {
          issues.push({
            type: 'general',
            title: `Review Account Information (${account.name})`,
            description: `We found ${account.name}${account.number ? ` (Account #${account.number})` : ''} in your report. Review this account for accuracy.`,
            impact: 'Medium Impact',
            impactColor: 'yellow',
            account: {
              accountName: account.name,
              accountNumber: account.number || '',
              balance: '',
              dateOpened: '',
              dateReported: '',
              paymentStatus: '',
              remarks: []
            },
            laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
          });
        }
      }
    }
    
    // If we still couldn't find valid accounts but we found issues, don't add a generic issue
    if (issues.length > 1) {
      return issues;
    }
    
    // If we couldn't find any accounts or issues, add generic dispute opportunities
    issues.push({
      type: 'generic',
      title: 'Generic Credit Report Review',
      description: 'Even though we could not identify specific accounts in your report, we can create dispute letters addressing common credit reporting issues. We can help with inquiries, personal information, and more.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    return issues;
  }
  
  // Clean up account names for better presentation
  const cleanedAccounts = validAccounts.map(acc => ({
    ...acc,
    accountName: cleanAccountName(acc.accountName)
  }));
  
  console.log("Cleaned account names:", cleanedAccounts.map(acc => acc.accountName).join(", "));
  
  // Check for duplicate accounts (accounts with similar names)
  const accountNames = cleanedAccounts.map(acc => acc.accountName.toLowerCase());
  const duplicateNameMap = new Map<string, CreditReportAccount[]>();
  
  cleanedAccounts.forEach(account => {
    const simplifiedName = account.accountName.toLowerCase().replace(/\s+/g, '');
    if (!duplicateNameMap.has(simplifiedName)) {
      duplicateNameMap.set(simplifiedName, []);
    }
    duplicateNameMap.get(simplifiedName)?.push(account);
  });
  
  // Add duplicate accounts as issues
  for (const [name, accounts] of duplicateNameMap.entries()) {
    if (accounts.length > 1) {
      issues.push({
        type: 'duplicate',
        title: `Duplicate Account (${accounts[0].accountName})`,
        description: `The same ${accounts[0].accountName} account appears ${accounts.length} times on your report with different account numbers. This may be inaccurate and affecting your utilization ratio.`,
        impact: 'High Impact',
        impactColor: 'orange',
        account: accounts[0],
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)', 'FCRA § 623 (Responsibilities of furnishers of information)']
      });
    }
  }
  
  // Check for accounts with late payments or negative remarks
  cleanedAccounts.forEach(account => {
    // Check payment status
    if (account.paymentStatus && (
      account.paymentStatus.includes('Late') || 
      account.paymentStatus.includes('Delinquent') ||
      account.paymentStatus.includes('Collection')
    )) {
      issues.push({
        type: 'payment',
        title: `Late Payment Status (${account.accountName})`,
        description: `Your ${account.accountName} account shows a "${account.paymentStatus}" status, which could significantly impact your credit score.`,
        impact: 'Critical Impact',
        impactColor: 'red',
        account: account,
        laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
      });
    }
    
    // Check for negative remarks
    if (account.remarks && account.remarks.length > 0) {
      issues.push({
        type: 'remarks',
        title: `Negative Remarks (${account.accountName})`,
        description: `Your ${account.accountName} account has the following remarks: ${account.remarks.join(', ')}. These could be disputed if inaccurate.`,
        impact: 'Critical Impact',
        impactColor: 'red',
        account: account,
        laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
      });
    }
    
    // Always suggest reviewing each account for potential inaccuracies
    issues.push({
      type: 'account_review',
      title: `Review Account Details (${account.accountName})`,
      description: `All details of your ${account.accountName} account should be carefully reviewed. Creditors often report incorrect balances, payment history, or account status.`,
      impact: 'Medium Impact',
      impactColor: 'yellow',
      account: account,
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  });
  
  // Check for personal information issues
  if (data.personalInfo) {
    issues.push({
      type: 'personal_info',
      title: 'Personal Information Review',
      description: 'Your personal information should be verified for accuracy, including name spelling, current and previous addresses, and employment information.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
    });
  }
  
  // If no issues found, add generic issues
  if (issues.length === 0) {
    // Add a few generic issues that are likely to apply to any credit report
    issues.push({
      type: 'inquiry',
      title: 'Credit Inquiries Review',
      description: 'All inquiries on your credit report should be reviewed to ensure they were authorized by you. Unauthorized inquiries can be disputed and removed.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 604 (Permissible purposes of consumer reports)']
    });
    
    issues.push({
      type: 'bureau_comparison',
      title: 'Cross-Bureau Data Comparison',
      description: 'Information often varies between credit bureaus. Accounts, balances, and status should be consistent across all three major bureaus.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    });
    
    if (cleanedAccounts.length > 0) {
      const randomAccount = cleanedAccounts[Math.floor(Math.random() * cleanedAccounts.length)];
      issues.push({
        type: 'general',
        title: `Review Account Information (${randomAccount.accountName})`,
        description: `No obvious errors were detected, but you should carefully review your ${randomAccount.accountName} account details for accuracy.`,
        impact: 'Medium Impact',
        impactColor: 'yellow',
        account: randomAccount,
        laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
      });
    }
  }
  
  return issues;
};
