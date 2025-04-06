
import { PersonalInfo, CreditReportInquiry } from '../../types';

/**
 * Generate a fallback dispute letter for inquiry issues
 * @param personalInfo Consumer's personal information
 * @param inquiry Inquiry to dispute
 * @param bureau Credit bureau to send the letter to
 * @returns Generated dispute letter content
 */
export function generateFallbackInquiryDisputeLetter(
  personalInfo: PersonalInfo,
  inquiry: CreditReportInquiry,
  bureau: string
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
  letter += `Re: Dispute of Unauthorized Credit Inquiry\n\n`;
  
  // Add greeting
  letter += `To Whom It May Concern:\n\n`;
  
  // Add introduction
  letter += `I am writing to dispute an unauthorized inquiry that appears on my credit report. I have identified the following inquiry that I did not authorize:\n\n`;
  
  // Add inquiry details
  const inquiryName = inquiry.inquiryCompany || inquiry.inquiryBy || inquiry.creditor || "Unknown Company";
  letter += `Inquiry By: ${inquiryName}\n`;
  letter += `Inquiry Date: ${inquiry.inquiryDate}\n`;
  if (inquiry.type) {
    letter += `Inquiry Type: ${inquiry.type}\n`;
  }
  letter += `\n`;
  
  // Add dispute reason
  letter += `I did not authorize this inquiry and did not apply for credit with this company. Under the Fair Credit Reporting Act (FCRA), credit inquiries can only be made with a permissible purpose, typically with the consumer's consent. As I did not give my consent for this inquiry, it should be removed from my credit report.\n\n`;
  
  // Add legal basis
  letter += `Section 604 of the FCRA establishes permissible purposes for accessing a consumer's credit report, and Section 611 provides consumers with the right to dispute inaccurate information. This inquiry appears to violate these provisions as I did not authorize it.\n\n`;
  
  // Add conclusion and request
  letter += `Please investigate this matter and remove this unauthorized inquiry from my credit report. Please send me written confirmation when this action has been completed.\n\n`;
  
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
export const generateFallbackInquiryLetter = generateFallbackInquiryDisputeLetter;
