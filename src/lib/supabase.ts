
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables injected by Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Supabase credentials missing. Make sure you have connected your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

// User session context
export type UserSession = {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  isLoading: boolean;
}

// Sample credit reports related functions
export const SAMPLE_REPORTS_BUCKET = 'sample-credit-reports';
export const SAMPLE_LETTERS_BUCKET = 'sample-dispute-letters';
export const LEGAL_TEMPLATES_BUCKET = 'legal-templates';

// Dispute letter templates categorized by reason
export const DISPUTE_TEMPLATES = {
  IDENTITY_THEFT: 'identity_theft_template.txt',
  NOT_MY_ACCOUNT: 'not_my_account_template.txt',
  INCORRECT_BALANCE: 'incorrect_balance_template.txt',
  INCORRECT_PAYMENT_HISTORY: 'incorrect_payment_history_template.txt',
  INCORRECT_STATUS: 'incorrect_status_template.txt',
  ACCOUNT_CLOSED: 'account_closed_template.txt',
  GENERAL_DISPUTE: 'general_dispute_template.txt',
  FCRA_VIOLATION: 'fcra_violation_template.txt',
};

// FCRA and legal reference sections
export const LEGAL_REFERENCES = {
  ACCURACY_REQUIREMENTS: 'fcra_accuracy_requirements.txt',
  INVESTIGATION_PROCEDURES: 'fcra_investigation_procedures.txt',
  DISPUTE_RIGHTS: 'fcra_dispute_rights.txt',
  FURNISHER_RESPONSIBILITIES: 'fcra_furnisher_resp.txt',
  COMMON_VIOLATIONS: 'fcra_common_violations.txt',
};

/**
 * Fetch a list of all sample credit reports available in Supabase storage
 */
export async function listSampleReports() {
  try {
    const { data, error } = await supabase
      .storage
      .from(SAMPLE_REPORTS_BUCKET)
      .list();
      
    if (error) {
      console.error('Error fetching sample reports:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in listSampleReports:', error);
    return [];
  }
}

/**
 * Download a specific sample credit report from Supabase storage
 * @param fileName The name of the file to download
 * @returns The File object or null if download failed
 */
export async function downloadSampleReport(fileName: string): Promise<File | null> {
  try {
    const { data, error } = await supabase
      .storage
      .from(SAMPLE_REPORTS_BUCKET)
      .download(fileName);
      
    if (error || !data) {
      console.error('Error downloading sample report:', error);
      return null;
    }
    
    // Convert blob to File object
    return new File([data], fileName, { 
      type: fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain' 
    });
  } catch (error) {
    console.error('Error in downloadSampleReport:', error);
    return null;
  }
}

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
      console.error('Error fetching sample dispute letters:', error);
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
      console.error('Error downloading sample dispute letter:', error);
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
 * Get the public URL for a sample credit report
 * @param fileName The name of the file
 * @returns The public URL for the file
 */
export function getSampleReportUrl(fileName: string): string {
  const { data } = supabase
    .storage
    .from(SAMPLE_REPORTS_BUCKET)
    .getPublicUrl(fileName);
    
  return data.publicUrl;
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
      console.error(`Error listing successful dispute examples for ${disputeType}:`, error);
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
    console.error(`Error getting successful dispute examples for ${disputeType}:`, error);
    return [];
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
 * Enhanced function to generate comprehensive dispute letters using templates and FCRA provisions
 * @param disputeType Type of dispute (identity theft, incorrect balance, etc.)
 * @param accountDetails Details about the account being disputed
 * @param userInfo User's personal information
 * @returns Generated dispute letter
 */
export async function generateEnhancedDisputeLetter(
  disputeType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<string> {
  try {
    // Normalize dispute type to match our template keys
    let templateType: keyof typeof DISPUTE_TEMPLATES = 'GENERAL_DISPUTE';
    
    const normalizedDispute = disputeType.toLowerCase();
    if (normalizedDispute.includes('not') && normalizedDispute.includes('mine')) {
      templateType = 'NOT_MY_ACCOUNT';
    } else if (normalizedDispute.includes('identity') || normalizedDispute.includes('fraud')) {
      templateType = 'IDENTITY_THEFT';
    } else if (normalizedDispute.includes('balance')) {
      templateType = 'INCORRECT_BALANCE';
    } else if (normalizedDispute.includes('payment') || normalizedDispute.includes('late')) {
      templateType = 'INCORRECT_PAYMENT_HISTORY';
    } else if (normalizedDispute.includes('status')) {
      templateType = 'INCORRECT_STATUS';
    } else if (normalizedDispute.includes('closed')) {
      templateType = 'ACCOUNT_CLOSED';
    }
    
    // Fetch the appropriate template
    let letterTemplate = await fetchDisputeTemplate(templateType);
    
    // Fall back to general template if specific one isn't available
    if (!letterTemplate) {
      letterTemplate = await fetchDisputeTemplate('GENERAL_DISPUTE');
    }
    
    // Get relevant FCRA sections
    const fcraSections = await getRelevantFCRASections(templateType);
    
    // Get successful dispute examples
    const successfulExamples = await getSuccessfulDisputeExamples(templateType);
    
    // Use a successful example if available
    let additionalLanguage = '';
    if (successfulExamples.length > 0) {
      // Extract the most relevant paragraph from a successful example
      const example = successfulExamples[0];
      const paragraphs = example.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.length > 30 && paragraph.length < 300) {
          // Find a reasonably sized, relevant paragraph
          additionalLanguage = paragraph;
          break;
        }
      }
    }
    
    // Generate full letter with all components
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Bureau addresses
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureau = accountDetails.bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
    
    // Base letter template to use if no specific template is available
    const baseTemplate = `
${userInfo.name || '[YOUR NAME]'}
${userInfo.address || '[YOUR ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${currentDate}

${accountDetails.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information in Credit Report

Account Name: ${accountDetails.accountName}
Account Number: ${accountDetails.accountNumber || '[ACCOUNT NUMBER]'}
Reason for Dispute: ${disputeType}

To Whom It May Concern:

This letter is to formally dispute inaccurate information appearing on my credit report. I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), specifically Section 611(a).

Information being disputed:
The ${disputeType.toLowerCase()} for the account listed above is being reported inaccurately. ${accountDetails.errorDescription}

${additionalLanguage ? `Detailed explanation:\n${additionalLanguage}\n\n` : ''}

Legal basis for dispute:
${fcraSections}

Under the FCRA, you are required to conduct a reasonable investigation into this matter and correct or delete any information that cannot be verified. Please note that according to the FCRA:

1. You must complete your investigation within 30 days (or 45 days if I provide additional information during the 30-day period).
2. You must forward all relevant information to the furnisher of this information for verification.
3. You must provide me with the results of your investigation and a free copy of my credit report if changes are made.
4. If information is changed or deleted, you cannot reinsert it without notifying me.

I request that you:
- Conduct a thorough investigation of this disputed information
- Remove the inaccurate information from my credit report
- Provide me with written confirmation of the results of your investigation

If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

${userInfo.name || '[YOUR SIGNATURE]'}

Enclosures:
- Copy of credit report with disputed item highlighted
- [SUPPORTING DOCUMENTATION PLACEHOLDER]
`;

    // Use the specific template if available, otherwise use the base template
    let finalLetter = letterTemplate || baseTemplate;
    
    // Replace placeholders with actual values
    finalLetter = finalLetter
      .replace(/\[FULL_NAME\]|\[YOUR_NAME\]|\[NAME\]/g, userInfo.name || '[YOUR NAME]')
      .replace(/\[ADDRESS\]|\[YOUR_ADDRESS\]/g, userInfo.address || '[YOUR ADDRESS]')
      .replace(/\[CITY\]/g, userInfo.city || '[CITY]')
      .replace(/\[STATE\]/g, userInfo.state || '[STATE]')
      .replace(/\[ZIP\]/g, userInfo.zip || '[ZIP]')
      .replace(/\[DATE\]|\[CURRENT_DATE\]/g, currentDate)
      .replace(/\[BUREAU\]/g, accountDetails.bureau)
      .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
      .replace(/\[ACCOUNT_NAME\]/g, accountDetails.accountName)
      .replace(/\[ACCOUNT_NUMBER\]/g, accountDetails.accountNumber || '[ACCOUNT NUMBER]')
      .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, disputeType)
      .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, accountDetails.errorDescription)
      .replace(/\[FCRA_SECTIONS\]/g, fcraSections)
      .replace(/\[ADDITIONAL_LANGUAGE\]/g, additionalLanguage);
    
    return finalLetter;
  } catch (error) {
    console.error('Error generating enhanced dispute letter:', error);
    // Return a simplified letter as fallback
    return `
${userInfo.name || '[YOUR NAME]'}
${userInfo.address || '[YOUR ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${new Date().toLocaleDateString()}

${accountDetails.bureau}
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Information

To Whom It May Concern:

I am writing to dispute the following information in my credit report:

Account Name: ${accountDetails.accountName}
Account Number: ${accountDetails.accountNumber || '[ACCOUNT NUMBER]'}
Reason for Dispute: ${disputeType}

This information is inaccurate because: ${accountDetails.errorDescription}

Under Section 611 of the Fair Credit Reporting Act, you are required to investigate this dispute and remove information that cannot be verified.

Sincerely,

${userInfo.name || '[YOUR NAME]'}
`;
  }
}

// Application routes
export const APP_ROUTES = {
  DASHBOARD: '/dashboard',
  DISPUTE_LETTERS: '/dispute-letters',
  CREATE_DISPUTE: '/dispute-letters/new', // Changed back to the correct route
  UPLOAD_REPORT: '/upload-report',
  EDUCATION: '/education',
  LOGIN: '/login',
  SIGNUP: '/signup'
};

