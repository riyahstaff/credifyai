
import { fetchDisputeTemplate } from './legalTemplates';
import { getRelevantFCRASections } from './legalTemplates';
import { getSuccessfulDisputeExamples } from './disputeLetters';
import { DISPUTE_TEMPLATES } from './constants';

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
    console.log("Generating dispute letter with:", { disputeType, accountDetails, userInfo });
    
    // Determine the dispute category and type based on the input
    let disputeCategory: keyof typeof DISPUTE_TEMPLATES = 'general';
    let templateType = 'GENERAL_DISPUTE';
    
    const normalizedDispute = disputeType.toLowerCase();
    if (normalizedDispute.includes('not') && normalizedDispute.includes('mine')) {
      disputeCategory = 'account';
      templateType = 'NOT_MY_ACCOUNT';
    } else if (normalizedDispute.includes('identity') || normalizedDispute.includes('fraud')) {
      disputeCategory = 'account';
      templateType = 'IDENTITY_THEFT';
    } else if (normalizedDispute.includes('balance')) {
      disputeCategory = 'account';
      templateType = 'INCORRECT_BALANCE';
    } else if (normalizedDispute.includes('payment') || normalizedDispute.includes('late')) {
      disputeCategory = 'account';
      templateType = 'INCORRECT_PAYMENT_HISTORY';
    } else if (normalizedDispute.includes('status')) {
      disputeCategory = 'account';
      templateType = 'INCORRECT_STATUS';
    } else if (normalizedDispute.includes('closed')) {
      disputeCategory = 'account';
      templateType = 'ACCOUNT_CLOSED';
    } else if (normalizedDispute.includes('inquiry')) {
      disputeCategory = 'inquiry';
      templateType = 'UNAUTHORIZED_INQUIRY';
    } else if (normalizedDispute.includes('collection')) {
      disputeCategory = 'collection';
      templateType = 'COLLECTION_DISPUTE';
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
    
    // Credit report number (placeholder)
    const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    
    // Bureau addresses
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureau = accountDetails.bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
    
    // Clean up account name and number
    const accountName = accountDetails.accountName || 'Unknown Account';
    const accountNumber = accountDetails.accountNumber || 'xxxxx';
    
    // Format the account section in the requested format
    const accountSection = `
DISPUTED ITEMS:
- **Creditor:** ${accountName.toUpperCase()}
- **Account #:** ${accountNumber ? (accountNumber.startsWith('xxxx') ? accountNumber : 'xxxx-xxxx-' + accountNumber.slice(-4)) : 'xxxx-xxxx-xxxx-xxxx'}
- **Alleged Late Payments:** As reported on my credit report
`;

    // Handle empty user information with clear logging
    if (!userInfo.name || userInfo.name === "[YOUR NAME]") {
      console.warn("Missing user name in letter generation");
    }
    if (!userInfo.address || !userInfo.city || !userInfo.state || !userInfo.zip) {
      console.warn("Missing address information in letter generation:", { 
        address: userInfo.address, 
        city: userInfo.city,
        state: userInfo.state,
        zip: userInfo.zip
      });
    }

    // Generate the final letter - directly use user information from parameters
    let letterContent = `Credit Report #: ${creditReportNumber} Today is ${currentDate}

${userInfo.name || '[YOUR NAME]'}
${userInfo.address || '[YOUR ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${bureau.charAt(0).toUpperCase() + bureau.slice(1)}
${bureauAddress}

Re: Dispute of Inaccurate Late Payment Information

To Whom It May Concern:

I am writing to dispute inaccurate late payment information that appears on my credit report. Per my review, under the credit report provided to me, the following alleged late payments noted are inaccurately reported and in violation of multiple laws, both federal and state, including but not limited to the FCRA, CRSA, and CDIA enactments.

${accountSection}

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law. The industry standard Metro 2 format requires specific, accurate reporting practices that have not been followed in this case.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

${userInfo.name || '[YOUR NAME]'}

Enclosures:
- Copy of ID
- Copy of social security card
- Copy of utility bill
`;

    // Ensure the KEY explanation is removed
    letterContent = letterContent.replace(
      /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
      ''
    );
    
    // Remove any "KEY" section explaining acronyms
    letterContent = letterContent.replace(
      /\*\s*means\s*REQUIRED\s*ALWAYS[\s\S]*?(?=\n\n)/g,
      ''
    );

    console.log("Generated letter content length:", letterContent.length);
    return letterContent;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    throw new Error("Failed to generate dispute letter");
  }
}
