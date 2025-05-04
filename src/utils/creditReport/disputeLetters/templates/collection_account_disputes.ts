
/**
 * Collection account dispute templates
 * Contains specific language and formatting for collection account disputes
 */

export const collectionAccountTemplates = {
  validation: `
I am writing to dispute a collection account on my credit report. Under the Fair Debt Collection Practices Act (FDCPA), I have the right to request validation of this debt. I have no record of owing this debt as it appears on my credit report, and the alleged creditor has failed to provide proper validation.

According to the FDCPA section 15 USC 1692g, all debt collectors must validate debts when disputed. Additionally, under the Fair Credit Reporting Act (FCRA) section 15 USC 1681i, if this information cannot be properly verified, it must be removed from my credit report.
  `,
  
  timeBarred: `
I am disputing this collection account as it appears to be time-barred by the statute of limitations in my state. This debt is too old to be legally collected or reported.

Under the Fair Credit Reporting Act section 15 USC 1681c, most negative information, including collections, should be removed from a credit report after 7 years. Additionally, under the Fair Debt Collection Practices Act, attempting to collect on a time-barred debt may violate sections 15 USC 1692e and 15 USC 1692f.
  `,
  
  duplicate: `
I am disputing this collection account because it appears to be a duplicate of another account already listed on my credit report. This double reporting unfairly impacts my credit score and creates confusion in my credit history.

Under the Fair Credit Reporting Act section 15 USC 1681e(b), credit reporting agencies must maintain reasonable procedures to ensure accuracy, which includes preventing duplicate reporting of the same account.
  `
};
