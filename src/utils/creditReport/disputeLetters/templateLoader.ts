
import { 
  issueTemplateMapping, 
  generalDisputeTemplate 
} from './templates/issueSpecificTemplates';

/**
 * Get the template for a specific issue type
 */
export async function getTemplateForIssueType(issueType: string): Promise<string> {
  // Normalize issue type
  const normalizedType = normalizeIssueType(issueType);
  
  // Get the appropriate template
  const template = issueTemplateMapping[normalizedType] || generalDisputeTemplate;
  
  return template;
}

/**
 * Normalize issue type to a standard format
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
