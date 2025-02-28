
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
