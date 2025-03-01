
// Function to provide sample dispute language based on account and field types
export const getSampleDisputeLanguage = async (
  accountName: string, 
  field: string, 
  bureau: string
): Promise<string> => {
  // Get dispute type from field
  let disputeType = 'general';
  
  const fieldLower = field.toLowerCase();
  if (fieldLower.includes('balance')) {
    disputeType = 'balance';
  } else if (fieldLower.includes('payment') || fieldLower.includes('late')) {
    disputeType = 'late_payment';
  } else if (fieldLower.includes('status')) {
    disputeType = 'account_status';
  } else if (fieldLower.includes('date')) {
    disputeType = 'dates';
  } else if (fieldLower.includes('inquiry') || fieldLower.includes('inquiries')) {
    disputeType = 'inquiry';
  } else if (accountName.toLowerCase().includes('personal') || fieldLower.includes('address') || fieldLower.includes('name')) {
    disputeType = 'personal_information';
  } else if (fieldLower.includes('student') || accountName.toLowerCase().includes('student')) {
    disputeType = 'student_loan';
  }
  
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
  const language = defaultLanguage[disputeType] || defaultLanguage['general'];
  
  return language;
};
