
import React from 'react';
import { Upload } from 'lucide-react';

interface ReportUploadSectionProps {
  isUploading: boolean;
  onFileSelected: (file: File) => void;
}

const ReportUploadSection: React.FC<ReportUploadSectionProps> = ({
  isUploading,
  onFileSelected
}) => {
  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-lg p-6 text-center">
      <div className="w-16 h-16 mx-auto bg-credify-teal/10 rounded-full flex items-center justify-center mb-4">
        <Upload className="text-credify-teal" size={24} />
      </div>
      
      <h4 className="text-lg font-medium text-credify-navy dark:text-white mb-2">
        Upload Your Credit Report
      </h4>
      
      <p className="text-credify-navy-light dark:text-white/70 text-sm mb-6 max-w-md mx-auto">
        Upload a credit report PDF or text file to analyze and generate personalized dispute letters.
      </p>
      
      <div className="relative inline-block">
        <input
          type="file"
          accept=".pdf,.txt,.text"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileSelected(e.target.files[0]);
            }
          }}
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
              <Upload size={18} />
              <span>Select Report File</span>
            </>
          )}
        </button>
      </div>
      
      <p className="mt-4 text-xs text-credify-navy-light dark:text-white/60">
        Supports PDF and text files from Experian, Equifax, and TransUnion
      </p>
    </div>
  );
};

export default ReportUploadSection;
