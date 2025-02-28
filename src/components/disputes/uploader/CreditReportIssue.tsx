
import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { CreditReportAccount } from '@/utils/creditReport/types';

interface CreditReportIssueProps {
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
  onGenerateDispute: () => void;
}

const CreditReportIssue: React.FC<CreditReportIssueProps> = ({
  title,
  description,
  impact,
  impactColor,
  account,
  laws,
  onGenerateDispute
}) => {
  const getImpactColorClass = (color: string): string => {
    switch (color.toLowerCase()) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-credify-navy/40 border border-gray-100 dark:border-gray-700/30 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="mt-1">
            <AlertCircle className={`${
              impactColor === 'red' ? 'text-red-500' : 
              impactColor === 'orange' ? 'text-orange-500' : 
              'text-yellow-500'
            }`} size={20} />
          </div>
          <div>
            <h4 className="font-medium text-credify-navy dark:text-white">{title}</h4>
            <p className="text-sm text-credify-navy-light dark:text-white/70 mt-1">
              {description}
            </p>
          </div>
        </div>
        <div className={`flex items-center ${getImpactColorClass(impactColor)} px-3 py-1 rounded-full text-xs font-medium`}>
          {impact}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h5 className="text-sm font-medium text-credify-navy dark:text-white mb-2">Applicable Laws:</h5>
        <div className="flex flex-wrap gap-2">
          {laws.map((law, idx) => (
            <div key={idx} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm text-credify-navy-light dark:text-white/70">
              {law}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button 
          onClick={onGenerateDispute}
          className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium text-sm flex items-center gap-1"
        >
          Generate Dispute Letter
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CreditReportIssue;
