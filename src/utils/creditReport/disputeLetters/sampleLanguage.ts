
/**
 * Get sample dispute language for a specific dispute type
 * @param disputeType The type of dispute
 * @returns Sample dispute language
 */
export function getSampleDisputeLanguage(disputeType: string): string {
  const samples: Record<string, string> = {
    'late_payment': 'I dispute the late payment reported on this account. I have always made my payments on time and have documentation to prove it.',
    'collection_account': 'I dispute this collection account. This debt is [not mine/paid/settled/too old to report].',
    'inquiry': 'I dispute this inquiry. I did not authorize this inquiry and have no record of applying for credit with this company.',
    'account_ownership': 'I dispute this account. This account does not belong to me and may be the result of identity theft or a mixed file.',
    'incorrect_balance': 'I dispute the balance reported on this account. The correct balance is [CORRECT AMOUNT].',
    'incorrect_payment_history': 'I dispute the payment history reported on this account. My payment history has been [DESCRIBE CORRECT HISTORY].',
    'account_closed': 'I dispute the status of this account. This account was closed on [DATE] and should be reported as closed.',
    'default': 'I dispute this item on my credit report as it appears to be inaccurate or incomplete. This information must be verified or removed according to the Fair Credit Reporting Act.'
  };
  
  return samples[disputeType] || samples.default;
}

/**
 * Get multiple sample dispute languages
 * @returns Array of sample dispute languages
 */
export function getSampleDisputeLanguages(): string[] {
  return [
    getSampleDisputeLanguage('late_payment'),
    getSampleDisputeLanguage('collection_account'),
    getSampleDisputeLanguage('inquiry'),
    getSampleDisputeLanguage('account_ownership'),
    getSampleDisputeLanguage('incorrect_balance'),
    getSampleDisputeLanguage('incorrect_payment_history'),
    getSampleDisputeLanguage('account_closed')
  ];
}
