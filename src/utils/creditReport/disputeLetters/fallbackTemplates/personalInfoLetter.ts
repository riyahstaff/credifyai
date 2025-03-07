
/**
 * Generate a fallback personal information dispute letter when no samples are available
 */
export const generateFallbackPersonalInfoDisputeLetter = (): string => {
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
  
  letter += `Re: Dispute of Inaccurate Personal Information\n\n`;
  
  letter += `To Whom It May Concern:\n\n`;
  letter += `I am writing to dispute inaccurate personal information that appears on my credit report.\n\n`;
  
  letter += `DISPUTED ITEM(S):\n`;
  letter += `Type: Personal Information Error\n`;
  letter += `Incorrect Information: [DESCRIBE INACCURATE INFORMATION]\n`;
  letter += `Correct Information: [PROVIDE CORRECT INFORMATION]\n\n`;
  
  letter += `This inaccuracy could lead to confusion regarding my identity and potentially affect my creditworthiness. Under Section 611 of the FCRA, you are required to conduct a reasonable investigation into disputed information and correct any inaccuracies.\n\n`;
  
  letter += `I request that you:\n`;
  letter += `1. Update my personal information with the correct details provided above\n`;
  letter += `2. Remove any outdated or incorrect information\n`;
  letter += `3. Notify me when the investigation is complete\n`;
  letter += `4. Provide me with a free updated copy of my credit report showing the corrections\n\n`;
  
  letter += `Please complete your investigation within the 30-day timeframe as required by the FCRA.\n\n`;
  
  letter += `Sincerely,\n\n`;
  letter += `[YOUR NAME]\n\n`;
  
  letter += `Enclosures:\n`;
  letter += `- Copy of Driver's License\n`;
  letter += `- Copy of Social Security Card\n`;
  letter += `- Supporting Documentation\n`;
  
  return letter;
};
