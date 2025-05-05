
/**
 * Generate a dispute letter for a specific discrepancy
 */
export function generateDisputeLetterForDiscrepancy(
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): string {
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Bureau addresses
  const bureauAddresses: Record<string, string> = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  // Normalize bureau name for address lookup
  const bureau = accountDetails.bureau.toLowerCase();
  const bureauAddress = bureauAddresses[bureau] || accountDetails.bureau;
  
  // Format the account section
  let accountSection = '';
  if (accountDetails.accountName) {
    accountSection = `
DISPUTED ITEM(S):
Account Name: ${accountDetails.accountName.toUpperCase()}
${accountDetails.accountNumber ? `Account Number: ${accountDetails.accountNumber}` : ''}
Issue: The information reported for this account appears to be inaccurate
`;
  }
  
  // Format address only with real data - NO PLACEHOLDERS
  let addressBlock = userInfo.name ? `${userInfo.name}\n` : '';
  
  if (userInfo.address) {
    addressBlock += `${userInfo.address}\n`;
  }
  
  if (userInfo.city && userInfo.state) {
    addressBlock += `${userInfo.city}, ${userInfo.state} ${userInfo.zip || ''}\n`;
  }
  
  addressBlock += `\n${currentDate}\n\n`;
  
  // Generate letter content with specific dispute language related to the account
  const letterContent = `${addressBlock}${bureauAddress}\n\n` +
    `Re: Dispute of Inaccurate Information in Credit Report\n\n` +
    `To Whom It May Concern:\n\n` +
    `I am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified the following item(s) that require investigation:\n\n` +
    `${accountSection}\n` +
    `${accountDetails.errorDescription || "The information appears to be incorrect and should be verified or removed from my credit report."}\n\n` +
    `Under the Fair Credit Reporting Act (FCRA), specifically section 15 USC 1681i, you are required to conduct a reasonable investigation of the disputed information and verify its accuracy with the original source. If the information cannot be verified, it must be removed from my credit report.\n\n` +
    `I've attached copies of relevant documentation to assist with your investigation. Please complete your investigation within 30 days as required by the FCRA.\n\n` +
    `Thank you for your prompt attention to this matter.\n\n` +
    `Sincerely,\n\n` +
    `${userInfo.name}\n\n` +
    `Enclosures:\n` +
    `- Copy of ID\n` +
    `- Copy of social security card\n` +
    `- Proof of address\n`;
  
  return letterContent;
}
