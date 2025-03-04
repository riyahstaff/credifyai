
import React from 'react';
import { Upload, FileCheck } from 'lucide-react';

interface ActionButtonsProps {
  onResetUpload: () => void;
  onGenerateAllLetters: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onResetUpload, onGenerateAllLetters }) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onResetUpload}
        className="btn-outline flex items-center gap-1"
      >
        <Upload size={18} />
        <span>Upload New Report</span>
      </button>
      
      <button
        onClick={onGenerateAllLetters}
        className="btn-primary flex items-center gap-1"
      >
        <FileCheck size={18} />
        <span>Generate All Letters</span>
      </button>
    </div>
  );
};

export default ActionButtons;
