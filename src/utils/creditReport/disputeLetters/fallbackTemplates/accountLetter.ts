
/**
 * Fallback dispute letter template for account issues
 * Used when the enhanced letter generation fails
 */

interface AccountInfo {
  accountName: string;
  accountNumber: string;
  errorType: string;
  bureau: string;
}

export const generateFallbackAccountDisputeLetter = (accountInfo: AccountInfo): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  const { accountName, accountNumber, errorType, bureau } = accountInfo;
  
  return `${currentDate}

${bureau.toUpperCase()}
P.O. Box 2000
Chester, PA 19016

RE: Dispute of Inaccurate Credit Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report. The items disputed are inaccurate and incomplete, and I request an investigation of this information to correct the errors pursuant to the Fair Credit Reporting Act (FCRA).

DISPUTED ITEM(S):
Account Name: ${accountName.toUpperCase()}
Account Number: ${accountNumber}
Reason for Dispute: ${errorType}

Under the Fair Credit Reporting Act, Section 611(a), you are required to conduct a reasonable investigation into this matter. I am requesting that this account be verified and the inaccurate information be removed or corrected.

As per my rights under the FCRA, please provide me with:
1. Verification that you have contacted the furnisher of this information
2. Copies of any documentation used in your investigation
3. A description of your investigation process
4. Updated results of your investigation

Please send me a corrected copy of my credit report if changes are made. I am aware of my right to add a statement to my credit report if the dispute is not resolved to my satisfaction.

Thank you for your prompt attention to this matter.

Sincerely,

[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[YOUR SOCIAL SECURITY NUMBER]
`;
};
