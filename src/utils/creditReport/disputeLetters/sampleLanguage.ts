
/**
 * Sample dispute language and phrases
 */
import { findSampleDispute } from './sampleLetters';

// Store successful dispute phrases cache
let successfulDisputePhrasesCache: Record<string, string[]> = {};

/**
 * Get sample dispute language for a specific dispute type
 */
export const getSampleDisputeLanguage = async (accountName: string, field: string, bureau: string): Promise<string> => {
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
  } else if (accountName === "Personal Information") {
    disputeType = 'personal_information';
  }
  
  // Try to find a matching sample dispute letter
  const sampleLetter = await findSampleDispute(disputeType, bureau.toLowerCase());
  
  if (sampleLetter && sampleLetter.effectiveLanguage && sampleLetter.effectiveLanguage.length > 0) {
    // Return the first effective language paragraph
    return sampleLetter.effectiveLanguage[0];
  }
  
  // If no sample letter found, use default language
  const defaultLanguage: Record<string, string> = {
    'balance': 'The balance shown on this account is incorrect and does not reflect my actual financial obligation. This error violates Metro 2 reporting standards which require accurate balance reporting.',
    'late_payment': 'This account is incorrectly reported as delinquent. According to my records, all payments have been made on time. This error violates FCRA Section 623 which requires furnishers to report accurate information.',
    'account_status': 'The account status is being reported incorrectly. This violates FCRA accuracy requirements and Metro 2 standards for proper status code reporting.',
    'dates': 'The dates associated with this account are inaccurate and do not align with the actual account history. This violates Metro 2 standards for date reporting.',
    'personal_information': 'My personal information is reported incorrectly. This error affects my credit profile and violates FCRA requirements for accurate consumer information.'
  };
  
  // Get the specific language for the field if available, otherwise use a generic template
  const language = defaultLanguage[disputeType] || 
    `The ${field} for this account is being inaccurately reported by ${bureau}. This information is incorrect and should be investigated and corrected to reflect accurate information. This error violates both FCRA Section 611(a) accuracy requirements and Metro 2 Format standards.`;
  
  return language;
};

/**
 * Retrieve successful dispute phrases for various dispute types
 * These are phrases that have been effective in getting disputes approved
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  // Return cached phrases if available
  if (Object.keys(successfulDisputePhrasesCache).length > 0) {
    return successfulDisputePhrasesCache;
  }
  
  try {
    // Load sample dispute letters if not already loaded
    const { loadSampleDisputeLetters } = await import('./sampleLetters');
    const sampleLetters = await loadSampleDisputeLetters();
    
    // Extract successful dispute phrases by category
    const phrases: Record<string, string[]> = {
      balanceDisputes: [],
      latePaymentDisputes: [],
      accountOwnershipDisputes: [],
      closedAccountDisputes: [],
      personalInfoDisputes: [],
      inquiryDisputes: [],
      general: []
    };
    
    // Process each sample letter to extract phrases
    for (const letter of sampleLetters) {
      if (letter.effectiveLanguage && letter.effectiveLanguage.length > 0) {
        // Categorize by dispute type
        switch (letter.disputeType) {
          case 'balance':
            phrases.balanceDisputes.push(...letter.effectiveLanguage);
            break;
          case 'late_payment':
            phrases.latePaymentDisputes.push(...letter.effectiveLanguage);
            break;
          case 'not_mine':
            phrases.accountOwnershipDisputes.push(...letter.effectiveLanguage);
            break;
          case 'account_status':
            phrases.closedAccountDisputes.push(...letter.effectiveLanguage);
            break;
          case 'personal_information':
            phrases.personalInfoDisputes.push(...letter.effectiveLanguage);
            break;
          case 'dates':
          case 'general':
          default:
            phrases.general.push(...letter.effectiveLanguage);
            break;
        }
      }
    }
    
    // If we don't have enough sample phrases, add some default ones
    if (phrases.balanceDisputes.length === 0) {
      phrases.balanceDisputes = [
        "The balance reported is incorrect and does not reflect my actual financial obligation. My records indicate a different balance.",
        "This account shows an incorrect balance that does not match my payment history or account statements."
      ];
    }
    
    if (phrases.latePaymentDisputes.length === 0) {
      phrases.latePaymentDisputes = [
        "I have never been late on this account and have documentation to prove all payments were made on time.",
        "The reported late payment is incorrect. I made all payments within the required timeframe as evidenced by my bank statements."
      ];
    }
    
    if (phrases.accountOwnershipDisputes.length === 0) {
      phrases.accountOwnershipDisputes = [
        "This account does not belong to me and I have never authorized its opening. I request a full investigation into how this account was opened.",
        "I have no knowledge of this account and it appears to be the result of identity theft or a mixed credit file."
      ];
    }
    
    if (phrases.closedAccountDisputes.length === 0) {
      phrases.closedAccountDisputes = [
        "This account was closed on [DATE] but is being reported as open. Please update the status to reflect the account is closed.",
        "I closed this account and it should not be reporting as open. This misrepresentation affects my credit utilization ratio."
      ];
    }
    
    // Cache and return the phrases
    successfulDisputePhrasesCache = phrases;
    console.log("Successfully loaded dispute phrases:", Object.keys(phrases).map(k => `${k}: ${phrases[k as keyof typeof phrases].length} phrases`).join(', '));
    return phrases;
  } catch (error) {
    console.error("Error loading successful dispute phrases:", error);
    
    // Return default phrases on error
    return {
      balanceDisputes: ["The balance shown is incorrect and does not reflect my actual financial obligation."],
      latePaymentDisputes: ["I have never been late on this account and have documentation to prove all payments were made on time."],
      accountOwnershipDisputes: ["This account does not belong to me and I have never authorized its opening."],
      closedAccountDisputes: ["This account was closed but is being incorrectly reported as open."],
      personalInfoDisputes: ["My personal information is reported incorrectly."],
      inquiryDisputes: ["I never authorized this inquiry on my credit report."],
      general: ["The information reported is inaccurate and violates the Fair Credit Reporting Act."]
    };
  }
};
