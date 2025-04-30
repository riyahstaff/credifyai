
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileUp, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/supabase/client';
import { analyzeReport } from '@/services/externalBackendService';
import { processCreditReport } from '@/utils/creditReport/processor';

interface CreditReportBackendUploaderProps {
  onSuccess?: (reportId: string) => void;
  testMode?: boolean;
}

const CreditReportBackendUploader: React.FC<CreditReportBackendUploaderProps> = ({ 
  onSuccess,
  testMode = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processingStarted, setProcessingStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);
  
  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      setUploadComplete(false);
      setProcessingStarted(false);
      setUsingLocalFallback(false);
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        setIsUploading(false);
        toast({
          title: "File too large",
          description: "The selected file exceeds the 10MB size limit.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'txt', 'html', 'htm'].includes(fileExtension || '')) {
        setError('Invalid file type. Please upload a PDF, TXT, or HTML file.');
        setIsUploading(false);
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, TXT, or HTML file from a credit bureau.",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      // First attempt with external API
      console.log("Attempting to analyze report using external API");
      let response = await analyzeReport(file);
      
      clearInterval(progressInterval);
      
      // If external API fails or returns a local fallback, try local processing
      if (!response.success || response.isLocalFallback) {
        console.log("External API unavailable, using local processing");
        setUsingLocalFallback(true);
        
        try {
          // Process the file locally
          const reportData = await processCreditReport(file);
          
          // Create a mock response structure
          response = {
            success: true,
            data: {
              id: `local_${Date.now()}`,
              ...reportData,
              // Add any other fields needed for compatibility
            },
            isLocalFallback: true
          };
          
          toast({
            title: "Using Local Processing",
            description: "External API unavailable. Processing your report locally.",
            variant: "default"
          });
        } catch (localError) {
          console.error("Local processing failed:", localError);
          throw new Error(`Local processing failed: ${localError instanceof Error ? localError.message : "Unknown error"}`);
        }
      }
      
      setUploadComplete(true);
      setUploadProgress(100);
      setProcessingStarted(true);
      
      // Show success message
      toast({
        title: "Credit report uploaded",
        description: usingLocalFallback 
          ? "Your credit report is being processed locally."
          : "Your credit report is being processed. This may take a few moments.",
      });
      
      if (response.data?.id) {
        // Store the analysis results in session storage for use in letter generation
        try {
          sessionStorage.setItem('creditReportAnalysis', JSON.stringify(response.data));
          
          // Extract reportId from response
          const reportId = response.data.id;
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(reportId);
          }
          
          // Navigate to the dispute letters page after a delay
          setTimeout(() => {
            navigate(APP_ROUTES.DISPUTE_LETTERS);
          }, 3000);
        } catch (storageError) {
          console.error("Error storing analysis results:", storageError);
        }
      }
    } catch (error) {
      console.error("Error uploading credit report:", error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-lg p-6 text-center">
      <div className="w-16 h-16 mx-auto bg-credify-teal/10 rounded-full flex items-center justify-center mb-4">
        {uploadComplete ? (
          <CheckCircle className="text-green-500" size={24} />
        ) : (
          <Upload className="text-credify-teal" size={24} />
        )}
      </div>
      
      <h4 className="text-lg font-medium text-credify-navy dark:text-white mb-2">
        {uploadComplete ? 'Credit Report Uploaded!' : 'Upload Your Credit Report'}
        {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
      </h4>
      
      <p className="text-credify-navy-light dark:text-white/70 text-sm mb-6 max-w-md mx-auto">
        {uploadComplete
          ? usingLocalFallback 
            ? 'Your credit report is being processed locally. You will be redirected to the dispute letters page shortly.'
            : 'Your credit report is being processed. You will be redirected to the dispute letters page shortly.'
          : 'Upload a credit report PDF or text file to analyze and generate personalized dispute letters.'}
      </p>
      
      {isUploading && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div 
              className="h-full bg-credify-teal rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-credify-navy-light dark:text-white/70">
            {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={16} />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {!uploadComplete && (
        <div className="relative inline-block">
          <input
            type="file"
            accept=".pdf,.txt,.text,.html,.htm"
            onChange={handleFileSelected}
            className="absolute inset-0 opacity-0 w-full cursor-pointer"
            disabled={isUploading}
          />
          <button
            disabled={isUploading}
            className="px-6 py-3 bg-credify-teal hover:bg-credify-teal-dark text-white rounded-lg transition-colors flex items-center gap-2 justify-center"
          >
            {isUploading ? (
              <>
                <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FileUp size={18} />
                <span>Select Report File</span>
              </>
            )}
          </button>
        </div>
      )}
      
      {!isUploading && !uploadComplete && (
        <p className="mt-4 text-xs text-credify-navy-light dark:text-white/60">
          Supports PDF and text files from Experian, Equifax, and TransUnion
        </p>
      )}
      
      {uploadComplete && processingStarted && (
        <div className="flex justify-center mt-4">
          <p className="text-sm text-credify-teal flex items-center gap-1">
            <span className="h-2 w-2 bg-credify-teal rounded-full animate-pulse"></span>
            Processing your report{usingLocalFallback ? ' locally' : ''}...
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditReportBackendUploader;
