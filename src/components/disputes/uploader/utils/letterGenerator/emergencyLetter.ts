
/**
 * Create an emergency letter when all other methods fail
 */
import { DisputeLetter } from './types';

export function createEmergencyLetter(
  title: string, 
  accountName: string, 
  accountNumber: string, 
  errorType: string
): DisputeLetter {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
  
  const content = `
${currentDate}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information.

Experian
P.O. Box 4500
Allen, TX 75013

To Whom It May Concern:

I received a copy of my credit report (Credit Report #: ${creditReportNumber}) and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant.

Alleging Creditor and Account as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${accountNumber ? 'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 'xxxxxxxx####'}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant

The federal and state laws require full compliance to any and all standards of exacting and perfect reporting in its entirety. I am requesting that you investigate this information and remove any inaccurate items that cannot be verified.

According to the Fair Credit Reporting Act § 611 (FCRA § 611), you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified.

Please send an updated copy of my credit report to my address. According to the act, there shall be no charge for this updated report.

Sincerely,
[YOUR NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

  return {
    id: Date.now(),
    title: title,
    bureau: "Experian",
    recipient: "Experian",
    accountName: accountName,
    accountNumber: accountNumber,
    errorType: errorType,
    explanation: "This letter addresses issues found in your credit report.",
    letterContent: content,
    content: content,
    status: 'draft',
    createdAt: new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    }),
    bureaus: ["Experian"],
    laws: ["FCRA § 611", "FCRA § 623"],
    timestamp: new Date().toISOString()
  };
}
