
import { 
  getSampleDisputeLanguage 
} from '@/utils/creditReport/disputeLetters';

/**
 * Get sample dispute language for a specific dispute type
 * @param disputeType The type of dispute
 * @param accountName Optional account name for personalized samples
 */
export function getSampleDisputeText(disputeType: string, accountName?: string): string {
  return getSampleDisputeLanguage(disputeType);
}

/**
 * Get a sample dispute letter template for a specific issue
 * @param issueType The type of issue
 */
export function getSampleDisputeLetterText(issueType: string): string {
  const samples: Record<string, string> = {
    'late_payment': 'I am disputing the late payment reported by [CREDITOR] on [DATE]. I have always made my payments on time and have documentation to prove it.',
    'collection_account': 'I am disputing the collection account reported by [COLLECTION AGENCY]. This debt is [not mine/paid/settled/too old to report].',
    'inquiry': 'I am disputing the inquiry made by [COMPANY] on [DATE]. I did not authorize this inquiry and have no record of applying for credit with this company.',
    'account_ownership': 'I am disputing the account with [CREDITOR]. This account does not belong to me and may be the result of identity theft or a mixed file.',
    'default': 'I am writing to dispute information that appears on my credit report. The item(s) I am disputing appear to be inaccurate and I request that they be investigated and corrected according to the Fair Credit Reporting Act.'
  };
  
  return samples[issueType] || samples.default;
}
