
/**
 * Dispute letter generator functions
 */
import { RecommendedDispute, UserInfo, LegalReference } from '../types';
import { getLegalReferencesForDispute } from '../legalReferences';
import { getSampleDisputeLanguage } from './sampleLanguage';
import { findSampleDispute } from './sampleDisputes';

/**
 * Generate a dispute letter for a specific discrepancy
 */
export const generateDisputeLetterForDiscrepancy = async (
  discrepancy: RecommendedDispute, 
  userInfo: UserInfo
): Promise<string> => {
  console.log("Generating dispute letter for:", discrepancy);

  // Get the bureau address
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  // Normalize bureau name to match our address keys
  const bureauKey = discrepancy.bureau.toLowerCase().replace(/\s+/g, '');
  
  // Choose the correct address or use a placeholder
  const bureauAddress = bureauAddresses[bureauKey as keyof typeof bureauAddresses] || 
                       `${discrepancy.bureau}\n[BUREAU ADDRESS]`;
  
  // Get the current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get legal references if available or fetch them
  const legalReferences = discrepancy.legalBasis || 
    getLegalReferencesForDispute(discrepancy.reason, discrepancy.description);
  
  // Format disputed account information - ensure actual account details are used
  const accountNumber = discrepancy.accountNumber || "Unknown";
  const disputedAccountInfo = `
DISPUTED ITEM(S):
- Account Name: ${discrepancy.accountName}
- Account Number: ${accountNumber}
- Reason for Dispute: ${discrepancy.reason}
- Details: ${discrepancy.description}
`;

  // Try to find a relevant sample dispute letter to use as a template
  try {
    const sampleLetter = await findSampleDispute(discrepancy.reason, discrepancy.bureau);
    if (sampleLetter) {
      console.log("Found sample dispute letter for this type of dispute");
      // Extract key phrases from the sample letter to enhance our letter
      let enhancedLetter = sampleLetter.content
        .replace(/\[FULL_NAME\]|\[YOUR_NAME\]|\[NAME\]/g, userInfo.name || '[YOUR NAME]')
        .replace(/\[ADDRESS\]|\[YOUR_ADDRESS\]/g, userInfo.address || '[YOUR ADDRESS]')
        .replace(/\[CITY\]/g, userInfo.city || '[CITY]')
        .replace(/\[STATE\]/g, userInfo.state || '[STATE]')
        .replace(/\[ZIP\]/g, userInfo.zip || '[ZIP]')
        .replace(/\[DATE\]|\[CURRENT_DATE\]/g, currentDate)
        .replace(/\[BUREAU\]/g, discrepancy.bureau)
        .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
        .replace(/\[ACCOUNT_NAME\]/g, discrepancy.accountName)
        .replace(/\[ACCOUNT_NUMBER\]/g, accountNumber)
        .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, discrepancy.reason)
        .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, discrepancy.description)
        .replace(/your credit report/gi, "my credit report")
        .replace(/Your credit report/gi, "My credit report");
      
      // Update enclosures section to only include ID and SSN card
      enhancedLetter = enhancedLetter.replace(
        /Enclosures:(\s|.)*$/m, 
        `Enclosures:
- Copy of Driver's License
- Copy of Social Security Card

${disputedAccountInfo}`
      );
      
      return enhancedLetter;
    }
  } catch (error) {
    console.error("Error finding sample dispute letter:", error);
    // Continue with regular template if there's an error
  }
  
  // If no sample dispute language is available, try to get one
  let disputeExplanation = discrepancy.sampleDisputeLanguage || discrepancy.description;
  
  if (!discrepancy.sampleDisputeLanguage) {
    try {
      const sampleLanguage = await getSampleDisputeLanguage(discrepancy.reason, discrepancy.bureau);
      if (sampleLanguage && sampleLanguage.length > 10) {
        disputeExplanation = `${discrepancy.description}\n\n${sampleLanguage}`;
      }
    } catch (error) {
      console.error("Error getting sample dispute language:", error);
      // Continue with original explanation if there's an error
    }
  }
  
  // Generate citations text with more specific references
  let citationsText = "As required by the Fair Credit Reporting Act (FCRA) Section 611(a), ";
  
  if (legalReferences && legalReferences.length > 0) {
    citationsText = "As required by ";
    legalReferences.forEach((ref, index) => {
      if (index > 0) {
        citationsText += index === legalReferences.length - 1 ? " and " : ", ";
      }
      citationsText += `${ref.law} ${ref.section} (${ref.title})`;
    });
    citationsText += ", ";
  }
  
  // Add additional relevant laws based on dispute type
  if (discrepancy.reason.toLowerCase().includes('not mine') || 
      discrepancy.reason.toLowerCase().includes('fraud') || 
      discrepancy.reason.toLowerCase().includes('identity')) {
    citationsText += "and consistent with the Fair and Accurate Credit Transactions Act (FACTA), ";
  }
  
  if (discrepancy.reason.toLowerCase().includes('collection') || 
      discrepancy.reason.toLowerCase().includes('debt')) {
    citationsText += "and in accordance with the Fair Debt Collection Practices Act (FDCPA), ";
  }
  
  // Generate an enhanced letter with more detailed legal language
  let letterContent = `
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${discrepancy.bureau}
${bureauAddress}

RE: FORMAL DISPUTE OF INACCURATE CREDIT INFORMATION
ACCOUNT NAME: ${discrepancy.accountName}
ACCOUNT NUMBER: ${accountNumber}
DISPUTE REASON: ${discrepancy.reason}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${discrepancy.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

${disputedAccountInfo}

EXPLANATION OF INACCURACY:
${disputeExplanation}

LEGAL BASIS FOR DISPUTE:
${citationsText}you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

Under Section 611 of the FCRA, you must:
1. Conduct a thorough investigation of this disputed information within 30 days (45 days if I submit additional information)
2. Forward all relevant information to the furnisher of this information
3. Consider all information I have submitted
4. Provide me with the results of your investigation and a free copy of my credit report if changes are made
5. Remove the disputed item if it cannot be properly verified

If you continue to report this information without proper verification, you may be in violation of the FCRA, which provides for actual and punitive damages, as well as attorneys' fees for failure to comply with these provisions.

I REQUEST THAT YOU:
- Conduct a thorough investigation of this disputed information
- Remove the inaccurate information from my credit report
- Send updated information to all credit bureaus and third parties who have received my credit report
- Provide me with written confirmation of the results of your investigation

Please direct all correspondence regarding this matter to the address listed above. I expect a response within the timeframe specified by the FCRA.

Sincerely,


${userInfo.name}

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

  return letterContent;
};
