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
    
    // Generate a unique credit report number
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
    // Format account number with masked format if available
    const accountNumber = accountDetails.accountNumber 
      ? (accountDetails.accountNumber.length > 4 
          ? 'xx-xxxx-' + accountDetails.accountNumber.slice(-4) 
          : 'xx-xxxx-' + accountDetails.accountNumber)
      : 'xx-xxxx-1000';
    
    // Format the account section in the requested format
    const accountSection = `
DISPUTED ITEM(S):
Account Name: ${accountName.toUpperCase()}
Account Number: ${accountNumber}
Reason for Dispute: ${disputeType}
`;

    // Handle empty user information with clear logging
    if (!userInfo.name || userInfo.name === "[YOUR NAME]") {
      console.warn("Missing user name in letter generation");
    }
    
    // Format address with proper line breaks
    let formattedAddress = '';
    if (userInfo.address && userInfo.address !== "[YOUR ADDRESS]") {
      formattedAddress = userInfo.address;
    } else {
      formattedAddress = "[YOUR ADDRESS]";
    }
    
    let locationInfo = '';
    if (userInfo.city && userInfo.state && userInfo.zip && 
        userInfo.city !== "[CITY]" && 
        userInfo.state !== "[STATE]" && 
        userInfo.zip !== "[ZIP]") {
      locationInfo = `${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;
    } else {
      locationInfo = "[CITY], [STATE] [ZIP]";
    }

    // Generate the final letter
    let letterContent = `Credit Report #: ${creditReportNumber}
Today is ${currentDate}

${userInfo.name || '[YOUR NAME]'}
${formattedAddress}
${locationInfo}

${bureau.charAt(0).toUpperCase() + bureau.slice(1)}
${bureauAddress}

Re: Dispute of Inaccurate Information - ${disputeType} Account #1

To Whom It May Concern:

I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:

${accountSection}

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law. The industry standard Metro 2 format requires specific, accurate reporting practices that have not been followed in this case.

${accountDetails.errorDescription || "The information appears to be incorrect and should be verified or removed from my credit report."}

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
