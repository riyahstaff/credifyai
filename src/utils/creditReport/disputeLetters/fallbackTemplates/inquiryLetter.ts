
/**
 * Fallback template for inquiry dispute letters
 */

/**
 * Generate a fallback letter template for inquiry disputes
 */
export const generateFallbackInquiryDisputeLetter = (): string => {
  // Generate a credit report/tracking number
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  const trackingNumber = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
  
  // Format date using specific format to match sample letters
  const today = new Date();
  const formattedDate = `${today.toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })}`;
  
  let letter = `Credit Report #: ${creditReportNumber}\nToday is ${formattedDate}\n\n`;
  letter += `[YOUR NAME]\n`;
  letter += `[YOUR ADDRESS]\n`;
  letter += `[CITY], [STATE] [ZIP]\n\n`;
  
  letter += `TransUnion\nP.O. Box 2000\nChester, PA 19016\n\n`;
  
  letter += `Re: Unauthorized inquiries on my credit report - Request for immediate removal\n\n`;
  
  letter += `To Whom It May Concern:\n\n`;
  letter += `I recently reviewed my credit report and discovered unauthorized inquiries that I did not authorize. Under the Fair Credit Reporting Act (FCRA), Section 604, inquiries can only be made with a permissible purpose and with my authorization.\n\n`;
  
  letter += `DISPUTED ITEM(S):\n`;
  letter += `- Unauthorized inquiry from [ACCOUNT_NAME] on [DATE]\n\n`;
  
  letter += `I did not authorize these inquiries and request their immediate investigation and removal. These unauthorized inquiries have negatively impacted my credit score and constitute a violation of my privacy rights.\n\n`;
  
  letter += `According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify any and all inquiries you post on a credit report. Under Section 611 of the FCRA, you must conduct a thorough investigation of this disputed information within 30 days.\n\n`;
  
  letter += `Please remove these unauthorized inquiries immediately and provide confirmation when completed. If you find that these inquiries were authorized, please provide me with copies of my signed authorization for each inquiry.\n\n`;
  
  letter += `Sincerely,\n\n`;
  letter += `[YOUR NAME]\n\n`;
  
  letter += `Enclosures:\n`;
  letter += `- Copy of Driver's License\n`;
  letter += `- Copy of Social Security Card\n`;
  
  return letter;
};
