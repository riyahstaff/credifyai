
import { PersonalInfo, CreditReportAccount } from '../../types';

/**
 * Generate a fallback dispute letter for account issues
 * @param personalInfo Consumer's personal information
 * @param account Account to dispute
 * @param bureau Credit bureau to send the letter to
 * @param customLanguage Optional custom language to include in the letter
 * @returns Generated dispute letter content
 */
export function generateFallbackAccountDisputeLetter(
  personalInfo: PersonalInfo,
  account: CreditReportAccount,
  bureau: string,
  customLanguage?: string
): string {
  // Format date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Determine bureau address
  const bureauAddress = getBureauAddress(bureau);

  // Create the letter
  let letter = '';

  // Add consumer info header
  if (personalInfo.name) {
    letter += `${personalInfo.name}\n`;
  }
  
  if (personalInfo.address) {
    letter += `${personalInfo.address}\n`;
  }
  
  if (personalInfo.city && personalInfo.state && personalInfo.zip) {
    letter += `${personalInfo.city}, ${personalInfo.state} ${personalInfo.zip}\n`;
  }
  
  letter += `${currentDate}\n\n`;
  
  // Add bureau address
  letter += `${bureauAddress}\n\n`;
  
  // Add subject line
  letter += `Re: Dispute of Inaccurate Information\n\n`;
  
  // Add greeting
  letter += `To Whom It May Concern:\n\n`;
  
  // Add introduction
  letter += `I am writing to dispute the following information in my credit report. I have identified the following item that is inaccurate or incomplete:\n\n`;
  
  // Add account details
  letter += `Account Name: ${account.accountName || "Unknown"}\n`;
  
  if (account.accountNumber) {
    letter += `Account Number: ${account.accountNumber}\n`;
  }
  
  if (account.currentBalance || account.balance) {
    letter += `Reported Balance: $${account.currentBalance || account.balance}\n`;
  }
  
  if (account.openDate || account.dateOpened) {
    letter += `Date Opened: ${account.openDate || account.dateOpened}\n`;
  }
  
  letter += `\n`;
  
  // Add dispute reason
  if (customLanguage) {
    letter += `${customLanguage}\n\n`;
  } else {
    letter += `This information is inaccurate because the account details reported do not correctly reflect my credit history. As required under the Fair Credit Reporting Act (FCRA), please investigate this matter and correct the disputed information.\n\n`;
  }
  
  // Add legal basis
  letter += `Under the Fair Credit Reporting Act (FCRA), consumer reporting agencies are required to follow reasonable procedures to assure maximum possible accuracy of the information they report. Additionally, when a consumer disputes information, both the credit bureau and the furnisher of the information are required to conduct a reasonable investigation.\n\n`;
  
  // Add conclusion and request
  letter += `Please investigate this matter and update my credit report to reflect accurate information. Please send me written confirmation of your findings and the actions taken.\n\n`;
  
  // Add closing
  letter += `Sincerely,\n\n\n`;
  
  if (personalInfo.name) {
    letter += `${personalInfo.name}\n`;
  } else {
    letter += `_______________________\n`;
  }
  
  return letter;
}

/**
 * Get the mailing address for a credit bureau
 */
function getBureauAddress(bureau: string): string {
  const lowerBureau = bureau.toLowerCase();
  
  if (lowerBureau.includes('experian')) {
    return 'Experian\nP.O. Box 4500\nAllen, TX 75013';
  } else if (lowerBureau.includes('equifax')) {
    return 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374';
  } else if (lowerBureau.includes('transunion')) {
    return 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016';
  } else {
    return `${bureau}\n[Bureau Address]`;
  }
}

// Add an alias for the function to maintain backward compatibility
export const generateFallbackAccountLetter = generateFallbackAccountDisputeLetter;
