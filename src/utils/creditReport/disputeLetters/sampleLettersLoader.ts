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
  generateFallbackPersonalInfoDisputeLetter,
  generateFallbackCollectionDisputeLetter,
  generateFallbackBankruptcyDisputeLetter,
  generateFallbackIncorrectBalanceDisputeLetter
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
    console.log("Loading sample dispute letters from storage");
    const sampleFiles = await listSampleDisputeLetters();
    console.log(`Found ${sampleFiles.length} sample letter files`);
    
    const letters: SampleDisputeLetter[] = [];
    
    for (const file of sampleFiles) {
      try {
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
          
          console.log(`Loaded sample letter: ${disputeType} for ${bureau}`);
        }
      } catch (error) {
        console.error(`Error loading sample letter ${file.name}:`, error);
      }
    }
    
    // Add some fallback sample letters if none were loaded or to supplement the collection
    if (letters.length === 0 || !letters.some(l => l.disputeType.includes('inquiry'))) {
      console.log('Adding fallback inquiry dispute sample');
      letters.push({
        content: generateFallbackInquiryDisputeLetter(),
        disputeType: 'inquiry',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['I did not authorize this inquiry'],
        legalCitations: ['FCRA Section 604', 'FCRA Section 611']
      });
    }
    
    if (letters.length === 0 || !letters.some(l => l.disputeType.includes('late_payment'))) {
      console.log('Adding fallback late payment dispute sample');
      letters.push({
        content: generateFallbackLatePaymentDisputeLetter(),
        disputeType: 'late_payment',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['This payment was made on time'],
        legalCitations: ['FCRA Section 623']
      });
    }
    
    if (letters.length === 0 || !letters.some(l => l.disputeType.includes('personal_information'))) {
      console.log('Adding fallback personal information dispute sample');
      letters.push({
        content: generateFallbackPersonalInfoDisputeLetter(),
        disputeType: 'personal_information',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['My personal information is incorrect'],
        legalCitations: ['FCRA Section 611']
      });
    }
    
    if (letters.length === 0 || !letters.some(l => l.disputeType.includes('collection'))) {
      console.log('Adding fallback collection dispute sample');
      letters.push({
        content: generateFallbackCollectionDisputeLetter(),
        disputeType: 'collection',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['This collection account is invalid'],
        legalCitations: ['FCRA Section 623', 'FDCPA Section 809']
      });
    }
    
    if (letters.length === 0 || !letters.some(l => l.disputeType.includes('bankruptcy'))) {
      console.log('Adding fallback bankruptcy dispute sample');
      letters.push({
        content: generateFallbackBankruptcyDisputeLetter(),
        disputeType: 'bankruptcy',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['This bankruptcy information is inaccurate'],
        legalCitations: ['FCRA Section 605', 'FCRA Section 611']
      });
    }
    
    if (letters.length === 0 || !letters.some(l => l.disputeType.includes('balance'))) {
      console.log('Adding fallback incorrect balance dispute sample');
      letters.push({
        content: generateFallbackIncorrectBalanceDisputeLetter(),
        disputeType: 'incorrect_balance',
        bureau: 'all',
        successfulOutcome: true,
        effectiveLanguage: ['The balance reported is incorrect'],
        legalCitations: ['FCRA Section 623']
      });
    }
    
    sampleDisputeLettersCache = letters;
    console.log(`Loaded ${letters.length} sample dispute letters (including fallbacks)`);
    return letters;
  } catch (error) {
    console.error('Error loading sample dispute letters:', error);
    return [];
  }
};
