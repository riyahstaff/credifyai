
/**
 * Sample dispute letter search functionality
 */
import { SampleDisputeLetter } from '../types';
import { loadSampleDisputeLetters } from './sampleLettersLoader';

/**
 * Find the most appropriate sample dispute letter based on dispute type
 */
export const findSampleDispute = async (disputeType: string, bureau?: string): Promise<SampleDisputeLetter | null> => {
  try {
    const sampleLetters = await loadSampleDisputeLetters();
    console.log(`Searching for sample letters matching: ${disputeType} for ${bureau || 'any bureau'}`);
    
    if (!sampleLetters || sampleLetters.length === 0) {
      console.warn("No sample letters available from Supabase or fallbacks");
      return null;
    }
    
    // First try to find an exact match for both dispute type and bureau
    if (bureau) {
      const exactMatch = sampleLetters.find(
        l => l.disputeType.toLowerCase() === disputeType.toLowerCase() && 
             l.bureau?.toLowerCase() === bureau.toLowerCase() && 
             l.successfulOutcome === true
      );
      
      if (exactMatch) {
        console.log("Found exact match for dispute type and bureau with successful outcome");
        return exactMatch;
      }
    }
    
    // Then try to find a match just based on dispute type with successful outcome
    const disputeTypeMatch = sampleLetters.find(
      l => l.disputeType.toLowerCase() === disputeType.toLowerCase() && 
           l.successfulOutcome === true
    );
    
    if (disputeTypeMatch) {
      console.log("Found match for dispute type with successful outcome");
      return disputeTypeMatch;
    }
    
    // Try to find a match based on partial dispute type with successful outcome
    const partialTypeMatch = sampleLetters.find(
      l => (l.disputeType.toLowerCase().includes(disputeType.toLowerCase()) || 
           disputeType.toLowerCase().includes(l.disputeType.toLowerCase())) && 
           l.successfulOutcome === true
    );
    
    if (partialTypeMatch) {
      console.log("Found partial match for dispute type with successful outcome");
      return partialTypeMatch;
    }
    
    // Try to find a match based on semantic similarity - look for related terms
    const semanticMatches = findSemanticMatches(disputeType, sampleLetters);
    if (semanticMatches.length > 0) {
      console.log("Found semantic match for dispute type");
      return semanticMatches[0];
    }
    
    // Finally, just find any letter with this dispute type or related type
    const anyMatch = sampleLetters.find(
      l => l.disputeType.toLowerCase() === disputeType.toLowerCase() ||
           l.disputeType.toLowerCase().includes(disputeType.toLowerCase()) ||
           disputeType.toLowerCase().includes(l.disputeType.toLowerCase())
    );
    
    if (anyMatch) {
      console.log("Found any match for dispute type");
      return anyMatch;
    }
    
    console.log("No matching sample dispute letter found in Supabase or fallbacks");
    return null;
  } catch (error) {
    console.error("Error finding sample dispute letter:", error);
    return null;
  }
};

/**
 * Find semantically similar dispute types
 * This is a basic implementation that looks for related terms
 */
function findSemanticMatches(disputeType: string, letters: SampleDisputeLetter[]): SampleDisputeLetter[] {
  if (!disputeType || !letters || letters.length === 0) {
    return [];
  }
  
  const relatedTerms: Record<string, string[]> = {
    'late payment': ['late', 'payment', 'delinquent', 'missed payment', 'past due'],
    'not mine': ['not mine', 'identity theft', 'fraud', 'account ownership', 'unauthorized'],
    'balance': ['balance', 'amount', 'incorrect balance', 'wrong balance'],
    'inquiries': ['inquiry', 'inquiries', 'credit check', 'hard pull', 'unauthorized inquiry'],
    'account status': ['status', 'open', 'closed', 'incorrect status', 'account standing'],
    'personal information': ['address', 'name', 'personal', 'identity', 'information'],
    'collection': ['collection', 'debt', 'collector', 'collections agency'],
    'bankruptcy': ['bankruptcy', 'chapter 7', 'chapter 13', 'discharged'],
  };
  
  // Convert dispute type to lowercase
  const lowerDisputeType = disputeType.toLowerCase();
  
  // Find which category this dispute belongs to
  let matchingCategories: string[] = [];
  
  for (const [category, terms] of Object.entries(relatedTerms)) {
    if (terms.some(term => lowerDisputeType.includes(term))) {
      matchingCategories.push(category);
    }
  }
  
  // If no categories matched, return empty array
  if (matchingCategories.length === 0) {
    return [];
  }
  
  // Find letters that match any of the identified categories
  const semanticMatches: SampleDisputeLetter[] = [];
  
  for (const letter of letters) {
    if (!letter.disputeType) continue;
    
    const lowerLetterType = letter.disputeType.toLowerCase();
    
    for (const category of matchingCategories) {
      const terms = relatedTerms[category];
      
      if (terms && terms.some(term => lowerLetterType.includes(term))) {
        semanticMatches.push(letter);
        break; // Don't add the same letter multiple times
      }
    }
  }
  
  // Prioritize successful outcome letters
  return semanticMatches.sort((a, b) => {
    // Sort successful letters to the front
    if (a.successfulOutcome === true && b.successfulOutcome !== true) return -1;
    if (a.successfulOutcome !== true && b.successfulOutcome === true) return 1;
    return 0;
  });
}
