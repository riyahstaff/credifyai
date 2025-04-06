import { supabase } from '@/lib/supabase/client';
import { CreditReportData } from '../types';
import { DisputeLetter, LetterTemplate, Issue } from '../types/letterTypes';

/**
 * Advanced dispute letter generator for credit report issues
 */

/**
 * Generates an enhanced dispute letter based on credit report data and identified issues
 * @param creditReportData The parsed credit report data
 * @param issues Array of identified issues in the credit report
 * @param userId The user ID for storing the letter
 * @returns The generated dispute letter object
 */
export async function generateEnhancedDisputeLetter(
  creditReportData: CreditReportData,
  issues: Issue[],
  userId: string
): Promise<DisputeLetter> {
  try {
    // Group issues by bureau and account
    const groupedIssues = groupIssuesByBureauAndAccount(issues);
    
    // For each group, select the appropriate template and generate a letter
    const letters: DisputeLetter[] = [];
    
    for (const group of groupedIssues) {
      const { bureau, accountName, accountNumber, issues: groupIssues } = group;
      
      // Determine the primary issue type for template selection
      const primaryIssueType = determinePrimaryIssueType(groupIssues);
      
      // Fetch the appropriate template from Supabase
      const template = await fetchLetterTemplate(primaryIssueType);
      
      if (!template) {
        console.error(`No template found for issue type: ${primaryIssueType}`);
        continue;
      }
      
      // Generate the letter content
      const letterContent = generateLetterContent(
        template,
        creditReportData,
        bureau,
        accountName,
        accountNumber,
        groupIssues
      );
      
      // Create the dispute letter object
      const letter: DisputeLetter = {
        id: generateUniqueId(),
        title: `${bureau} Dispute - ${accountName || 'Multiple Accounts'}`,
        content: letterContent,
        letterContent: letterContent, // Duplicate for compatibility
        bureau,
        accountName: accountName || 'Multiple Accounts',
        accountNumber: accountNumber || 'Multiple',
        errorType: primaryIssueType,
        status: 'ready',
        createdAt: new Date().toISOString(),
        userId
      };
      
      letters.push(letter);
      
      // Store the letter in Supabase
      await storeDisputeLetter(letter);
    }
    
    // Return the first letter or a default letter if none were generated
    return letters[0] || createDefaultLetter(creditReportData, userId);
  } catch (error) {
    console.error('Error generating dispute letter:', error);
    return createDefaultLetter(creditReportData, userId);
  }
}

/**
 * Groups issues by bureau and account for more targeted letter generation
 */
function groupIssuesByBureauAndAccount(issues: Issue[]): {
  bureau: string;
  accountName?: string;
  accountNumber?: string;
  issues: Issue[];
}[] {
  const groups: Map<string, {
    bureau: string;
    accountName?: string;
    accountNumber?: string;
    issues: Issue[];
  }> = new Map();
  
  for (const issue of issues) {
    const { bureau, accountName, accountNumber } = issue;
    
    // Create a key for grouping
    const key = `${bureau}|${accountName || ''}|${accountNumber || ''}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        bureau,
        accountName,
        accountNumber,
        issues: []
      });
    }
    
    groups.get(key)?.issues.push(issue);
  }
  
  return Array.from(groups.values());
}

/**
 * Determines the primary issue type for template selection
 */
function determinePrimaryIssueType(issues: Issue[]): string {
  // Count occurrences of each issue type
  const typeCounts: Record<string, number> = {};
  
  for (const issue of issues) {
    const { type } = issue;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }
  
  // Find the most common issue type
  let maxCount = 0;
  let primaryType = 'general';
  
  for (const [type, count] of Object.entries(typeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      primaryType = type;
    }
  }
  
  // Map the primary type to one of our template types
  const templateTypeMap: Record<string, string> = {
    'inconsistent_information': 'inconsistent_information',
    'multiple_addresses': 'multiple_addresses',
    'late_payment': 'late_payment_disputes',
    'collection_account': 'collection_account_disputes',
    'student_loan': 'student_loan_disputes',
    'inquiry': 'inquiry_disputes',
    'personal_information': 'personal_information_disputes',
    'account_ownership': 'account_ownership_disputes',
    'general': 'inconsistent_information' // Default to inconsistent information
  };
  
  return templateTypeMap[primaryType] || 'inconsistent_information';
}

/**
 * Fetches the appropriate letter template from Supabase
 */
async function fetchLetterTemplate(templateType: string): Promise<LetterTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('letter_templates')
      .select('*')
      .eq('type', templateType)
      .single();
    
    if (error) {
      console.error('Error fetching letter template:', error);
      return null;
    }
    
    return data as LetterTemplate;
  } catch (error) {
    console.error('Error fetching letter template:', error);
    return null;
  }
}

/**
 * Generates the letter content by replacing placeholders in the template
 */
function generateLetterContent(
  template: LetterTemplate,
  creditReportData: CreditReportData,
  bureau: string,
  accountName?: string,
  accountNumber?: string,
  issues?: Issue[]
): string {
  let content = template.content;
  
  // Replace personal information placeholders
  const { personalInfo } = creditReportData;
  
  if (personalInfo) {
    content = content.replace(/{CONSUMER_FULL_NAME}/g, personalInfo.name || '');
    content = content.replace(/{CONSUMER_STREET_ADDRESS}/g, personalInfo.address || '');
    content = content.replace(/{CONSUMER_CITY}/g, personalInfo.city || '');
    content = content.replace(/{CONSUMER_STATE}/g, personalInfo.state || '');
    content = content.replace(/{CONSUMER_ZIP}/g, personalInfo.zip || '');
    content = content.replace(/{CONSUMER_SSN_LAST4}/g, personalInfo.ssn?.slice(-4) || '');
    content = content.replace(/{CONSUMER_DOB}/g, personalInfo.dob || '');
    content = content.replace(/{CURRENT_DATE}/g, new Date().toLocaleDateString());
    content = content.replace(/{CONSUMER_EMPLOYER}/g, personalInfo.employer || '');
    content = content.replace(/{CONSUMER_PHONE}/g, personalInfo.phone || '');
  }
  
  // Replace credit bureau specific placeholders
  const bureauInfo = getBureauInfo(bureau);
  
  content = content.replace(/{CREDIT_BUREAU_NAME}/g, bureauInfo.name);
  content = content.replace(/{CREDIT_BUREAU_ADDRESS}/g, bureauInfo.address);
  content = content.replace(/{CREDIT_BUREAU_CITY}/g, bureauInfo.city);
  content = content.replace(/{CREDIT_BUREAU_STATE}/g, bureauInfo.state);
  content = content.replace(/{CREDIT_BUREAU_ZIP}/g, bureauInfo.zip);
  content = content.replace(/{CREDIT_REPORT_NUMBER}/g, creditReportData.reportNumber || '');
  
  // Replace account information placeholders if applicable
  if (accountName) {
    content = content.replace(/{ACCOUNT_NAME}/g, accountName);
  }
  
  if (accountNumber) {
    content = content.replace(/{ACCOUNT_NUMBER_MASKED}/g, maskAccountNumber(accountNumber));
  }
  
  // Generate and replace dynamic content based on issues
  if (issues && issues.length > 0) {
    const disputeSummaryList = generateDisputeSummaryList(issues);
    const specificDisputeDetails = generateSpecificDisputeDetails(issues);
    
    content = content.replace(/{DISPUTE_SUMMARY_LIST}/g, disputeSummaryList);
    content = content.replace(/{SPECIFIC_DISPUTE_DETAILS}/g, specificDisputeDetails);
    
    // Replace specific issue type placeholders
    const issueTypes = issues.map(issue => issue.type);
    
    if (issueTypes.includes('inconsistent_information')) {
      const inconsistentList = generateInconsistentBureausList(issues.filter(i => i.type === 'inconsistent_information'));
      content = content.replace(/{INCONSISTENT_BUREAUS_LIST}/g, inconsistentList);
    }
    
    if (issueTypes.includes('multiple_addresses')) {
      const addressesList = generateIncorrectAddressesList(issues.filter(i => i.type === 'multiple_addresses'));
      content = content.replace(/{INCORRECT_ADDRESSES_LIST}/g, addressesList);
    }
    
    if (issueTypes.includes('late_payment')) {
      const latePaymentsList = generateLatePaymentAccountsList(issues.filter(i => i.type === 'late_payment'));
      content = content.replace(/{LATE_PAYMENT_ACCOUNTS_LIST}/g, latePaymentsList);
    }
    
    if (issueTypes.includes('collection_account')) {
      const collectionsList = generateCollectionAccountsList(issues.filter(i => i.type === 'collection_account'));
      content = content.replace(/{COLLECTION_ACCOUNTS_LIST}/g, collectionsList);
    }
    
    if (issueTypes.includes('student_loan')) {
      const studentLoansList = generateStudentLoanAccountsList(issues.filter(i => i.type === 'student_loan'));
      content = content.replace(/{STUDENT_LOAN_ACCOUNTS_LIST}/g, studentLoansList);
    }
    
    if (issueTypes.includes('inquiry')) {
      const inquiriesList = generateUnauthorizedInquiriesList(issues.filter(i => i.type === 'inquiry'));
      content = content.replace(/{UNAUTHORIZED_INQUIRIES_LIST}/g, inquiriesList);
    }
    
    if (issueTypes.includes('personal_information')) {
      const personalInfoList = generateIncorrectPersonalInfoList(issues.filter(i => i.type === 'personal_information'));
      content = content.replace(/{INCORRECT_PERSONAL_INFO_LIST}/g, personalInfoList);
    }
    
    if (issueTypes.includes('account_ownership')) {
      const notMyAccountsList = generateNotMyAccountsList(issues.filter(i => i.type === 'account_ownership'));
      content = content.replace(/{NOT_MY_ACCOUNTS_LIST}/g, notMyAccountsList);
    }
  }
  
  // Replace any remaining placeholders with empty strings
  content = content.replace(/{[A-Z_]+}/g, '');
  
  return content;
}

/**
 * Gets information for a specific credit bureau
 */
function getBureauInfo(bureau: string): {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
} {
  const bureauMap: Record<string, {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  }> = {
    'experian': {
      name: 'Experian',
      address: 'PO Box 4500',
      city: 'Allen',
      state: 'TX',
      zip: '75013'
    },
    'equifax': {
      name: 'Equifax',
      address: 'PO Box 740256',
      city: 'Atlanta',
      state: 'GA',
      zip: '30374'
    },
    'transunion': {
      name: 'TransUnion',
      address: 'PO Box 2000',
      city: 'Chester',
      state: 'PA',
      zip: '19016'
    }
  };
  
  return bureauMap[bureau.toLowerCase()] || bureauMap['experian'];
}

/**
 * Masks an account number for security
 */
function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) {
    return accountNumber;
  }
  
  const lastFour = accountNumber.slice(-4);
  const maskedPart = '*'.repeat(accountNumber.length - 4);
  
  return maskedPart + lastFour;
}

/**
 * Generates a bulleted list of dispute items
 */
function generateDisputeSummaryList(issues: Issue[]): string {
  return issues.map(issue => `• ${issue.description}`).join('\n');
}

/**
 * Generates detailed explanations for each dispute item
 */
function generateSpecificDisputeDetails(issues: Issue[]): string {
  return issues.map(issue => {
    return `${issue.accountName ? `Account: ${issue.accountName}` : 'Issue'} ${issue.accountNumber ? `(Account ending in ${issue.accountNumber.slice(-4)})` : ''}\n` +
           `Description: ${issue.description}\n` +
           `Reason: ${issue.reason || 'Information is inaccurate or incomplete'}\n` +
           `Legal Basis: ${issue.legalBasis || 'FCRA Section 1681e requiring maximum possible accuracy'}\n`;
  }).join('\n\n');
}

/**
 * Generates a list of inconsistencies between bureaus
 */
function generateInconsistentBureausList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.accountName || 'Account'} ${issue.accountNumber ? `(ending in ${issue.accountNumber.slice(-4)})` : ''}: ` +
           `${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of incorrect addresses
 */
function generateIncorrectAddressesList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of accounts with disputed late payments
 */
function generateLatePaymentAccountsList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.accountName || 'Account'} ${issue.accountNumber ? `(ending in ${issue.accountNumber.slice(-4)})` : ''}: ` +
           `${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of disputed collection accounts
 */
function generateCollectionAccountsList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.accountName || 'Collection Account'} ${issue.accountNumber ? `(ending in ${issue.accountNumber.slice(-4)})` : ''}: ` +
           `${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of disputed student loan accounts
 */
function generateStudentLoanAccountsList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.accountName || 'Student Loan'} ${issue.accountNumber ? `(ending in ${issue.accountNumber.slice(-4)})` : ''}: ` +
           `${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of unauthorized inquiries
 */
function generateUnauthorizedInquiriesList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.accountName || 'Company'} (${issue.date || 'Unknown Date'}): ` +
           `${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of incorrect personal information
 */
function generateIncorrectPersonalInfoList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.description}`;
  }).join('\n');
}

/**
 * Generates a list of accounts that don't belong to the consumer
 */
function generateNotMyAccountsList(issues: Issue[]): string {
  return issues.map(issue => {
    return `• ${issue.accountName || 'Account'} ${issue.accountNumber ? `(ending in ${issue.accountNumber.slice(-4)})` : ''}: ` +
           `${issue.description}`;
  }).join('\n');
}

/**
 * Stores a dispute letter in Supabase
 */
async function storeDisputeLetter(letter: DisputeLetter): Promise<void> {
  try {
    const { error } = await supabase
      .from('dispute_letters')
      .insert(letter);
    
    if (error) {
      console.error('Error storing dispute letter:', error);
    }
  } catch (error) {
    console.error('Error storing dispute letter:', error);
  }
}

/**
 * Generates a unique ID for a dispute letter
 */
function generateUniqueId(): string {
  return `letter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a default letter if no specific issues were identified
 */
function createDefaultLetter(creditReportData: CreditReportData, userId: string): DisputeLetter {
  return {
    id: generateUniqueId(),
    title: 'General Credit Report Dispute',
    content: 'Please review the attached credit report for accuracy.',
    letterContent: 'Please review the attached credit report for accuracy.',
    bureau: creditReportData.primaryBureau || 'all',
    accountName: 'Multiple Accounts',
    accountNumber: 'Multiple',
    errorType: 'general',
    status: 'draft',
    createdAt: new Date().toISOString(),
    userId
  };
}
