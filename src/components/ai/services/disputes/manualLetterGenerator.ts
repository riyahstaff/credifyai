
import { DisputeType } from './types';

export const generateManualDisputeLetter = (
  dispute: DisputeType,
  samplePhrases: Record<string, string[]> = {}
): string => {
  // Enhanced letter template with FCRA citations and legal language
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureau = dispute.bureau.toLowerCase();
  const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Try to find appropriate sample language based on dispute type
  let additionalLanguage = "";
  if (samplePhrases) {
    if (dispute.errorType.toLowerCase().includes('balance')) {
      additionalLanguage = samplePhrases.balanceDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('late') || dispute.errorType.toLowerCase().includes('payment')) {
      additionalLanguage = samplePhrases.latePaymentDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('not mine') || dispute.errorType.toLowerCase().includes('fraud')) {
      additionalLanguage = samplePhrases.accountOwnershipDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('closed')) {
      additionalLanguage = samplePhrases.closedAccountDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('inquiry')) {
      additionalLanguage = samplePhrases.inquiryDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('name') || dispute.errorType.toLowerCase().includes('address')) {
      additionalLanguage = samplePhrases.personalInfoDisputes?.[0] || "";
    } else if (dispute.errorType.toLowerCase().includes('student')) {
      // Add student loan specific language
      additionalLanguage = "In light of recent Department of Education changes affecting student loan servicing and reporting, this information should be reviewed for compliance with current federal guidelines.";
    }
  }
  
  // Add the sample language if available
  const explanation = additionalLanguage ? 
    `${dispute.explanation}\n\n${additionalLanguage}` : 
    dispute.explanation;
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

${currentDate}

${dispute.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information - Account #[ACCOUNT NUMBER]

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${dispute.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

Account Name: ${dispute.accountName}
Account Number: [ACCOUNT NUMBER]
Reason for Dispute: ${dispute.errorType}

This information is inaccurate because: ${explanation}

Under Section 611(a) of the FCRA, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this debt
4. Remove the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
  `;
};
