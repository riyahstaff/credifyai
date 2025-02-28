
/**
 * Sample dispute letters loading and processing
 */
import { SampleDisputeLetter } from './types';
import { listSampleDisputeLetters, downloadSampleDisputeLetter } from '@/lib/supabase';
import { 
  determineDisputeTypeFromFileName, 
  determineBureauFromFileName, 
  extractKeyComponentsFromLetter 
} from './utils';

// Store sample dispute letters cache
let sampleDisputeLettersCache: SampleDisputeLetter[] = [];

/**
 * Find the most appropriate sample dispute letter based on dispute type
 */
export const findSampleDispute = async (disputeType: string, bureau?: string): Promise<SampleDisputeLetter | null> => {
  const sampleLetters = await loadSampleDisputeLetters();
  
  // First try to find an exact match for both dispute type and bureau
  if (bureau) {
    const exactMatch = sampleLetters.find(
      l => l.disputeType === disputeType && 
           l.bureau === bureau && 
           l.successfulOutcome === true
    );
    
    if (exactMatch) return exactMatch;
  }
  
  // Then try to find a match just based on dispute type with successful outcome
  const disputeTypeMatch = sampleLetters.find(
    l => l.disputeType === disputeType && l.successfulOutcome === true
  );
  
  if (disputeTypeMatch) return disputeTypeMatch;
  
  // Finally, just find any letter with this dispute type
  const anyMatch = sampleLetters.find(l => l.disputeType === disputeType);
  
  return anyMatch || null;
};

/**
 * Load all sample dispute letters from Supabase Storage
 */
export const loadSampleDisputeLetters = async (): Promise<SampleDisputeLetter[]> => {
  if (sampleDisputeLettersCache.length > 0) {
    return sampleDisputeLettersCache;
  }
  
  try {
    const sampleFiles = await listSampleDisputeLetters();
    const letters: SampleDisputeLetter[] = [];
    
    for (const file of sampleFiles) {
      const letterContent = await downloadSampleDisputeLetter(file.name);
      if (letterContent) {
        // Determine dispute type from file name or content
        const disputeType = determineDisputeTypeFromFileName(file.name);
        const bureau = determineBureauFromFileName(file.name);
        
        // Extract effective language and legal citations
        const { effectiveLanguage, legalCitations } = extractKeyComponentsFromLetter(letterContent);
        
        letters.push({
          content: letterContent,
          disputeType,
          bureau,
          successfulOutcome: file.name.toLowerCase().includes('successful'),
          effectiveLanguage,
          legalCitations
        });
      }
    }
    
    sampleDisputeLettersCache = letters;
    console.log(`Loaded ${letters.length} sample dispute letters`);
    return letters;
  } catch (error) {
    console.error('Error loading sample dispute letters:', error);
    return [];
  }
};
