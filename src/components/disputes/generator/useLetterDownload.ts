
import { useToast } from '@/hooks/use-toast';

export function useLetterDownload() {
  const { toast } = useToast();
  
  const downloadLetter = (letterContent: string, bureau: string, accountName: string, accountNumber?: string) => {
    if (!letterContent) return;
    
    // Get consumer information from localStorage if available
    const consumerName = localStorage.getItem('userName') || '[YOUR NAME]';
    const consumerAddress = localStorage.getItem('userAddress') || '[YOUR ADDRESS]';
    const consumerCity = localStorage.getItem('userCity') || '[CITY]';
    const consumerState = localStorage.getItem('userState') || '[STATE]';
    const consumerZip = localStorage.getItem('userZip') || '[ZIP]';
    const consumerSSN = localStorage.getItem('userSSN') || '[SSN]';
    const consumerDOB = localStorage.getItem('userDOB') || '[DOB]';
    
    // Current date formatted
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Credit report number (placeholder if not available)
    const creditReportNumber = localStorage.getItem('creditReportNumber') || 'CR' + Math.floor(Math.random() * 10000000);
    
    // Bureau addresses
    const bureauAddresses = {
      'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || `${bureau}\n[BUREAU ADDRESS]`;
    
    // If this is a template letter with minimal content, enhance it with a standard dispute format
    if (letterContent.length < 300 || !letterContent.includes('DISPUTED ITEM')) {
      letterContent = `Credit Report #: ${creditReportNumber} Today is ${currentDate}
My First and My Last name is: ${consumerName}
My Street NUMBER and My Street NAME is:
${consumerAddress}
My City and My State is:
${consumerCity}, ${consumerState} ${consumerZip}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

${bureauAddress}

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:

${accountName ? `
Alleging Creditor and Account as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
` : ''}

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
My First and My Last name is: ${consumerName}
My Street NUMBER and My Street NAME is:
${consumerAddress}
My City and My State is:
${consumerCity}, ${consumerState} ${consumerZip}`;

      // Add inquiry-specific language if needed
      if (letterContent.toLowerCase().includes('inquiry')) {
        letterContent += `\n\n**Should any of the above noted items of chicanery and subterfuge leading to the allegations of the mis-reported misinformation of my complaint also be related to one or more accusations of inquiries, obviously I am now calling for undoubted and irrefutable physical proof of the verifiable validated and adequately acquired permissible purpose exactly as mandated by laws and or else eradicated in its entirety any and all such not yet demonstrated and certified true, correct, complete, timely, and metro 2 compliant accusations.`;
      }
    } else {
      // Just replace placeholders in existing letter
      letterContent = letterContent
        .replace(/\[YOUR NAME\]|\[FULL_NAME\]|\[NAME\]/g, consumerName)
        .replace(/\[YOUR ADDRESS\]|\[ADDRESS\]/g, consumerAddress)
        .replace(/\[CITY\]/g, consumerCity)
        .replace(/\[STATE\]/g, consumerState)
        .replace(/\[ZIP\]/g, consumerZip)
        .replace(/\[SSN\]|\[SOCIAL SECURITY NUMBER\]/g, consumerSSN)
        .replace(/\[DOB\]|\[DATE OF BIRTH\]/g, consumerDOB)
        .replace(/\[ACCOUNT NUMBER\]/g, accountNumber || 'Unknown')
        .replace(/\[BUREAU\]/g, bureau)
        .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
        .replace(/\[CURRENT_DATE\]|\[DATE\]/g, currentDate)
        .replace(/Your credit report/gi, "My credit report");
    }
    
    // Update enclosures section to match the requested format
    if (letterContent.includes("Enclosures:")) {
      const enclosurePattern = /Enclosures:[\s\S]*?(?=\n\n|\Z)/;
      letterContent = letterContent.replace(enclosurePattern, 
        `Enclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number`
      );
    } else {
      letterContent += `\n\nEnclosures:
- Proof of identification
- Proof of residence or mailing address
- Proof of social security number`;
    }
    
    // Create file and trigger download
    const element = document.createElement('a');
    const file = new Blob([letterContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Dispute_Letter_${bureau}_${accountName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter downloaded",
      description: "Your dispute letter has been downloaded to your device.",
    });
  };
  
  return { downloadLetter };
}
