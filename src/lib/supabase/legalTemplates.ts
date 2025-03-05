
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
    const referenceText = LEGAL_REFERENCES[referenceType];
    
    if (!referenceText) {
      console.error(`Legal reference ${referenceType} not found`);
      return null;
    }
    
    return referenceText;
  } catch (error) {
    console.error(`Error in fetchLegalReference for ${referenceType}:`, error);
    return null;
  }
}

/**
 * Fetch a specific dispute letter template based on dispute type categories
 * @param disputeCategory The category of dispute (general, account, inquiry, collection)
 * @param disputeType The specific type within the category
 * @returns The template content or null if retrieval failed
 */
export async function fetchDisputeTemplate(
  disputeCategory: keyof typeof DISPUTE_TEMPLATES,
  disputeType: string
): Promise<string | null> {
  try {
    if (!DISPUTE_TEMPLATES[disputeCategory]) {
      console.error(`Dispute category ${disputeCategory} not found`);
      return null;
    }
    
    const templateName = DISPUTE_TEMPLATES[disputeCategory][disputeType as keyof typeof DISPUTE_TEMPLATES[typeof disputeCategory]];
    
    if (!templateName) {
      console.error(`Dispute template ${disputeType} not found in category ${disputeCategory}`);
      return null;
    }
    
    const { data, error } = await supabase
      .storage
      .from(LEGAL_TEMPLATES_BUCKET)
      .download(templateName);
      
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
    'not_my_account': ['fcra_section_611', 'fcra_section_623'],
    'identity_theft': ['fcra_section_611', 'fcra_section_623'],
    'incorrect_balance': ['fcra_section_611', 'fcra_section_623'],
    'incorrect_payment_history': ['fcra_section_611', 'fcra_section_623'],
    'account_closed': ['fcra_section_611', 'fcra_section_623'],
    'incorrect_status': ['fcra_section_611', 'fcra_section_623'],
    'default': ['fcra_section_611', 'fcra_section_609']
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
