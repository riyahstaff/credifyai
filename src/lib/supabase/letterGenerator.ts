
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
    
    // Format the account section in the requested format
    const accountSection = `
Alleging Creditor and Account as is reported on my credit report:
${accountDetails.accountName.toUpperCase()}
ACCOUNT- ${accountDetails.accountNumber ? 'xxxxxxxx' + accountDetails.accountNumber.substring(Math.max(0, accountDetails.accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;

    // Generate the final letter
    let letterContent = `Credit Report #: ${creditReportNumber} Today is ${currentDate}
My First and My Last name is: ${userInfo.name || '[YOUR NAME]'}
My Street NUMBER and My Street NAME is:
${userInfo.address || '[YOUR ADDRESS]'}
My City and My State is:
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

${accountDetails.bureau}
${bureauAddress}

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:
${accountSection}

The federal and my state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety, and should I be compelled to direct a consumer request for a lawful potential resolution via civil and or criminal courts, undoubtedly the court and its ruling magistrate would requisite irrefutable evidence to every single and each any and or all of the aspects of mandated reporting of which you are obligated, to include full proof in testimonial certificate to your precise metro 2 reporting.

The CRSA enacted ad CDIA implemented Metro 2 COMPLIANCE standards will be among the many fold documents of evidence I will with no uncertainty request from you for each and every allegation of adversary notation and aspects of claimed account(s) that clearly needs to be removed immediately.

To avoid such an unnecessary and obviously troublesome action for you, please compose undoubted certificates of your lawful actions to irrefutably verify and validate all data for this and all allegations of derogatory account and or aspects of adversary reporting to include at a minimum every notation, each and all dates, unmistakable accounting balances, all transactions and the audits of all such activities, any and all lawfully verified and recorded identifications, the minimal five (5) portioned personal identifiers, each and every of the alpha-/ numeric-/ and or alphanumeric source codes, all of the sequential and precisely exact 426 characters of the P-6 segment (aka P-statement), the 386 pieces to confirmation of a collection (if any), the creditor classification codes, each and all pay status, and else wise mandated portions of metro 2 compliant reporting, whether reported or not.

To return to federal and my state's reporting compliance, as REQUIRED BY LAW, please eradicate any and every aspect of adversary and or derogatory reportings in any and every of your data files for which you will directly or indirectly produce, contain, store, sell, exhibit, or elsewise report.

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report.

Under Section 611 of the FCRA, you must:
1. Conduct a thorough investigation of this disputed information within 30 days (45 days if I submit additional information)
2. Forward all relevant information to the furnisher of this information
3. Consider all information I have submitted
4. Provide me with the results of your investigation and a free copy of my credit report if changes are made
5. Remove the disputed item if it cannot be properly verified

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report.

Sincerely,

${userInfo.name || '[YOUR NAME]'}

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

    // Remove any KEY explanation section if present
    letterContent = letterContent.replace(
      /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
      ''
    );
    
    // Remove any "KEY" section explaining acronyms
    letterContent = letterContent.replace(
      /\*\s*means\s*REQUIRED\s*ALWAYS[\s\S]*?(?=\n\n)/g,
      ''
    );

    return letterContent;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    throw new Error("Failed to generate dispute letter");
  }
}
