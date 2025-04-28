
import { CreditReportData } from '../types';

/**
 * Generate the content for a dispute letter based on the template and user data
 */
export function generateLetterContent(
  templateContent: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  creditReportData?: CreditReportData | null
): string {
  // If a template was provided, use it, otherwise create a basic letter
  let content = templateContent || getDefaultLetterTemplate();
  
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Get bureau address
  const bureauAddress = getBureauAddress(accountDetails.bureau);
  
  // Replace placeholders in the template
  content = content
    .replace(/\{NAME\}|\{CONSUMER_NAME\}|\{USER_NAME\}/gi, userInfo.name)
    .replace(/\{ADDRESS\}|\{CONSUMER_ADDRESS\}/gi, userInfo.address || '')
    .replace(/\{CITY\}|\{CONSUMER_CITY\}/gi, userInfo.city || '')
    .replace(/\{STATE\}|\{CONSUMER_STATE\}/gi, userInfo.state || '')
    .replace(/\{ZIP\}|\{CONSUMER_ZIP\}/gi, userInfo.zip || '')
    .replace(/\{DATE\}|\{CURRENT_DATE\}/gi, currentDate)
    .replace(/\{BUREAU\}|\{CREDIT_BUREAU\}/gi, accountDetails.bureau)
    .replace(/\{BUREAU_ADDRESS\}/gi, bureauAddress)
    .replace(/\{ACCOUNT_NAME\}/gi, accountDetails.accountName)
    .replace(/\{ACCOUNT_NUMBER\}/gi, accountDetails.accountNumber || '')
    .replace(/\{ERROR_DESCRIPTION\}/gi, accountDetails.errorDescription);
  
  // Add a header with user info if not already present
  if (!content.trim().startsWith(userInfo.name)) {
    content = `${userInfo.name}
${userInfo.address ? userInfo.address + '\n' : ''}${userInfo.city ? userInfo.city + ', ' : ''}${userInfo.state || ''} ${userInfo.zip || ''}

${currentDate}

${accountDetails.bureau}
${bureauAddress}

${content}`;
  }
  
  return content;
}

/**
 * Get address for credit bureau
 */
function getBureauAddress(bureau: string): string {
  const bureauLower = bureau.toLowerCase();
  
  if (bureauLower.includes('experian')) {
    return 'Experian\nP.O. Box 4500\nAllen, TX 75013';
  } else if (bureauLower.includes('equifax')) {
    return 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374';
  } else if (bureauLower.includes('transunion') || bureauLower.includes('trans union')) {
    return 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016';
  }
  
  return '[BUREAU ADDRESS]';
}

/**
 * Get a default letter template
 */
function getDefaultLetterTemplate(): string {
  return `RE: Dispute of Inaccurate Information in Credit Report

To Whom It May Concern:

I am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.

Account Name: {ACCOUNT_NAME}
Account Number: {ACCOUNT_NUMBER}
Error Description: {ERROR_DESCRIPTION}

Please conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.

I understand that according to the Fair Credit Reporting Act, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.

In accordance with Metro 2 reporting guidelines, I request that you properly code this account as "disputed by consumer" (compliance code XB) during your investigation.

Thank you for your prompt attention to this matter.

Sincerely,

{NAME}`;
}
