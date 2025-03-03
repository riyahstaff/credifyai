
/**
 * Sample dispute letter search functionality
 */
import { SampleDisputeLetter } from '../types';
import { loadSampleDisputeLetters } from './sampleLettersLoader';

/**
 * Find the most appropriate sample dispute letter based on dispute type
 */
export const findSampleDispute = async (disputeType: string, bureau?: string): Promise<SampleDisputeLetter | null> => {
  const sampleLetters = await loadSampleDisputeLetters();
  console.log(`Searching for sample letters matching: ${disputeType} for ${bureau || 'any bureau'}`);
  
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
    console.log("Found basic match for dispute type");
    return anyMatch;
  }
  
  console.log("No suitable sample letters found");
  return null;
};

/**
 * Find semantic matches for dispute type based on related terms
 */
function findSemanticMatches(disputeType: string, letters: SampleDisputeLetter[]): SampleDisputeLetter[] {
  const lowerDisputeType = disputeType.toLowerCase();
  
  // Create a map of dispute types and their related terms
  const relatedTerms: Record<string, string[]> = {
    'late payment': ['late', 'payment history', 'delinquent', 'past due', '30 day', '60 day', '90 day'],
    'not my account': ['not mine', 'fraud', 'identity theft', 'unknown account', 'unauthorized', 'never opened'],
    'incorrect balance': ['balance', 'amount', 'incorrect amount', 'wrong balance', 'paid off', 'payoff', 'not owed'],
    'incorrect status': ['status', 'open', 'closed', 'collection', 'charged off', 'transferred'],
    'collection': ['collection', 'debt collector', 'third-party', 'charge off', 'charged off'],
    'inquiry': ['inquiry', 'hard pull', 'credit check', 'hard inquiry', 'unauthorized inquiry'],
    'bankruptcy': ['bankruptcy', 'chapter 7', 'chapter 13', 'dismissed', 'discharged'],
    'personal information': ['address', 'name', 'personal', 'employment', 'employer', 'phone number', 'ssn']
  };
  
  // Check if any related terms match the dispute type
  const matchedCategories: string[] = [];
  for (const [category, terms] of Object.entries(relatedTerms)) {
    if (terms.some(term => lowerDisputeType.includes(term))) {
      matchedCategories.push(category);
    }
  }
  
  // Look for sample letters that match any of the matched categories
  const matches: SampleDisputeLetter[] = [];
  for (const category of matchedCategories) {
    const categoryMatches = letters.filter(letter => 
      letter.disputeType.toLowerCase().includes(category) || 
      relatedTerms[category].some(term => letter.disputeType.toLowerCase().includes(term))
    );
    
    // Prioritize successful outcomes
    const successfulMatches = categoryMatches.filter(letter => letter.successfulOutcome);
    if (successfulMatches.length > 0) {
      matches.push(...successfulMatches);
    } else {
      matches.push(...categoryMatches);
    }
  }
  
  return matches;
}
