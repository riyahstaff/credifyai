
import { LegalReference } from '@/utils/creditReport/types';

/**
 * Mapping of issue types to template text
 */
export const issueTemplateMapping: Record<string, string> = {
  'late_payment': `
I am disputing the late payment reported on this account because it is inaccurate. I have always made my payments on time as evidenced by my bank statements and receipt records.

Under the Fair Credit Reporting Act (FCRA), specifically section 15 USC 1681e(b), you are required to follow "reasonable procedures to assure maximum possible accuracy" of the information in my credit report. The payment status being reported is incorrect and does not accurately reflect my payment history.
  `,
  
  'collection_account': `
I am disputing this collection account as it appears to be inaccurate or unverified. I have no record of owing this debt, and the alleged creditor has failed to provide proper validation as required by law.

Under the Fair Debt Collection Practices Act (FDCPA) section 15 USC 1692g and the Fair Credit Reporting Act (FCRA) section 15 USC 1681i, this debt must be properly verified or removed from my credit report.
  `,
  
  'inquiry': `
I am disputing this inquiry as I did not authorize access to my credit report by this company. Under the Fair Credit Reporting Act section 15 USC 1681b, access to a consumer's credit report is limited to those with a permissible purpose.

Please investigate this unauthorized inquiry and remove it from my credit report as it represents an unauthorized access to my personal financial information.
  `,
  
  'personal_info': `
I am disputing the personal information listed on my credit report as it contains inaccuracies. The correct information is provided in this letter.

Under the Fair Credit Reporting Act section 15 USC 1681i(a)(1)(A), you are required to "conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate" and record the correct information in my file.
  `,
  
  'identity_theft': `
I am disputing this account as it is the result of identity theft. I did not open this account and have filed a police report regarding this fraudulent activity (see attached documentation).

Under the Fair Credit Reporting Act section 15 USC 1681c-2, I am requesting that this fraudulent information be blocked from my credit report as it resulted from identity theft.
  `,
  
  'duplicate_account': `
I am disputing this account because it appears to be a duplicate of another account already listed on my credit report. This double reporting unfairly impacts my credit score and creates confusion in my credit history.

Under the Fair Credit Reporting Act section 15 USC 1681e(b), credit reporting agencies must maintain reasonable procedures to ensure accuracy, which includes preventing duplicate reporting of the same account.
  `,
  
  'bankruptcy_discharge': `
I am disputing this account as it has been discharged in bankruptcy but is not being reported as such. The bankruptcy discharge was on [DATE] under case number [CASE NUMBER].

Under the Fair Credit Reporting Act section 15 USC 1681c, once a debt has been discharged in bankruptcy, it must be reported accurately to reflect this legal status.
  `,
  
  'general': `
I am disputing information in my credit report that appears to be inaccurate. After reviewing my report, I have identified discrepancies that require investigation.

Under the Fair Credit Reporting Act section 15 USC 1681i, you are required to conduct a reasonable investigation into disputed information and verify its accuracy with the original sources. If the disputed information cannot be verified, it must be removed from my credit report.
  `
};

/**
 * Bureau address mapping
 */
export const bureauAddressMapping: Record<string, string> = {
  'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
  'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
  'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
};

/**
 * Legal references by issue type
 */
export const legalReferences: Record<string, LegalReference[]> = {
  'late_payment': [
    {
      law: 'FCRA',
      section: '15 USC 1681s-2(a)(3)',
      title: 'Duty to provide notice of dispute',
      text: 'If the completeness or accuracy of any information furnished by any person to any consumer reporting agency is disputed by the consumer, that person may not furnish the information to any consumer reporting agency without notice that such information is disputed by the consumer.'
    },
    {
      law: 'FCRA',
      section: '15 USC 1681e(b)',
      title: 'Accuracy of report',
      text: 'Whenever a consumer reporting agency prepares a consumer report it shall follow reasonable procedures to assure maximum possible accuracy of the information concerning the individual about whom the report relates.'
    }
  ],
  
  'collection_account': [
    {
      law: 'FDCPA',
      section: '15 USC 1692g',
      title: 'Validation of debts',
      text: 'Within five days after the initial communication with a consumer in connection with the collection of any debt, a debt collector shall, unless the following information is contained in the initial communication or the consumer has paid the debt, send the consumer a written notice containing the amount of the debt, the name of the creditor to whom the debt is owed, and statements regarding disputing the debt.'
    },
    {
      law: 'FCRA',
      section: '15 USC 1681i',
      title: 'Procedure in case of disputed accuracy',
      text: 'If the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate.'
    }
  ],
  
  'inquiry': [
    {
      law: 'FCRA',
      section: '15 USC 1681b',
      title: 'Permissible purposes of consumer reports',
      text: 'A consumer reporting agency may furnish a consumer report only under specific circumstances, such as in accordance with the written instructions of the consumer, for employment purposes, or in connection with a credit transaction.'
    }
  ],
  
  'general': [
    {
      law: 'FCRA',
      section: '15 USC 1681i(a)(1)(A)',
      title: 'Reinvestigation of disputed information',
      text: 'If the completeness or accuracy of any item of information contained in a consumer's file at a consumer reporting agency is disputed by the consumer and the consumer notifies the agency directly, or indirectly through a reseller, of such dispute, the agency shall, free of charge, conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate and record the current status of the disputed information, or delete the item from the file.'
    },
    {
      law: 'FCRA',
      section: '15 USC 1681e(b)',
      title: 'Accuracy of report',
      text: 'Whenever a consumer reporting agency prepares a consumer report it shall follow reasonable procedures to assure maximum possible accuracy of the information concerning the individual about whom the report relates.'
    }
  ]
};
