
import { bureauAddressMapping, issueTemplateMapping } from './templates/issueSpecificTemplates';
import { getTemplateForIssueType } from './templateLoader';
import { CreditReportData, Issue } from '@/utils/creditReport/types';
import { FCRA_LAWS } from '@/utils/creditReport/constants';

// Define the legal references
const LEGAL_REFERENCES = {
  latePayments: ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)'],
  collections: ['15 USC 1692c', '15 USC 1681s-2(a)(3)'],
  inaccuracies: ['15 USC 1681e(b)', '15 USC 1681i'],
  inquiries: ['15 USC 1681b(a)(2)', '15 USC 1681m'],
  personalInfo: ['15 USC 1681c', '15 USC 1681g'],
  studentLoans: ['15 USC 1681e(b)', '15 USC 1681i'],
  bankruptcy: ['15 USC 1681c', '15 USC 1681i', '15 USC 1681e(b)'],
  metro2: ['Metro 2® Compliance Guidelines']
};

/**
 * Generate dispute letter
 */
export async function generateDisputeLetter(
  issueType: string,
  accountDetails: any,
  userInfo: any,
  creditReportData?: any
): Promise<string> {
  // Determine which bureau to address
  const bureau = accountDetails.bureau || 
                 creditReportData?.primaryBureau || 
                 creditReportData?.bureau || 
                 'Credit Bureau';
                 
  console.log(`Generating dispute letter for ${issueType} issue with ${bureau}`);
  
  // Load the template for this issue type
  const template = await getTemplateForIssueType(issueType);
  
  // Get bureau address
  const bureauAddress = bureauAddressMapping[bureau] || bureauAddressMapping['Unknown'];
  
  // Get legal references for this issue type
  const legalRefs = getLegalReferencesForIssue(issueType);
  
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Prepare data for replacement in the template
  const data = {
    DATE: currentDate,
    BUREAU_NAME: bureau,
    BUREAU_ADDRESS: bureauAddress,
    CONSUMER_NAME: userInfo?.name || '[YOUR NAME]',
    CONSUMER_ADDRESS: formatUserAddress(userInfo),
    ACCOUNT_DETAILS: formatAccountDetails(accountDetails),
    ISSUE_TYPE: issueType,
    ISSUE_DESCRIPTION: accountDetails.errorDescription || `This ${issueType} appears to be inaccurate.`,
    LEGAL_REFERENCES: formatLegalReferences(legalRefs),
    ACCOUNT_NAME: accountDetails.accountName || 'Account in Question',
    ACCOUNT_NUMBER: accountDetails.accountNumber ? `Account Number: ${accountDetails.accountNumber}` : '',
  };
  
  // Replace placeholders in the template with actual data
  let letter = template;
  for (const [key, value] of Object.entries(data)) {
    letter = letter.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
  }
  
  return letter;
}

/**
 * Get legal references for a specific issue type
 */
function getLegalReferencesForIssue(issueType: string): string[] {
  // Normalize the issue type
  const type = issueType.toLowerCase();
  
  if (type.includes('personal') || type.includes('info')) {
    return LEGAL_REFERENCES.personalInfo;
  } else if (type.includes('late') || type.includes('payment')) {
    return LEGAL_REFERENCES.latePayments;
  } else if (type.includes('collect')) {
    return LEGAL_REFERENCES.collections;
  } else if (type.includes('inquiry')) {
    return LEGAL_REFERENCES.inquiries;
  } else if (type.includes('student') || type.includes('loan')) {
    return LEGAL_REFERENCES.studentLoans;
  } else if (type.includes('bankrupt')) {
    return LEGAL_REFERENCES.bankruptcy;
  } else {
    return LEGAL_REFERENCES.inaccuracies;
  }
}

/**
 * Format legal references into a readable string
 */
function formatLegalReferences(references: string[]): string {
  if (!references || references.length === 0) {
    return '';
  }
  
  return references.map(ref => `- ${ref}`).join('\n');
}

/**
 * Format user address information
 */
function formatUserAddress(userInfo: any): string {
  if (!userInfo) return '[YOUR ADDRESS]';
  
  let address = '';
  
  if (userInfo.address) {
    address += userInfo.address;
  }
  
  if (userInfo.city || userInfo.state || userInfo.zip) {
    if (address) address += '\n';
    
    if (userInfo.city) {
      address += userInfo.city;
    }
    
    if (userInfo.state) {
      if (userInfo.city) address += ', ';
      address += userInfo.state;
    }
    
    if (userInfo.zip) {
      address += ' ' + userInfo.zip;
    }
  }
  
  return address || '[YOUR ADDRESS]';
}

/**
 * Format account details
 */
function formatAccountDetails(accountDetails: any): string {
  if (!accountDetails) return '';
  
  let details = '';
  
  if (accountDetails.accountName) {
    details += `Account Name: ${accountDetails.accountName}\n`;
  }
  
  if (accountDetails.accountNumber) {
    details += `Account Number: ${accountDetails.accountNumber}\n`;
  }
  
  if (accountDetails.balance) {
    details += `Balance: $${accountDetails.balance}\n`;
  }
  
  if (accountDetails.openDate) {
    details += `Date Opened: ${accountDetails.openDate}\n`;
  }
  
  if (accountDetails.errorDescription) {
    details += `\nIssue: ${accountDetails.errorDescription}\n`;
  }
  
  return details;
}

/**
 * Enhanced dispute letter generation with more specific formatting
 */
export async function generateEnhancedDisputeLetter(
  issueType: string,
  accountDetails: any,
  userInfo: any,
  creditReportData?: any
): Promise<string> {
  // Use the basic generator and then enhance the output
  let letter = await generateDisputeLetter(issueType, accountDetails, userInfo, creditReportData);
  
  // Ensure letter has the proper bureau
  const bureau = accountDetails.bureau || 
                creditReportData?.primaryBureau || 
                creditReportData?.bureau || 
                'Credit Bureau';
  
  // Make sure Metro 2 language is included
  if (!letter.includes('Metro 2')) {
    letter += `\n\nIn accordance with Metro 2® reporting guidelines, I request that you properly code this account as "disputed by consumer" (compliance code XB) during your investigation.`;
  }
  
  // Ensure FCRA 30-day investigation requirement is mentioned
  if (!letter.includes('30 days')) {
    letter += `\n\nI understand that according to the Fair Credit Reporting Act, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.`;
  }
  
  // Make sure letter has a proper closing
  if (!letter.includes('Sincerely')) {
    letter += `\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n\n${userInfo?.name || '[YOUR NAME]'}`;
  }
  
  return letter;
}

/**
 * Generate letters for multiple issues
 */
export async function generateLettersForIssues(
  issues: Issue[],
  userInfo: any,
  creditReportData?: any
): Promise<{ content: string, bureau: string }[]> {
  // Group issues by bureau
  const issuesByBureau: Record<string, Issue[]> = {};
  
  for (const issue of issues) {
    const bureau = issue.bureau || 'Unknown';
    if (!issuesByBureau[bureau]) {
      issuesByBureau[bureau] = [];
    }
    issuesByBureau[bureau].push(issue);
  }
  
  // Generate a letter for each bureau
  const letters = [];
  
  for (const [bureau, bureauIssues] of Object.entries(issuesByBureau)) {
    // Group issues by type
    const issuesByType: Record<string, Issue[]> = {};
    
    for (const issue of bureauIssues) {
      if (!issuesByType[issue.type]) {
        issuesByType[issue.type] = [];
      }
      issuesByType[issue.type].push(issue);
    }
    
    // Generate letter content
    let letterContent = '';
    
    // User information and date
    letterContent += `${userInfo?.name || '[YOUR NAME]'}\n`;
    letterContent += `${formatUserAddress(userInfo)}\n\n`;
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    letterContent += `${currentDate}\n\n`;
    
    // Bureau information
    letterContent += `${bureau}\n`;
    letterContent += `${bureauAddressMapping[bureau] || bureauAddressMapping['Unknown']}\n\n`;
    
    // Letter subject
    letterContent += `RE: Dispute of Inaccurate Information in Credit Report\n\n`;
    letterContent += `To Whom It May Concern:\n\n`;
    
    // Introduction
    letterContent += `I am writing to dispute the following information in my credit report. The items listed below are inaccurate and/or incomplete. Under the Fair Credit Reporting Act (FCRA), I request that you investigate and correct the following items:\n\n`;
    
    // List each issue by type
    for (const [type, typeIssues] of Object.entries(issuesByType)) {
      // Get legal references for this issue type
      const legalRefs = getLegalReferencesForIssue(type);
      
      // Add a section for this issue type
      switch (type) {
        case 'personal_info':
          letterContent += `DISPUTED PERSONAL INFORMATION:\n`;
          break;
        case 'late_payment':
          letterContent += `DISPUTED LATE PAYMENT ACCOUNTS:\n`;
          break;
        case 'collection':
          letterContent += `DISPUTED COLLECTION ACCOUNTS:\n`;
          break;
        case 'inquiry':
          letterContent += `DISPUTED INQUIRIES:\n`;
          break;
        case 'student_loan':
          letterContent += `DISPUTED STUDENT LOAN ACCOUNTS:\n`;
          break;
        case 'bankruptcy':
          letterContent += `DISPUTED BANKRUPTCY INFORMATION:\n`;
          break;
        default:
          letterContent += `DISPUTED ACCOUNTS:\n`;
      }
      
      // List each specific issue
      for (const issue of typeIssues) {
        if (issue.accountName) {
          letterContent += `- ${issue.accountName}`;
          if (issue.accountNumber) {
            letterContent += ` (Account #: ${issue.accountNumber})`;
          }
          letterContent += `\n`;
        }
        
        letterContent += `  Issue: ${issue.description}\n`;
        letterContent += `  Reason: ${issue.reason}\n\n`;
      }
      
      // Add legal references for this type
      letterContent += `Legal basis for this dispute:\n`;
      letterContent += formatLegalReferences(legalRefs) + '\n\n';
    }
    
    // Add standard closing text
    letterContent += `Under the Fair Credit Reporting Act (FCRA), you are required to:\n`;
    letterContent += `1. Conduct a reasonable investigation into the information I am disputing\n`;
    letterContent += `2. Forward all relevant information that I provide to the furnisher\n`;
    letterContent += `3. Review and consider all relevant information\n`;
    letterContent += `4. Provide me the results of your investigation\n`;
    letterContent += `5. Delete the disputed information if it cannot be verified\n\n`;
    
    letterContent += `In accordance with Metro 2® reporting guidelines, I request that you properly code these accounts as "disputed by consumer" (compliance code XB) during your investigation.\n\n`;
    
    letterContent += `I understand that according to the Fair Credit Reporting Act, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.\n\n`;
    
    letterContent += `Thank you for your prompt attention to this matter.\n\n`;
    
    letterContent += `Sincerely,\n\n`;
    letterContent += `${userInfo?.name || '[YOUR NAME]'}`;
    
    // Add letter to the list
    letters.push({
      content: letterContent,
      bureau: bureau
    });
  }
  
  return letters;
}

/**
 * Generate and store dispute letters
 */
export async function generateAndStoreDisputeLetters(
  issues: Issue[],
  reportData: CreditReportData,
  userInfo: any
): Promise<any[]> {
  console.log(`Generating letters for ${issues.length} issues`);
  
  // Generate letters for all issues
  const generatedLetters = await generateLettersForIssues(issues, userInfo, reportData);
  
  // Format letters for storage
  const storedLetters = generatedLetters.map((letter, index) => {
    // Find an account to use for this letter
    let accountName = '';
    let accountNumber = '';
    
    const issuesForBureau = issues.filter(issue => issue.bureau === letter.bureau);
    if (issuesForBureau.length > 0) {
      const issueWithAccount = issuesForBureau.find(issue => issue.accountName);
      if (issueWithAccount) {
        accountName = issueWithAccount.accountName || '';
        accountNumber = issueWithAccount.accountNumber || '';
      }
    }
    
    // Fallback if no account found
    if (!accountName && reportData.accounts && reportData.accounts.length > 0) {
      accountName = reportData.accounts[0].accountName;
      accountNumber = reportData.accounts[0].accountNumber || '';
    }
    
    // Create letter object
    return {
      id: Date.now() + index,
      title: `${letter.bureau} Dispute Letter`,
      content: letter.content,
      letterContent: letter.content,
      bureau: letter.bureau,
      accountName: accountName,
      accountNumber: accountNumber,
      errorType: issues[0]?.type || 'general',
      status: 'ready',
      createdAt: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
  });
  
  // Store the generated letters in session storage
  try {
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(storedLetters));
    console.log(`Successfully stored ${storedLetters.length} letters in session storage`);
  } catch (error) {
    console.error("Error storing letters in session storage:", error);
  }
  
  return storedLetters;
}
