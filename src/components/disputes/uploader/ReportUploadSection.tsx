
import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ReportUploadSectionProps {
  isUploading: boolean;
  onFileSelected: (file: File) => void;
}

const ReportUploadSection: React.FC<ReportUploadSectionProps> = ({
  isUploading,
  onFileSelected
}) => {
  const [fileInfo, setFileInfo] = useState<{ name: string; type: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'error' | 'network-error'>('idle');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`File selected: ${file.name} (${file.type}), size: ${file.size}`);
      setFileInfo({ name: file.name, type: file.type });
      
      // Validate file
      if (isValidFileType(file)) {
        setStatus('ready');
        
        // Check for network connectivity
        if (!navigator.onLine) {
          console.warn("Network appears to be offline, but proceeding with file selection");
          setStatus('network-error');
        }
        
        onFileSelected(file);
      } else {
        setStatus('error');
        console.error("Invalid file type selected");
        // We don't call onFileSelected for invalid files
      }
    }
  };
  
  const isValidFileType = (file: File): boolean => {
    const validTypes = ['application/pdf', 'text/plain', 'text/html', 'text/htm'];
    const validExtensions = ['.pdf', '.txt', '.text', '.html', '.htm'];
    
    // Check MIME type
    if (validTypes.includes(file.type)) {
      return true;
    }
    
    // Check file extension as fallback
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  };

  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-lg p-6 text-center">
      <div className="w-16 h-16 mx-auto bg-credify-teal/10 rounded-full flex items-center justify-center mb-4">
        <Upload className="text-credify-teal" size={24} />
      </div>
      
      <h4 className="text-lg font-medium text-credify-navy dark:text-white mb-2">
        Upload Your Credit Report
      </h4>
      
      <p className="text-credify-navy-light dark:text-white/70 text-sm mb-6 max-w-md mx-auto">
        Upload a credit report PDF or text file from Experian, Equifax, or TransUnion to analyze and generate personalized dispute letters.
      </p>
      
      <div className="relative inline-block">
        <input
          type="file"
          accept=".pdf,.txt,.text,.html,.htm"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 w-full cursor-pointer"
          disabled={isUploading}
        />
        <button
          disabled={isUploading}
          className={`px-6 py-3 ${
            status === 'error' 
              ? 'bg-red-500 hover:bg-red-600' 
              : status === 'network-error'
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-credify-teal hover:bg-credify-teal-dark'
          } text-white rounded-lg transition-colors flex items-center gap-2 justify-center`}
        >
          {isUploading ? (
            <>
              <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : status === 'error' ? (
            <>
              <AlertTriangle size={18} />
              <span>Invalid File Type</span>
            </>
          ) : status === 'network-error' ? (
            <>
              <AlertCircle size={18} />
              <span>Network Issue - Continue Locally</span>
            </>
          ) : status === 'ready' ? (
            <>
              <CheckCircle size={18} />
              <span>File Ready</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>Select Report File</span>
            </>
          )}
        </button>
      </div>
      
      {fileInfo && (
        <p className="mt-2 text-sm text-credify-navy-light dark:text-white/70">
          {fileInfo.name}
        </p>
      )}
      
      <p className="mt-4 text-xs text-credify-navy-light dark:text-white/60">
        Supports PDF and text files from Experian, Equifax, and TransUnion
      </p>
      
      {status === 'error' && (
        <div className="mt-3 text-xs text-red-500">
          Please select a PDF or text file (.pdf, .txt, .html)
        </div>
      )}
      
      {status === 'network-error' && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-md">
          <div className="flex items-start gap-2">
            <Info className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <div className="text-xs text-amber-800 dark:text-amber-300 text-left">
              <p className="font-medium mb-1">Network connectivity issues detected</p>
              <p>Your report will be processed locally instead of using our cloud service. All processing happens in your browser and no data is sent to our servers.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportUploadSection;
