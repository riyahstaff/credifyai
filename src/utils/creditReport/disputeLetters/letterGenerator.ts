
/**
 * Dispute letter generator functions
 */
import { RecommendedDispute, UserInfo, LegalReference } from '../types';
import { getLegalReferencesForDispute } from '../legalReferences';

/**
 * Generate a dispute letter for a specific discrepancy
 */
export const generateDisputeLetterForDiscrepancy = async (
  discrepancy: RecommendedDispute, 
  userInfo: UserInfo
): Promise<string> => {
  // Get the bureau address
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureau = discrepancy.bureau.toLowerCase();
  const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
  
  // Get the current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get legal references if available
  const legalReferences = discrepancy.legalBasis || 
    getLegalReferencesForDispute(discrepancy.reason, discrepancy.description);
  
  // Use the sample dispute language or the description
  const disputeExplanation = discrepancy.sampleDisputeLanguage || discrepancy.description;
  
  // Generate citations text
  const citationsText = legalReferences && legalReferences.length > 0 
    ? `As required by ${legalReferences.map(ref => `${ref.law} ${ref.section}`).join(', ')}, ` 
    : 'As required by the Fair Credit Reporting Act (FCRA) Section 611(a), ';
  
  // Generate the letter content
  return `
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${discrepancy.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information - ${discrepancy.accountName}${discrepancy.accountNumber ? ` - Account #${discrepancy.accountNumber}` : ''}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${discrepancy.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

Account Name: ${discrepancy.accountName}
${discrepancy.accountNumber ? `Account Number: ${discrepancy.accountNumber}` : ''}
Reason for Dispute: ${discrepancy.reason}

This information is inaccurate because: ${disputeExplanation}

${citationsText}you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this debt
4. Remove the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name}

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
`;
};
