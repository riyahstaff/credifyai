
/**
 * Sample dispute letters loading and processing
 */
import { SampleDisputeLetter } from '../types';
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

/**
 * Generate a fallback inquiry dispute letter when no samples are available
 */
const generateFallbackInquiryDisputeLetter = (): string => {
  return `[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Unauthorized Inquiry

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 604 and Section 611, to dispute an unauthorized inquiry that appears on my credit report.

Upon reviewing my credit report, I discovered an inquiry from [COMPANY NAME] on [DATE OF INQUIRY]. I did not authorize this inquiry, nor do I have any business relationship with this company that would permit them to access my credit information.

The FCRA clearly states that consumer credit information may only be accessed with a permissible purpose, such as in response to a consumer-initiated transaction or application for credit. Since I did not initiate any transaction with this company, this inquiry violates the FCRA and must be removed from my credit report.

I request that you:
1. Remove this unauthorized inquiry from my credit report immediately
2. Provide me with the name, address, and telephone number of the entity that made this inquiry
3. Forward all relevant information about this dispute to the furnisher of this information
4. Notify me when the investigation is complete and provide me with a free updated copy of my credit report

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed inquiry highlighted
- Copy of identification documents`;
};

/**
 * Generate a fallback late payment dispute letter when no samples are available
 */
const generateFallbackLatePaymentDisputeLetter = (): string => {
  return `[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Late Payment Information

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611 and Section 623, to dispute inaccurate late payment information that appears on my credit report.

Upon reviewing my credit report, I discovered that [CREDITOR NAME] has reported my account #[ACCOUNT NUMBER] as having late payments on [DATES OF REPORTED LATE PAYMENTS]. This information is inaccurate, as I have always made timely payments on this account.

I have maintained detailed records of my payments, including [MENTION ANY EVIDENCE YOU HAVE: canceled checks, bank statements, payment confirmations, etc.], which clearly demonstrate that the payments in question were made on time.

Under Section 623 of the FCRA, furnishers of information to consumer reporting agencies must provide accurate information, and Section 611 requires you to conduct a reasonable investigation into disputed information.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher
3. Remove the inaccurate late payment information from my credit report
4. Provide me with the results of your investigation

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed information highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]`;
};

/**
 * Generate a fallback personal information dispute letter when no samples are available
 */
const generateFallbackPersonalInfoDisputeLetter = (): string => {
  return `[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

[DATE]

[CREDIT BUREAU]
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Personal Information

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611, to dispute inaccurate personal information that appears on my credit report.

Upon reviewing my credit report, I discovered the following inaccurate personal information:
[DESCRIBE INACCURATE INFORMATION: incorrect name spelling, wrong address, etc.]

The correct information is:
[PROVIDE CORRECT INFORMATION]

This inaccuracy could lead to confusion regarding my identity and potentially affect my creditworthiness. Under Section 611 of the FCRA, you are required to conduct a reasonable investigation into disputed information and correct any inaccuracies.

I request that you:
1. Update my personal information with the correct details provided above
2. Remove any outdated or incorrect addresses or other personal information
3. Notify me when the investigation is complete
4. Provide me with a free updated copy of my credit report showing the corrections

Please complete your investigation within the 30-day timeframe as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with disputed information highlighted
- [LIST ANY SUPPORTING DOCUMENTATION, such as driver's license, utility bills, etc.]`;
};
