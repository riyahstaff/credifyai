
/**
 * Utility functions for sample dispute letters
 */

/**
 * Determine dispute type from file name
 */
export const determineDisputeTypeFromFileName = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.includes('late_payment') || lowerName.includes('latepayment')) {
    return 'late_payment';
  } else if (lowerName.includes('inquiry') || lowerName.includes('hardpull')) {
    return 'inquiry';
  } else if (lowerName.includes('account') && (lowerName.includes('not') || lowerName.includes('fraud'))) {
    return 'not_my_account';
  } else if (lowerName.includes('identity') || lowerName.includes('fraud')) {
    return 'identity_theft';
  } else if (lowerName.includes('collection') || lowerName.includes('collect')) {
    return 'collection';
  } else if (lowerName.includes('balance')) {
    return 'incorrect_balance';
  } else if (lowerName.includes('bankruptcy') || lowerName.includes('bankrupt')) {
    return 'bankruptcy';
  } else if (lowerName.includes('personal') || lowerName.includes('info')) {
    return 'personal_information';
  } else if (lowerName.includes('status') || lowerName.includes('account_status')) {
    return 'account_status';
  } else {
    // Default case - extract from file name
    const parts = lowerName.split('_');
    if (parts.length > 1) {
      return parts[0]; // Use first part of filename
    }
    return 'general_dispute';
  }
};

/**
 * Determine bureau from file name
 */
export const determineBureauFromFileName = (fileName: string): string => {
  const lowerName = fileName.toLowerCase();
  
  if (lowerName.includes('experian')) {
    return 'Experian';
  } else if (lowerName.includes('equifax')) {
    return 'Equifax';
  } else if (lowerName.includes('transunion')) {
    return 'TransUnion';
  } else if (lowerName.includes('all')) {
    return 'all';
  } else {
    return 'all'; // Default to all bureaus
  }
};

/**
 * Extract key components from letter content
 */
export const extractKeyComponentsFromLetter = (content: string): { 
  effectiveLanguage: string[],
  legalCitations: string[] 
} => {
  const effectiveLanguage: string[] = [];
  const legalCitations: string[] = [];
  
  // Look for FCRA and other citations
  const lawRegex = /(FCRA|FDCPA|FACTA|ECOA|FCBA)(?:\s+Section|\s+§)?\s+(\d+[a-z]?(?:\(\d+\))?)/gi;
  let match;
  while ((match = lawRegex.exec(content)) !== null) {
    legalCitations.push(`${match[1]} Section ${match[2]}`);
  }
  
  // Extract effective language - look for key dispute paragraphs
  const paragraphs = content.split(/\n\s*\n/);
  
  for (const paragraph of paragraphs) {
    // Skip headers, signatures and placeholder text
    if (paragraph.includes('[YOUR') || 
        paragraph.includes('Sincerely,') || 
        paragraph.includes('To Whom It May Concern') ||
        paragraph.includes('Enclosure') ||
        paragraph.length < 30 ||
        /^\s*[A-Z0-9\s]+\s*$/.test(paragraph)) { // Skip all-caps headers
      continue;
    }
    
    // Look for paragraphs that likely contain dispute language
    if ((paragraph.includes('dispute') || 
         paragraph.includes('inaccurate') || 
         paragraph.includes('incorrect') || 
         paragraph.includes('investigation') ||
         paragraph.includes('not') ||
         paragraph.includes('error')) && 
        paragraph.length > 30 && 
        paragraph.length < 600) {
      effectiveLanguage.push(paragraph.trim());
    }
  }
  
  return { effectiveLanguage, legalCitations };
};
