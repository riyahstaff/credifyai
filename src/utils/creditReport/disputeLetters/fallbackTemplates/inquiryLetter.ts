
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
  const numericDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
  
  let letter = `Credit Report #: ${creditReportNumber}\n`;
  letter += `Today's Date is: ${formattedDate} ${numericDate}\n\n`;
  letter += `TransUnion\nP.O. Box 2000\nChester, PA 19016\n\n`;
  letter += `My Personal Tracking Number is ${trackingNumber}\n\n`;
  letter += `RE: Unauthorized inquiries on my credit report - Request for immediate removal\n\n`;
  letter += `To Whom It May Concern:\n\n`;
  letter += `I recently reviewed my credit report and discovered unauthorized inquiries that I did not authorize. Under the Fair Credit Reporting Act (FCRA), Section 604, inquiries can only be made with a permissible purpose and with my authorization.\n\n`;
  letter += `I did not authorize these inquiries and request their immediate investigation and removal. These unauthorized inquiries have negatively impacted my credit score and constitute a violation of my privacy rights.\n\n`;
  letter += `Please note that per the FCRA §611, you are required to conduct a reasonable investigation into this matter. Additionally, according to FCRA §605, there are strict limitations on how inquiries can be reported.\n\n`;
  letter += `I also request verification that all information is being reported in accordance with Metro 2 reporting standards. The CDIA (Consumer Data Industry Association) requires all credit reporting to follow these standards, and "any deviations from these standards jeopardizes data integrity" (CRRG 3-4).\n\n`;
  letter += `Please remove these unauthorized inquiries immediately and provide confirmation when completed. If you find that these inquiries were authorized, please provide me with copies of my signed authorization for each inquiry.\n\n`;
  letter += `Upon completion of your investigation, please send me an updated copy of my credit report showing that the disputed inquiries have been removed. According to FCRA §611(a)(6) and §612, there should be no charge for this report.\n\n`;
  letter += `Sincerely,\n\n`;
  letter += `[YOUR NAME]\n[YOUR ADDRESS]\n[CITY], [STATE] [ZIP]\n\n`;
  letter += `Enclosures:\n`;
  letter += `- Copy of identification\n`;
  letter += `- Copy of credit report with disputed inquiries highlighted`;
  
  return letter;
};
