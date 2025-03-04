
/**
 * Fallback sample dispute letter templates
 * These are used when no sample letters are found in Supabase storage
 */

export const generateFallbackInquiryDisputeLetter = (): string => {
  return `[CURRENT_DATE]

[BUREAU]
[BUREAU_ADDRESS]

Re: Dispute of Unauthorized Inquiry on Credit Report

To Whom It May Concern:

I am writing to dispute an unauthorized inquiry that appears on my credit report. I recently obtained a copy of my credit report and noticed an inquiry from [ACCOUNT_NAME] on my report that I did not authorize.

Under the Fair Credit Reporting Act (FCRA) Section 604, a credit reporting agency may only furnish a consumer report under specific circumstances, including when there is written permission from the consumer. I did not provide authorization for this inquiry, and therefore request that it be removed from my credit report immediately.

DISPUTED ITEM(S):
- Account Name: [ACCOUNT_NAME]
- Date of Inquiry: [INQUIRY_DATE]
- Reason for Dispute: Unauthorized Inquiry

According to FCRA Section 611, upon receiving this dispute, you are required to conduct a reasonable investigation and to remove information found to be inaccurate or unverifiable. Since I did not authorize this inquiry, it should be removed from my credit report.

Please investigate this matter and remove this unauthorized inquiry from my credit report as soon as possible. Upon completion of your investigation, please send me an updated copy of my credit report showing that this item has been removed.

Thank you for your attention to this matter.

Sincerely,

[FULL_NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card`;
};

export const generateFallbackLatePaymentDisputeLetter = (): string => {
  return `[CURRENT_DATE]

[BUREAU]
[BUREAU_ADDRESS]

Re: Dispute of Inaccurate Late Payment Information

To Whom It May Concern:

I am writing to dispute inaccurate information regarding a late payment that appears on my credit report. Upon reviewing my credit report, I noticed that [ACCOUNT_NAME] has reported a late payment for [ACCOUNT_NUMBER] which is incorrect.

DISPUTED ITEM(S):
- Account Name: [ACCOUNT_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Reason for Dispute: Incorrect Late Payment Reporting

I have always made payments on this account on time. The reported late payment on [DATE] is inaccurate. I have enclosed copies of my payment receipts/bank statements showing that the payment was made on time.

Under the Fair Credit Reporting Act (FCRA) Section 623(a)(3), furnishers must investigate and correct any inaccurate payment information when notified of a dispute. The reported late payment information is inaccurate and damaging to my credit profile.

I request that you conduct a thorough investigation of this matter and remove the incorrect late payment notation from my credit report. Upon completion of your investigation, please send me a corrected copy of my credit report.

Thank you for your attention to this matter.

Sincerely,

[FULL_NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
- Payment Receipt/Bank Statement`;
};

export const generateFallbackPersonalInfoDisputeLetter = (): string => {
  return `[CURRENT_DATE]

[BUREAU]
[BUREAU_ADDRESS]

Re: Correction of Personal Information in Credit Report

To Whom It May Concern:

I am writing to request correction of personal information that appears on my credit report. Upon review, I found the following information to be incorrect:

DISPUTED ITEM(S):
- Incorrect Information: [ERROR_TYPE]
- Correct Information: [CORRECTION]
- Reason for Dispute: Personal Information Error

Under the Fair Credit Reporting Act (FCRA) Section 611, you are required to correct or delete inaccurate information in my file after conducting an investigation. The incorrect personal information noted above should be updated immediately to reflect the correct information.

Please update my personal information as indicated and send me a corrected copy of my credit report showing these changes.

Thank you for your attention to this matter.

Sincerely,

[FULL_NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
- Proof of Correct Information`;
};

export const generateFallbackCollectionDisputeLetter = (): string => {
  return `[CURRENT_DATE]

[BUREAU]
[BUREAU_ADDRESS]

Re: Dispute of Collection Account

To Whom It May Concern:

I am writing to dispute a collection account that appears on my credit report. Upon reviewing my credit report, I found a collection account from [ACCOUNT_NAME] that [ERROR_DESCRIPTION].

DISPUTED ITEM(S):
- Collection Agency: [ACCOUNT_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Reason for Dispute: [ERROR_TYPE]

Under the Fair Debt Collection Practices Act (FDCPA) Section 809(b) and the Fair Credit Reporting Act (FCRA) Section 623, collection agencies must verify debts upon dispute and ensure accurate reporting. This collection account appears to be [ERROR_DESCRIPTION].

I request that you conduct a thorough investigation of this matter and remove this collection account from my credit report if it cannot be properly verified. Upon completion of your investigation, please send me a corrected copy of my credit report.

Thank you for your attention to this matter.

Sincerely,

[FULL_NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card`;
};

export const generateFallbackBankruptcyDisputeLetter = (): string => {
  return `[CURRENT_DATE]

[BUREAU]
[BUREAU_ADDRESS]

Re: Dispute of Bankruptcy Information

To Whom It May Concern:

I am writing to dispute bankruptcy information that appears on my credit report. Upon reviewing my credit report, I found that [ERROR_DESCRIPTION].

DISPUTED ITEM(S):
- Type of Bankruptcy: [BANKRUPTCY_TYPE]
- Filing Date: [FILING_DATE]
- Reason for Dispute: [ERROR_TYPE]

According to the Fair Credit Reporting Act (FCRA) Section 605, bankruptcy information should be reported accurately and can only be reported for a specific time period. Additionally, under FCRA Section 611, you are required to investigate disputed information and correct any inaccuracies.

The bankruptcy information on my credit report is [ERROR_DESCRIPTION]. Please investigate this matter and correct or remove the inaccurate bankruptcy information from my credit report.

Thank you for your attention to this matter.

Sincerely,

[FULL_NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
- Court Documents (if applicable)`;
};

export const generateFallbackIncorrectBalanceDisputeLetter = (): string => {
  return `[CURRENT_DATE]

[BUREAU]
[BUREAU_ADDRESS]

Re: Dispute of Incorrect Balance Information

To Whom It May Concern:

I am writing to dispute an incorrect balance that appears on my credit report. Upon reviewing my credit report, I noticed that [ACCOUNT_NAME] has reported an incorrect balance for account [ACCOUNT_NUMBER].

DISPUTED ITEM(S):
- Account Name: [ACCOUNT_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Reported Balance: [REPORTED_BALANCE]
- Correct Balance: [CORRECT_BALANCE]
- Reason for Dispute: Incorrect Balance

Per FCRA Section 623(a)(2), credit reporting agencies and furnishers must ensure the completeness and accuracy of reported account balances. The current balance report appears to violate these provisions. My records indicate a different balance, and this discrepancy must be investigated.

I have attached documentation showing the correct balance on this account. Please investigate this matter and update the balance information on my credit report to reflect the correct amount.

Thank you for your attention to this matter.

Sincerely,

[FULL_NAME]

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
- Account Statement Showing Correct Balance`;
};
