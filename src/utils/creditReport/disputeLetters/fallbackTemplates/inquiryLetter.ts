
/**
 * Generate a fallback dispute letter for inquiry issues
 * @param inquiryName The name of the company that made the inquiry
 * @param inquiryDate The date of the inquiry
 * @param bureau The credit bureau
 * @returns Dispute letter content
 */
export function generateInquiryDisputeLetter(
  inquiryName: string,
  inquiryDate: string | undefined,
  bureau: string
): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const bureauAddresses: Record<string, string> = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureauAddress = bureauAddresses[bureau.toLowerCase()] || `${bureau} Credit Bureau`;
  
  const formattedDate = inquiryDate || 'unknown date';
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
${date}

${bureauAddress}

Re: Dispute of Unauthorized Inquiry

To Whom It May Concern:

I am writing to dispute an unauthorized inquiry that appears on my credit report. I did not authorize the following company to access my credit report:

Company Name: ${inquiryName}
Date of Inquiry: ${formattedDate}

I have no record of applying for credit with this company or giving them permission to access my credit report. Under the Fair Credit Reporting Act (FCRA), credit inquiries should only be made with proper authorization.

Please investigate this unauthorized access to my credit report and remove the inquiry if it cannot be verified as authorized. Please provide me with the results of your investigation within 30 days as required by the FCRA.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of ID
- Copy of social security card
- Copy of utility bill
- Copy of credit report showing the unauthorized inquiry
  `.trim();
}

/**
 * Generate a dispute letter for an unauthorized inquiry
 * @param inquiryName The name of the company that made the inquiry
 * @param bureau The credit bureau
 * @returns Dispute letter content
 */
export function generateDisputeLetterForInquiry(
  inquiryName: string,
  bureau: string
): string {
  return generateInquiryDisputeLetter(inquiryName, undefined, bureau);
}
