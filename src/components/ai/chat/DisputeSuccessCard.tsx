
import React from 'react';
import { Check, Download } from 'lucide-react';

interface DisputeSuccessCardProps {
  onDownload: () => void;
}

const DisputeSuccessCard: React.FC<DisputeSuccessCardProps> = ({ onDownload }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-card text-card-foreground border border-border rounded-xl p-3 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Check size={16} className="text-primary" />
          <span className="font-medium">Dispute Letter Generated</span>
        </div>
        <button 
          className="bg-primary text-primary-foreground py-1.5 px-3 rounded-lg text-sm flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
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
