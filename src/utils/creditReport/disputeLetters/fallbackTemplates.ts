
/**
 * Fallback templates for dispute letters
 * These are used when no sample dispute letter is available
 */

/**
 * Generate a fallback inquiry dispute letter
 */
export const generateFallbackInquiryDisputeLetter = (): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE] [ZIP]

${currentDate}

Experian
P.O. Box 4500
Allen, TX 75013

Re: Dispute of Unauthorized Credit Inquiry

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), to dispute an unauthorized inquiry appearing on my credit report.

After reviewing my credit report, I have identified an inquiry that I did not authorize. The details are as follows:

Company Name: [COMPANY NAME]
Date of Inquiry: [DATE OF INQUIRY]

I have not applied for credit with this company, nor have I given them permission to access my credit report. This inquiry violates my rights under the FCRA Section 604, which states that credit reports can only be obtained with a permissible purpose and proper authorization.

As required by the FCRA Section 611, I request that you conduct a thorough investigation of this unauthorized inquiry and remove it from my credit report. An inquiry made without proper authorization is a violation of federal law and damages my credit profile.

Please complete your investigation within 30 days as required by the FCRA and provide me with written confirmation of the removal of this unauthorized inquiry.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of my credit report with unauthorized inquiry highlighted
- Copy of my identification
`;
};

/**
 * Generate a fallback late payment dispute letter
 */
export const generateFallbackLatePaymentDisputeLetter = (): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE] [ZIP]

${currentDate}

Equifax Information Services LLC
P.O. Box 740256
Atlanta, GA 30374

Re: Dispute of Inaccurate Late Payment Information

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), to dispute inaccurate late payment information appearing on my credit report.

After reviewing my credit report, I have identified the following late payment that is being reported inaccurately:

Account Name: [ACCOUNT NAME]
Account Number: [ACCOUNT NUMBER]
Reported Late Payment Date(s): [DATE(S)]

This information is inaccurate because I have made all payments on time for this account. I have maintained records of my payments, including [MENTION ANY EVIDENCE LIKE BANK STATEMENTS, CANCELED CHECKS, RECEIPTS, ETC.], which clearly show that the payment(s) in question were made before the due date.

Under FCRA Section 623(a)(1), furnishers of information to credit reporting agencies must provide accurate information. Additionally, Section 611 of the FCRA requires you to conduct a reasonable investigation into this matter and correct any inaccurate information.

I request that you:
1. Investigate this disputed late payment(s)
2. Remove the inaccurate late payment information from my credit report
3. Send me an updated copy of my credit report showing the correction

Please complete your investigation within the 30-day timeframe required by the FCRA. If you have any questions or need additional documentation, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with inaccurate information highlighted
- [LIST ANY SUPPORTING PAYMENT EVIDENCE]
`;
};

/**
 * Generate a fallback personal information dispute letter
 */
export const generateFallbackPersonalInfoDisputeLetter = (): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE] [ZIP]

${currentDate}

TransUnion Consumer Solutions
P.O. Box 2000
Chester, PA 19016

Re: Correction of Personal Information in Credit Report

To Whom It May Concern:

I am writing to request correction of inaccurate personal information appearing in my credit report, in accordance with my rights under the Fair Credit Reporting Act (FCRA).

After reviewing my credit report, I have identified the following inaccurate personal information:

[DESCRIBE INCORRECT INFORMATION, SUCH AS:
- Incorrect name spelling
- Wrong address
- Inaccurate employment information
- Incorrect date of birth
- Other personal information errors]

The correct information is as follows:
[PROVIDE CORRECT INFORMATION]

This inaccurate information can lead to potential identity confusion and could negatively impact my credit profile. Under Section 611 of the FCRA, you are required to conduct a reasonable investigation into this matter and correct any inaccurate information.

I am enclosing copies of documentation that verify the correct personal information, including [LIST DOCUMENTS SUCH AS DRIVER'S LICENSE, UTILITY BILL, PAY STUB, ETC.].

Please update my credit report to reflect the correct personal information and send me a revised copy of my credit report showing these corrections. I request that you complete this investigation within the 30-day timeframe required by the FCRA.

If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with incorrect information highlighted
- [LIST VERIFICATION DOCUMENTS]
`;
};

/**
 * Generate a fallback account not mine dispute letter
 */
export const generateFallbackNotMyAccountDisputeLetter = (): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE] [ZIP]

${currentDate}

Experian
P.O. Box 4500
Allen, TX 75013

Re: Dispute of Account Not Belonging to Me

To Whom It May Concern:

I am writing to dispute an account appearing on my credit report that does not belong to me, as provided by my rights under the Fair Credit Reporting Act (FCRA).

The following account appears on my credit report but is not mine:

Account Name: [CREDITOR NAME]
Account Number: [ACCOUNT NUMBER]
Reported Open Date: [OPEN DATE]

I have never opened an account with this creditor, authorized anyone to open an account on my behalf, or been an authorized user on this account. This account should not appear on my credit report and is severely impacting my credit score.

This may be the result of one of the following:
- A mixed file where another consumer's information has been incorrectly merged with mine
- Identity theft
- A clerical error by the creditor or credit reporting agency

Under Section 611(a) of the FCRA, you are required to conduct a reasonable investigation into this matter. If this account cannot be properly verified as belonging to me, it must be removed from my credit report.

I request that you:
1. Investigate this disputed account
2. Remove this account from my credit report as it does not belong to me
3. Send me an updated copy of my credit report showing the removal

I am enclosing a copy of my identification to verify my identity. If you require any additional information to complete your investigation, please contact me at the address listed above.

Please complete your investigation within the 30-day timeframe required by the FCRA.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with disputed account highlighted
- Copy of identification (driver's license/passport)
- [ANY ADDITIONAL SUPPORTING DOCUMENTATION]
`;
};

/**
 * Generate a fallback balance dispute letter
 */
export const generateFallbackBalanceDisputeLetter = (): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY], [STATE] [ZIP]

${currentDate}

Equifax Information Services LLC
P.O. Box 740256
Atlanta, GA 30374

Re: Dispute of Inaccurate Account Balance

To Whom It May Concern:

I am writing to dispute inaccurate balance information appearing on my credit report, in accordance with my rights under the Fair Credit Reporting Act (FCRA).

After reviewing my credit report, I have identified the following account with an incorrect balance:

Account Name: [CREDITOR NAME]
Account Number: [ACCOUNT NUMBER]
Reported Balance: [INCORRECT BALANCE]
Correct Balance: [CORRECT BALANCE]

This information is inaccurate because [EXPLAIN REASON, SUCH AS RECENT PAYMENTS NOT REFLECTED, ACCOUNT PAID OFF, BALANCE CALCULATION ERROR, ETC.]. I have documentation from the creditor showing the correct balance.

Under FCRA Section 623(a)(2), furnishers of information to credit reporting agencies must provide accurate information regarding account balances. Additionally, Section 611 requires you to conduct a reasonable investigation into this dispute.

I am enclosing copies of [MENTION DOCUMENTATION, SUCH AS RECENT STATEMENTS, PAYMENT CONFIRMATIONS, ZERO BALANCE LETTER, ETC.] that verify the correct balance on this account.

I request that you:
1. Investigate this disputed balance
2. Update my credit report to reflect the correct balance
3. Send me an updated copy of my credit report showing the correction

Please complete your investigation within the 30-day timeframe required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with inaccurate information highlighted
- [LIST DOCUMENTATION SHOWING CORRECT BALANCE]
`;
};
