
/**
 * Export all fallback letter templates
 */
export * from './inquiryLetter';
export * from './latePaymentLetter';
export * from './personalInfoLetter';

/**
 * Generate a basic fallback dispute letter for any type
 */
export const generateFallbackDisputeLetter = (disputeType: string = 'general'): string => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  
  let letter = `Credit Report #: ${creditReportNumber}\nToday is ${formattedDate}\n\n`;
  letter += `[YOUR NAME]\n`;
  letter += `[YOUR ADDRESS]\n`;
  letter += `[CITY], [STATE] [ZIP]\n\n`;
  
  letter += `[BUREAU]\n`;
  letter += `[BUREAU ADDRESS]\n\n`;
  
  letter += `Re: Dispute of Inaccurate Information\n\n`;
  
  letter += `To Whom It May Concern:\n\n`;
  letter += `I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n\n`;
  
  letter += `DISPUTED ITEM(S):\n`;
  letter += `Account Name: [ACCOUNT_NAME]\n`;
  letter += `Account Number: [ACCOUNT_NUMBER]\n`;
  letter += `Reason for Dispute: [DISPUTE_REASON]\n\n`;
  
  letter += `This information is inaccurate because [EXPLANATION]. I have attached documentation that verifies my claim.\n\n`;
  
  letter += `According to the Fair Credit Reporting Act, Section 611 (15 U.S.C. § 1681i), you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, under Section 623 of the FCRA, data furnishers are required to provide accurate information to consumer reporting agencies.\n\n`;
  
  letter += `Please investigate this matter and correct your records within the 30-day timeframe provided by the FCRA. Furthermore, please provide me with notification of the results of your investigation.\n\n`;
  
  letter += `Sincerely,\n\n`;
  letter += `[YOUR NAME]\n\n`;
  
  letter += `Enclosures:\n`;
  letter += `- Copy of Driver's License\n`;
  letter += `- Copy of Social Security Card\n`;
  
  return letter;
};
