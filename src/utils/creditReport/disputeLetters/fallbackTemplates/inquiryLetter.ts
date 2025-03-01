
/**
 * Generate a fallback inquiry dispute letter when no samples are available
 */
export const generateFallbackInquiryDisputeLetter = (): string => {
  return `[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Unauthorized Inquiry

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 604 and Section 611, to dispute an unauthorized inquiry that appears on my credit report.

Upon reviewing my credit report, I discovered an inquiry from [COMPANY NAME] on [DATE OF INQUIRY]. I did not authorize this inquiry, nor do I have any business relationship with this company that would permit them to access my credit information.

The FCRA clearly states that consumer credit information may only be accessed with a permissible purpose, such as in response to a consumer-initiated transaction or application for credit. Since I did not initiate any transaction with this company, this inquiry violates the FCRA and must be removed from my credit report.

I request that you:
1. Remove this unauthorized inquiry from my credit report immediately
2. Provide me with the name, address, and telephone number of the entity that made this inquiry
3. Forward all relevant information about this dispute to the furnisher of this information
4. Notify me when the investigation is complete and provide me with a free updated copy of my credit report

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed inquiry highlighted
- Copy of identification documents`;
};
