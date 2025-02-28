
/**
 * Dispute Letters Generator
 * This module handles generating dispute letters based on credit report issues
 */
import { RecommendedDispute, UserInfo, LegalReference, SampleDisputeLetter } from './types';
import { getLegalReferencesForDispute } from './legalReferences';
import { listSampleDisputeLetters, downloadSampleDisputeLetter } from '@/lib/supabase';

// Store sample dispute letters cache
let sampleDisputeLettersCache: SampleDisputeLetter[] = [];
// Store successful dispute phrases cache
let successfulDisputePhrasesCache: Record<string, string[]> = {};

/**
 * Generate a dispute letter for a specific discrepancy
 */
export const generateDisputeLetterForDiscrepancy = async (
  discrepancy: RecommendedDispute, 
  userInfo: UserInfo
): Promise<string> => {
  // Get the bureau address
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  const bureau = discrepancy.bureau.toLowerCase();
  const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
  
  // Get the current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get legal references if available
  const legalReferences = discrepancy.legalBasis || 
    getLegalReferencesForDispute(discrepancy.reason, discrepancy.description);
  
  // Use the sample dispute language or the description
  const disputeExplanation = discrepancy.sampleDisputeLanguage || discrepancy.description;
  
  // Generate citations text
  const citationsText = legalReferences && legalReferences.length > 0 
    ? `As required by ${legalReferences.map(ref => `${ref.law} ${ref.section}`).join(', ')}, ` 
    : 'As required by the Fair Credit Reporting Act (FCRA) Section 611(a), ';
  
  // Generate the letter content
  return `
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${discrepancy.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information - ${discrepancy.accountName}${discrepancy.accountNumber ? ` - Account #${discrepancy.accountNumber}` : ''}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${discrepancy.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

Account Name: ${discrepancy.accountName}
${discrepancy.accountNumber ? `Account Number: ${discrepancy.accountNumber}` : ''}
Reason for Dispute: ${discrepancy.reason}

This information is inaccurate because: ${disputeExplanation}

${citationsText}you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this debt
4. Remove the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name}

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
`;
};

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

/**
 * Determine dispute type from file name
 */
function determineDisputeTypeFromFileName(fileName: string): string {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName.includes('balance') || lowerFileName.includes('amount')) {
    return 'balance';
  } else if (lowerFileName.includes('late') || lowerFileName.includes('payment')) {
    return 'late_payment';
  } else if (lowerFileName.includes('not_mine') || lowerFileName.includes('fraud') || lowerFileName.includes('identity')) {
    return 'not_mine';
  } else if (lowerFileName.includes('closed') || lowerFileName.includes('status')) {
    return 'account_status';
  } else if (lowerFileName.includes('date')) {
    return 'dates';
  } else if (lowerFileName.includes('personal') || lowerFileName.includes('address') || lowerFileName.includes('name')) {
    return 'personal_information';
  }
  
  return 'general';
}

/**
 * Determine bureau from file name
 */
function determineBureauFromFileName(fileName: string): string | undefined {
  const lowerFileName = fileName.toLowerCase();
  
  if (lowerFileName.includes('experian')) {
    return 'experian';
  } else if (lowerFileName.includes('equifax')) {
    return 'equifax';
  } else if (lowerFileName.includes('transunion')) {
    return 'transunion';
  }
  
  return undefined;
}

/**
 * Extract key components from a dispute letter
 */
function extractKeyComponentsFromLetter(letterContent: string): { 
  effectiveLanguage: string[], 
  legalCitations: string[] 
} {
  const effectiveLanguage: string[] = [];
  const legalCitations: string[] = [];
  
  // Look for paragraphs that appear to be describing the dispute
  const paragraphs = letterContent.split(/\n\s*\n/);
  
  for (const paragraph of paragraphs) {
    // Check for legal citations
    if (paragraph.includes('FCRA') || 
        paragraph.includes('Fair Credit Reporting Act') || 
        paragraph.includes('Section') || 
        paragraph.includes('METRO') || 
        paragraph.includes('15 U.S.C')) {
      legalCitations.push(paragraph.trim());
    }
    
    // Check for dispute explanation paragraphs
    if ((paragraph.includes('inaccurate') || 
         paragraph.includes('incorrect') || 
         paragraph.includes('error') || 
         paragraph.includes('dispute')) && 
        paragraph.length > 50 && 
        paragraph.length < 500) {
      effectiveLanguage.push(paragraph.trim());
    }
  }
  
  return { effectiveLanguage, legalCitations };
}
