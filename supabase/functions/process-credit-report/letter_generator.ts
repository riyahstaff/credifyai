
/**
 * Advanced FCRA-Compliant Dispute Letter Generator
 * Creates comprehensive, legally-sound dispute letters based on extracted information
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
  
  // Determine bureau address with proper bureau names
  const bureauAddresses: Record<string, { name: string; address: string }> = {
    'Experian': {
      name: 'Experian',
      address: 'Experian\nDispute Department\nP.O. Box 4500\nAllen, TX 75013'
    },
    'Equifax': {
      name: 'Equifax Information Services LLC',
      address: 'Equifax Information Services LLC\nDispute Department\nP.O. Box 740256\nAtlanta, GA 30374'
    },
    'TransUnion': {
      name: 'TransUnion LLC',
      address: 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    }
  };
  
  const bureauInfo = bureauAddresses[issue.bureau] || {
    name: 'Credit Bureau',
    address: '[BUREAU ADDRESS]'
  };
  
  // Format comprehensive account information with FCRA compliance
  const accountDetails = formatAccountDetails(account, issue);
  
  // Get FCRA laws applicable to this issue type
  const fcraLaws = getFCRALaws(issue.type);
  
  // Generate comprehensive legal language
  const legalLanguage = generateLegalLanguage(issue.type, account.accountName, fcraLaws);
  
  // Generate comprehensive FCRA-compliant letter content
  const letterContent = generateComprehensiveLetter(
    userInfo,
    bureauInfo,
    creditReportNumber,
    currentDate,
    accountDetails,
    issue,
    account,
    legalLanguage
  );
  
  // Use the comprehensive letter content instead of template replacement
  
  return {
    issue_type: issue.type,
    content: letterContent,
    bureau: issue.bureau,
    account_number: account.accountNumber,
    creditor_name: account.accountName
  };
}

/**
 * Format comprehensive account details for dispute letter
 */
function formatAccountDetails(account: Account, issue: CreditReportIssue): string {
  let details = `DISPUTED ACCOUNT INFORMATION:\n`;
  details += `Account Name: ${account.accountName}\n`;
  
  if (account.accountNumber) {
    details += `Account Number: ${account.accountNumber}\n`;
  }
  
  if (account.creditor || account.creditorName) {
    details += `Original Creditor: ${account.creditor || account.creditorName}\n`;
  }
  
  if (account.balance || account.currentBalance) {
    details += `Reported Balance: $${account.balance || account.currentBalance}\n`;
  }
  
  if (account.status || account.paymentStatus) {
    details += `Account Status: ${account.status || account.paymentStatus}\n`;
  }
  
  if (account.openDate || account.dateOpened) {
    details += `Date Opened: ${account.openDate || account.dateOpened}\n`;
  }
  
  if (account.lastReportedDate || account.dateReported) {
    details += `Date Last Reported: ${account.lastReportedDate || account.dateReported}\n`;
  }
  
  if (account.accountType) {
    details += `Account Type: ${account.accountType}\n`;
  }
  
  return details;
}

/**
 * Get FCRA laws applicable to issue type
 */
function getFCRALaws(issueType: IssueType): string[] {
  const laws: string[] = [];
  
  // Core FCRA laws applicable to all disputes
  laws.push('15 USC §1681i(a)(1)(A) - Right to dispute inaccurate information');
  laws.push('15 USC §1681e(b) - Maximum possible accuracy requirement');
  
  switch (issueType) {
    case 'late_payment':
      laws.push('15 USC §1681s-2(a)(1)(A) - Furnisher accuracy requirements');
      laws.push('15 USC §1681s-2(a)(3) - Investigation upon dispute');
      break;
    case 'collection':
      laws.push('15 USC §1692g - Debt validation requirements');
      laws.push('15 USC §1681s-2(b) - Furnisher investigation duties');
      break;
    case 'inquiry':
      laws.push('15 USC §1681b(a)(3)(A) - Permissible purpose requirements');
      laws.push('15 USC §1681m - Adverse action notice requirements');
      break;
    case 'balance_error':
    case 'account_status':
      laws.push('15 USC §1681s-2(a)(1)(A) - Prohibition on furnishing inaccurate information');
      break;
    case 'identity_theft':
      laws.push('15 USC §1681c-2 - Identity theft provisions');
      laws.push('15 USC §1681s-2(a)(6)(B) - Fraud alert requirements');
      break;
  }
  
  return laws;
}

/**
 * Generate comprehensive legal language
 */
function generateLegalLanguage(issueType: IssueType, accountName: string, laws: string[]): string {
  let language = `LEGAL BASIS FOR DISPUTE:\n`;
  
  laws.forEach(law => {
    language += `• ${law}\n`;
  });
  
  language += `\nUnder the Fair Credit Reporting Act (FCRA), you are obligated to conduct a reasonable reinvestigation of this disputed information within 30 days. `;
  
  switch (issueType) {
    case 'late_payment':
      language += `The reported late payment information for ${accountName} is inaccurate and violates FCRA requirements for furnisher accuracy.`;
      break;
    case 'collection':
      language += `This collection account lacks proper validation and violates both FCRA and FDCPA requirements.`;
      break;
    case 'inquiry':
      language += `This unauthorized inquiry violates FCRA permissible purpose requirements.`;
      break;
    default:
      language += `The information reported for ${accountName} is inaccurate and must be verified or deleted.`;
  }
  
  return language;
}

/**
 * Generate comprehensive FCRA-compliant letter
 */
function generateComprehensiveLetter(
  userInfo: PersonalInfo,
  bureauInfo: { name: string; address: string },
  creditReportNumber: string,
  currentDate: string,
  accountDetails: string,
  issue: CreditReportIssue,
  account: Account,
  legalLanguage: string
): string {
  return `${currentDate}

${bureauInfo.address}

RE: Formal Dispute Under the Fair Credit Reporting Act (FCRA)
Credit Report Number: ${creditReportNumber}

Dear ${bureauInfo.name} Dispute Department,

I am writing to formally dispute inaccurate information appearing on my credit report. This letter serves as my official notice under the Fair Credit Reporting Act (FCRA) that the following information is inaccurate and must be investigated and corrected or deleted.

CONSUMER INFORMATION:
Name: ${userInfo.name || '[CONSUMER NAME]'}
Address: ${userInfo.address || '[CONSUMER ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}
${userInfo.ssn ? `SSN: ***-**-${userInfo.ssn.slice(-4)}` : 'SSN: ***-**-[LAST 4]'}
${userInfo.phone ? `Phone: ${userInfo.phone}` : 'Phone: [PHONE NUMBER]'}

${accountDetails}

NATURE OF DISPUTE:
${getDisputeDescription(issue, account)}

${legalLanguage}

FCRA VIOLATIONS IDENTIFIED:
• Failure to follow reasonable procedures to assure maximum possible accuracy (15 USC §1681e(b))
• Potential failure to conduct adequate reinvestigation upon dispute (15 USC §1681i(a)(1)(A))
• Possible furnishing of information known to be inaccurate (15 USC §1681s-2(a)(1)(A))

REQUIRED ACTIONS:
Under the Fair Credit Reporting Act, you are required to:

1. Conduct a reasonable reinvestigation of the disputed information within 30 days of receipt
2. Forward all relevant dispute information to the furnisher within 5 business days
3. Review and consider all relevant information submitted during the investigation
4. Delete or modify any information found to be inaccurate, incomplete, or unverifiable
5. Provide written notice of investigation results within 5 business days of completion
6. If information is deleted, provide a free copy of my updated credit report

REQUESTED RESOLUTION:
• Complete deletion of the inaccurate information described above
• Written confirmation of all corrections made
• Updated credit report reflecting all changes

This dispute is made in good faith based on my personal knowledge. The information disputed is inaccurate, incomplete, or unverifiable under FCRA standards.

Please investigate this matter promptly and provide written verification of accuracy or delete the information from my credit file. Failure to properly investigate may result in violations of 15 USC §1681n (willful noncompliance) and 15 USC §1681o (negligent noncompliance).

I expect your full cooperation in resolving this matter within required timeframes.

Sincerely,

${userInfo.name || '[CONSUMER SIGNATURE]'}
${userInfo.name || '[CONSUMER PRINTED NAME]'}

Enclosures: Supporting Documentation
`;
}

/**
 * Get detailed dispute description based on issue type
 */
function getDisputeDescription(issue: CreditReportIssue, account: Account): string {
  switch (issue.type) {
    case 'late_payment':
      return `The payment history reported for ${account.accountName} contains inaccurate late payment information. These reported late payments are false and damaging to my credit profile. This account has been managed responsibly and any reported delinquencies are inaccurate.`;
    
    case 'collection':
      return `The collection account reported by ${account.accountName} is inaccurate and unverified. I dispute this debt as either: (1) not belonging to me, (2) previously paid or settled, (3) improperly validated, or (4) beyond the statute of limitations.`;
    
    case 'inquiry':
      return `The credit inquiry reported by ${account.accountName} was made without my authorization and lacks a permissible purpose under the FCRA. I did not apply for credit with this company and did not authorize access to my credit report.`;
    
    case 'balance_error':
      return `The balance being reported for ${account.accountName} is incorrect. The actual balance differs from what is being reported, affecting my credit utilization ratio and overall credit scoring.`;
    
    case 'account_status':
      return `The account status being reported for ${account.accountName} is inaccurate and does not reflect the true current status of this account. This misrepresentation is negatively affecting my creditworthiness.`;
    
    case 'identity_theft':
      return `The account ${account.accountName} is the result of identity theft or fraud. I did not open this account, authorize its creation, or incur any associated debt. I request this fraudulent account be blocked under FCRA §605B.`;
    
    default:
      return `The information being reported for ${account.accountName} contains inaccuracies that require investigation and correction. ${issue.description || 'The reported information does not accurately reflect the true status of this account.'}`;
  }
}

/**
 * Store the extracted personal info in storage for frontend use
 */
function savePersonalInfoToStorage(personalInfo: PersonalInfo): void {
  try {
    console.log("Would save personal info to storage:", {
      name: personalInfo.name,
      address: personalInfo.address,
      city: personalInfo.city,
      state: personalInfo.state,
      zip: personalInfo.zip,
      extracted: true,
      extractedDate: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving personal info to storage:", error);
  }
}
