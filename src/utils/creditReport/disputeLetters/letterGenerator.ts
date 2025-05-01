
import { 
  CreditReportData, 
  CreditReportAccount, 
  IdentifiedIssue,
  PersonalInfo,
  FCRA_LAWS 
} from '../types';
import { 
  issueTemplateMapping, 
  bureauAddressMapping,
  generalDisputeTemplate 
} from './templates/issueSpecificTemplates';

/**
 * Generate a dispute letter for specific issues
 */
export async function generateDisputeLetter(
  issueType: string,
  accountData: any,
  userInfo: any,
  reportData?: CreditReportData | null
): Promise<string> {
  // Get the appropriate template based on issue type
  const template = issueTemplateMapping[issueType] || generalDisputeTemplate;
  
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Determine bureau name and address
  let bureauName = accountData.bureau || 'Credit Bureau';
  if (reportData?.primaryBureau) {
    bureauName = reportData.primaryBureau;
  } else if (reportData?.bureau) {
    bureauName = reportData.bureau;
  }
  
  // Ensure bureau name is one of the recognized bureaus
  if (!['Experian', 'Equifax', 'TransUnion'].includes(bureauName)) {
    // Try to detect which bureau from the report text
    if (reportData?.rawText) {
      const text = reportData.rawText.toLowerCase();
      if (text.includes('experian')) {
        bureauName = 'Experian';
      } else if (text.includes('equifax')) {
        bureauName = 'Equifax';
      } else if (text.includes('transunion') || text.includes('trans union')) {
        bureauName = 'TransUnion';
      }
    }
  }
  
  const bureauAddress = bureauAddressMapping[bureauName] || '[BUREAU ADDRESS]';
  
  // Get SSN (last 4 only for security)
  const ssnLast4 = userInfo.ssn ? 
    `xxx-xx-${userInfo.ssn.slice(-4)}` : 
    (reportData?.personalInfo?.ssn ? `xxx-xx-${reportData.personalInfo.ssn.slice(-4)}` : 'xxx-xx-xxxx');
  
  // Format issue details based on issue type
  let issueDetails = '';
  let issueReason = accountData.reason || accountData.errorDescription || 'This information is inaccurate and must be verified or removed';
  
  // Format specific details based on issue type
  switch (issueType) {
    case 'personal_info':
    case 'personalInfo':
      issueDetails = formatPersonalInfoIssues(reportData);
      break;
    case 'late_payment':
    case 'latePayments':
      issueDetails = formatLatePaymentIssues(accountData);
      break;
    case 'collection':
    case 'collections':
      issueDetails = formatCollectionIssues(accountData);
      break;
    case 'student_loan':
    case 'studentLoans':
      issueDetails = formatStudentLoanIssues(accountData, reportData);
      break;
    case 'inquiry':
    case 'inquiries':
      issueDetails = formatInquiryIssues(accountData, reportData);
      break;
    case 'bankruptcy':
      issueDetails = formatBankruptcyIssues(accountData);
      break;
    default:
      // General or inaccuracy cases
      issueDetails = formatGeneralInaccuracyIssues(accountData);
      break;
  }
  
  // Get appropriate legal references
  const legalRefs = getLegalReferencesForIssueType(issueType);
  
  // Create replacements map for template
  const replacements: Record<string, string> = {
    '[DATE]': currentDate,
    '[BUREAU_NAME]': bureauName,
    '[BUREAU_ADDRESS]': bureauAddress,
    '[CONSUMER_NAME]': userInfo.name || '[YOUR NAME]',
    '[CONSUMER_ADDRESS]': userInfo.address || '[YOUR ADDRESS]',
    '[CONSUMER_CITY]': userInfo.city || '[CITY]',
    '[CONSUMER_STATE]': userInfo.state || '[STATE]',
    '[CONSUMER_ZIP]': userInfo.zip || '[ZIP]',
    '[CONSUMER_SSN_LAST_4]': ssnLast4,
    '[REPORT_DATE]': reportData?.reportDate || currentDate,
    '[CREDITOR_NAME]': accountData.accountName || accountData.creditor || '[CREDITOR NAME]',
    '[ACCOUNT_NUMBER]': accountData.accountNumber || '[ACCOUNT NUMBER]',
    '[ORIGINAL_CREDITOR]': accountData.creditor || accountData.originalCreditor || '[ORIGINAL CREDITOR]',
    '[BALANCE]': formatCurrency(accountData.balance || accountData.currentBalance),
    '[REPORTED_INFO]': accountData.reportedInfo || '',
    '[ISSUE_DETAILS]': issueDetails,
    '[ISSUE_REASON]': issueReason,
    '[LATE_PAYMENT_DATES]': accountData.latePaymentDates || '[LATE PAYMENT DATES]',
    '[FILING_DATE]': accountData.filingDate || '[FILING DATE]',
    '[DISCHARGE_DATE]': accountData.dischargeDate || '[DISCHARGE DATE]',
    '[CASE_NUMBER]': accountData.caseNumber || '[CASE NUMBER]',
    '[INQUIRY_DATE]': accountData.inquiryDate || '[INQUIRY DATE]',
    '[LEGAL_REFERENCES]': formatLegalReferences(legalRefs)
  };
  
  // Apply replacements to template
  let letterContent = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    letterContent = letterContent.replace(new RegExp(placeholder, 'g'), value);
  }
  
  // Ensure letter doesn't contain any remaining placeholder brackets
  letterContent = cleanupRemainingPlaceholders(letterContent);
  
  return letterContent;
}

/**
 * Format personal information issues
 */
function formatPersonalInfoIssues(reportData?: CreditReportData | null): string {
  if (!reportData?.personalInfo) {
    return "Incorrect personal information (name, address, employer, or social security number)";
  }
  
  const issues = [];
  
  // Check for multiple names
  if (reportData.personalInfo.name && reportData.personalInfo.name.includes(',')) {
    issues.push(`Multiple names are showing on my credit report: ${reportData.personalInfo.name}`);
  }
  
  // Check for multiple addresses
  if (reportData.personalInfo.address && reportData.personalInfo.address.includes(',')) {
    issues.push(`Multiple addresses are showing on my credit report: ${reportData.personalInfo.address}`);
  }
  
  // Check for multiple employers
  if (reportData.personalInfo.employer && reportData.personalInfo.employer.includes(',')) {
    issues.push(`Multiple employers are showing on my credit report: ${reportData.personalInfo.employer}`);
  }
  
  // SSN issues
  if (reportData.personalInfo.ssn && 
     (reportData.personalInfo.ssn.includes(',') || reportData.personalInfo.ssn.length !== 9)) {
    issues.push("There are issues with my Social Security Number on the report");
  }
  
  if (issues.length === 0) {
    issues.push("My personal information contains inaccuracies that need to be corrected");
  }
  
  return issues.join("\n\n");
}

/**
 * Format late payment issues
 */
function formatLatePaymentIssues(accountData: any): string {
  const details = [];
  
  details.push(`Account: ${accountData.accountName || '[ACCOUNT NAME]'}`);
  
  if (accountData.accountNumber) {
    details.push(`Account Number: ${accountData.accountNumber}`);
  }
  
  if (accountData.balance || accountData.currentBalance) {
    details.push(`Current Balance: ${formatCurrency(accountData.balance || accountData.currentBalance)}`);
  }
  
  if (accountData.latePaymentDates || accountData.paymentHistory) {
    details.push(`Reported Late Payment History: ${accountData.latePaymentDates || accountData.paymentHistory}`);
  }
  
  details.push("\nThe late payment information reported for this account is inaccurate or cannot be verified for the following reasons:");
  details.push("- The payment history shown does not accurately reflect my actual payment history");
  details.push("- The reported late payments cannot be validated with proper documentation");
  
  if (accountData.reason) {
    details.push(`- ${accountData.reason}`);
  }
  
  return details.join("\n");
}

/**
 * Format collection issues
 */
function formatCollectionIssues(accountData: any): string {
  const details = [];
  
  details.push(`Collection Account: ${accountData.accountName || '[COLLECTION AGENCY]'}`);
  
  if (accountData.accountNumber) {
    details.push(`Account Number: ${accountData.accountNumber}`);
  }
  
  if (accountData.originalCreditor || accountData.creditor) {
    details.push(`Original Creditor: ${accountData.originalCreditor || accountData.creditor}`);
  }
  
  if (accountData.balance || accountData.currentBalance) {
    details.push(`Reported Balance: ${formatCurrency(accountData.balance || accountData.currentBalance)}`);
  }
  
  details.push("\nThis collection account is disputed for the following reasons:");
  details.push("- The debt cannot be properly verified with complete documentation");
  details.push("- The collection agency has not provided validation of this debt");
  
  if (accountData.reason) {
    details.push(`- ${accountData.reason}`);
  }
  
  return details.join("\n");
}

/**
 * Format student loan issues
 */
function formatStudentLoanIssues(accountData: any, reportData?: CreditReportData | null): string {
  const details = [];
  
  details.push(`Student Loan Account: ${accountData.accountName || '[LOAN SERVICER]'}`);
  
  if (accountData.accountNumber) {
    details.push(`Account Number: ${accountData.accountNumber}`);
  }
  
  if (accountData.balance || accountData.currentBalance) {
    details.push(`Reported Balance: ${formatCurrency(accountData.balance || accountData.currentBalance)}`);
  }
  
  // Look for potential duplicate loans
  if (reportData?.accounts) {
    const thisBalance = parseFloat(String(accountData.balance || accountData.currentBalance || 0));
    const possibleDuplicates = reportData.accounts.filter(acc => {
      // Skip the current account
      if (acc.accountNumber === accountData.accountNumber && 
          acc.accountName === accountData.accountName) {
        return false;
      }
      
      // Convert balance to number for comparison
      const accBalance = parseFloat(String(acc.balance || acc.currentBalance || 0));
      
      // Check if balances match or are very close (within 1%)
      const balancesMatch = Math.abs(accBalance - thisBalance) / thisBalance < 0.01;
      
      // Check for student loan related account names
      const isStudentLoan = 
        (acc.accountName || '').toLowerCase().includes('loan') ||
        (acc.accountName || '').toLowerCase().includes('dept of ed') ||
        (acc.accountName || '').toLowerCase().includes('navient') ||
        (acc.accountName || '').toLowerCase().includes('sallie');
        
      return balancesMatch && isStudentLoan;
    });
    
    if (possibleDuplicates.length > 0) {
      details.push("\nThis student loan appears to be reported multiple times on my credit report with the same or very similar loan amounts:");
      possibleDuplicates.forEach(dup => {
        details.push(`- Duplicate entry under ${dup.accountName} with balance ${formatCurrency(dup.balance || dup.currentBalance)}`);
      });
      details.push("\nThis appears to be the same loan that has been transferred or sold to a different servicer but is being incorrectly reported as separate accounts.");
    }
  }
  
  details.push("\nThis student loan account is disputed for the following reasons:");
  details.push("- The loan appears to be reported multiple times on my credit report");
  details.push("- The balance information is not accurate");
  
  if (accountData.reason) {
    details.push(`- ${accountData.reason}`);
  }
  
  return details.join("\n");
}

/**
 * Format inquiry issues
 */
function formatInquiryIssues(accountData: any, reportData?: CreditReportData | null): string {
  const details = [];
  
  details.push(`Inquiry by: ${accountData.creditor || accountData.inquiryBy || accountData.accountName || '[COMPANY NAME]'}`);
  
  if (accountData.inquiryDate) {
    details.push(`Inquiry Date: ${accountData.inquiryDate}`);
  }
  
  // Check if inquiry is over 1 year old
  let isOldInquiry = false;
  if (accountData.inquiryDate) {
    const inquiryDate = new Date(accountData.inquiryDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (inquiryDate < oneYearAgo) {
      isOldInquiry = true;
      details.push(`\nThis inquiry is over one year old (inquiry date: ${accountData.inquiryDate})`);
    }
    
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    if (inquiryDate < twoYearsAgo) {
      details.push(`This inquiry is over two years old and must be removed according to the FCRA`);
    }
  }
  
  details.push("\nI dispute this inquiry for the following reasons:");
  details.push("- I did not authorize this inquiry");
  
  if (isOldInquiry) {
    details.push("- This inquiry is over one year old and should be removed");
  }
  
  if (accountData.reason) {
    details.push(`- ${accountData.reason}`);
  }
  
  return details.join("\n");
}

/**
 * Format bankruptcy issues
 */
function formatBankruptcyIssues(accountData: any): string {
  const details = [];
  
  details.push(`Bankruptcy Information: ${accountData.accountName || '[BANKRUPTCY FILING]'}`);
  
  if (accountData.filingDate) {
    details.push(`Filing Date: ${accountData.filingDate}`);
  }
  
  if (accountData.dischargeDate) {
    details.push(`Discharge Date: ${accountData.dischargeDate}`);
  }
  
  if (accountData.caseNumber) {
    details.push(`Case Number: ${accountData.caseNumber}`);
  }
  
  details.push("\nI dispute this bankruptcy information for the following reasons:");
  details.push("- This bankruptcy information is inaccurate or outdated");
  details.push("- The reporting of this bankruptcy violates the 10-year reporting limitation under the FCRA");
  
  if (accountData.reason) {
    details.push(`- ${accountData.reason}`);
  }
  
  return details.join("\n");
}

/**
 * Format general or inaccuracy issues
 */
function formatGeneralInaccuracyIssues(accountData: any): string {
  const details = [];
  
  details.push(`Account: ${accountData.accountName || '[ACCOUNT NAME]'}`);
  
  if (accountData.accountNumber) {
    details.push(`Account Number: ${accountData.accountNumber}`);
  }
  
  if (accountData.balance || accountData.currentBalance) {
    details.push(`Current Balance: ${formatCurrency(accountData.balance || accountData.currentBalance)}`);
  }
  
  if (accountData.dateOpened || accountData.openDate) {
    details.push(`Date Opened: ${accountData.dateOpened || accountData.openDate}`);
  }
  
  if (accountData.status || accountData.paymentStatus) {
    details.push(`Status: ${accountData.status || accountData.paymentStatus}`);
  }
  
  details.push("\nThis account contains the following inaccuracies that must be corrected:");
  
  // Add more specific detail based on provided error description
  if (accountData.errorDescription) {
    details.push(`- ${accountData.errorDescription}`);
  } else {
    details.push("- The account information contains inaccuracies that must be verified or corrected");
    details.push("- The account details do not match my records");
  }
  
  if (accountData.reason) {
    details.push(`- ${accountData.reason}`);
  }
  
  return details.join("\n");
}

/**
 * Format currency values
 */
function formatCurrency(value: string | number | undefined): string {
  if (value === undefined || value === null) {
    return '$0.00';
  }
  
  if (typeof value === 'string') {
    // If it already has a dollar sign, return as is
    if (value.startsWith('$')) {
      return value;
    }
    
    // Try to parse the string to a number
    const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
    if (isNaN(numValue)) {
      return value;
    }
    
    return `$${numValue.toFixed(2)}`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

/**
 * Get legal references for a specific issue type
 */
function getLegalReferencesForIssueType(issueType: string): string[] {
  // Normalize the issue type to match FCRA_LAWS keys
  const normalizedType = issueType.replace(/[_-]/g, '').toLowerCase();
  
  // Map of normalized issue types to FCRA_LAWS keys
  const typeMapping: Record<string, keyof typeof FCRA_LAWS> = {
    'personalinfo': 'personalInfo',
    'latepayment': 'latePayments',
    'latepayments': 'latePayments',
    'collection': 'collections',
    'collections': 'collections',
    'inaccuracy': 'inaccuracies',
    'inaccuracies': 'inaccuracies',
    'inquiry': 'inquiries',
    'inquiries': 'inquiries',
    'studentloan': 'studentLoans',
    'studentloans': 'studentLoans',
    'bankruptcy': 'bankruptcy',
    'general': 'generalCredit'
  };
  
  // Get the mapped key
  const fcraKey = typeMapping[normalizedType] as keyof typeof FCRA_LAWS;
  
  // Return the legal references for the mapped key, or general credit references as fallback
  return FCRA_LAWS[fcraKey] || FCRA_LAWS.generalCredit || [];
}

/**
 * Format legal references for inclusion in a letter
 */
function formatLegalReferences(legalRefs: string[]): string {
  if (!legalRefs || legalRefs.length === 0) {
    return '';
  }
  
  return legalRefs.map(ref => `- ${ref}`).join('\n');
}

/**
 * Clean up any remaining placeholders in the letter
 */
function cleanupRemainingPlaceholders(content: string): string {
  // Replace any remaining placeholders with empty strings
  return content.replace(/\[[A-Z_]+\]/g, '');
}

/**
 * Generate dispute letters for multiple issues
 */
export async function generateLettersForIssues(
  issues: IdentifiedIssue[],
  reportData: CreditReportData,
  userInfo: any
): Promise<any[]> {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  const letters: any[] = [];
  
  for (const issue of issues) {
    try {
      // Determine the issue type
      const issueType = mapIssueTypeToTemplate(issue.type);
      
      // Use the account from the issue if available
      const account = issue.account || findAccountByName(reportData.accounts, issue.title);
      
      if (!account) {
        console.warn(`No account found for issue: ${issue.title}`);
        continue;
      }
      
      // Create a data object that includes both issue and account info
      const letterData = {
        ...account,
        ...issue,
        reason: issue.description,
        bureau: issue.laws ? issue.laws.join(', ') : reportData.primaryBureau || reportData.bureau
      };
      
      // Generate the letter content
      const letterContent = await generateDisputeLetter(
        issueType,
        letterData,
        userInfo,
        reportData
      );
      
      // Create a letter object
      const letter = {
        id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: `${issue.title} Dispute`,
        content: letterContent,
        letterContent,
        bureau: reportData.primaryBureau || reportData.bureau || letterData.bureau || 'Credit Bureau',
        accountName: account.accountName,
        accountNumber: account.accountNumber || '',
        errorType: issue.type,
        createdAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        status: 'ready'
      };
      
      letters.push(letter);
      console.log(`Generated letter for issue: ${issue.title}`);
    } catch (error) {
      console.error(`Error generating letter for issue ${issue.title}:`, error);
    }
  }
  
  return letters;
}

/**
 * Map issue type to template type
 */
function mapIssueTypeToTemplate(issueType: string): string {
  // Clean up issue type
  const normalizedType = issueType.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // Map of common issue types to template types
  const typeMapping: Record<string, string> = {
    'wrong_personal_info': 'personal_info',
    'incorrect_personal_info': 'personal_info',
    'personal_information': 'personal_info',
    'wrong_name': 'personal_info',
    'wrong_address': 'personal_info',
    'incorrect_name': 'personal_info',
    'incorrect_address': 'personal_info',
    'wrong_employer': 'personal_info',
    'incorrect_employer': 'personal_info',
    'wrong_ssn': 'personal_info',
    'incorrect_ssn': 'personal_info',
    
    'late_payment': 'late_payment',
    'late_payments': 'late_payment',
    'missed_payment': 'late_payment',
    'delinquent_account': 'late_payment',
    'payment_history': 'late_payment',
    
    'collection': 'collection',
    'collections': 'collection',
    'collection_account': 'collection',
    'debt_collection': 'collection',
    
    'student_loan': 'student_loan',
    'student_loans': 'student_loan',
    'duplicate_student_loan': 'student_loan',
    'federal_student_loan': 'student_loan',
    'private_student_loan': 'student_loan',
    
    'bankruptcy': 'bankruptcy',
    'chapter_7': 'bankruptcy',
    'chapter_13': 'bankruptcy',
    
    'inquiry': 'inquiry',
    'inquiries': 'inquiry',
    'hard_inquiry': 'inquiry',
    'unauthorized_inquiry': 'inquiry',
    
    'inaccuracy': 'inaccuracy',
    'inaccuracies': 'inaccuracy',
    'incorrect_information': 'inaccuracy',
    'account_error': 'inaccuracy',
    'reporting_error': 'inaccuracy',
    'balance_error': 'inaccuracy',
    'date_error': 'inaccuracy',
    'wrong_balance': 'inaccuracy',
    'incorrect_balance': 'inaccuracy'
  };
  
  // Return the mapped type or default to general
  return typeMapping[normalizedType] || 'general';
}

/**
 * Find an account by name in the accounts list
 */
function findAccountByName(
  accounts: CreditReportAccount[], 
  accountName: string
): CreditReportAccount | undefined {
  if (!accounts || accounts.length === 0) {
    return undefined;
  }
  
  // Clean up account name for comparison
  const cleanAccountName = accountName.toLowerCase().trim();
  
  // First try an exact match
  const exactMatch = accounts.find(
    acc => acc.accountName.toLowerCase().trim() === cleanAccountName
  );
  
  if (exactMatch) {
    return exactMatch;
  }
  
  // Try partial match
  const partialMatch = accounts.find(
    acc => cleanAccountName.includes(acc.accountName.toLowerCase().trim()) || 
          acc.accountName.toLowerCase().trim().includes(cleanAccountName)
  );
  
  return partialMatch;
}

/**
 * Enhanced dispute letter generator for specific discrepancies
 */
export async function generateEnhancedDisputeLetter(
  errorType: string,
  disputeInfo: {
    accountName: string;
    accountNumber?: string;
    errorDescription?: string;
    bureau?: string;
    relevantReportText?: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  reportData?: CreditReportData | null
): Promise<string> {
  // Map error type to issue type
  const issueType = mapIssueTypeToTemplate(errorType);
  
  // Get the bureau name
  const bureau = disputeInfo.bureau || 
                (reportData?.primaryBureau || 
                reportData?.bureau ||
                'Credit Bureau');
  
  // Create data object for letter generation
  const letterData = {
    ...disputeInfo,
    bureau: bureau,
    reason: disputeInfo.errorDescription || 'This information is inaccurate and requires investigation'
  };
  
  // Generate the letter content
  const letterContent = await generateDisputeLetter(
    issueType,
    letterData,
    userInfo,
    reportData
  );
  
  return letterContent;
}

/**
 * Enhanced generator for creating multiple dispute letters from issues
 */
export async function generateAndStoreDisputeLetters(
  issues: IdentifiedIssue[],
  reportData: CreditReportData,
  userInfo: any
): Promise<any[]> {
  // Generate letters for issues
  const letters = await generateLettersForIssues(issues, reportData, userInfo);
  
  // Store the letters in session storage
  try {
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    console.log(`Stored ${letters.length} generated letters in session storage`);
  } catch (error) {
    console.error("Failed to store generated letters in session:", error);
  }
  
  return letters;
}
