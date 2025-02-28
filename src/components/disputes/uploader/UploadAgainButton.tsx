
import React from 'react';
import { Upload } from 'lucide-react';

interface UploadAgainButtonProps {
  onClick: () => void;
}

const UploadAgainButton: React.FC<UploadAgainButtonProps> = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="text-sm flex items-center gap-1.5 text-credify-navy-light dark:text-white/70 hover:text-credify-teal transition-colors"
      >
        <Upload size={14} />
        <span>Upload a different report</span>
      </button>
    </div>
  );
};

export default UploadAgainButton;
