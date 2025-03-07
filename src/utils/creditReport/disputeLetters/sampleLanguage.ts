
/**
 * Sample language and phrases for dispute letters
 */

/**
 * Get successful dispute phrases for different dispute types
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  try {
    // Return sample phrases organized by dispute type
    return {
      late_payment: [
        "I have never been late on this account.",
        "The reported late payment is inaccurate and has no basis in fact.",
        "This payment was made on time but was incorrectly processed by the creditor.",
        "I have documentation showing this payment was made before the due date."
      ],
      balance: [
        "The reported balance is incorrect and does not match my records.",
        "This account has been paid in full and should show a zero balance.",
        "The balance reported is from an unauthorized charge that I've disputed with the creditor.",
        "This balance includes fees that were waived but not properly reflected in your records."
      ],
      inquiry: [
        "I did not authorize this credit inquiry.",
        "This inquiry was made without my knowledge or consent.",
        "I have no relationship with this company and did not apply for credit with them.",
        "This appears to be a fraudulent inquiry as I never gave permission for my credit to be checked."
      ],
      account_status: [
        "This account is incorrectly reported as open when it was closed on [date].",
        "This account should be reported as 'paid as agreed' not as 'settled'.",
        "The account status is inaccurate and does not reflect the actual status per my agreement with the creditor.",
        "This account was included in a bankruptcy and should be reported as discharged."
      ],
      not_mine: [
        "This account does not belong to me and I have never had any relationship with this creditor.",
        "I am a victim of identity theft and this account was fraudulently opened in my name.",
        "This account appears to be the result of a mixed credit file with someone with a similar name.",
        "I have never opened an account with this company."
      ],
      personal_information: [
        "The address listed is incorrect and has never been my residence.",
        "My name is misspelled which could result in incorrect information being associated with my credit file.",
        "The employment information listed is outdated and incorrect.",
        "My date of birth is incorrectly reported."
      ]
    };
  } catch (error) {
    console.error("Error getting successful dispute phrases:", error);
    return {};
  }
};

/**
 * Get sample dispute language based on dispute type
 */
export const getSampleDisputeLanguage = async (
  disputeType: string,
  bureau: string = 'TransUnion'
): Promise<string> => {
  // Default sample language based on dispute type
  const defaultLanguage: Record<string, string> = {
    'balance': 'The balance shown on this account is incorrect and does not reflect my actual financial obligation. This error violates Metro 2 reporting standards which require accurate balance reporting.',
    'late_payment': 'This account is incorrectly reported as delinquent. According to my records, all payments have been made on time. This error violates FCRA Section 623 which requires furnishers to report accurate information.',
    'account_status': 'The account status is being reported incorrectly. This violates FCRA accuracy requirements and Metro 2 standards for proper status code reporting.',
    'dates': 'The dates associated with this account are inaccurate and do not align with the actual account history. This violates Metro 2 standards for date reporting.',
    'personal_information': 'My personal information is reported incorrectly. This error affects my credit profile and violates FCRA requirements for accurate consumer information.',
    'inquiry': 'This inquiry was made without my knowledge or consent. This violates FCRA Section 604, which requires a permissible purpose for accessing my credit information.',
    'student_loan': 'This student loan account is being reported inaccurately. Recent Department of Education changes may qualify this loan for discharge or reduction. This violates FCRA Section 623 which requires furnishers to report accurate information.',
    'general': `The information for this account is being inaccurately reported by ${bureau}. This information is incorrect and should be investigated and corrected to reflect accurate information. This error violates both FCRA Section 611(a) accuracy requirements and Metro 2 Format standards.`
  };
  
  // Get the specific language for the field if available, otherwise use a generic template
  const language = defaultLanguage[disputeType.toLowerCase()] || defaultLanguage['general'];
  
  return language;
};
