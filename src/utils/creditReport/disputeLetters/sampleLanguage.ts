
/**
 * Sample dispute language generator
 * This module provides sample language for different types of disputes
 */

// Sample dispute language for common dispute types
const disputeLanguageSamples = {
  balance: [
    "The balance reported for this account is incorrect. My records indicate a significantly different balance amount than what is being reported.",
    "I dispute the balance shown on this account as it does not accurately reflect my payment history and current status.",
    "The balance shown on my credit report for this account is inaccurate. I have documentation showing a different balance."
  ],
  latepayment: [
    "I have never missed a payment on this account and have documentation to prove all payments were made on time.",
    "The late payment notation on this account is incorrect. I have always paid this account as agreed and on time.",
    "I dispute the late payment record as I have documentation showing my payment was received before the due date."
  ],
  notmine: [
    "This account does not belong to me. I have never opened an account with this creditor and request full verification of this account.",
    "I am a victim of identity theft and this account was fraudulently opened in my name. I have filed a police report regarding this matter.",
    "I have no knowledge of this account and dispute its validity. Per the FCRA, I request complete verification of this debt."
  ],
  negativeremark: [
    "I dispute the negative remarks associated with this account as they are inaccurate and do not reflect my actual payment history.",
    "The negative remark on this account is incorrect. I request validation of this information as required by the FCRA.",
    "This negative remark does not accurately represent the circumstances surrounding this account and should be removed."
  ],
  accountstatus: [
    "The current status of this account is being reported incorrectly. The account should be reported as [correct status].",
    "I dispute the status of this account as it does not accurately reflect its current standing. The account is actually [correct status].",
    "The account status being reported is inaccurate and harmful to my credit profile. The correct status should be [correct status]."
  ],
  accountinformation: [
    "The account information being reported contains multiple inaccuracies including [specific details]. I request complete verification.",
    "There are discrepancies in how this account is being reported across different credit bureaus which indicates reporting errors.",
    "Key information about this account is being reported incorrectly, including [specific details] which should be corrected."
  ]
};

/**
 * Get sample dispute language for a specific account and error type
 */
export const getSampleDisputeLanguage = async (
  accountName: string,
  errorType: string,
  bureau: string
): Promise<string> => {
  // Normalize the error type to match our sample language keys
  const lowerErrorType = errorType.toLowerCase();
  
  // Match to the appropriate category
  let category = 'accountinformation'; // Default fallback category
  
  if (lowerErrorType.includes('balance')) {
    category = 'balance';
  } else if (lowerErrorType.includes('late') || lowerErrorType.includes('payment')) {
    category = 'latepayment';
  } else if (lowerErrorType.includes('not') && lowerErrorType.includes('mine') || 
             lowerErrorType.includes('fraud') || lowerErrorType.includes('identity')) {
    category = 'notmine';
  } else if (lowerErrorType.includes('remark') || lowerErrorType.includes('negative')) {
    category = 'negativeremark';
  } else if (lowerErrorType.includes('status') || lowerErrorType.includes('open') || 
             lowerErrorType.includes('closed')) {
    category = 'accountstatus';
  }
  
  // Get the sample language for this category
  const samples = disputeLanguageSamples[category as keyof typeof disputeLanguageSamples] || disputeLanguageSamples.accountinformation;
  
  // Get a random sample from the category
  const randomIndex = Math.floor(Math.random() * samples.length);
  const sampleLanguage = samples[randomIndex];
  
  // Customize it with account name and bureau
  const customizedLanguage = `Regarding my ${accountName} account reported by ${bureau}: ${sampleLanguage}`;
  
  return customizedLanguage;
};

/**
 * Get successful dispute phrases for different dispute types
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  // These would ideally come from a database of successful disputes
  return {
    balanceDisputes: [
      "I have reviewed my records and found that the balance reported is incorrect. My records indicate the correct balance is $X as of [date].",
      "The balance shown is from a previously resolved account and should be updated to reflect the current zero balance."
    ],
    latePaymentDisputes: [
      "I have always made payments on time for this account, and I have enclosed copies of my bank statements as evidence.",
      "The reported late payment occurred during a period when I had arranged a payment deferral with the creditor as documented in the attached correspondence."
    ],
    accountOwnershipDisputes: [
      "I have never applied for or opened an account with this creditor. I request full verification including my original application and signature.",
      "This account was fraudulently opened using my personal information. I have filed a police report (see attached) and request immediate removal."
    ],
    negativeRemarkDisputes: [
      "The negative remark was the result of a verified bank error which has been acknowledged in writing by the creditor (see attached letter).",
      "This negative remark was supposed to be removed as part of a settlement agreement reached on [date] (copy enclosed)."
    ]
  };
};
