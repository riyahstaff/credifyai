
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export function useBackendReportUpload() {
  const { toast } = useToast();
  const [uploadingBackend, setUploadingBackend] = useState(false);
  const [uploadedReportId, setUploadedReportId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [letters, setLetters] = useState<any[]>([]);
  const [loadingLetters, setLoadingLetters] = useState(false);
  
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
    handleUploadSuccess,
    fetchDisputeLetters,
    resetUpload,
  };
}
