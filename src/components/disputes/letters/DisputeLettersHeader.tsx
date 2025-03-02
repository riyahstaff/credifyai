
import React from 'react';
import { Plus } from 'lucide-react';

interface DisputeLettersHeaderProps {
  onCreateNewLetter: () => void;
}

const DisputeLettersHeader: React.FC<DisputeLettersHeaderProps> = ({ onCreateNewLetter }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-1">Dispute Letters</h1>
        <p className="text-credify-navy-light dark:text-white/70">Create and manage your credit dispute letters</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onCreateNewLetter}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          <span>Create New Letter</span>
        </button>
      </div>
    </div>
  );
};

export default DisputeLettersHeader;
