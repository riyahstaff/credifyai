/**
 * Template Manager
 * Loads and manages dispute letter templates
 */

import { issueTemplateMapping, bureauAddressMapping, legalReferences } from './templates/issueSpecificTemplates';
import { collectionAccountTemplates } from './templates/collection_account_disputes';

/**
 * Get the appropriate template for a specific issue type
 */
export function getTemplateForIssueType(issueType: string): string {
  console.log(`Getting template for issue type: ${issueType}`);
  
  // First check collection account templates for collection issues
  if (issueType.toLowerCase().includes('collection')) {
    const collectionTemplate = collectionAccountTemplates[issueType] || collectionAccountTemplates.default;
    if (collectionTemplate) {
      console.log(`Using collection account specific template for ${issueType}`);
      return collectionTemplate;
    }
  }
  
  // Otherwise use the standard template mapping
  const normalizedType = issueType.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  console.log(`Normalized type: ${normalizedType}`);
  
  // Try to find an exact match
  if (issueTemplateMapping[normalizedType]) {
    return issueTemplateMapping[normalizedType];
  }
  
  // Look for partial matches
  for (const key of Object.keys(issueTemplateMapping)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      console.log(`Found partial template match: ${key}`);
      return issueTemplateMapping[key];
    }
  }
  
  // Default to a general template
  console.log("No specific template found, using general template");
  return issueTemplateMapping.general;
}

/**
 * Get bureau address from template
 */
export function getBureauAddress(bureau: string): string {
  const normalizedBureau = bureau.toLowerCase().replace(/[^a-z]/g, '');
  
  // Try to find an exact match
  if (bureauAddressMapping[normalizedBureau]) {
    return bureauAddressMapping[normalizedBureau];
  }
  
  // Look for partial matches
  for (const key of Object.keys(bureauAddressMapping)) {
    if (normalizedBureau.includes(key) || key.includes(normalizedBureau)) {
      return bureauAddressMapping[key];
    }
  }
  
  // Default to a generic address
  return 'Credit Bureau\nP.O. Box 123456\nSome City, ST 12345';
}

/**
 * Get legal references for a specific issue type
 */
export function getLegalReferencesForIssueType(issueType: string) {
  const normalizedType = issueType.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // Try to find an exact match
  if (legalReferences[normalizedType]) {
    return legalReferences[normalizedType];
  }
  
  // Look for partial matches
  for (const key of Object.keys(legalReferences)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return legalReferences[key];
    }
  }
  
  // Default to general references
  return legalReferences.general;
}
