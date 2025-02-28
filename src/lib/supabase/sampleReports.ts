
import { supabase } from './client';
import { SAMPLE_REPORTS_BUCKET } from './constants';

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
