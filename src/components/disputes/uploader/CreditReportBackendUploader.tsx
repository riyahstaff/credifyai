
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
      // Reset state
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
      
      // Simulate initial upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 60 ? 60 : newProgress;
        });
      }, 300);
      
      // Always attempt to analyze locally first for reliability
      let reportData;
      setUsingLocalFallback(true);
      
      try {
        console.log("Processing credit report locally...");
        reportData = await processCreditReport(file);
        setUploadProgress(80);
        clearInterval(progressInterval);
      } catch (processingError) {
        console.error("Error processing report locally:", processingError);
        
        // If local processing fails, try external API
        try {
          console.log("Local processing failed, trying external API...");
          setUsingLocalFallback(false);
          
          const response = await analyzeReport(file);
          
          if (response.success) {
            reportData = response.data;
            if (response.isLocalFallback) {
              setUsingLocalFallback(true);
            }
          } else {
            throw new Error(response.error || "API error");
          }
          
          setUploadProgress(90);
        } catch (apiError) {
          console.error("External API also failed:", apiError);
          setUsingLocalFallback(true);
          
          // Last resort: create minimal report data
          reportData = {
            id: `emergency_${Date.now()}`,
            accounts: [],
            issues: [],
            status: 'completed'
          };
          
          toast({
            title: "Processing Issues",
            description: "We encountered some difficulties analyzing your report. Limited functionality may be available.",
            variant: "destructive",
          });
        }
      } finally {
        clearInterval(progressInterval);
      }
      
      // Complete the upload process
      setUploadComplete(true);
      setUploadProgress(100);
      setProcessingStarted(true);
      
      // Show success message
      toast({
        title: "Credit report uploaded",
        description: usingLocalFallback 
          ? "Your credit report is being processed locally."
          : "Your credit report has been processed successfully.",
      });
      
      // Store the report data
      try {
        sessionStorage.setItem('creditReportAnalysis', JSON.stringify(reportData));
        
        // Generate a report ID if needed
        const reportId = reportData.id || `report_${Date.now()}`;
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(reportId);
        }
        
        // Navigate to the dispute letters page after a delay
        setTimeout(() => {
          navigate(APP_ROUTES.DISPUTE_LETTERS);
        }, 2000);
      } catch (storageError) {
        console.error("Error storing analysis results:", storageError);
      }
    } catch (error) {
      console.error("Error in file upload handler:", error);
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
