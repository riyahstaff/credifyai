
import React, { useState } from 'react';
import { Upload, FileUp, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  dragActiveClassName?: string;
  dropzoneClassName?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelected, 
  accept = ".pdf,.csv,.txt", 
  dragActiveClassName = "border-credify-teal bg-credify-teal/5",
  dropzoneClassName = "border-gray-200 dark:border-gray-700"
}) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };
  
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Check if file is valid format
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'pdf' && fileExt !== 'csv' && fileExt !== 'txt') {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF, CSV, or TXT file from one of the credit bureaus.",
        variant: "destructive",
      });
      return;
    }

    onFileSelected(file);
  };
  
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? dragActiveClassName : dropzoneClassName
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-20 h-20 bg-credify-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <FileUp className="text-credify-teal" size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-2">
        Drag & Drop Your Credit Report
      </h3>
      
      <p className="text-credify-navy-light dark:text-white/70 mb-6 max-w-md mx-auto">
        Upload your credit report from Experian, Equifax, or TransUnion in PDF or CSV format
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <label className="btn-primary cursor-pointer flex items-center gap-2">
          <Upload size={18} />
          <span>Browse Files</span>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
