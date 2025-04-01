
/**
 * Advanced dispute letter generator
 * Creates personalized dispute letters based on extracted information
 */

import { extractPersonalInfo, PersonalInfo } from "./personal_info_extractor.ts";
import { CreditReportIssue, IssueType, Account } from "./issue_detector.ts";

interface LetterTemplate {
  id: string;
  name: string;
  issue_type: string;
  content: string;
}

interface GeneratedLetter {
  issue_type: IssueType;
  content: string;
  bureau: string;
  account_number?: string;
  creditor_name?: string;
}

/**
 * Generate dispute letters for credit report issues
 */
export function generate_letters(
  issues: CreditReportIssue[],
  userData: any,
  reportText: string,
  templates: LetterTemplate[]
): GeneratedLetter[] {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  // Extract personal information from the credit report
  const personalInfo = extractPersonalInfo(reportText);
  console.log("Personal info extracted from report:", personalInfo);
  
  // Merge personal info with user profile data, preferring report data
  const userInfo: PersonalInfo = {
    name: personalInfo.name || userData.full_name || "[YOUR NAME]",
    address: personalInfo.address || userData.address || "[YOUR ADDRESS]",
    city: personalInfo.city || userData.city || "[CITY]",
    state: personalInfo.state || userData.state || "[STATE]",
    zip: personalInfo.zip || userData.zip || "[ZIP]",
    ssn: personalInfo.ssn,
    phone: personalInfo.phone,
    dob: personalInfo.dob
  };
  
  // Store the extracted personal info in localStorage for frontend use
  savePersonalInfoToStorage(userInfo);
  
  // Generate a letter for each issue
  const letters: GeneratedLetter[] = [];
  
  for (const issue of issues) {
    // Find the appropriate template for this issue type
    let template = templates.find(t => t.issue_type === issue.type);
    
    // Fall back to a general template if no specific one is found
    if (!template) {
      template = templates.find(t => t.issue_type === 'general') || templates[0];
      console.log(`No template found for ${issue.type}, using fallback template`);
    }
    
    if (!template) {
      console.error(`No template found for issue type: ${issue.type} and no fallback template available`);
      continue;
    }
    
    console.log(`Using template: ${template.name} for issue type: ${issue.type}`);
    
    // Process each account for this issue
    for (const account of issue.accounts) {
      const letter = generateLetterForAccount(template, issue, account, userInfo);
      letters.push(letter);
      console.log(`Generated letter for ${account.accountName} (${issue.type})`);
    }
  }
  
  return letters;
}

/**
 * Helper function to generate a letter for a specific account
 */
function generateLetterForAccount(
  template: LetterTemplate,
  issue: CreditReportIssue,
  account: Account,
  userInfo: PersonalInfo
): GeneratedLetter {
  // Generate a credit report number
  const creditReportNumber = `CR-${Math.floor(Math.random() * 10000000)}`;
  
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Determine bureau address
  const bureauAddresses: Record<string, string> = {
    'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
    'All Bureaus': '[BUREAU ADDRESS]'
  };
  
  const bureauAddress = bureauAddresses[issue.bureau] || '[BUREAU ADDRESS]';
  
  // Format detailed account information
  let accountDetails = '';
  
  // Format based on the type of issue
  if (issue.type === 'late_payment') {
    accountDetails = `
Creditor: ${account.accountName.toUpperCase()}
Account Number: ${account.accountNumber || 'XXXXXXXXXXXX1234'}
${account.balance ? `Balance: $${account.balance}\n` : ''}
${account.openDate ? `Opened: ${account.openDate}\n` : ''}
${account.lastReportedDate ? `Last Reported: ${account.lastReportedDate}\n` : ''}
${account.status ? `Status: ${account.status}\n` : ''}
Issue: Late payments reported incorrectly or cannot be validated
`;
  } else if (issue.type === 'collection') {
    accountDetails = `
Collection Account: ${account.accountName.toUpperCase()}
${account.accountNumber ? `Account Number: ${account.accountNumber}\n` : ''}
${account.creditor ? `Original Creditor: ${account.creditor}\n` : ''}
${account.balance ? `Amount: $${account.balance}\n` : ''}
${account.lastReportedDate ? `Reported: ${account.lastReportedDate}\n` : ''}
Issue: This collection account is disputed as inaccurate and unverified
`;
  } else if (issue.type === 'inquiry') {
    accountDetails = `
Inquiry By: ${account.accountName}
${account.lastReportedDate ? `Date of Inquiry: ${account.lastReportedDate}\n` : ''}
Issue: This inquiry was not authorized and should be removed
`;
  } else {
    accountDetails = `
Account: ${account.accountName.toUpperCase()}
${account.accountNumber ? `Account Number: ${account.accountNumber}\n` : ''}
${account.balance ? `Current Balance: $${account.balance}\n` : ''}
${account.openDate ? `Date Opened: ${account.openDate}\n` : ''}
${account.lastReportedDate ? `Last Reported: ${account.lastReportedDate}\n` : ''}
${account.status ? `Status: ${account.status}\n` : ''}
Issue: This account contains inaccurate information that requires verification
`;
  }
  
  // Prepare the replacement values
  const replacements: Record<string, string> = {
    '{{CREDIT_REPORT_NUMBER}}': creditReportNumber,
    '{{CURRENT_DATE}}': currentDate,
    '{{USER_NAME}}': userInfo.name,
    '{{USER_ADDRESS}}': userInfo.address,
    '{{USER_CITY}}': userInfo.city,
    '{{USER_STATE}}': userInfo.state,
    '{{USER_ZIP}}': userInfo.zip,
    '{{USER_PHONE}}': userInfo.phone || '[PHONE NUMBER]',
    '{{USER_SSN}}': userInfo.ssn || '[LAST 4 OF SSN]',
    '{{BUREAU}}': issue.bureau,
    '{{BUREAU_ADDRESS}}': bureauAddress,
    '{{DISPUTED_ACCOUNTS}}': accountDetails,
    '{{ACCOUNT_NAME}}': account.accountName,
    '{{ACCOUNT_NUMBER}}': account.accountNumber || 'XXXXXXXXXXXX1234',
    '{{ISSUE_DESCRIPTION}}': issue.description
  };
  
  // Apply the replacements to the template
  let content = template.content;
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  }
  
  // Make sure all the necessary consumer information is included
  if (!content.includes(userInfo.name) && userInfo.name) {
    content = `${userInfo.name}\n${content}`;
  }
  
  if (!content.includes(userInfo.address) && userInfo.address) {
    const addressLine = `${userInfo.address}, ${userInfo.city}, ${userInfo.state} ${userInfo.zip}\n`;
    content = `${userInfo.name}\n${addressLine}${content}`;
  }
  
  // Ensure the KEY explanation is removed
  content = content.replace(
    /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
    ''
  );
  
  // Remove any "KEY" section explaining acronyms
  content = content.replace(
    /\*\s*means\s*REQUIRED\s*ALWAYS[\s\S]*?(?=\n\n)/g,
    ''
  );
  
  return {
    issue_type: issue.type,
    content: content,
    bureau: issue.bureau,
    account_number: account.accountNumber,
    creditor_name: account.accountName
  };
}

/**
 * Store the extracted personal info in storage for frontend use
 */
function savePersonalInfoToStorage(personalInfo: PersonalInfo): void {
  try {
    // Create a serialized version of personal info to store
    const storageData = {
      name: personalInfo.name,
      address: personalInfo.address,
      city: personalInfo.city,
      state: personalInfo.state,
      zip: personalInfo.zip,
      extracted: true,
      extractedDate: new Date().toISOString()
    };
    
    // This is a dummy function that would be implemented differently in a browser vs Edge Function
    console.log("Would save personal info to storage:", storageData);
    
    // In a real browser environment, we would do:
    // localStorage.setItem('userName', personalInfo.name);
    // localStorage.setItem('userAddress', personalInfo.address);
    // localStorage.setItem('userCity', personalInfo.city);
    // localStorage.setItem('userState', personalInfo.state);
    // localStorage.setItem('userZip', personalInfo.zip);
  } catch (error) {
    console.error("Error saving personal info to storage:", error);
  }
}
