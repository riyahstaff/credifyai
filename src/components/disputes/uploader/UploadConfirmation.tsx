
import React from 'react';
import { File, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadConfirmationProps {
  fileName: string;
  fileSize: string;
  onStartAnalysis: () => void;
  onRemoveFile: () => void;
  testMode?: boolean;
}

const UploadConfirmation: React.FC<UploadConfirmationProps> = ({ 
  fileName,
  fileSize,
  onStartAnalysis,
  onRemoveFile,
  testMode = false
}) => {
  const handleStartAnalysis = () => {
    // If in test mode, set the test mode flag
    if (testMode) {
      console.log("Setting test mode for analysis");
      sessionStorage.setItem('testModeSubscription', 'true');
    }
    
    onStartAnalysis();
  };
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <File className="text-blue-500" size={22} />
        </div>
        <div>
          <p className="font-medium text-credify-navy dark:text-white">
            {fileName}
            {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
          </p>
          <p className="text-xs text-credify-navy-light dark:text-white/70">
            {fileSize}
          </p>
        </div>
      </div>
      
      {testMode && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg mb-4">
          <div className="flex gap-2">
            <div className="text-blue-600 mt-0.5">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Test Mode Active
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                Your report will be processed in test mode with enhanced functionality.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleStartAnalysis}
          className="bg-credify-teal hover:bg-credify-teal-dark dark:hover:bg-credify-teal-light"
        >
          {testMode ? "Analyze (Test Mode)" : "Analyze Report"}
        </Button>
        
        <Button
          variant="outline"
          onClick={onRemoveFile}
          className="gap-1 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
        >
          <Trash2 size={16} />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default UploadConfirmation;
