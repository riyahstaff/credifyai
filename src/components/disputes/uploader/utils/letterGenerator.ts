
import { CreditReportData } from '@/utils/creditReportParser';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';
import { IssueItem } from '../types/analysisTypes';

interface UserInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * Get user information from local storage or provide defaults
 */
export const getUserInfo = (): UserInfo => {
  return {
    name: localStorage.getItem('userName') || "[YOUR NAME]",
    address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
    city: localStorage.getItem('userCity') || "[CITY]",
    state: localStorage.getItem('userState') || "[STATE]",
    zip: localStorage.getItem('userZip') || "[ZIP]"
  };
};

/**
 * Create a fallback dispute letter when no issues can be processed
 */
export const createFallbackLetter = (): any => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Credit report number (placeholder if not available)
  const creditReportNumber = localStorage.getItem('creditReportNumber') || 'CR' + Math.floor(Math.random() * 10000000);
  const userInfo = getUserInfo();
  
  return {
    bureau: "Equifax",
    accountName: "All Accounts",
    accountNumber: "",
    errorType: "General Dispute",
    explanation: "I am disputing all information in my credit report that may be inaccurate, incomplete, or not compliant with Metro 2 standards as required by law.",
    letterContent: `Credit Report #: ${creditReportNumber} Today is ${currentDate}
My First and My Last name is: ${userInfo.name}
My Street NUMBER and My Street NAME is:
${userInfo.address}
My City and My State is:
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

Equifax Information Services LLC
P.O. Box 740256
Atlanta, GA 30374

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:

The federal and my state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety, and should I be compelled to direct a consumer request for a lawful potential resolution via civil and or criminal courts, undoubtedly the court and its ruling magistrate would requisite irrefutable evidence to every single and each any and or all of the aspects of mandated reporting of which you are obligated, to include full proof in testimonial certificate to your precise metro 2 reporting.

The CRSA enacted ad CDIA implemented Metro 2 COMPLIANCE standards will be among the many fold documents of evidence I will with no uncertainty request from you for each and every allegation of adversary notation and aspects of claimed account(s) that clearly needs to be removed immediately.

To avoid such an unnecessary and obviously troublesome action for you, please compose undoubted certificates of your lawful actions to irrefutably verify and validate all data for this and all allegations of derogatory account and or aspects of adversary reporting to include at a minimum every notation, each and all dates, unmistakable accounting balances, all transactions and the audits of all such activities, any and all lawfully verified and recorded identifications, the minimal five (5) portioned personal identifiers, each and every of the alpha-/ numeric-/ and or alphanumeric source codes, all of the sequential and precisely exact 426 characters of the P-6 segment (aka P-statement), the 386 pieces to confirmation of a collection (if any), the creditor classification codes, each and all pay status, and else wise mandated portions of metro 2 compliant reporting, whether reported or not.

To return to federal and my state's reporting compliance, as REQUIRED BY LAW, please eradicate any and every aspect of adversary and or derogatory reporting UNPROVEN to be in its entirety FULLY TRUE, ACCURATE, COMPLETE, TIMELY, of MY OWNERSHIP, OF MY RESPONSIBILITY, in accordance to each and every obligatory reporting regulation, mentioned here or not! COMPOSE PROOF in testimonial certificate is DEMANDED, anything less will compel me to determine your actions as HOSTILE and WILLFULLY IGNORANT to my consumer and civil rights and willfully derelict to proper reporting, a CLEAR VIOLATION of FEDERAL LAW of with I may indeed seek and be awarded punitive monetary benefits beyond the REQUISITE RESOLUTIONS that I am here and now DEMANDING!

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report. Otherwise, anyone paying for your reporting services could fax, mail or email in even a potentially fraudulent account.

According to the provisions of the Fair Credit Reporting Act § 611(a) [15 USC 1681i(a)], these disputed items must be reinvestigated or deleted from my credit record within 30 days. During the investigation period, these items must be removed from my credit report as the mere reporting of items prior to debt validation constitutes collection activity. I am also requesting the names, addresses and telephone numbers of individuals you contacted during your investigation.

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report. If you have any questions or need additional information, please contact me at address noted below.

The CRSA enacted CDIA Metro 2 compliant reporting format REQUIRES the precise and exact fully complete 426-character P-Segment or Trailing Segment that is to include the minimally five portioned PERSONAL IDENTIFIERS to which databasing of alleged tradeline information occurs. Per CRSA, auto-populating ANY data field input entry and or application of Slash Entries (such as 11111 or 00000, etc) into the Metro 2 system is automatic call for deletion due to any and all repeating entry as NULL and VOID.

By the provisions of the Fair Credit Reporting Act and per the standards of reporting compliance implemented with the CRSA enacted CDIA Metro 2 COMPLIANCE regulations, I demand that these above mentioned derogatory items be investigated and permanently removed from my report. It is my understanding that you will recheck these items with the creditor who has posted them. Please remove any information that the creditor cannot verify. I understand that under 15 U.S.C. Sec. 1681i(a), you must complete this reinvestigation within 30 days of receipt of this letter.

Please send an updated copy of my credit report to the above address. According to the act, there shall be no charge for this updated report. I also request that you please send notices of corrections to anyone who received my credit report in the past six months.

THANK YOU IN ADVANCE for your WILLFUL rectifying of the notated MIS-INFORMATION above indicated,
My First and My Last name is: ${userInfo.name}
My Street NUMBER and My Street NAME is:
${userInfo.address}
My City and My State is:
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

Enclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number
`,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate dispute letters based on identified issues
 */
export const generateDisputeLetters = async (
  issues: IssueItem[],
  maxLetters = 3
): Promise<any[]> => {
  const userInfo = getUserInfo();
  const generatedLetters = [];
  
  // If no issues are provided, return a fallback letter
  if (!issues || issues.length === 0) {
    return [createFallbackLetter()];
  }
  
  // Credit report number (placeholder if not available)
  const creditReportNumber = localStorage.getItem('creditReportNumber') || 'CR' + Math.floor(Math.random() * 10000000);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Try to generate letters for each issue, up to maxLetters
  for (const issue of issues.slice(0, maxLetters)) { 
    const bureauName = issue.account?.bureau || "Equifax";
    const accountName = issue.account?.accountName || issue.title;
    const accountNumber = issue.account?.accountNumber || "";
    
    try {
      console.log(`Generating dispute letter for: ${accountName} - ${issue.title}`);
      
      // Build a detailed description that includes specific details from the account
      let detailedDescription = issue.description;
      
      // Add account details to the description if available
      if (issue.account) {
        detailedDescription += `\n\nAccount details:\n`;
        if (issue.account.dateOpened) detailedDescription += `- Date Opened: ${issue.account.dateOpened}\n`;
        if (issue.account.lastReportedDate) detailedDescription += `- Last Reported: ${issue.account.lastReportedDate}\n`;
        if (issue.account.currentBalance) detailedDescription += `- Current Balance: ${issue.account.currentBalance}\n`;
        if (issue.account.paymentStatus) detailedDescription += `- Payment Status: ${issue.account.paymentStatus}\n`;
        if (issue.account.accountType) detailedDescription += `- Account Type: ${issue.account.accountType}\n`;
        
        // Include any remarks
        if (issue.account.remarks && issue.account.remarks.length > 0) {
          detailedDescription += `- Remarks: ${issue.account.remarks.join(', ')}\n`;
        }
      }
      
      // Add reference to applicable laws
      if (issue.laws && issue.laws.length > 0) {
        detailedDescription += `\nThis dispute is based on the following legal provisions: ${issue.laws.join(', ')}`;
      }
      
      // Format the account entry in the required format
      const accountSection = `
Alleging Creditor and Account as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;
      
      // Create letter in the specified format
      const letterContent = `Credit Report #: ${creditReportNumber} Today is ${currentDate}
My First and My Last name is: ${userInfo.name}
My Street NUMBER and My Street NAME is:
${userInfo.address}
My City and My State is:
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

${bureauName === "Equifax" ? "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374" : 
 bureauName === "Experian" ? "Experian\nP.O. Box 4500\nAllen, TX 75013" :
 bureauName === "TransUnion" ? "TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016" :
 bureauName}

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:
${accountSection}

The federal and my state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety, and should I be compelled to direct a consumer request for a lawful potential resolution via civil and or criminal courts, undoubtedly the court and its ruling magistrate would requisite irrefutable evidence to every single and each any and or all of the aspects of mandated reporting of which you are obligated, to include full proof in testimonial certificate to your precise metro 2 reporting.

The CRSA enacted ad CDIA implemented Metro 2 COMPLIANCE standards will be among the many fold documents of evidence I will with no uncertainty request from you for each and every allegation of adversary notation and aspects of claimed account(s) that clearly needs to be removed immediately.

To avoid such an unnecessary and obviously troublesome action for you, please compose undoubted certificates of your lawful actions to irrefutably verify and validate all data for this and all allegations of derogatory account and or aspects of adversary reporting to include at a minimum every notation, each and all dates, unmistakable accounting balances, all transactions and the audits of all such activities, any and all lawfully verified and recorded identifications, the minimal five (5) portioned personal identifiers, each and every of the alpha-/ numeric-/ and or alphanumeric source codes, all of the sequential and precisely exact 426 characters of the P-6 segment (aka P-statement), the 386 pieces to confirmation of a collection (if any), the creditor classification codes, each and all pay status, and else wise mandated portions of metro 2 compliant reporting, whether reported or not.

To return to federal and my state's reporting compliance, as REQUIRED BY LAW, please eradicate any and every aspect of adversary and or derogatory reporting UNPROVEN to be in its entirety FULLY TRUE, ACCURATE, COMPLETE, TIMELY, of MY OWNERSHIP, OF MY RESPONSIBILITY, in accordance to each and every obligatory reporting regulation, mentioned here or not! COMPOSE PROOF in testimonial certificate is DEMANDED, anything less will compel me to determine your actions as HOSTILE and WILLFULLY IGNORANT to my consumer and civil rights and willfully derelict to proper reporting, a CLEAR VIOLATION of FEDERAL LAW of with I may indeed seek and be awarded punitive monetary benefits beyond the REQUISITE RESOLUTIONS that I am here and now DEMANDING!

Specific issues with this account:
${detailedDescription}

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report. Otherwise, anyone paying for your reporting services could fax, mail or email in even a potentially fraudulent account.

According to the provisions of the Fair Credit Reporting Act § 611(a) [15 USC 1681i(a)], these disputed items must be reinvestigated or deleted from my credit record within 30 days. During the investigation period, these items must be removed from my credit report as the mere reporting of items prior to debt validation constitutes collection activity. I am also requesting the names, addresses and telephone numbers of individuals you contacted during your investigation.

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report. If you have any questions or need additional information, please contact me at address noted below.

The CRSA enacted CDIA Metro 2 compliant reporting format REQUIRES the precise and exact fully complete 426-character P-Segment or Trailing Segment that is to include the minimally five portioned PERSONAL IDENTIFIERS to which databasing of alleged tradeline information occurs. Per CRSA, auto-populating ANY data field input entry and or application of Slash Entries (such as 11111 or 00000, etc) into the Metro 2 system is automatic call for deletion due to any and all repeating entry as NULL and VOID.

By the provisions of the Fair Credit Reporting Act and per the standards of reporting compliance implemented with the CRSA enacted CDIA Metro 2 COMPLIANCE regulations, I demand that these above mentioned derogatory items be investigated and permanently removed from my report. It is my understanding that you will recheck these items with the creditor who has posted them. Please remove any information that the creditor cannot verify. I understand that under 15 U.S.C. Sec. 1681i(a), you must complete this reinvestigation within 30 days of receipt of this letter.

Please send an updated copy of my credit report to the above address. According to the act, there shall be no charge for this updated report. I also request that you please send notices of corrections to anyone who received my credit report in the past six months.

THANK YOU IN ADVANCE for your WILLFUL rectifying of the notated MIS-INFORMATION above indicated,
My First and My Last name is: ${userInfo.name}
My Street NUMBER and My Street NAME is:
${userInfo.address}
My City and My State is:
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

Enclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number`;
      
      const disputeData = {
        bureau: bureauName,
        accountName: accountName,
        accountNumber: accountNumber || "",
        errorType: issue.title,
        explanation: detailedDescription,
        letterContent: letterContent,
        impact: issue.impact,
        laws: issue.laws || ['FCRA § 611'],
        timestamp: new Date().toISOString()
      };
      
      generatedLetters.push(disputeData);
      console.log(`Letter generated for ${accountName} - ${issue.title}`);
    } catch (error) {
      console.error(`Error generating letter for ${accountName}:`, error);
    }
  }
  
  // If no letters were generated, create a fallback letter
  if (generatedLetters.length === 0) {
    console.log("No letters generated, creating fallback letter");
    generatedLetters.push(createFallbackLetter());
  }
  
  return generatedLetters;
};

/**
 * Store generated letters in session storage
 */
export const storeGeneratedLetters = (
  letters: any[]
): boolean => {
  if (!letters || letters.length === 0) {
    console.error("No letters to store");
    return false;
  }
  
  try {
    // Always store at least the first letter
    const firstLetter = letters[0];
    sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(firstLetter));
    
    try {
      // Try to store all letters if possible
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    } catch (storageError) {
      console.warn("Could not store all letters, only storing first letter:", storageError);
    }
    
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    console.log(`${letters.length} letters generated and stored in session storage`);
    return true;
  } catch (error) {
    console.error("Failed to store letters in session storage:", error);
    return false;
  }
};
