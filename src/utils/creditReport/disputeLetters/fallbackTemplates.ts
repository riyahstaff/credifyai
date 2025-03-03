
/**
 * Fallback dispute letter templates
 * These are used when no sample letters are found in storage
 */

// Inquiry dispute letter template
export const generateFallbackInquiryDisputeLetter = (): string => {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

[BUREAU]
[BUREAU ADDRESS]

Re: Unauthorized Inquiry Dispute - Consumer Statement and Request for Investigation

To Whom It May Concern:

I am writing to dispute an unauthorized inquiry that appears on my credit report. Under the Fair Credit Reporting Act (FCRA), specifically Section 604(a), inquiries can only be made with a permissible purpose, which requires my explicit authorization in many cases.

After reviewing my credit report, I have identified the following unauthorized inquiry:
- Creditor Name: [CREDITOR NAME]
- Date of Inquiry: [INQUIRY DATE]

I did not authorize this inquiry and have no record of applying for credit or services with this company. This unauthorized inquiry is damaging my credit score and may indicate attempted identity theft.

Under FCRA Section 611, I request that you conduct a thorough investigation of this inquiry and remove it from my credit report if the creditor cannot provide evidence of my authorization. Additionally, per FCRA Section 605(a)(3)(A), this inquiry should be removed if it cannot be verified as legitimate within 30 days.

Please investigate this matter and remove the unauthorized inquiry from my credit report. I also request that you provide me with:
1. The name, address, and telephone number of the company that made this inquiry
2. Documentation showing my authorization for this inquiry
3. The specific purpose for which the inquiry was made
4. Written confirmation when this inquiry has been removed

If you find that this inquiry was indeed authorized, please provide me with complete documentation showing when and how I provided this authorization.

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed inquiry highlighted
- [ANY ADDITIONAL DOCUMENTATION]
`;
};

// Late payment dispute letter template
export const generateFallbackLatePaymentDisputeLetter = (): string => {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

[BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Late Payment Reporting

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate late payment information appearing on my credit report.

After reviewing my credit report from [BUREAU], I have identified the following inaccurate late payment entry:

Account Name: [ACCOUNT NAME]
Account Number: [ACCOUNT NUMBER]
Reported Late Payment Date(s): [LATE PAYMENT DATE(S)]

This late payment information is inaccurate because:
[CHOOSE ONE OR MORE OF THE FOLLOWING REASONS]
- This payment was made on time, and I have documentation proving timely payment
- I never received a bill or statement for this payment
- The account was set up for automatic payments that the creditor failed to process
- This account was included in a bankruptcy that discharged my liability
- This account was paid as agreed under a payment plan or settlement
- This late payment is older than 7 years and should be removed per FCRA Section 605(c)
- The late payment report resulted from identity theft or fraud

I have attached the following documentation to support my dispute: [LIST DOCUMENTATION]

As required by FCRA Section 611(a), you must conduct a reasonable investigation into this matter and correct or delete information that cannot be verified. Additionally, FCRA Section 623(b) requires furnishers of information to investigate and correct inaccurate information when notified of a dispute.

Under the FCRA, you must:
1. Forward all relevant information regarding my dispute to the furnisher of this information
2. Complete your investigation within 30 days (or 45 days if I provide additional information during the 30-day period)
3. Provide me with written results of your investigation
4. Delete or correct any information that cannot be verified as accurate

If you continue to report this inaccurate information, I may have cause to pursue this matter further under the provisions for civil liability as outlined in FCRA Section 616.

Please direct all correspondence regarding this matter to the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed late payment highlighted
- [LIST OF ADDITIONAL DOCUMENTATION]
`;
};

// Personal information dispute letter template
export const generateFallbackPersonalInfoDisputeLetter = (): string => {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

[BUREAU]
[BUREAU ADDRESS]

Re: Correction of Personal Information in Credit Report

To Whom It May Concern:

I am writing to request the correction of inaccurate personal information that appears in my credit report. Under the Fair Credit Reporting Act (FCRA), specifically Section 611(a), I have the right to dispute incomplete or inaccurate information in my file.

After reviewing my credit report from [BUREAU], I have found the following personal information to be inaccurate:

[SELECT APPLICABLE ITEMS]
- Incorrect name: [INCORRECT NAME] should be [CORRECT NAME]
- Incorrect address: [INCORRECT ADDRESS] should be [CORRECT ADDRESS]
- Incorrect previous address(es): [INCORRECT PREVIOUS ADDRESS] should be [CORRECT PREVIOUS ADDRESS]
- Incorrect employment information: [INCORRECT EMPLOYER] should be [CORRECT EMPLOYER]
- Incorrect Social Security Number: [INCORRECT SSN DIGITS] should be [CORRECT SSN DIGITS]
- Incorrect date of birth: [INCORRECT DOB] should be [CORRECT DOB]
- Incorrect phone number: [INCORRECT PHONE] should be [CORRECT PHONE]

I have attached documentation to verify the correct information, including: [LIST DOCUMENTATION]

Under FCRA Section 611, you are required to investigate this dispute and correct any inaccurate information. Accurate personal information is essential for proper credit reporting and preventing identity confusion that could negatively impact my creditworthiness.

Please update my credit report to reflect the correct personal information listed above. Additionally, please provide me with:
1. Written confirmation that the information has been corrected
2. A copy of my updated credit report showing the corrections
3. Notification of any steps you have taken to ensure this information is properly updated with all creditors who may have received incorrect information

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional verification documents, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with incorrect personal information highlighted
- [LIST OF SUPPORTING DOCUMENTATION]
`;
};

// Collection account dispute letter template
export const generateFallbackCollectionDisputeLetter = (): string => {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

[BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Collection Account

To Whom It May Concern:

I am writing to dispute a collection account that appears on my credit report. Under the Fair Credit Reporting Act (FCRA), specifically Section 611, I have the right to dispute any incomplete or inaccurate information in my credit file.

The collection account I am disputing is as follows:

Collection Agency Name: [COLLECTION AGENCY NAME]
Original Creditor: [ORIGINAL CREDITOR]
Account Number: [ACCOUNT NUMBER]
Amount: [AMOUNT]
Date Reported: [DATE REPORTED]

I dispute this collection account for the following reason(s):
[SELECT APPLICABLE REASONS]
- This debt is not mine / I have no record of this debt
- This debt has been paid in full on [DATE]
- This debt was settled for less than the full amount on [DATE]
- This collection is reporting an incorrect balance
- This collection has been included in bankruptcy
- This collection is past the statute of limitations for reporting (over 7 years old)
- The collection agency cannot verify this debt as required by the FDCPA
- The debt was the result of identity theft
- This is a duplicate of another collection already reporting

Under FCRA Section 623(a)(8) and FDCPA Section 809(b), collection agencies must verify debts and provide complete validation upon request. I have not received proper validation of this debt despite my requests (if applicable).

Per FCRA Section 611(a), I request that you:
1. Conduct a thorough investigation of this collection account
2. Contact the collection agency to provide verification of this debt
3. Remove this collection from my credit report if it cannot be fully verified
4. Provide me with copies of any documentation used to verify this debt
5. Send me the results of your investigation

If this collection agency cannot provide complete verification of this debt as required by law, this item must be removed from my credit report immediately.

Please complete your investigation within the 30-day timeframe (or 45 days if I provide additional information) as required by the FCRA. If you have any questions, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed collection highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
`;
};

// Bankruptcy dispute letter template
export const generateFallbackBankruptcyDisputeLetter = (): string => {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

[BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Bankruptcy Information

To Whom It May Concern:

I am writing to dispute inaccurate bankruptcy information that appears on my credit report. Under the Fair Credit Reporting Act (FCRA), specifically Section 611(a), I have the right to dispute any incomplete or inaccurate information in my file.

After reviewing my credit report from [BUREAU], I have identified the following inaccurate bankruptcy information:

Bankruptcy Type: [CHAPTER 7/CHAPTER 13/OTHER]
Case Number: [CASE NUMBER]
Filing Date: [FILING DATE]
Discharge/Dismissal Date: [DISCHARGE/DISMISSAL DATE]

This bankruptcy information is inaccurate because:
[SELECT APPLICABLE REASONS]
- I have never filed for bankruptcy
- The bankruptcy has been dismissed, not discharged
- The bankruptcy discharge date is incorrect
- The bankruptcy chapter type is incorrect
- The bankruptcy is being reported beyond the legal reporting period (10 years for Chapter 7, 7 years for completed Chapter 13)
- Individual accounts included in the bankruptcy are not correctly reporting as discharged
- Accounts that were reaffirmed during bankruptcy are incorrectly showing as included in bankruptcy

I have attached documentation from the bankruptcy court to support my dispute, including: [LIST DOCUMENTATION]

Under FCRA Section 605(a)(1), a Chapter 7 bankruptcy can be reported for no more than 10 years from the date of filing, and a Chapter 13 bankruptcy that has been completed can be reported for no more than 7 years. Additionally, Section 611 requires you to conduct a reasonable investigation into disputed information.

I request that you:
1. Investigate this dispute and verify the accuracy of the bankruptcy information with the appropriate bankruptcy court
2. Correct any inaccurate information regarding the bankruptcy
3. Ensure all accounts included in the bankruptcy are properly reporting as such
4. Remove the bankruptcy information entirely if it cannot be verified or if it is beyond the legal reporting period
5. Provide me with the results of your investigation and a corrected copy of my credit report

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional verification documents, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed bankruptcy information highlighted
- [LIST OF SUPPORTING DOCUMENTATION]
`;
};

// Incorrect balance dispute letter template
export const generateFallbackIncorrectBalanceDisputeLetter = (): string => {
  return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

[BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Incorrect Account Balance

To Whom It May Concern:

I am writing to dispute an incorrect balance that appears on my credit report. Under the Fair Credit Reporting Act (FCRA), specifically Section 611(a), I have the right to dispute incomplete or inaccurate information in my credit file.

After reviewing my credit report from [BUREAU], I have identified the following account with an incorrect balance:

Account Name: [CREDITOR NAME]
Account Number: [ACCOUNT NUMBER]
Reported Balance: [REPORTED BALANCE]
Correct Balance: [CORRECT BALANCE]

This balance information is inaccurate because:
[SELECT APPLICABLE REASONS]
- The account has been paid in full on [DATE]
- The balance has been reduced through payments not yet reflected
- The balance includes unauthorized or disputed charges
- The balance reflects fees or interest that should not apply
- The account was settled for less than the full amount on [DATE]
- The account was included in bankruptcy and the debt was discharged
- The balance shown is from an old statement and does not reflect current status
- The account has been closed with a zero balance

I have attached the following documentation to verify the correct balance: [LIST DOCUMENTATION]

As required by FCRA Section 611, you must conduct a reasonable investigation into this matter and correct any inaccurate information. Additionally, FCRA Section 623(a)(2) requires creditors to provide accurate information to credit reporting agencies and correct any inaccuracies.

I request that you:
1. Contact the creditor to verify the correct current balance
2. Update my credit report to reflect the accurate balance
3. Provide me with the results of your investigation
4. Send me a corrected copy of my credit report showing the updated information

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed balance highlighted
- [LIST OF SUPPORTING DOCUMENTATION]
`;
};
