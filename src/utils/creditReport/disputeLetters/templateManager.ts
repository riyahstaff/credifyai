
/**
 * Letter Template Manager
 * Handles loading, storing, and retrieving letter templates
 */

import { collectionAccountDisputeTemplate } from './templates';
import { supabase } from '@/lib/supabase/client';

// Define types
export interface LetterTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  bureau?: string;
}

/**
 * Get a specific letter template by type
 * @param templateType The type of letter template to retrieve
 * @returns The requested letter template
 */
export async function getLetterTemplate(templateType: string): Promise<LetterTemplate | null> {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('letter_templates')
      .select('*')
      .eq('issue_type', templateType)
      .single();
    
    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        type: data.issue_type,
        content: data.content,
      };
    }
    
    // If not found in database, use built-in templates
    return getBuiltInTemplate(templateType);
  } catch (error) {
    console.error('Error fetching letter template:', error);
    
    // Fallback to built-in templates
    return getBuiltInTemplate(templateType);
  }
}

/**
 * Get a built-in template
 * @param templateType The type of template to retrieve
 * @returns The requested built-in template
 */
function getBuiltInTemplate(templateType: string): LetterTemplate | null {
  const templateMap: Record<string, { content: string, name: string }> = {
    'collection_account': {
      name: 'Collection Account Dispute',
      content: collectionAccountDisputeTemplate
    },
    // Add more templates here as they are created
  };
  
  const template = templateMap[templateType];
  
  if (!template) {
    console.warn(`No built-in template found for type: ${templateType}`);
    return null;
  }
  
  return {
    id: `built-in-${templateType}`,
    name: template.name,
    type: templateType,
    content: template.content
  };
}

/**
 * Save a letter template to the database
 * @param template The template to save
 * @returns Whether the save operation was successful
 */
export async function saveLetterTemplate(template: LetterTemplate): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('letter_templates')
      .insert({
        name: template.name,
        issue_type: template.type,
        content: template.content
      });
    
    if (error) {
      console.error('Error saving letter template:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving letter template:', error);
    return false;
  }
}

/**
 * Get all available letter templates
 * @returns Array of all available templates
 */
export async function getAllLetterTemplates(): Promise<LetterTemplate[]> {
  try {
    // Fetch from database
    const { data, error } = await supabase
      .from('letter_templates')
      .select('*');
    
    if (error) {
      console.error('Error fetching letter templates:', error);
      return getBuiltInTemplates();
    }
    
    // Convert to LetterTemplate format
    const dbTemplates = data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.issue_type,
      content: item.content
    }));
    
    // Merge with built-in templates (prioritizing DB versions)
    const builtInTemplates = getBuiltInTemplates();
    const dbTemplateTypes = dbTemplates.map(t => t.type);
    
    // Only include built-in templates that don't exist in the database
    const uniqueBuiltInTemplates = builtInTemplates.filter(
      t => !dbTemplateTypes.includes(t.type)
    );
    
    return [...dbTemplates, ...uniqueBuiltInTemplates];
  } catch (error) {
    console.error('Error fetching letter templates:', error);
    return getBuiltInTemplates();
  }
}

/**
 * Get all built-in templates
 * @returns Array of all built-in templates
 */
function getBuiltInTemplates(): LetterTemplate[] {
  return [
    {
      id: 'built-in-collection_account',
      name: 'Collection Account Dispute',
      type: 'collection_account',
      content: collectionAccountDisputeTemplate
    }
    // Add more built-in templates as they are created
  ];
}
