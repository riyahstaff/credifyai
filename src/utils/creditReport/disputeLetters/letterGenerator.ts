
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
  userInfo: UserInfo,
  creditReportData?: any
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

  // Extract accounts from the credit report data if available
  let accountsSectionContent = "";
  if (creditReportData && creditReportData.accounts && creditReportData.accounts.length > 0) {
    creditReportData.accounts.forEach((account: any, index: number) => {
      const accountName = account.accountName || 'UNKNOWN CREDITOR';
      const accountNumber = account.accountNumber || 'Unknown';
      const maskedNumber = accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####';
      
      accountsSectionContent += `
Alleging Creditor#${index + 1} and Account #${index + 1} as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${maskedNumber}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;
    });
  } else if (discrepancy.accountName) {
    // If no accounts from report, at least include the disputed account
    accountsSectionContent = `
Alleging Creditor and Account as is reported on my credit report:
${discrepancy.accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;
  }

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
      
      // Add the accounts section
      if (accountsSectionContent && !enhancedLetter.includes("Alleging Creditor")) {
        enhancedLetter = enhancedLetter.replace(
          /To Whom It May Concern:/,
          `To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:${accountsSectionContent}`
        );
      }
      
      // Add the Re: section if it's not already there
      if (!enhancedLetter.includes("Re: My certified letter")) {
        enhancedLetter = enhancedLetter.replace(
          /\[DATE\]\n\n/,
          `${currentDate}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

`
        );
      }
      
      // Update enclosures section to only include ID and SSN card
      enhancedLetter = enhancedLetter.replace(
        /Enclosures:(\s|.)*$/m, 
        `Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`
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
  
  // Generate credit report number
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  
  // Generate an enhanced letter with more detailed legal language
  let letterContent = `
Credit Report #: ${creditReportNumber} Today is ${currentDate}
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

${discrepancy.bureau}
${bureauAddress}

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:${accountsSectionContent}

The federal and my state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety, and should I be compelled to direct a consumer request for a lawful potential resolution via civil and or criminal courts, undoubtedly the court and its ruling magistrate would requisite irrefutable evidence to every single and each any and or all of the aspects of mandated reporting of which you are obligated, to include full proof in testimonial certificate to your precise metro 2 reporting.

The CRSA enacted ad CDIA implemented Metro 2 COMPLIANCE standards will be among the many fold documents of evidence I will with no uncertainty request from you for each and every allegation of adversary notation and aspects of claimed account(s) that clearly needs to be removed immediately.

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

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report. Otherwise, anyone paying for your reporting services could fax, mail or email in even a potentially fraudulent account.

According to the provisions of the Fair Credit Reporting Act § 611(a) [15 USC 1681i(a)], these disputed items must be reinvestigated or deleted from my credit record within 30 days. During the investigation period, these items must be removed from my credit report as the mere reporting of items prior to debt validation constitutes collection activity. I am also requesting the names, addresses and telephone numbers of individuals you contacted during your investigation.

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report. If you have any questions or need additional information, please contact me at address noted below.

The CRSA enacted CDIA Metro 2 compliant reporting format REQUIRES the precise and exact fully complete 426-character P-Segment or Trailing Segment that is to include the minimally five portioned PERSONAL IDENTIFIERS to which databasing of alleged tradeline information occurs. Per CRSA, auto-populating ANY data field input entry and or application of Slash Entries (such as 11111 or 00000, etc) into the Metro 2 system is automatic call for deletion due to any and all repeating entry as NULL and VOID.

By the provisions of the Fair Credit Reporting Act and per the standards of reporting compliance implemented with the CRSA enacted CDIA Metro 2 COMPLIANCE regulations, I demand that these above mentioned derogatory items be investigated and permanently removed from my report. It is my understanding that you will recheck these items with the creditor who has posted them. Please remove any information that the creditor cannot verify. I understand that under 15 U.S.C. Sec. 1681i(a), you must complete this reinvestigation within 30 days of receipt of this letter.

Please send an updated copy of my credit report to the above address. According to the act, there shall be no charge for this updated report. I also request that you please send notices of corrections to anyone who received my credit report in the past six months.

THANK YOU IN ADVANCE for your WILLFUL rectifying of the notated MIS-INFORMATION above indicated,

${userInfo.name}

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

  return letterContent;
};
