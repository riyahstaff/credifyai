
import { CreditReportData } from '../types';

/**
 * Generates letter content based on template and context
 */
export function generateLetterContent(
  template: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string;
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
  console.log("Generating letter content with template:", template.substring(0, 50));
  
  try {
    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate a unique credit report number
    const creditReportNumber = creditReportData?.reportNumber || `CR-${Math.floor(Math.random() * 10000000)}`;
    
    // Bureau addresses
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
    };
    
    // Determine bureau address
    const bureau = accountDetails.bureau.toLowerCase();
    let bureauAddress = '';
    
    if (bureau.includes('experian')) {
      bureauAddress = bureauAddresses.experian;
    } else if (bureau.includes('equifax')) {
      bureauAddress = bureauAddresses.equifax;
    } else if (bureau.includes('transunion')) {
      bureauAddress = bureauAddresses.transunion;
    } else {
      bureauAddress = `${accountDetails.bureau}`;
    }
    
    // Format user information
    let formattedUserInfo = '';
    
    if (userInfo.name) {
      formattedUserInfo += `${userInfo.name}\n`;
      
      if (userInfo.address) {
        formattedUserInfo += `${userInfo.address}\n`;
        
        if (userInfo.city && userInfo.state && userInfo.zip) {
          formattedUserInfo += `${userInfo.city}, ${userInfo.state} ${userInfo.zip}\n`;
        }
      }
    }
    
    // Account information
    const accountSection = `
DISPUTED ITEM(S):
Account Name: ${accountDetails.accountName.toUpperCase()}
${accountDetails.accountNumber ? `Account Number: ${accountDetails.accountNumber}` : ''}
Reason for Dispute: ${accountDetails.errorDescription}
`;
    
    // Replace placeholders in template
    let content = template
      .replace(/\{USER_NAME\}/g, userInfo.name || '')
      .replace(/\{USER_ADDRESS\}/g, userInfo.address || '')
      .replace(/\{USER_CITY\}/g, userInfo.city || '')
      .replace(/\{USER_STATE\}/g, userInfo.state || '')
      .replace(/\{USER_ZIP\}/g, userInfo.zip || '')
      .replace(/\{DATE\}/g, currentDate)
      .replace(/\{BUREAU_NAME\}/g, accountDetails.bureau)
      .replace(/\{BUREAU_ADDRESS\}/g, bureauAddress)
      .replace(/\{ACCOUNT_NAME\}/g, accountDetails.accountName)
      .replace(/\{ACCOUNT_NUMBER\}/g, accountDetails.accountNumber || '')
      .replace(/\{REASON\}/g, accountDetails.errorDescription)
      .replace(/\{CREDIT_REPORT_NUMBER\}/g, creditReportNumber);
    
    // If no template supplied, create a standard letter
    if (!content || content === template) {
      content = `${formattedUserInfo}${currentDate}\n\n${bureauAddress}\n\nRe: Dispute of Credit Report Information\n\nTo Whom It May Concern:\n\nI am writing to dispute information in my credit report. I have identified the following item(s) that are inaccurate:\n\n${accountSection}\n\nUnder the Fair Credit Reporting Act, you are required to investigate this dispute and provide me with the results within 30 days. If you cannot verify this information, please remove it from my credit report.\n\nThank you for your attention to this matter.\n\nSincerely,\n\n${userInfo.name || '[YOUR NAME]'}`;
    }
    
    // Clean up any remaining template placeholders
    content = content.replace(/\{[A-Z_]+\}/g, '');
    
    console.log("Letter content generation successful");
    return content;
  } catch (error) {
    console.error("Error in generating letter content:", error);
    return `Dear ${accountDetails.bureau},\n\nI am writing to dispute the following information in my credit report: ${accountDetails.accountName}.\n\nSincerely,\n${userInfo.name || '[YOUR NAME]'}`;
  }
}
