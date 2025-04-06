
import { DisputeData } from '../../../disputes/generator/types';
import { getSampleDisputeLanguage } from '@/utils/creditReport/disputeLetters/sampleLanguage';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';

/**
 * Generates a manual dispute letter for a credit report issue
 */
export async function generateManualDisputeLetter(
  disputeData: DisputeData,
  account: CreditReportAccount,
  creditReportData?: CreditReportData | null
): Promise<string> {
  try {
    // Format current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format bureau address
    const bureauAddresses: Record<string, string> = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    // Get bureau address based on bureau name
    const bureauKey = disputeData.bureau?.toLowerCase() || 'experian';
    const bureau = bureauKey.includes('experian') ? 'experian' : 
                   bureauKey.includes('equifax') ? 'equifax' : 
                   bureauKey.includes('transunion') ? 'transunion' : 'experian';
    const bureauAddress = bureauAddresses[bureau];
    
    // Get user information
    const userInfo = {
      name: disputeData.userInfo?.name || '[YOUR NAME]',
      address: disputeData.userInfo?.address || '[YOUR ADDRESS]',
      city: disputeData.userInfo?.city || '[CITY]',
      state: disputeData.userInfo?.state || '[STATE]',
      zip: disputeData.userInfo?.zip || '[ZIP]'
    };
    
    // Get sample dispute language for this type of dispute
    const disputeType = disputeData.errorType.toLowerCase().replace(/\s+/g, '_');
    const sampleLanguage = getSampleDisputeLanguage(disputeType);
    
    // Generate letter content
    let letterContent = `${userInfo.name}\n${userInfo.address}\n${userInfo.city}, ${userInfo.state} ${userInfo.zip}\n\n`;
    letterContent += `${currentDate}\n\n`;
    letterContent += `${bureauAddress}\n\n`;
    letterContent += `Re: Dispute of Inaccurate Information in Credit Report\n\n`;
    letterContent += `To Whom It May Concern:\n\n`;
    letterContent += `I am writing to dispute the following information in my credit report. I have identified the following items that are inaccurate or incomplete:\n\n`;
    letterContent += `Account Name: ${account.accountName.toUpperCase()}\n`;
    
    if (account.accountNumber) {
      letterContent += `Account Number: ${account.accountNumber}\n`;
    }
    
    letterContent += `\nI am disputing this information because: ${disputeData.explanation}\n\n`;
    
    // Add some sample language based on dispute type
    if (sampleLanguage && sampleLanguage.length > 0) {
      // Choose a random sample phrase from the array
      const randomIndex = Math.floor(Math.random() * sampleLanguage.length);
      letterContent += `${sampleLanguage[randomIndex]}\n\n`;
    }
    
    letterContent += `Under the Fair Credit Reporting Act, you are required to:\n`;
    letterContent += `1. Conduct a reasonable investigation into the information I am disputing\n`;
    letterContent += `2. Forward all relevant information that I provide to the furnisher\n`;
    letterContent += `3. Review and consider all relevant information\n`;
    letterContent += `4. Provide me the results of your investigation\n`;
    letterContent += `5. Delete the disputed information if it cannot be verified\n\n`;
    
    letterContent += `Please investigate this matter and provide me with the results within 30 days as required by the FCRA.\n\n`;
    letterContent += `Sincerely,\n\n${userInfo.name}\n\n`;
    letterContent += `Enclosures:\n`;
    letterContent += `- Copy of ID\n`;
    letterContent += `- Copy of social security card\n`;
    letterContent += `- Copy of utility bill\n`;
    
    return letterContent;
  } catch (error) {
    console.error('Error generating manual dispute letter:', error);
    return 'Error generating dispute letter. Please try again or contact support.';
  }
}
