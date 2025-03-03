
/**
 * Sample dispute language utilities
 */
import { loadSampleDisputeLetters } from './sampleLettersLoader';

interface DisputePhrases {
  [key: string]: string[];
}

// Cache for successful dispute phrases
let disputePhrasesCache: DisputePhrases = {};

/**
 * Get sample dispute language based on dispute type and bureau
 */
export const getSampleDisputeLanguage = async (disputeType: string, bureau?: string): Promise<string> => {
  console.log(`Fetching sample dispute language for ${disputeType}, bureau: ${bureau || 'any'}`);
  
  try {
    // Load all sample letters
    const sampleLetters = await loadSampleDisputeLetters();
    
    // Find letters that match the dispute type
    const matchingLetters = sampleLetters.filter(letter => {
      return letter.disputeType.toLowerCase().includes(disputeType.toLowerCase()) && 
             (!bureau || letter.bureau?.toLowerCase().includes(bureau.toLowerCase()));
    });
    
    // If we have matches, extract effective language from the most relevant one
    if (matchingLetters.length > 0) {
      // Prioritize successful letters
      const successfulLetters = matchingLetters.filter(l => l.successfulOutcome);
      const targetLetter = successfulLetters.length > 0 ? successfulLetters[0] : matchingLetters[0];
      
      if (targetLetter.effectiveLanguage && targetLetter.effectiveLanguage.length > 0) {
        // Join multiple language snippets with proper formatting
        const language = targetLetter.effectiveLanguage.join('\n\n');
        console.log(`Found sample language for ${disputeType}: ${language.substring(0, 50)}...`);
        return language;
      }
    }
    
    // Fallback to generic language based on dispute type
    console.log(`No exact match found for ${disputeType}, using fallback language`);
    return generateFallbackLanguage(disputeType, bureau);
  } catch (error) {
    console.error("Error getting sample dispute language:", error);
    return generateFallbackLanguage(disputeType, bureau);
  }
};

/**
 * Get all successful dispute phrases for analysis
 */
export const getSuccessfulDisputePhrases = async (): Promise<DisputePhrases> => {
  // Use cached phrases if available
  if (Object.keys(disputePhrasesCache).length > 0) {
    return disputePhrasesCache;
  }
  
  try {
    // Load all sample letters
    const sampleLetters = await loadSampleDisputeLetters();
    
    // Extract successful phrases by dispute type
    const phrases: DisputePhrases = {};
    
    for (const letter of sampleLetters) {
      if (letter.successfulOutcome && letter.effectiveLanguage) {
        const disputeType = letter.disputeType.toLowerCase();
        
        if (!phrases[disputeType]) {
          phrases[disputeType] = [];
        }
        
        // Add unique phrases
        for (const phrase of letter.effectiveLanguage) {
          if (!phrases[disputeType].includes(phrase)) {
            phrases[disputeType].push(phrase);
          }
        }
      }
    }
    
    // Cache the results
    disputePhrasesCache = phrases;
    return phrases;
  } catch (error) {
    console.error("Error getting successful dispute phrases:", error);
    return {};
  }
};

/**
 * Generate fallback language when no sample is available
 */
const generateFallbackLanguage = (disputeType: string, bureau?: string): string => {
  const disputeLower = disputeType.toLowerCase();
  
  if (disputeLower.includes('late') || disputeLower.includes('payment')) {
    return "I have reviewed my payment history and can confirm that all payments were made on time. My records show no late payments for this account. This inaccuracy is harming my credit score and must be corrected immediately under the Fair Credit Reporting Act.";
  }
  
  if (disputeLower.includes('balance') || disputeLower.includes('amount')) {
    return "The balance reported for this account is incorrect. My records indicate a different amount than what is being reported. This error violates the Fair Credit Reporting Act requirement for accurate reporting.";
  }
  
  if (disputeLower.includes('account') && (disputeLower.includes('not') || disputeLower.includes('mine'))) {
    return "This account does not belong to me. I have never opened or authorized this account. This appears to be a case of mixed files or possibly identity theft that must be investigated immediately.";
  }
  
  if (disputeLower.includes('inquiry') || disputeLower.includes('pull')) {
    return "I did not authorize this inquiry on my credit report. Under the Fair Credit Reporting Act, inquiries can only be made with proper authorization. I request immediate investigation and removal of this unauthorized inquiry.";
  }
  
  // Generic language for other dispute types
  return `I am disputing this information as it appears to be inaccurate. After reviewing my records, I've found that this ${disputeType} contains errors that need to be corrected under the Fair Credit Reporting Act.`;
};
