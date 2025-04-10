
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  success: boolean;
  reportId?: string;
  message: string;
  error?: any;
}

export const useBackendReportUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedReportId, setUploadedReportId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Upload file to Supabase storage and process it
  const uploadFile = async (file: File): Promise<UploadResult> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload credit reports.",
        variant: "destructive",
      });
      return { success: false, message: "Authentication required" };
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadError(null);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      
      // Initialize the result object
      let result: UploadResult = {
        success: false,
        message: "Upload failed"
      };
      
      try {
        // Call the upload-credit-report edge function
        const { data, error } = await supabase.functions.invoke('upload-credit-report', {
          body: formData
        });
        
        if (error) {
          throw error;
        }
        
        setUploadProgress(70);
        
        if (data?.credit_report_id) {
          setUploadedReportId(data.credit_report_id);
          
          // Check if the report was already processed
          if (data.processing_result) {
            setUploadProgress(100);
            
            result = {
              success: true,
              reportId: data.credit_report_id,
              message: "Credit report uploaded and processed successfully",
            };
            
            toast({
              title: "Report Processed",
              description: "Credit report uploaded and processed successfully",
            });
          } else {
            // Report was uploaded but not yet processed
            setUploadProgress(80);
            
            // Wait for processing completion
            const processingResult = await waitForReportProcessing(data.credit_report_id);
            
            if (processingResult.success) {
              setUploadProgress(100);
              result = {
                success: true,
                reportId: data.credit_report_id,
                message: processingResult.message,
              };
              
              toast({
                title: "Report Processed",
                description: processingResult.message,
              });
            } else {
              setUploadProgress(100);
              setUploadError(processingResult.message);
              result = {
                success: false,
                reportId: data.credit_report_id,
                message: processingResult.message,
                error: processingResult.error
              };
              
              toast({
                title: "Processing Issue",
                description: processingResult.message,
                variant: "destructive",
              });
            }
          }
        } else {
          // No report ID returned
          throw new Error("No report ID returned from upload function");
        }
      } catch (error) {
        console.error("Error during upload:", error);
        
        setUploadProgress(0);
        setUploadError(error instanceof Error ? error.message : "Unknown error");
        
        result = {
          success: false,
          message: "Failed to upload credit report",
          error
        };
        
        toast({
          title: "Upload Failed",
          description: "Failed to upload credit report. Please try again.",
          variant: "destructive",
        });
      }
      
      return result;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Wait for report processing to complete
  const waitForReportProcessing = async (reportId: string): Promise<UploadResult> => {
    try {
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        
        // Wait before checking
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check report status
        const { data: report, error } = await supabase
          .from('credit_reports')
          .select('*')
          .eq('id', reportId)
          .single();
        
        if (error) {
          console.error("Error checking report status:", error);
          continue;
        }

        // Fix: Check each status case separately instead of combining conditions
        if (report.status === 'Processed') {
          // Process "Processed" status separately
          
          // Check if any letters were generated
          const { data: letters, error: lettersError } = await supabase
            .from('dispute_letters')
            .select('*')
            .eq('userId', user?.id)
            .order('createdAt', { ascending: false })
            .limit(10);
          
          if (lettersError) {
            console.error("Error checking for generated letters:", lettersError);
          } else if (letters && letters.length > 0) {
            // Store letters in session storage for the dispute letters page
            console.log(`Found ${letters.length} letters, storing in session storage`);
            sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
            sessionStorage.setItem('forceLettersReload', 'true');
            
            return {
              success: true,
              reportId,
              message: `Credit report processed with ${letters.length} letters generated`
            };
          }
          
          // Report was processed but no letters were found
          return {
            success: true,
            reportId,
            message: "Credit report processed successfully"
          };
        }
        
        // Handle error statuses separately
        if (report.status === 'Error') {
          return {
            success: false,
            reportId,
            message: `Error processing report: ${report.status}`,
            error: report.status
          };
        }
        
        if (report.status === 'Failed') {
          return {
            success: false,
            reportId,
            message: `Error processing report: ${report.status}`,
            error: report.status
          };
        }
        
        // Update progress
        setUploadProgress(80 + (attempts * 2));
      }
      
      // Max attempts reached
      return {
        success: false,
        reportId,
        message: "Report processing timeout. Please check later for results.",
      };
    } catch (error) {
      console.error("Error waiting for report processing:", error);
      
      return {
        success: false,
        reportId,
        message: "Error checking report processing status",
        error
      };
    }
  };
  
  // Handle successful upload in parent component
  const handleUploadSuccess = (reportId: string) => {
    setUploadedReportId(reportId);
    
    // In addition to storing the report ID, also trigger a navigation to dispute letters if available
    checkForDisputeLetters().then(hasLetters => {
      if (hasLetters) {
        // Trigger navigation to dispute letters
        console.log("ANALYSIS_COMPLETE_READY_FOR_NAVIGATION");
      }
    });
  };
  
  // Check if dispute letters exist for the current user
  const checkForDisputeLetters = async (): Promise<boolean> => {
    if (!user) {
      return false;
    }
    
    try {
      const { data: letters } = await supabase
        .from('dispute_letters')
        .select('*')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })
        .limit(10);
      
      if (letters && letters.length > 0) {
        // Store letters in session storage
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking for dispute letters:", error);
      return false;
    }
  };
  
  return {
    uploadFile,
    isUploading,
    uploadProgress,
    uploadedReportId,
    uploadError,
    handleUploadSuccess,
  };
};
