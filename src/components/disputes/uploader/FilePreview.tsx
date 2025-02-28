
import React from 'react';
import { X, FileText } from 'lucide-react';

interface FilePreviewProps {
  fileName: string;
  fileSize: string;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileName, fileSize, onRemove }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg px-4 py-3 flex items-center gap-3">
      <div className="p-2 bg-white dark:bg-gray-700/50 rounded-lg">
        <FileText size={20} className="text-credify-navy-light dark:text-white/70" />
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-credify-navy dark:text-white">{fileName}</p>
        <p className="text-xs text-credify-navy-light dark:text-white/70">{fileSize}</p>
      </div>
      <button
        onClick={onRemove}
        className="ml-auto p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default FilePreview;
