
/**
 * Sample dispute letter language utility
 * Provides relevant language for different types of disputes
 */
import { findSampleDispute } from './sampleDisputes';
import { loadSampleDisputeLetters } from './sampleLettersLoader';

/**
 * Get sample dispute language for a specific dispute type
 */
export const getSampleDisputeLanguage = async (
  disputeType: string,
  bureau?: string
): Promise<string> => {
  console.log(`Finding sample dispute language for ${disputeType}, bureau: ${bureau || 'any'}`);
  
  // Try to find a matching sample dispute letter first
  const sampleDispute = await findSampleDispute(disputeType, bureau);
  
  if (sampleDispute?.effectiveLanguage && sampleDispute.effectiveLanguage.length > 0) {
    console.log("Found sample dispute language from examples");
    return sampleDispute.effectiveLanguage[0];
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
    'general': `This information is inaccurate and should be investigated and corrected. This error violates both FCRA Section 611(a) accuracy requirements and Metro 2 Format standards.`
  };
  
  console.log(`Using default language for dispute type: ${disputeType}`);
  
  // Get the specific language for the field if available, otherwise use a generic template
  let normalizedType = 'general';
  
  // Try to normalize the dispute type to match our keys
  const typeLower = disputeType.toLowerCase();
  if (typeLower.includes('balance')) {
    normalizedType = 'balance';
  } else if (typeLower.includes('payment') || typeLower.includes('late')) {
    normalizedType = 'late_payment';
  } else if (typeLower.includes('status')) {
    normalizedType = 'account_status';
  } else if (typeLower.includes('date')) {
    normalizedType = 'dates';
  } else if (typeLower.includes('personal') || typeLower.includes('address') || typeLower.includes('name')) {
    normalizedType = 'personal_information';
  } else if (typeLower.includes('inquiry')) {
    normalizedType = 'inquiry';
  } else if (typeLower.includes('student')) {
    normalizedType = 'student_loan';
  }
  
  return defaultLanguage[normalizedType] || defaultLanguage['general'];
};

/**
 * Get successful dispute phrases by category
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  // Load all sample dispute letters
  const sampleLetters = await loadSampleDisputeLetters();
  console.log(`Loaded ${sampleLetters.length} sample dispute letters for phrase extraction`);
  
  // Categorize effective language by dispute type
  const phrases: Record<string, string[]> = {
    balanceDisputes: [],
    latePaymentDisputes: [],
    accountOwnershipDisputes: [],
    inquiryDisputes: [],
    personalInfoDisputes: [],
    closedAccountDisputes: [],
    generalDisputes: []
  };
  
  // Extract phrases from sample letters
  for (const letter of sampleLetters) {
    if (!letter.effectiveLanguage || letter.effectiveLanguage.length === 0) continue;
    
    const disputeType = letter.disputeType.toLowerCase();
    const successfulPhrases = letter.effectiveLanguage.filter(phrase => phrase && phrase.length > 15);
    
    if (disputeType.includes('balance')) {
      phrases.balanceDisputes.push(...successfulPhrases);
    } else if (disputeType.includes('payment') || disputeType.includes('late')) {
      phrases.latePaymentDisputes.push(...successfulPhrases);
    } else if (disputeType.includes('not mine') || disputeType.includes('fraud')) {
      phrases.accountOwnershipDisputes.push(...successfulPhrases);
    } else if (disputeType.includes('inquiry')) {
      phrases.inquiryDisputes.push(...successfulPhrases);
    } else if (disputeType.includes('personal') || disputeType.includes('name') || disputeType.includes('address')) {
      phrases.personalInfoDisputes.push(...successfulPhrases);
    } else if (disputeType.includes('closed')) {
      phrases.closedAccountDisputes.push(...successfulPhrases);
    } else {
      phrases.generalDisputes.push(...successfulPhrases);
    }
  }
  
  console.log(`Extracted dispute phrases by category:`, 
    Object.fromEntries(Object.entries(phrases).map(([k, v]) => [k, v.length]))
  );
  
  return phrases;
};
