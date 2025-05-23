
import React from 'react';
import { FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DisputeLettersHeaderProps {
  hideCreateButton?: boolean;
}

const DisputeLettersHeader: React.FC<DisputeLettersHeaderProps> = ({ 
  hideCreateButton = false 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
      <div className="mb-4 lg:mb-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-credify-navy dark:text-white">
          CLEO AI-Generated Dispute Letters
        </h1>
        <p className="mt-2 text-credify-navy-light dark:text-white/70 max-w-2xl">
          Our advanced AI engine analyzes your credit reports, identifies potential violations, and generates tailored dispute letters based on the latest legal precedents and FCRA regulations.
        </p>
      </div>
      
      {!hideCreateButton && (
        <button
          onClick={() => navigate('/upload-report')}
          className="btn-primary flex items-center space-x-2"
        >
          <FileUp size={18} />
          <span>Upload Credit Report</span>
        </button>
      )}
    </div>
  );
};

export default DisputeLettersHeader;
