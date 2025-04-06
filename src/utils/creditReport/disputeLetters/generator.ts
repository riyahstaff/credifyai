
/**
 * Credit Report Dispute Letter Generator
 * Generates properly formatted dispute letters based on credit report issues
 */
import { CreditReportAccount } from '../types';
import { Issue, DisputeLetter } from '../types/letterTypes';
import { determineBureau, getBureauAddress } from '@/components/disputes/uploader/utils/bureauUtils';

/**
 * Generate a properly formatted dispute letter based on identified issues
 * @param dispute The dispute information
 * @param userInfo The user's personal information
 */
export const generateDisputeLetterForDiscrepancy = async (
  dispute: any,
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<string> => {
  try {
    // Get bureau info
    const bureau = dispute.bureau || 'TransUnion';
    const bureauAddress = getBureauAddress(bureau);
    
    // Get account info
    const accountName = dispute.accountName || 'Multiple Accounts';
    const accountNumber = dispute.accountNumber || 'Unknown';
    
    // Format date using standard convention
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate a credit report number
    const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    
    // Ensure we have the user's information or placeholders
    const name = userInfo.name || '[YOUR NAME]';
    const address = userInfo.address || '[YOUR ADDRESS]';
    const city = userInfo.city || '[CITY]';
    const state = userInfo.state || '[STATE]';
    const zip = userInfo.zip || '[ZIP]';
    
    // Create the properly formatted letter header
    let letterContent = `Credit Report #: ${creditReportNumber}\nToday's Date is: ${currentDate}\n\n`;
    letterContent += `${bureau}\n${bureauAddress}\n\n`;
    letterContent += `Re: Dispute of Inaccurate Credit Information - Account: ${accountName}\n\n`;
    letterContent += `To Whom It May Concern:\n\n`;
    
    // Add dispute details
    letterContent += `I am writing to dispute the following information in my credit report. The item I wish to dispute is:\n\n`;
    letterContent += `Account: ${accountName}\n`;
    
    if (accountNumber && accountNumber !== 'Unknown') {
      letterContent += `Account Number: ${'xxxx'.padEnd(accountNumber.length - 4, 'x')}${accountNumber.slice(-4)}\n`;
    }
    
    letterContent += `\nReason for Dispute: ${dispute.reason || dispute.errorType || 'Inaccurate Information'}\n\n`;
    letterContent += `${dispute.description || dispute.explanation || 'This information is inaccurate or incomplete and should be investigated or removed from my credit report.'}\n\n`;
    
    // Add FCRA language
    letterContent += `Under the Fair Credit Reporting Act (FCRA), Section 611, you are required to conduct a reasonable investigation into this matter within 30 days of receiving this dispute. You must verify the accuracy of the information with the original source or remove the disputed item. Additionally, Section 605 limits how long negative information can be reported.\n\n`;
    
    // Add specific language for different types of disputes
    if (dispute.reason && dispute.reason.toLowerCase().includes('inquiry')) {
      letterContent += `I did not authorize this inquiry on my credit report. According to FCRA Section 604, inquiries can only be made with permissible purpose and consumer authorization. Please provide proof of my authorization or remove this inquiry immediately.\n\n`;
    } else if (dispute.reason && dispute.reason.toLowerCase().includes('payment')) {
      letterContent += `The payment information for this account is inaccurate. Per FCRA Section 623(a)(3), furnishers must investigate and correct any inaccurate payment information. The reported late payment information does not match my records and is damaging to my credit profile.\n\n`;
    } else if (dispute.reason && dispute.reason.toLowerCase().includes('balance')) {
      letterContent += `The balance information for this account is incorrect. Per FCRA Section 623(a)(2), credit reporting agencies and furnishers must ensure the completeness and accuracy of reported account balances. My records indicate a different balance.\n\n`;
    }
    
    // Add Metro 2 compliance language
    letterContent += `Additionally, I request verification that all information is being reported in accordance with Metro 2 reporting standards. The CDIA (Consumer Data Industry Association) requires all credit reporting to follow these standards, and "any deviations from these standards jeopardizes data integrity" (CRRG 3-4).\n\n`;
    
    // Request verification documentation
    letterContent += `Please provide me with copies of any documentation associated with this disputed account, including written verification and validation of:\n`;
    letterContent += `- The complete account history and payment records\n`;
    letterContent += `- Verification of all account details including opening date, balance, and payment history\n`;
    letterContent += `- Confirmation that the reporting meets all Metro 2 compliance standards\n\n`;
    
    // Legal requirements
    letterContent += `Upon completion of your investigation, please send me an updated copy of my credit report showing that the disputed item has been corrected or removed. According to FCRA Section 611(a)(6) and 612, there should be no charge for this report.\n\n`;
    letterContent += `I also request that you send notices of corrections to anyone who received my credit report in the past six months.\n\n`;
    
    // Closing statement
    letterContent += `Sincerely,\n\n`;
    letterContent += `${name}\n${address}\n${city}, ${state} ${zip}\n\n`;
    
    // Add enclosures section
    letterContent += `Enclosures:\n`;
    letterContent += `- Copy of identification\n`;
    letterContent += `- Copy of credit report with disputed items highlighted\n`;
    letterContent += `- Supporting documentation\n`;
    
    return letterContent;
  } catch (error) {
    console.error("Error generating dispute letter:", error);
    throw error;
  }
};

/**
 * Generate a more advanced dispute letter with specific legal language
 * based on the sample letters provided
 */
export const generateAdvancedDisputeLetter = async (
  dispute: any,
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<string> => {
  // Implementation of advanced letter generation
  // For now, this is just a wrapper for the basic method
  return generateDisputeLetterForDiscrepancy(dispute, userInfo);
};

// Alias function for backward compatibility
export const generateEnhancedDisputeLetter = generateAdvancedDisputeLetter;

// Export all functions
export default {
  generateDisputeLetterForDiscrepancy,
  generateAdvancedDisputeLetter,
  generateEnhancedDisputeLetter
};
