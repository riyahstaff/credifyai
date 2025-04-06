
/**
 * Sample dispute language for different types of credit report errors
 */

// Map of dispute types to sample language
const disputeLanguageSamples: Record<string, string[]> = {
  late_payment: [
    "The reported late payment is inaccurate as I have made all payments on time. I have enclosed proof of timely payments for your review.",
    "This account shows a late payment, but I have consistently paid on time. My bank records confirm this error.",
    "I dispute this late payment as I have never missed a payment deadline on this account."
  ],
  
  collection_account: [
    "This collection account is not valid. I either paid this debt in full or it does not belong to me.",
    "I dispute this collection account as it was paid in full on [DATE] and should be marked as 'Paid' or removed entirely.",
    "This collection account is not accurate. I have no record of this debt, and it may be the result of identity theft."
  ],
  
  account_not_mine: [
    "This account does not belong to me. I have never opened an account with this creditor.",
    "I have no knowledge of this account and did not authorize its creation. Please investigate potential identity theft.",
    "This account was fraudulently opened using my information without my knowledge or consent."
  ],
  
  incorrect_balance: [
    "The reported balance on this account is incorrect. My current balance is [ACTUAL BALANCE].",
    "This balance is outdated and does not reflect my recent payment of [PAYMENT AMOUNT] made on [DATE].",
    "The reported balance is inaccurate as it does not reflect the payoff I made on [DATE]."
  ],
  
  duplicate_account: [
    "This appears to be a duplicate listing of another account already appearing on my report.",
    "This account is reporting twice under different names, creating the appearance of more debt than actually exists.",
    "This account is a duplicate of the account listed as [OTHER ACCOUNT NAME] with the same account number."
  ],
  
  account_status_error: [
    "The status of this account is reported incorrectly. It should show as [CORRECT STATUS].",
    "This account is erroneously reported as open when it was closed on [DATE].",
    "The account status is inaccurate. This account was paid in full and closed on [DATE]."
  ],
  
  bankruptcy_error: [
    "This bankruptcy was discharged on [DATE] and should be reported as discharged, not as [CURRENT STATUS].",
    "This bankruptcy filing is inaccurately reported. The correct filing date was [DATE].",
    "This account was included in my bankruptcy discharge and should be reported as such, with a zero balance."
  ],
  
  unauthorized_inquiry: [
    "I did not authorize this inquiry and have no recollection of applying for credit with this company.",
    "This inquiry was made without my permission and should be removed from my credit report.",
    "I believe this inquiry was made fraudulently as I never applied for credit with this company."
  ],
  
  personal_information_error: [
    "My personal information is incorrect. My [FIELD] should be [CORRECT VALUE], not [REPORTED VALUE].",
    "The address listed as [INCORRECT ADDRESS] is not and has never been my address.",
    "My employment information is outdated. I now work for [CURRENT EMPLOYER] since [DATE]."
  ],
  
  general: [
    "The information reported about this account is not accurate and requires correction.",
    "I dispute this item as it contains errors that negatively impact my credit report.",
    "This entry contains inaccurate information that does not correctly represent my credit history."
  ]
};

/**
 * Gets sample dispute language for a specific dispute type
 * @param disputeType The type of dispute
 * @returns Array of sample dispute phrases
 */
export function getSampleDisputeLanguage(disputeType: string): string[] {
  const normalizedType = disputeType.toLowerCase().replace(/\s+/g, '_');
  
  // Return specific language if available, otherwise return general language
  return disputeLanguageSamples[normalizedType] || disputeLanguageSamples.general;
}

/**
 * Gets sample language that has been successful in disputes
 * @param disputeType The type of dispute
 * @returns Array of successful dispute phrases
 */
export function getSuccessfulDisputePhrases(disputeType: string): string[] {
  // In a real implementation, this might filter for only the most successful phrases
  // For now, just return all sample language
  return getSampleDisputeLanguage(disputeType);
}
