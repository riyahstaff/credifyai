
import React from 'react';
import { FileText, X, Play } from 'lucide-react';

interface UploadConfirmationProps {
  fileName: string;
  fileSize: string;
  onStartAnalysis: () => void;
  onRemoveFile: () => void;
}

const UploadConfirmation: React.FC<UploadConfirmationProps> = ({
  fileName,
  fileSize,
  onStartAnalysis,
  onRemoveFile
}) => {
  return (
    <div className="bg-white dark:bg-credify-navy/30 rounded-lg p-5 border border-gray-100 dark:border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <FileText className="text-credify-teal" size={20} />
          </div>
          <div>
            <h4 className="font-medium text-credify-navy dark:text-white">{fileName}</h4>
            <p className="text-sm text-credify-navy-light dark:text-white/70">{fileSize}</p>
          </div>
        </div>
        <button 
          onClick={onRemoveFile}
          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          aria-label="Remove file"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onStartAnalysis}
          className="btn-primary flex items-center gap-2 px-6"
        >
          <Play size={16} />
          <span>Analyze Report</span>
        </button>
      </div>
    </div>
  );
};

export default UploadConfirmation;
