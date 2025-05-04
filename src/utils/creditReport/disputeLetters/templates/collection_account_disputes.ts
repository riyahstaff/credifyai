
/**
 * Collection Account Dispute Templates
 * Specialized templates for different collection account scenarios
 */

/**
 * Collection account dispute templates
 */
export const collectionAccountTemplates: Record<string, string> = {
  // Default collection account dispute
  'default': `
To Whom It May Concern:

I am writing to dispute a collection account that appears on my credit report. After reviewing my report, I noticed an account from [COLLECTION_AGENCY] that I believe contains inaccurate information.

Account details being disputed:
- Creditor Name: {{ACCOUNT_NAME}}
- Account Number: {{ACCOUNT_NUMBER}}
- Reported Balance: [BALANCE]

This collection account is disputed for the following reasons:
1. I have no record of owing this debt
2. The collection agency has not provided proper validation of this debt as required by law
3. The information reported is inaccurate

Under the Fair Debt Collection Practices Act (FDCPA) section 15 USC 1692g and the Fair Credit Reporting Act (FCRA) section 15 USC 1681i, this debt must be properly verified or removed from my credit report.

Please investigate this matter and remove this disputed item from my credit report. If you verify this account, please provide me with copies of any documents submitted by the creditor to support their claim.

Sincerely,
{{USER_NAME}}
`,

  // Debt validation dispute
  'debt_validation': `
To Whom It May Concern:

I am writing to dispute a collection account that appears on my credit report from {{ACCOUNT_NAME}} (Account #: {{ACCOUNT_NUMBER}}). I am exercising my right to dispute this debt under the Fair Debt Collection Practices Act and the Fair Credit Reporting Act.

I have no record of this debt and have not received proper validation notices as required by law. Under section 15 USC 1692g of the FDCPA, a debt collector must validate a debt when disputed by the consumer.

Please provide the following information to validate this debt:
1. Proof that you own the debt or are authorized to collect it
2. The complete chain of custody showing all owners of this debt from the original creditor
3. A copy of the original signed agreement that created this debt
4. An accounting showing how the current balance was calculated, including all fees, interest, payments, and credits

Until this debt is properly validated, I request that you:
1. Cease reporting this account to the credit bureaus
2. Note this account as disputed in all future credit reporting
3. Provide documentation of your investigation to me at the address below

Sincerely,
{{USER_NAME}}
`,

  // Paid collection dispute
  'paid_collection': `
To Whom It May Concern:

I am writing to dispute a collection account from {{ACCOUNT_NAME}} (Account #: {{ACCOUNT_NUMBER}}) that is showing on my credit report with an incorrect status. This account has been paid in full, but continues to be reported as unpaid or outstanding.

I made payment in full on [DATE] via [PAYMENT METHOD]. Please find attached proof of payment documentation.

Under the Fair Credit Reporting Act section 15 USC 1681i, you are required to conduct a reasonable investigation and correct inaccurate information. The current reporting of this account is misleading and damaging to my credit profile.

Please update this account to reflect "Paid in Full" status and update the balance to $0. If you cannot verify this information with the collection agency, please remove this entry from my credit report entirely.

Sincerely,
{{USER_NAME}}
`,

  // Statute of limitations expired
  'time_barred': `
To Whom It May Concern:

I am writing to dispute a collection account from {{ACCOUNT_NAME}} (Account #: {{ACCOUNT_NUMBER}}) that appears on my credit report. This debt is time-barred and beyond the statute of limitations for collection in my state.

The original account was allegedly opened on [ORIGINAL DATE], making this debt approximately [X] years old. In my state of residence, the statute of limitations for this type of debt is [Y] years, which has clearly expired.

Under the Fair Credit Reporting Act and relevant case law, reporting time-barred debt without noting its legal status may constitute an unfair collection practice. Additionally, most negative information should only remain on credit reports for seven years.

Please remove this outdated item from my credit report as it no longer represents current and accurate information about my creditworthiness.

Sincerely,
{{USER_NAME}}
`
};

// Export additional specialized templates
export const collectionAgencyDisputeTemplate = `
To Whom It May Concern:

I am writing to dispute a collection account from {{ACCOUNT_NAME}} (Account #: {{ACCOUNT_NUMBER}}) that appears on my credit report. I have reason to believe this collection agency is not properly licensed to collect debts in my state of residence.

Under various state laws and the Fair Debt Collection Practices Act, collection agencies must be properly licensed to legally collect debts. I request verification that {{ACCOUNT_NAME}} is properly licensed as a debt collector in [STATE].

Furthermore, I have not received proper validation of this debt as required by section 15 USC 1692g of the FDCPA, which requires debt collectors to validate debts upon consumer dispute.

Please investigate this matter and remove this collection account from my credit report if proper licensing and debt validation cannot be verified.

Sincerely,
{{USER_NAME}}
`;

// Export a comprehensive collection dispute template
export const comprehensiveCollectionDisputeTemplate = `
To Whom It May Concern:

I am writing to formally dispute the collection account from {{ACCOUNT_NAME}} (Account #: {{ACCOUNT_NUMBER}}) that appears on my credit report. After careful review, I believe this information to be inaccurate, incomplete, or unverifiable for multiple reasons.

DISPUTED INFORMATION:
Creditor Name: {{ACCOUNT_NAME}}
Account Number: {{ACCOUNT_NUMBER}}
Reported Balance: [BALANCE]
Date Reported: [DATE]

REASONS FOR DISPUTE (one or more of the following apply):
- I have no record or recollection of this debt
- The amount reported is incorrect
- The account status is reported incorrectly
- The account information is incomplete
- This may be the result of identity theft or mixed files
- I have not received proper validation of this debt
- The debt is beyond the statute of limitations
- The debt was included in a bankruptcy discharge
- The debt was previously paid or settled

LEGAL BASIS FOR DISPUTE:
Under the Fair Credit Reporting Act (FCRA), specifically:
- Section 15 USC 1681e(b): Requires "reasonable procedures to assure maximum possible accuracy"
- Section 15 USC 1681i: Requires a reasonable investigation of disputed information

Under the Fair Debt Collection Practices Act (FDCPA), specifically:
- Section 15 USC 1692e: Prohibits false or misleading representations
- Section 15 USC 1692g: Requires validation of disputed debts

I request that you conduct a thorough investigation of this matter, including contacting the original creditor for verification. If you cannot verify this account or if the information is inaccurate, it must be removed from my credit report per the FCRA.

Please provide me with the results of your investigation and a free copy of my credit report if changes are made.

Sincerely,
{{USER_NAME}}
`;
