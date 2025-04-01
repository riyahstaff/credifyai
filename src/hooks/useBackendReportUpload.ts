
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export function useBackendReportUpload() {
  const { toast } = useToast();
  const [uploadingBackend, setUploadingBackend] = useState(false);
  const [uploadedReportId, setUploadedReportId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [letters, setLetters] = useState<any[]>([]);
  const [loadingLetters, setLoadingLetters] = useState(false);
  
  const uploadToBackend = async (file: File) => {
    try {
      setUploadingBackend(true);
      setUploadError(null);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to upload credit reports to the cloud.');
      }
      
      // Create form data for the file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      
      // Call the upload-credit-report function
      const { data, error } = await supabase.functions.invoke(
        'upload-credit-report',
        {
          body: formData
        }
      );
      
      if (error) {
        throw error;
      }
      
      console.log('Upload success:', data);
      
      if (data.credit_report_id) {
        setUploadedReportId(data.credit_report_id);
        toast({
          title: 'Report uploaded successfully',
          description: 'Your credit report is being processed. Results will be available shortly.',
        });
        
        // Call the function to fetch dispute letters
        fetchDisputeLetters();
        
        return data.credit_report_id;
      } else {
        throw new Error('No credit report ID returned from the server.');
      }
    } catch (error) {
      console.error('Error uploading credit report:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload credit report');
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload credit report',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingBackend(false);
    }
  };
  
  const handleUploadSuccess = (reportId: string) => {
    setUploadedReportId(reportId);
    fetchDisputeLetters();
  };
  
  const fetchDisputeLetters = async () => {
    try {
      setLoadingLetters(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to fetch dispute letters.');
      }
      
      // Call the get-dispute-letters function
      const { data, error } = await supabase.functions.invoke(
        'get-dispute-letters',
        {
          body: { userId: user.id },
        }
      );
      
      if (error) {
        throw error;
      }
      
      if (data?.letters) {
        setLetters(data.letters);
        
        // Store user information from letters in localStorage if available
        storeUserInfoFromLetters(data.letters);
      }
    } catch (error) {
      console.error('Error fetching dispute letters:', error);
      toast({
        title: 'Error fetching letters',
        description: error instanceof Error ? error.message : 'Failed to fetch dispute letters',
        variant: 'destructive',
      });
    } finally {
      setLoadingLetters(false);
    }
  };
  
  // Helper function to extract and store user information from letters
  const storeUserInfoFromLetters = (letters: any[]) => {
    if (!letters || letters.length === 0) return;
    
    try {
      // Get the first letter content to extract user info
      const letterContent = letters[0].letter_content;
      
      if (!letterContent) return;
      
      // Extract name
      const nameMatch = letterContent.match(/^([A-Za-z\s\.]{2,50}?)(?:\n|\r|,)/);
      if (nameMatch && nameMatch[1] && nameMatch[1].trim().length > 3) {
        localStorage.setItem('userName', nameMatch[1].trim());
      }
      
      // Extract address, city, state, zip
      const addressMatch = letterContent.match(/^[A-Za-z\s\.]{2,50}?\n(.*?)(?:\n|\r)/);
      if (addressMatch && addressMatch[1]) {
        const addressLine = addressMatch[1].trim();
        
        // Try to parse address, city, state, zip
        const cityStateZipMatch = addressLine.match(/^(.*?),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/);
        if (cityStateZipMatch) {
          localStorage.setItem('userAddress', cityStateZipMatch[1].trim());
          localStorage.setItem('userCity', cityStateZipMatch[2].trim());
          localStorage.setItem('userState', cityStateZipMatch[3].trim());
        } else {
          localStorage.setItem('userAddress', addressLine);
        }
      }
      
      console.log('Stored user information from generated letters');
    } catch (error) {
      console.error('Error extracting user info from letters:', error);
    }
  };
  
  // Load existing letters on mount
  useEffect(() => {
    if (supabase) {
      fetchDisputeLetters();
    }
  }, []);
  
  const resetUpload = () => {
    setUploadedReportId(null);
    setUploadError(null);
  };
  
  return {
    uploadingBackend,
    uploadedReportId,
    uploadError,
    letters,
    loadingLetters,
    uploadToBackend,
    handleUploadSuccess,
    fetchDisputeLetters,
    resetUpload,
  };
}
