
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
  
  // First try to find an exact match for both dispute type and bureau
  if (bureau) {
    const exactMatch = sampleLetters.find(
      l => l.disputeType.toLowerCase() === disputeType.toLowerCase() && 
           l.bureau?.toLowerCase() === bureau.toLowerCase() && 
           l.successfulOutcome === true
    );
    
    if (exactMatch) return exactMatch;
  }
  
  // Then try to find a match just based on dispute type with successful outcome
  const disputeTypeMatch = sampleLetters.find(
    l => l.disputeType.toLowerCase() === disputeType.toLowerCase() && 
         l.successfulOutcome === true
  );
  
  if (disputeTypeMatch) return disputeTypeMatch;
  
  // Try to find a match based on partial dispute type with successful outcome
  const partialTypeMatch = sampleLetters.find(
    l => l.disputeType.toLowerCase().includes(disputeType.toLowerCase()) && 
         l.successfulOutcome === true
  );
  
  if (partialTypeMatch) return partialTypeMatch;
  
  // Finally, just find any letter with this dispute type
  const anyMatch = sampleLetters.find(
    l => l.disputeType.toLowerCase() === disputeType.toLowerCase() ||
         l.disputeType.toLowerCase().includes(disputeType.toLowerCase())
  );
  
  return anyMatch || null;
};
