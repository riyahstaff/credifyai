import { supabase } from './client';
import { 
  SAMPLE_LETTERS_BUCKET, 
  LEGAL_TEMPLATES_BUCKET, 
  DISPUTE_TEMPLATES, 
  LEGAL_REFERENCES 
} from './constants';

/**
 * Fetch a list of all sample dispute letters available in Supabase storage
 */
export async function listSampleDisputeLetters() {
  try {
    const { data, error } = await supabase
      .storage
      .from(SAMPLE_LETTERS_BUCKET)
      .list();
      
    if (error) {
      console.error('Error fetching sample dispute letters from Supabase:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in listSampleDisputeLetters:', error);
    return [];
  }
}

/**
 * Download a specific sample dispute letter from Supabase storage
 * @param fileName The name of the file to download
 * @returns The text content or null if download failed
 */
export async function downloadSampleDisputeLetter(fileName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .storage
      .from(SAMPLE_LETTERS_BUCKET)
      .download(fileName);
      
    if (error || !data) {
      console.error('Error downloading sample dispute letter from Supabase:', error);
      return null;
    }
    
    // Convert blob to text
    return await data.text();
  } catch (error) {
    console.error('Error in downloadSampleDisputeLetter:', error);
    return null;
  }
}

/**
 * Download a legal template from Supabase storage
 * @param templateName The name of the template to download
 * @returns The text content or null if download failed
 */
export async function downloadLegalTemplate(templateName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .storage
      .from(LEGAL_TEMPLATES_BUCKET)
      .download(`${templateName}.txt`);
      
    if (error || !data) {
      console.error('Error downloading legal template from Supabase:', error);
      return null;
    }
    
    // Convert blob to text
    return await data.text();
  } catch (error) {
    console.error('Error in downloadLegalTemplate:', error);
    return null;
  }
}

/**
 * Save a dispute letter to the user's account
 * @param userId The user's ID
 * @param disputeData The dispute letter data
 */
export async function saveDisputeLetter(userId: string, disputeData: any) {
  try {
    const { error } = await supabase
      .from('dispute_letters')
      .insert({
        user_id: userId,
        bureau: disputeData.bureau,
        account_name: disputeData.accountName,
        account_number: disputeData.accountNumber,
        error_type: disputeData.errorType,
        explanation: disputeData.explanation,
        letter_content: disputeData.letterContent,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error saving dispute letter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveDisputeLetter:', error);
    return false;
  }
}

/**
 * Get all dispute letters for a specific user
 * @param userId The user's ID
 * @returns An array of dispute letters
 */
export async function getUserDisputeLetters(userId: string) {
  try {
    const { data, error } = await supabase
      .from('dispute_letters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user dispute letters:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserDisputeLetters:', error);
    return [];
  }
}

/**
 * Get successful dispute examples for specific issue types
 * @param disputeType The type of dispute
 * @returns An array of successful dispute examples
 */
export async function getSuccessfulDisputeExamples(disputeType: string): Promise<string[]> {
  try {
    // Directory structure like: /successful-disputes/incorrect-balance/
    const path = `successful-disputes/${disputeType.toLowerCase().replace(/_/g, '-')}`;
    
    const { data, error } = await supabase
      .storage
      .from(SAMPLE_LETTERS_BUCKET)
      .list(path);
      
    if (error || !data) {
      console.error(`Error listing successful dispute examples for ${disputeType} from Supabase:`, error);
      return [];
    }
    
    // Download and collect all example texts
    const examples: string[] = [];
    
    for (const file of data) {
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from(SAMPLE_LETTERS_BUCKET)
        .download(`${path}/${file.name}`);
        
      if (!fileError && fileData) {
        examples.push(await fileData.text());
      }
    }
    
    return examples;
  } catch (error) {
    console.error(`Error getting successful dispute examples for ${disputeType} from Supabase:`, error);
    return [];
  }
}

/**
 * List available dispute templates by category
 * @returns An object with template categories and their templates
 */
export async function listDisputeTemplates() {
  try {
    // In a real implementation, this would fetch from Supabase
    return DISPUTE_TEMPLATES;
  } catch (error) {
    console.error('Error listing dispute templates:', error);
    return {};
  }
}

/**
 * Get legal reference text for a specific law or regulation
 * @param referenceKey The key for the legal reference (e.g., 'fcra_section_611')
 * @returns The legal reference text or null if not found
 */
export async function getLegalReference(referenceKey: string): Promise<string | null> {
  try {
    // In a real implementation, this would fetch from Supabase
    return LEGAL_REFERENCES[referenceKey] || null;
  } catch (error) {
    console.error(`Error getting legal reference for ${referenceKey}:`, error);
    return null;
  }
}
