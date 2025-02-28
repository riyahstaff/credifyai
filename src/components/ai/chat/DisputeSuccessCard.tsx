
import React from 'react';
import { Check, Download } from 'lucide-react';

interface DisputeSuccessCardProps {
  onDownload: () => void;
}

const DisputeSuccessCard: React.FC<DisputeSuccessCardProps> = ({ onDownload }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-credify-teal/10 text-credify-teal border border-credify-teal/20 rounded-xl p-3 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Check size={16} className="text-credify-teal" />
          <span className="font-medium">Dispute Letter Generated</span>
        </div>
        <button 
          className="bg-credify-teal text-white py-1.5 px-3 rounded-lg text-sm flex items-center gap-1.5"
          onClick={onDownload}
        >
          <Download size={14} />
          <span>Download Letter</span>
        </button>
      </div>
    </div>
  );
};

export default DisputeSuccessCard;
