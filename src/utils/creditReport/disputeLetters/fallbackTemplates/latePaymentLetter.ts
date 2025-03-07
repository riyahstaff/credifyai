
/**
 * Generate a fallback late payment dispute letter when no samples are available
 */
export const generateFallbackLatePaymentDisputeLetter = (): string => {
  // Generate a credit report number
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  
  // Format date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  
  let letter = `Credit Report #: ${creditReportNumber}\nToday is ${formattedDate}\n\n`;
  letter += `[YOUR NAME]\n`;
  letter += `[YOUR ADDRESS]\n`;
  letter += `[CITY], [STATE] [ZIP]\n\n`;
  
  letter += `[BUREAU]\n`;
  letter += `[BUREAU ADDRESS]\n\n`;
  
  letter += `Re: Dispute of Inaccurate Late Payment Information\n\n`;
  
  letter += `To Whom It May Concern:\n\n`;
  letter += `I am writing to dispute inaccurate late payment information that appears on my credit report.\n\n`;
  
  letter += `DISPUTED ITEM(S):\n`;
  letter += `Account Name: [ACCOUNT_NAME]\n`;
  letter += `Account Number: [ACCOUNT_NUMBER]\n`;
  letter += `Reported Late Payments: [DATES OF REPORTED LATE PAYMENTS]\n`;
  letter += `Reason for Dispute: Incorrect Late Payment Reporting\n\n`;
  
  letter += `This information is inaccurate, as I have always made timely payments on this account. I have maintained detailed records of my payments which clearly demonstrate that the payments in question were made on time.\n\n`;
  
  letter += `Under Section 623 of the FCRA, furnishers of information to consumer reporting agencies must provide accurate information, and Section 611 requires you to conduct a reasonable investigation into disputed information.\n\n`;
  
  letter += `Please investigate this matter and remove the inaccurate late payment information from my credit report. Upon completion of your investigation, please send me an updated copy of my credit report showing that this inaccurate information has been corrected.\n\n`;
  
  letter += `Sincerely,\n\n`;
  letter += `[YOUR NAME]\n\n`;
  
  letter += `Enclosures:\n`;
  letter += `- Copy of Driver's License\n`;
  letter += `- Copy of Social Security Card\n`;
  letter += `- Payment Records (if available)\n`;
  
  return letter;
};
