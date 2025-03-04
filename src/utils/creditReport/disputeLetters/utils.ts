
/**
 * Utility functions for working with sample dispute letters
 */

/**
 * Determine the dispute type from a filename
 */
export const determineDisputeTypeFromFileName = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.includes('late_payment') || lowerName.includes('late-payment')) {
    return 'late_payment';
  } else if (lowerName.includes('not_mine') || lowerName.includes('not-mine') || lowerName.includes('identity_theft')) {
    return 'not_mine';
  } else if (lowerName.includes('inquiry') || lowerName.includes('hard_pull')) {
    return 'inquiry';
  } else if (lowerName.includes('balance')) {
    return 'balance';
  } else if (lowerName.includes('collection')) {
    return 'collection';
  } else if (lowerName.includes('bankruptcy')) {
    return 'bankruptcy';
  } else if (lowerName.includes('personal_info')) {
    return 'personal_information';
  } else if (lowerName.includes('account_status')) {
    return 'account_status';
  }
  
  // If no specific type found, return a generic type
  return 'general_dispute';
};

/**
 * Determine the bureau from a filename
 */
export const determineBureauFromFileName = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.includes('experian')) {
    return 'Experian';
  } else if (lowerName.includes('equifax')) {
    return 'Equifax';
  } else if (lowerName.includes('transunion')) {
    return 'TransUnion';
  }
  
  // If no specific bureau found, return all
  return 'all';
};

/**
 * Extract key components from a dispute letter
 */
export const extractKeyComponentsFromLetter = (content: string): { 
  effectiveLanguage: string[], 
  legalCitations: string[] 
} => {
  const effectiveLanguage: string[] = [];
  const legalCitations: string[] = [];
  
  // Extract effective language paragraphs (3-15 word sentences that sound assertive)
  const paragraphs = content.split('\n');
  paragraphs.forEach(paragraph => {
    const trimmed = paragraph.trim();
    const wordCount = trimmed.split(/\s+/).length;
    
    if (wordCount >= 10 && wordCount <= 30 && 
        (trimmed.includes('request') || 
         trimmed.includes('dispute') || 
         trimmed.includes('demand') || 
         trimmed.includes('require') ||
         trimmed.includes('incorrect') ||
         trimmed.includes('inaccurate'))) {
      effectiveLanguage.push(trimmed);
    }
  });
  
  // Extract legal citations (looking for common patterns)
  const fcraPattern = /FCRA\s+(?:Section|§)\s+(\d+[a-z]?)/gi;
  const fdcpaPattern = /FDCPA\s+(?:Section|§)\s+(\d+[a-z]?)/gi;
  
  let match;
  while ((match = fcraPattern.exec(content)) !== null) {
    legalCitations.push(`FCRA Section ${match[1]}`);
  }
  
  while ((match = fdcpaPattern.exec(content)) !== null) {
    legalCitations.push(`FDCPA Section ${match[1]}`);
  }
  
  // Deduplicate arrays
  return {
    effectiveLanguage: [...new Set(effectiveLanguage)],
    legalCitations: [...new Set(legalCitations)]
  };
};
