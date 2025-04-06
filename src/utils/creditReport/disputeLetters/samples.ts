
/**
 * Sample dispute letter templates
 */

/**
 * Get a sample letter for disputing inaccurate information
 * @returns Sample letter text
 */
export function getSampleInaccurateInfoLetter(): string {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU NAME]
[CREDIT BUREAU ADDRESS]
[CITY, STATE ZIP]

Re: Dispute of Inaccurate Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report. I have reviewed my credit report and found that the following item(s) are inaccurate or incomplete:

Account Name: [ACCOUNT NAME]
Account Number: [ACCOUNT NUMBER]
Reason for Dispute: The information reported is inaccurate

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report
- [ADDITIONAL DOCUMENTATION]
  `.trim();
}

/**
 * Get a sample letter for disputing an unauthorized inquiry
 * @returns Sample letter text
 */
export function getSampleUnauthorizedInquiryLetter(): string {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU NAME]
[CREDIT BUREAU ADDRESS]
[CITY, STATE ZIP]

Re: Dispute of Unauthorized Inquiry

To Whom It May Concern:

I am writing to dispute an unauthorized inquiry that appears on my credit report. I did not authorize the following company to access my credit report:

Company Name: [COMPANY NAME]
Date of Inquiry: [INQUIRY DATE]

I have no record of applying for credit with this company or giving them permission to access my credit report. Under the Fair Credit Reporting Act (FCRA), credit inquiries should only be made with proper authorization.

Please investigate this unauthorized access to my credit report and remove the inquiry if it cannot be verified as authorized. Please provide me with the results of your investigation within 30 days as required by the FCRA.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report showing the unauthorized inquiry
  `.trim();
}

/**
 * Get a sample letter for disputing a collection account
 * @returns Sample letter text
 */
export function getSampleCollectionDisputeLetter(): string {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU NAME]
[CREDIT BUREAU ADDRESS]
[CITY, STATE ZIP]

Re: Dispute of Collection Account

To Whom It May Concern:

I am writing to dispute a collection account that appears on my credit report. The details of the account are as follows:

Collection Agency: [COLLECTION AGENCY NAME]
Account Number: [ACCOUNT NUMBER]
Original Creditor: [ORIGINAL CREDITOR NAME]
Reported Balance: $[AMOUNT]

I dispute this collection account because:
[ ] This is not my account
[ ] This account has been paid in full on [DATE]
[ ] This account was settled for less than the full amount on [DATE]
[ ] This debt is too old to be reported (over 7 years old)
[ ] I have no record of this debt and request validation
[ ] Other: [EXPLANATION]

Under the Fair Credit Reporting Act (FCRA), you are required to conduct a reasonable investigation and verify this information with the original creditor. If this information cannot be verified, it must be removed from my credit report.

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report
- [ADDITIONAL DOCUMENTATION, IF ANY]
  `.trim();
}

/**
 * Get all sample dispute letters
 * @returns Object containing all sample letters
 */
export function getAllSampleLetters(): Record<string, string> {
  return {
    'inaccurate_information': getSampleInaccurateInfoLetter(),
    'unauthorized_inquiry': getSampleUnauthorizedInquiryLetter(),
    'collection_account': getSampleCollectionDisputeLetter()
  };
}
