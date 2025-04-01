
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
  letter += `I am writing to dispute inaccurate late payment information that appears on my credit report. Per my review, under the credit report provided to me, the following alleged late payments noted are inaccurately reported and in violation of multiple laws, both federal and state, including but not limited to the FCRA, CRSA, and CDIA enactments.\n\n`;
  
  letter += `DISPUTED ITEMS:\n`;
  // Format for displaying multiple accounts
  letter += `- **Creditor:** [ACCOUNT_NAME]\n`;
  letter += `- **Account #:** [ACCOUNT_NUMBER]\n`;
  letter += `- **Alleged Late Payments:** [DATES OF REPORTED LATE PAYMENTS]\n\n`;
  
  // Add strong Metro 2 verbiage
  letter += `This information is inaccurate according to all relevant federal requirements for credit reporting. Under the CDIA Metro 2® Format which furnishers are MANDATED to comply with, the payment history must be reported using specific codes that communicate accurate payment status. The information reported fails to comply with these strict METRO 2 FORMAT standards.\n\n`;
  
  letter += `Under Section 623 of the FCRA, furnishers of information to consumer reporting agencies must provide accurate information, and Section 611 requires you to conduct a reasonable investigation into disputed information. Furthermore, per CRSA enacted, CDIA implemented laws, ALL reporting must be deleted if not CERTIFIABLY fully true, correct, complete, timely, and entirely Metro 2 format compliant.\n\n`;
  
  letter += `Moreover, under Section 605 of the FCRA, late payment information must not remain on a consumer's credit report beyond 7 years. I request verification that these reported late payments have not exceeded this statutory time frame and that the original date of delinquency has been properly established and maintained.\n\n`;
  
  letter += `I am hereby demanding that you, in accordance with both federal and state law, perform an investigation of this matter that includes:\n\n`;
  letter += `1. Verification with the furnisher(s) of the exact dates reported as late\n`;
  letter += `2. Confirmation that the furnisher(s) can provide documentary evidence of the alleged late payments\n`;
  letter += `3. Verification that the furnisher(s) are reporting in full compliance with Metro 2 standards, including proper use of payment history profile codes\n`;
  letter += `4. Confirmation that the furnisher(s) have maintained and can produce all records necessary to verify the accuracy of these alleged late payments\n\n`;
  
  letter += `If the furnisher(s) cannot provide CERTIFIED documentation proving the accuracy of this information according to Metro 2 Format standards, this information must be promptly removed from my credit report, as required by law.\n\n`;
  
  letter += `Please investigate this matter and remove the inaccurate late payment information from my credit report. Upon completion of your investigation, please send me an updated copy of my credit report showing that this inaccurate information has been corrected, as required by Section 611 of the FCRA.\n\n`;
  
  letter += `Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant.\n\n`;
  
  letter += `Sincerely,\n\n`;
  letter += `[YOUR NAME]\n\n`;
  
  letter += `Enclosures:\n`;
  letter += `- Copy of Driver's License\n`;
  letter += `- Copy of Social Security Card\n`;
  letter += `- Payment Records (if available)\n`;
  
  return letter;
};
