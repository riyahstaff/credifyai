/**
 * Comprehensive FCRA-Compliant Dispute Letter Generator
 */

import { getApplicableLaws, generateLegalLanguage } from '../fcraCompliance/fcraLaws';
import { CreditReportAccount, Issue } from '../types/creditReportTypes';
import { UserInfo } from '../types/letterTypes';

interface BureauInfo {
  name: string;
  address: string;
  disputeAddress: string;
}

export const BUREAU_ADDRESSES: Record<string, BureauInfo> = {
  'Experian': {
    name: 'Experian',
    address: 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    disputeAddress: 'Experian\nDispute Department\nP.O. Box 4500\nAllen, TX 75013'
  },
  'Equifax': {
    name: 'Equifax Information Services LLC',
    address: 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    disputeAddress: 'Equifax Information Services LLC\nDispute Department\nP.O. Box 740256\nAtlanta, GA 30374'
  },
  'TransUnion': {
    name: 'TransUnion LLC',
    address: 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
    disputeAddress: 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  }
};

export interface ComprehensiveDisputeLetter {
  id: string;
  title: string;
  content: string;
  bureau: string;
  accountName: string;
  accountNumber: string;
  errorType: string;
  status: 'ready' | 'draft' | 'sent';
  createdAt: string;
  legalCitations: string[];
  fcraViolations: string[];
}

/**
 * Generate a comprehensive FCRA-compliant dispute letter
 */
export function generateComprehensiveDisputeLetter(
  issue: Issue,
  account: CreditReportAccount,
  userInfo: UserInfo,
  bureau: string
): ComprehensiveDisputeLetter {
  
  const bureauInfo = BUREAU_ADDRESSES[bureau] || BUREAU_ADDRESSES['Experian'];
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const creditReportNumber = `CR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Get applicable laws
  const applicableLaws = getApplicableLaws(issue.type);
  const legalLanguage = generateLegalLanguage(issue.type, account.accountName);
  
  // Build comprehensive account details
  const accountDetails = buildAccountDetails(account, issue);
  
  // Generate the letter content
  const letterContent = `${currentDate}

${bureauInfo.disputeAddress}

RE: Formal Dispute Under the Fair Credit Reporting Act (FCRA)
Credit Report Number: ${creditReportNumber}

Dear ${bureauInfo.name} Dispute Department,

I am writing to formally dispute inaccurate information appearing on my credit report. This letter serves as my official notice under the Fair Credit Reporting Act (FCRA) that the following information is inaccurate and must be investigated and corrected or deleted.

CONSUMER INFORMATION:
Name: ${userInfo.name || '[CONSUMER NAME]'}
Address: ${userInfo.address || '[CONSUMER ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}
${userInfo.ssn ? `SSN: ***-**-${userInfo.ssn.slice(-4)}` : 'SSN: ***-**-[LAST 4]'}
Date of Birth: ${userInfo.dob || '[DOB]'}

DISPUTED ACCOUNT INFORMATION:
${accountDetails}

NATURE OF DISPUTE:
${getDisputeDescription(issue, account)}

LEGAL BASIS FOR DISPUTE:
${legalLanguage}

FCRA VIOLATIONS IDENTIFIED:
${getFCRAViolations(issue, account).map(violation => `• ${violation}`).join('\n')}

REQUIRED ACTIONS:
Under the Fair Credit Reporting Act, you are required to:

1. Conduct a reasonable reinvestigation of the disputed information within 30 days of receipt of this letter (15 USC §1681i(a)(1)(A))

2. Forward all relevant dispute information to the furnisher of the data within 5 business days (15 USC §1681i(a)(2))

3. Review and consider all relevant information submitted by me during the investigation (15 USC §1681i(a)(1)(B))

4. Delete or modify any information found to be inaccurate, incomplete, or unverifiable (15 USC §1681i(a)(5)(A))

5. Provide me with written notice of the results of the investigation within 5 business days of completion (15 USC §1681i(a)(6)(A))

6. If information is deleted or modified, provide me with a free copy of my credit report (15 USC §1681i(a)(6)(B)(i))

I am requesting the following specific actions:
• Complete deletion of the inaccurate information described above
• Correction of any remaining inaccurate data elements
• Written confirmation of all corrections made
• Updated credit report reflecting all changes

DOCUMENTATION ENCLOSED:
• Copy of government-issued photo ID
• Proof of current address
• Supporting documentation for this dispute

This dispute is made in good faith based on my personal knowledge and examination of my credit report. The information I am disputing is inaccurate, incomplete, or unverifiable as required under FCRA standards.

Please investigate this matter promptly and provide me with written verification of the accuracy of this information or delete it from my credit file. Failure to properly investigate this dispute may result in violations of federal law including 15 USC §1681n (willful noncompliance) and 15 USC §1681o (negligent noncompliance).

I expect your full cooperation in resolving this matter within the timeframes required by law.

Sincerely,

${userInfo.name || '[CONSUMER SIGNATURE]'}
${userInfo.name || '[CONSUMER PRINTED NAME]'}

Enclosures: Supporting Documentation
`;

  return {
    id: `letter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: `${issue.type.replace(/_/g, ' ').toUpperCase()} Dispute - ${account.accountName}`,
    content: letterContent,
    bureau: bureau,
    accountName: account.accountName,
    accountNumber: account.accountNumber || 'Unknown',
    errorType: issue.type,
    status: 'ready',
    createdAt: new Date().toISOString(),
    legalCitations: applicableLaws.map(law => law.citation),
    fcraViolations: getFCRAViolations(issue, account)
  };
}

function buildAccountDetails(account: CreditReportAccount, issue: Issue): string {
  let details = `Account Name: ${account.accountName}\n`;
  
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
  
  if (account.dateOpened || account.openDate) {
    details += `Date Opened: ${account.dateOpened || account.openDate}\n`;
  }
  
  if (account.lastReportedDate || account.dateReported) {
    details += `Date Last Reported: ${account.lastReportedDate || account.dateReported}\n`;
  }
  
  if (account.accountType) {
    details += `Account Type: ${account.accountType}\n`;
  }
  
  return details;
}

function getDisputeDescription(issue: Issue, account: CreditReportAccount): string {
  switch (issue.type) {
    case 'late_payment':
      return `The payment history reported for this account contains inaccurate late payment information. The reported late payments are false and damaging to my credit profile. This account has been managed responsibly and any reported delinquencies are inaccurate.`;
    
    case 'collection_account':
    case 'collection':
      return `This collection account is being reported inaccurately. I dispute this debt as either: (1) not belonging to me, (2) previously paid or settled, (3) improperly validated, or (4) beyond the statute of limitations. The collection agency has failed to provide proper validation of this debt as required under the FDCPA.`;
    
    case 'charge_off':
    case 'charged_off':
      return `The charge-off status being reported is inaccurate. This account was either never charged off, has been paid in full, was settled, or the charge-off is being reported incorrectly. The current reporting does not reflect the true status of this account.`;
    
    case 'inquiry':
    case 'unauthorized_inquiry':
      return `This credit inquiry was made without my authorization and lacks a permissible purpose under the FCRA. I did not apply for credit with this company and did not authorize them to access my credit report. This unauthorized inquiry is damaging my credit score.`;
    
    case 'balance_error':
    case 'incorrect_balance':
      return `The balance being reported for this account is incorrect. The actual balance differs from what is being reported, which affects my credit utilization ratio and overall credit scoring. The furnisher must report accurate balance information.`;
    
    case 'account_status':
    case 'status_error':
      return `The account status being reported is inaccurate and does not reflect the true current status of this account. This misrepresentation is negatively affecting my creditworthiness and must be corrected.`;
    
    case 'personal_info':
    case 'personal_information':
      return `My personal identifying information contains inaccuracies including incorrect addresses, employment information, or other personal details. This information does not belong to me and may indicate a mixed file situation.`;
    
    case 'duplicate_account':
      return `This account appears to be duplicated on my credit report, artificially inflating my credit obligations and negatively affecting my credit utilization calculations. Each account should only be reported once.`;
    
    case 'identity_theft':
    case 'fraud':
      return `This account is the result of identity theft or fraud. I did not open this account, authorize its creation, or incur the associated debt. I have filed appropriate reports with law enforcement and request this fraudulent account be blocked under FCRA §605B.`;
    
    default:
      return `The information being reported for this account contains inaccuracies that require investigation and correction. ${issue.description || 'The reported information does not accurately reflect the true status of this account.'} These inaccuracies must be verified or deleted under FCRA requirements.`;
  }
}

function getFCRAViolations(issue: Issue, account: CreditReportAccount): string[] {
  const violations: string[] = [];
  
  violations.push('15 USC §1681e(b) - Failure to follow reasonable procedures to assure maximum possible accuracy');
  violations.push('15 USC §1681i(a)(1)(A) - Obligation to conduct reasonable reinvestigation upon dispute');
  
  switch (issue.type) {
    case 'late_payment':
    case 'balance_error':
    case 'account_status':
      violations.push('15 USC §1681s-2(a)(1)(A) - Furnishing information known to be inaccurate');
      violations.push('15 USC §1681s-2(a)(3) - Failure to investigate disputed information');
      break;
    
    case 'collection_account':
    case 'collection':
      violations.push('15 USC §1692g - Failure to provide proper debt validation');
      violations.push('15 USC §1681s-2(b) - Failure to conduct adequate investigation upon dispute');
      break;
    
    case 'inquiry':
    case 'unauthorized_inquiry':
      violations.push('15 USC §1681b(a)(3)(A) - Accessing credit report without permissible purpose');
      violations.push('15 USC §1681m - Failure to provide proper adverse action notice');
      break;
    
    case 'personal_info':
      violations.push('15 USC §1681c - Reporting information beyond allowable time limits');
      violations.push('15 USC §1681g - Failure to properly identify consumer');
      break;
    
    case 'identity_theft':
    case 'fraud':
      violations.push('15 USC §1681c-2 - Failure to block fraudulent information');
      violations.push('15 USC §1681s-2(a)(6)(B) - Continuing to report information after fraud alert');
      break;
  }
  
  return violations;
}