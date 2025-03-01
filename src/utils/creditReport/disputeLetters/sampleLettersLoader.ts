
/**
 * Sample dispute letters loading functionality
 */
import { SampleDisputeLetter } from '../types';
import { listSampleDisputeLetters, downloadSampleDisputeLetter } from '@/lib/supabase';
import { 
  determineDisputeTypeFromFileName, 
  determineBureauFromFileName, 
  extractKeyComponentsFromLetter 
} from './utils';
import { 
  generateFallbackInquiryDisputeLetter,
  generateFallbackLatePaymentDisputeLetter,
  generateFallbackPersonalInfoDisputeLetter
} from './fallbackTemplates';

// Store sample dispute letters cache
let sampleDisputeLettersCache: SampleDisputeLetter[] = [];

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
    
    // Add some fallback sample letters if none were loaded
    if (letters.length === 0) {
      console.log('No sample dispute letters found in storage, adding fallbacks');
      
      // Add fallback inquiry dispute sample
      letters.push({
        content: generateFallbackInquiryDisputeLetter(),
        disputeType: 'inquiry',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['I did not authorize this inquiry'],
        legalCitations: ['FCRA Section 604', 'FCRA Section 611']
      });
      
      // Add fallback late payment dispute sample
      letters.push({
        content: generateFallbackLatePaymentDisputeLetter(),
        disputeType: 'late_payment',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['This payment was made on time'],
        legalCitations: ['FCRA Section 623']
      });
      
      // Add fallback personal information dispute sample
      letters.push({
        content: generateFallbackPersonalInfoDisputeLetter(),
        disputeType: 'personal_information',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['My personal information is incorrect'],
        legalCitations: ['FCRA Section 611']
      });
    }
    
    sampleDisputeLettersCache = letters;
    console.log(`Loaded ${letters.length} sample dispute letters`);
    return letters;
  } catch (error) {
    console.error('Error loading sample dispute letters:', error);
    return [];
  }
};
