
import { supabase } from './client';
import { 
  LEGAL_TEMPLATES_BUCKET, 
  DISPUTE_TEMPLATES, 
  LEGAL_REFERENCES 
} from './constants';

/**
 * Fetch legal references and FCRA provisions from Supabase storage
 * @param referenceType The type of legal reference to fetch
 * @returns The text content or null if retrieval failed
 */
export async function fetchLegalReference(referenceType: keyof typeof LEGAL_REFERENCES): Promise<string | null> {
  try {
    const fileName = LEGAL_REFERENCES[referenceType];
    
    const { data, error } = await supabase
      .storage
      .from(LEGAL_TEMPLATES_BUCKET)
      .download(fileName);
      
    if (error || !data) {
      console.error(`Error downloading legal reference ${referenceType}:`, error);
      return null;
    }
    
    return await data.text();
  } catch (error) {
    console.error(`Error in fetchLegalReference for ${referenceType}:`, error);
    return null;
  }
}

/**
 * Fetch a specific dispute letter template based on dispute type
 * @param disputeType The type of dispute
 * @returns The template content or null if retrieval failed
 */
export async function fetchDisputeTemplate(disputeType: keyof typeof DISPUTE_TEMPLATES): Promise<string | null> {
  try {
    const fileName = DISPUTE_TEMPLATES[disputeType];
    
    const { data, error } = await supabase
      .storage
      .from(LEGAL_TEMPLATES_BUCKET)
      .download(fileName);
      
    if (error || !data) {
      console.error(`Error downloading dispute template ${disputeType}:`, error);
      return null;
    }
    
    return await data.text();
  } catch (error) {
    console.error(`Error in fetchDisputeTemplate for ${disputeType}:`, error);
    return null;
  }
}

/**
 * Get FCRA sections relevant to a specific dispute type
 * @param disputeType The type of dispute
 * @returns Relevant FCRA sections
 */
export async function getRelevantFCRASections(disputeType: string): Promise<string> {
  // Fixed type mapping to use arrays of valid keys of LEGAL_REFERENCES
  const fcraMapping: Record<string, Array<keyof typeof LEGAL_REFERENCES>> = {
    'not_my_account': ['ACCURACY_REQUIREMENTS', 'INVESTIGATION_PROCEDURES'],
    'identity_theft': ['ACCURACY_REQUIREMENTS', 'INVESTIGATION_PROCEDURES'],
    'incorrect_balance': ['ACCURACY_REQUIREMENTS', 'FURNISHER_RESPONSIBILITIES'],
    'incorrect_payment_history': ['ACCURACY_REQUIREMENTS', 'FURNISHER_RESPONSIBILITIES'],
    'account_closed': ['ACCURACY_REQUIREMENTS', 'FURNISHER_RESPONSIBILITIES'],
    'incorrect_status': ['ACCURACY_REQUIREMENTS', 'FURNISHER_RESPONSIBILITIES'],
    'default': ['DISPUTE_RIGHTS', 'INVESTIGATION_PROCEDURES']
  };
  
  const normalizedType = disputeType.toLowerCase().replace(/\s+/g, '_');
  const relevantSections = fcraMapping[normalizedType] || fcraMapping['default'];
  
  let combinedText = '';
  
  for (const section of relevantSections) {
    const sectionText = await fetchLegalReference(section);
    if (sectionText) {
      combinedText += `${sectionText}\n\n`;
    }
  }
  
  return combinedText || "Section 611 of the FCRA requires consumer reporting agencies to conduct a reasonable investigation into any disputed information.";
}
