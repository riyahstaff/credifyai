
import { DisputeType } from './types';
import { getSampleDisputeLanguage } from '@/utils/creditReport/disputeLetters';

export const generateManualDisputeLetter = async (
  dispute: DisputeType,
  samplePhrases: Record<string, string[]> = {},
  options?: { testMode?: boolean }
): Promise<string> => {
  // Log if we're generating in test mode
  if (options?.testMode) {
    console.log("Generating manual dispute letter in test mode");
  }
  
  // Get bureau address
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
  
  // Credit report number (placeholder)
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  
  // Try to find appropriate sample language based on dispute type
  let additionalLanguage = "";
  
  // First check sample phrases passed to the function
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
  
  // If no language found from sample phrases, try to get from sample dispute letters
  if (!additionalLanguage) {
    try {
      additionalLanguage = await getSampleDisputeLanguage(dispute.errorType, dispute.bureau);
    } catch (error) {
      console.error("Error getting sample dispute language:", error);
    }
  }
  
  // Format the explanation section
  const explanation = additionalLanguage ? 
    `${dispute.explanation}\n\n${additionalLanguage}` : 
    dispute.explanation;
  
  // Add a test mode indicator if enabled
  const testModeHeader = options?.testMode ? 
    "[TEST MODE - NOT FOR ACTUAL SUBMISSION]\n\n" : 
    "";
  
  // Create the account section in the format requested
  const accountNumber = dispute.accountNumber || 'Unknown'; // Handle undefined accountNumber
  const accountSection = `
Alleging Creditor and Account as is reported on my credit report:
${dispute.accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;

  return `${testModeHeader}Credit Report #: ${creditReportNumber} Today is ${currentDate}
My First and My Last name is: [YOUR NAME]
My Street NUMBER and My Street NAME is:
[YOUR ADDRESS]
My City and My State is:
[CITY], [STATE] [ZIP]

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

${dispute.bureau}
${bureauAddress}

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:
${accountSection}

The federal and my state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety, and should I be compelled to direct a consumer request for a lawful potential resolution via civil and or criminal courts, undoubtedly the court and its ruling magistrate would requisite irrefutable evidence to every single and each any and or all of the aspects of mandated reporting of which you are obligated, to include full proof in testimonial certificate to your precise metro 2 reporting.

The CRSA enacted ad CDIA implemented Metro 2 COMPLIANCE standards will be among the many fold documents of evidence I will with no uncertainty request from you for each and every allegation of adversary notation and aspects of claimed account(s) that clearly needs to be removed immediately.

Specific issues with this account:
${explanation}

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report. Otherwise, anyone paying for your reporting services could fax, mail or email in even a potentially fraudulent account.

According to the provisions of the Fair Credit Reporting Act § 611(a) [15 USC 1681i(a)], these disputed items must be reinvestigated or deleted from my credit record within 30 days. During the investigation period, these items must be removed from my credit report as the mere reporting of items prior to debt validation constitutes collection activity. I am also requesting the names, addresses and telephone numbers of individuals you contacted during your investigation.

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report. If you have any questions or need additional information, please contact me at address noted below.

The CRSA enacted CDIA Metro 2 compliant reporting format REQUIRES the precise and exact fully complete 426-character P-Segment or Trailing Segment that is to include the minimally five portioned PERSONAL IDENTIFIERS to which databasing of alleged tradeline information occurs. Per CRSA, auto-populating ANY data field input entry and or application of Slash Entries (such as 11111 or 00000, etc) into the Metro 2 system is automatic call for deletion due to any and all repeating entry as NULL and VOID.

By the provisions of the Fair Credit Reporting Act and per the standards of reporting compliance implemented with the CRSA enacted CDIA Metro 2 COMPLIANCE regulations, I demand that these above mentioned derogatory items be investigated and permanently removed from my report. It is my understanding that you will recheck these items with the creditor who has posted them. Please remove any information that the creditor cannot verify. I understand that under 15 U.S.C. Sec. 1681i(a), you must complete this reinvestigation within 30 days of receipt of this letter.

Please send an updated copy of my credit report to the above address. According to the act, there shall be no charge for this updated report. I also request that you please send notices of corrections to anyone who received my credit report in the past six months.

THANK YOU IN ADVANCE for your WILLFUL rectifying of the notated MIS-INFORMATION above indicated,
My First and My Last name is: [YOUR NAME]
My Street NUMBER and My Street NAME is:
[YOUR ADDRESS]
My City and My State is:
[CITY], [STATE] [ZIP]

Enclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number`;
};
