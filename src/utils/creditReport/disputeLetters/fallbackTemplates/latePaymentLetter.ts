
/**
 * Generate a fallback late payment dispute letter when no samples are available
 */
export const generateFallbackLatePaymentDisputeLetter = (): string => {
  return `[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Late Payment Information

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611 and Section 623, to dispute inaccurate late payment information that appears on my credit report.

Upon reviewing my credit report, I discovered that [CREDITOR NAME] has reported my account #[ACCOUNT NUMBER] as having late payments on [DATES OF REPORTED LATE PAYMENTS]. This information is inaccurate, as I have always made timely payments on this account.

I have maintained detailed records of my payments, including [MENTION ANY EVIDENCE YOU HAVE: canceled checks, bank statements, payment confirmations, etc.], which clearly demonstrate that the payments in question were made on time.

Under Section 623 of the FCRA, furnishers of information to consumer reporting agencies must provide accurate information, and Section 611 requires you to conduct a reasonable investigation into disputed information.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher
3. Remove the inaccurate late payment information from my credit report
4. Provide me with the results of your investigation

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed information highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]`;
};
