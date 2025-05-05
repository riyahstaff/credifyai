
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileUp, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/lib/supabase/client';
import { analyzeReport } from '@/services/externalBackendService';
import { processCreditReport } from '@/utils/creditReport/processor';
import { generateDisputeLetters } from '@/utils/creditReport/disputeLetters/letterGenerator';

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
      setUploadProgress(10);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 50 ? 50 : newProgress;
        });
      }, 300);
      
      // Always process locally first (parallel to API call)
      console.log("Starting local processing as a fallback");
      const localProcessPromise = processCreditReport(file).catch(err => {
        console.error("Local processing failed:", err);
        return null;
      });
      
      // Try API call first, but don't wait too long
      console.log("Trying external API analysis");
      let reportData;
      try {
        const response = await analyzeReport(file);
        
        if (response.success && response.data) {
          reportData = response.data;
          setUsingLocalFallback(!!response.isLocalFallback);
          console.log("API analysis successful, using API result");
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (apiError) {
        console.warn("API analysis failed, falling back to local processing");
        
        // Wait for local processing result
        const localResult = await localProcessPromise;
        if (localResult) {
          reportData = {
            id: `local_${Date.now()}`,
            accounts: localResult.accounts || [],
            issues: localResult.issues || [],
            status: 'completed',
            processingMethod: 'local'
          };
          setUsingLocalFallback(true);
        } else {
          // Both API and local processing failed - create minimal report
          reportData = {
            id: `emergency_${Date.now()}`,
            accounts: [],
            issues: [],
            status: 'completed',
            processingMethod: 'emergency'
          };
          setUsingLocalFallback(true);
          
          toast({
            title: "Processing Issues",
            description: "Continuing with limited functionality. Some features may not work properly.",
            variant: "destructive",
          });
        }
      } finally {
        clearInterval(progressInterval);
      }
      
      // Complete the upload process
      setUploadProgress(90);
      setUploadComplete(true);
      setProcessingStarted(true);
      
      // Generate dispute letters directly
      const generateLetters = async () => {
        try {
          console.log("Generating dispute letters from report data");
          
          // Clear any existing letters first
          sessionStorage.removeItem('generatedDisputeLetters');
          sessionStorage.removeItem('pendingDisputeLetter');
          
          // Store the report data for future use
          sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
          sessionStorage.setItem('reportReadyForLetters', 'true');
          
          // Generate letters for issues or accounts if no issues found
          let letters = [];
          if (reportData.issues && reportData.issues.length > 0) {
            console.log(`Generating letters for ${reportData.issues.length} issues`);
            letters = await generateDisputeLetters(reportData);
          } else if (reportData.accounts && reportData.accounts.length > 0) {
            console.log(`No issues found, generating sample letter for account`);
            // Generate a sample letter for the first account
            const sampleIssue = {
              id: `sample_${Date.now()}`,
              type: 'inaccurate_information',
              description: 'Potentially inaccurate account information',
              accountName: reportData.accounts[0].accountName,
              accountNumber: reportData.accounts[0].accountNumber,
              bureau: 'equifax',
              severity: 'medium'
            };
            
            reportData.issues = [sampleIssue];
            letters = await generateDisputeLetters(reportData);
          }
          
          if (letters && letters.length > 0) {
            console.log(`Successfully generated ${letters.length} dispute letters`);
            sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
            
            toast({
              title: "Dispute Letters Generated",
              description: `Successfully generated ${letters.length} dispute letters.`,
            });
          } else {
            console.warn("No letters were generated");
            // Create a fallback letter
            const fallbackLetter = {
              id: Date.now(),
              title: "General Dispute Letter",
              recipient: "Credit Bureau",
              createdAt: new Date().toLocaleDateString(),
              status: "draft",
              bureaus: ["equifax"],
              content: `
Dear Credit Bureau,

I am writing to dispute information in my credit report. After reviewing my credit report, I have found inaccuracies that I would like to be investigated and corrected.

In accordance with the Fair Credit Reporting Act, please investigate the following information and remove it from my credit report:

[DESCRIBE SPECIFIC ACCOUNTS OR INFORMATION TO DISPUTE]

Please investigate these matters and correct my credit report accordingly.

Sincerely,
[YOUR NAME]
              `.trim(),
              accountName: reportData.accounts?.[0]?.accountName || "Unknown Account",
              accountNumber: reportData.accounts?.[0]?.accountNumber || "",
              errorType: "inaccurate_information"
            };
            
            sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(fallbackLetter));
            console.log("Stored fallback letter in session storage");
            
            toast({
              title: "Basic Dispute Letter Created",
              description: "A template letter has been created. You'll need to customize it with your specific dispute information.",
            });
          }
          
          // Force letter generation flag
          sessionStorage.setItem('forceLetterGeneration', 'true');
          sessionStorage.removeItem('lettersAlreadyLoaded');
          
          // Update progress to 100%
          setUploadProgress(100);
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(reportData.id);
          }
          
          // Navigate to the dispute letters page after a delay
          setTimeout(() => {
            navigate(APP_ROUTES.DISPUTE_LETTERS);
          }, 2000);
          
        } catch (error) {
          console.error("Error generating dispute letters:", error);
          toast({
            title: "Error Generating Letters",
            description: "There was a problem generating dispute letters.",
            variant: "destructive",
          });
        }
      };
      
      // Start letter generation process
      generateLetters();
      
    } catch (error) {
      console.error("Error in file upload handler:", error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsUploading(false);
      
      toast({
        title: "Upload failed",
        description: "Please try the 'Process Locally' option instead.",
        variant: "destructive",
      });
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
