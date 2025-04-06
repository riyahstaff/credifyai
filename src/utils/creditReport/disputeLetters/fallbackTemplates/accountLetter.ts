
/**
 * Generate a fallback dispute letter for account issues
 * @param accountName The name of the account
 * @param accountNumber The account number
 * @param issueType The type of issue
 * @param bureau The credit bureau
 * @returns Dispute letter content
 */
export function generateAccountDisputeLetter(
  accountName: string,
  accountNumber: string | undefined,
  issueType: string,
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
  
  // Generate issue description based on type
  let issueDescription = 'This account contains inaccurate information.';
  
  switch (issueType) {
    case 'late_payment':
      issueDescription = 'This account incorrectly shows late payments. I have always paid on time.';
      break;
    case 'incorrect_balance':
      issueDescription = 'The balance reported for this account is incorrect.';
      break;
    case 'account_ownership':
      issueDescription = 'This account does not belong to me. It may be the result of identity theft or a mixed file.';
      break;
    case 'collection_account':
      issueDescription = 'This collection account is disputed as it is [not mine/paid/settled/too old to report].';
      break;
  }
  
  // Format account number if available
  const formattedAccountNumber = accountNumber 
    ? `\nAccount Number: ${accountNumber.length > 4 ? 'xxxx-xxxx-' + accountNumber.slice(-4) : accountNumber}`
    : '';
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
${date}

${bureauAddress}

Re: Dispute of Inaccurate Account Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report. I have identified the following item that is inaccurate:

Account Name: ${accountName.toUpperCase()}${formattedAccountNumber}

${issueDescription}

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of ID
- Copy of social security card
- Copy of utility bill
  `.trim();
}

/**
 * Generate a dispute letter for incorrect account information
 * @param accountName The name of the account
 * @param errorDescription Description of the error
 * @param bureau The credit bureau
 * @returns Dispute letter content
 */
export function generateDisputeLetterForAccount(
  accountName: string,
  errorDescription: string,
  bureau: string
): string {
  return generateAccountDisputeLetter(
    accountName,
    undefined,
    'incorrect_information',
    bureau
  );
}
