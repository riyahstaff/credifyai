
import { fetchDisputeTemplate } from './legalTemplates';
import { getRelevantFCRASections } from './legalTemplates';
import { getSuccessfulDisputeExamples } from './disputeLetters';

/**
 * Enhanced function to generate comprehensive dispute letters using templates and FCRA provisions
 * @param disputeType Type of dispute (identity theft, incorrect balance, etc.)
 * @param accountDetails Details about the account being disputed
 * @param userInfo User's personal information
 * @returns Generated dispute letter
 */
export async function generateEnhancedDisputeLetter(
  disputeType: string,
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
): Promise<string> {
  try {
    // Normalize dispute type to match our template keys
    let templateType: keyof typeof import('./constants').DISPUTE_TEMPLATES = 'GENERAL_DISPUTE';
    
    const normalizedDispute = disputeType.toLowerCase();
    if (normalizedDispute.includes('not') && normalizedDispute.includes('mine')) {
      templateType = 'NOT_MY_ACCOUNT';
    } else if (normalizedDispute.includes('identity') || normalizedDispute.includes('fraud')) {
      templateType = 'IDENTITY_THEFT';
    } else if (normalizedDispute.includes('balance')) {
      templateType = 'INCORRECT_BALANCE';
    } else if (normalizedDispute.includes('payment') || normalizedDispute.includes('late')) {
      templateType = 'INCORRECT_PAYMENT_HISTORY';
    } else if (normalizedDispute.includes('status')) {
      templateType = 'INCORRECT_STATUS';
    } else if (normalizedDispute.includes('closed')) {
      templateType = 'ACCOUNT_CLOSED';
    }
    
    // Fetch the appropriate template
    let letterTemplate = await fetchDisputeTemplate(templateType);
    
    // Fall back to general template if specific one isn't available
    if (!letterTemplate) {
      letterTemplate = await fetchDisputeTemplate('GENERAL_DISPUTE');
    }
    
    // Get relevant FCRA sections
    const fcraSections = await getRelevantFCRASections(templateType);
    
    // Get successful dispute examples
    const successfulExamples = await getSuccessfulDisputeExamples(templateType);
    
    // Use a successful example if available
    let additionalLanguage = '';
    if (successfulExamples.length > 0) {
      // Extract the most relevant paragraph from a successful example
      const example = successfulExamples[0];
      const paragraphs = example.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.length > 30 && paragraph.length < 300) {
          // Find a reasonably sized, relevant paragraph
          additionalLanguage = paragraph;
          break;
        }
      }
    }
    
    // Generate full letter with all components
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Bureau addresses
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureau = accountDetails.bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
    
    // Base letter template to use if no specific template is available
    const baseTemplate = `
${userInfo.name || '[YOUR NAME]'}
${userInfo.address || '[YOUR ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${currentDate}

${accountDetails.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information in Credit Report

Account Name: ${accountDetails.accountName}
Account Number: ${accountDetails.accountNumber || '[ACCOUNT NUMBER]'}
Reason for Dispute: ${disputeType}

To Whom It May Concern:

This letter is to formally dispute inaccurate information appearing on my credit report. I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611(a).

Information being disputed:
The ${disputeType.toLowerCase()} for the account listed above is being reported inaccurately. ${accountDetails.errorDescription}

${additionalLanguage ? `Detailed explanation:\n${additionalLanguage}\n\n` : ''}

Legal basis for dispute:
${fcraSections}

Under the FCRA, you are required to conduct a reasonable investigation into this matter and correct or delete any information that cannot be verified. Please note that according to the FCRA:

1. You must complete your investigation within 30 days (or 45 days if I provide additional information during the 30-day period).
2. You must forward all relevant information to the furnisher of this information for verification.
3. You must provide me with the results of your investigation and a free copy of my credit report if changes are made.
4. If information is changed or deleted, you cannot reinsert it without notifying me.

I request that you:
- Conduct a thorough investigation of this disputed information
- Remove the inaccurate information from my credit report
- Provide me with written confirmation of the results of your investigation

If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name || '[YOUR SIGNATURE]'}

Enclosures:
- Copy of credit report with disputed item highlighted
- [SUPPORTING DOCUMENTATION PLACEHOLDER]
`;

    // Use the specific template if available, otherwise use the base template
    let finalLetter = letterTemplate || baseTemplate;
    
    // Replace placeholders with actual values
    finalLetter = finalLetter
      .replace(/\[FULL_NAME\]|\[YOUR_NAME\]|\[NAME\]/g, userInfo.name || '[YOUR NAME]')
      .replace(/\[ADDRESS\]|\[YOUR_ADDRESS\]/g, userInfo.address || '[YOUR ADDRESS]')
      .replace(/\[CITY\]/g, userInfo.city || '[CITY]')
      .replace(/\[STATE\]/g, userInfo.state || '[STATE]')
      .replace(/\[ZIP\]/g, userInfo.zip || '[ZIP]')
      .replace(/\[DATE\]|\[CURRENT_DATE\]/g, currentDate)
      .replace(/\[BUREAU\]/g, accountDetails.bureau)
      .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
      .replace(/\[ACCOUNT_NAME\]/g, accountDetails.accountName)
      .replace(/\[ACCOUNT_NUMBER\]/g, accountDetails.accountNumber || '[ACCOUNT NUMBER]')
      .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, disputeType)
      .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, accountDetails.errorDescription)
      .replace(/\[FCRA_SECTIONS\]/g, fcraSections)
      .replace(/\[ADDITIONAL_LANGUAGE\]/g, additionalLanguage);
    
    return finalLetter;
  } catch (error) {
    console.error('Error generating enhanced dispute letter:', error);
    // Return a simplified letter as fallback
    return `
${userInfo.name || '[YOUR NAME]'}
${userInfo.address || '[YOUR ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${new Date().toLocaleDateString()}

${accountDetails.bureau}
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report:

Account Name: ${accountDetails.accountName}
Account Number: ${accountDetails.accountNumber || '[ACCOUNT NUMBER]'}
Reason for Dispute: ${disputeType}

This information is inaccurate because: ${accountDetails.errorDescription}

Under Section 611 of the Fair Credit Reporting Act, you are required to investigate this dispute and remove information that cannot be verified.

Sincerely,

${userInfo.name || '[YOUR NAME]'}
`;
  }
}
