
/**
 * Utility functions for dispute letters processing
 */

/**
 * Determine dispute type from file name
 */
export function determineDisputeTypeFromFileName(fileName: string): string {
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
export function determineBureauFromFileName(fileName: string): string | undefined {
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
export function extractKeyComponentsFromLetter(letterContent: string): { 
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
