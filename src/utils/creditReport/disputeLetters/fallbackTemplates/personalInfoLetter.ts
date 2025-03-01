
/**
 * Generate a fallback personal information dispute letter when no samples are available
 */
export const generateFallbackPersonalInfoDisputeLetter = (): string => {
  return `[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Personal Information

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611, to dispute inaccurate personal information that appears on my credit report.

Upon reviewing my credit report, I discovered the following inaccurate personal information:
[DESCRIBE INACCURATE INFORMATION: incorrect name spelling, wrong address, etc.]

The correct information is:
[PROVIDE CORRECT INFORMATION]

This inaccuracy could lead to confusion regarding my identity and potentially affect my creditworthiness. Under Section 611 of the FCRA, you are required to conduct a reasonable investigation into disputed information and correct any inaccuracies.

I request that you:
1. Update my personal information with the correct details provided above
2. Remove any outdated or incorrect addresses or other personal information
3. Notify me when the investigation is complete
4. Provide me with a free updated copy of my credit report showing the corrections

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed information highlighted
- [LIST ANY SUPPORTING DOCUMENTATION, such as driver's license, utility bills, etc.]`;
};
