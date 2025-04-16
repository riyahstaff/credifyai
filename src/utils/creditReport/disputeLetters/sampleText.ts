/**
 * Sample dispute letter language for reference
 */

export function getSampleDisputeLanguage(disputeType?: string): string {
  const samples: Record<string, string> = {
    general: "This information appears to be inaccurate based on my records. Please verify this account and remove if it cannot be properly validated.",
    late_payment: "The late payment reported on this account is inaccurate. My payment history shows all payments were made on time for this account.",
    collection_account: "This collection account appears to be inaccurate. I have no record of owing this debt, and the collector has failed to provide proper validation.",
    inquiry: "I did not authorize this inquiry on my credit report. This inquiry was made without my consent and should be removed.",
    account_ownership: "This account does not belong to me and I have never opened an account with this creditor. Please remove this account from my report.",
    identity_theft: "I believe this account was opened fraudulently as part of identity theft. I have no knowledge of opening this account.",
    incorrect_balance: "The balance reported on this account is incorrect. The current balance should be significantly lower than what is reported.",
    account_status: "The status of this account is being reported incorrectly. This account should be reported as 'Closed' rather than 'Open'.",
    payment_history: "My payment history is being reported incorrectly. I have never missed a payment on this account."
  };

  // If a specific type is requested, return that sample
  if (disputeType && samples[disputeType.toLowerCase()]) {
    return samples[disputeType.toLowerCase()];
  }
  
  // Otherwise return the general sample
  return samples.general;
}
