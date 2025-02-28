
import React from 'react';
import { FileUp, Brain } from 'lucide-react';
import FilePreview from './FilePreview';

interface UploadConfirmationProps {
  fileName: string;
  fileSize: string;
  onRemoveFile: () => void;
  onStartAnalysis: () => void;
}

const UploadConfirmation: React.FC<UploadConfirmationProps> = ({
  fileName,
  fileSize,
  onRemoveFile,
  onStartAnalysis
}) => {
  return (
    <div className="text-center p-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileUp className="text-green-600 dark:text-green-400" size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
        Credit Report Ready for Analysis
      </h3>
      
      <p className="text-credify-navy-light dark:text-white/70 mb-6 max-w-md mx-auto">
        Your report has been uploaded successfully. Click the button below to start the AI analysis process.
      </p>
      
      <div className="flex items-center justify-center mb-6">
        <FilePreview 
          fileName={fileName}
          fileSize={fileSize}
          onRemove={onRemoveFile}
        />
      </div>
      
      <button
        onClick={onStartAnalysis}
        className="btn-primary flex items-center justify-center gap-2 mx-auto"
      >
        <Brain size={18} />
        <span>Start AI Analysis</span>
      </button>
    </div>
  );
};

export default UploadConfirmation;
