
/**
 * Dispute Letters Module
 * Contains functions for generating and formatting dispute letters
 */

// Export the letter generation functions
export { 
  generateDisputeLetter,
  generateLettersForIssues,
  generateEnhancedDisputeLetter,
  generateAndStoreDisputeLetters
} from './letterGenerator';

// Export templates
export { 
  issueTemplateMapping,
  bureauAddressMapping,
  legalReferences as templateLegalReferences
} from './templates/issueSpecificTemplates';

/**
 * Get sample dispute language for a specific issue type
 */
export function getSampleDisputeLanguage(issueType: string): string {
  // Map issue type to one of our standard types
  const normalizedType = normalizeIssueType(issueType);
  
  // Sample language by issue type
  const sampleLanguage: Record<string, string> = {
    'personal_info': "I am disputing incorrect personal information on my credit report. My correct information is as follows...",
    'late_payment': "I am disputing the late payments reported on this account. I have always made payments on time as evidenced by...",
    'collection': "I am disputing this collection account as I have no record of owing this debt. The alleged creditor has failed to validate this debt as required by law...",
    'inaccuracy': "I am disputing this account information as it contains factual errors. The correct information is as follows...",
    'student_loan': "I am disputing this student loan account as it appears to be a duplicate. This loan has been transferred to another servicer but is being reported twice...",
    'bankruptcy': "I am disputing this bankruptcy information as it is outdated and should no longer appear on my credit report according to the FCRA...",
    'inquiry': "I am disputing this inquiry as I did not authorize it. This represents an unauthorized access to my credit report...",
    'general': "I am disputing information in my credit report that I believe to be inaccurate. After reviewing my report, I have found several errors that require correction..."
  };
  
  return sampleLanguage[normalizedType] || sampleLanguage.general;
}

/**
 * Normalize issue type to standard categories
 */
function normalizeIssueType(issueType: string): string {
  const type = issueType.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  if (type.includes('personal') || type.includes('name') || type.includes('address') || type.includes('ssn')) {
    return 'personal_info';
  } else if (type.includes('late') || type.includes('payment')) {
    return 'late_payment';
  } else if (type.includes('collect')) {
    return 'collection';
  } else if (type.includes('student') || type.includes('loan')) {
    return 'student_loan';
  } else if (type.includes('bankrupt')) {
    return 'bankruptcy';
  } else if (type.includes('inquir')) {
    return 'inquiry';
  } else if (type.includes('inaccura') || type.includes('wrong') || type.includes('error')) {
    return 'inaccuracy';
  } else {
    return 'general';
  }
}
