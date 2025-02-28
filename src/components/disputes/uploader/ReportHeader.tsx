
import React from 'react';
import { ChevronUp, Search } from 'lucide-react';

interface ReportHeaderProps {
  accountCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  accountCount,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
          <ChevronUp size={16} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-medium text-credify-navy dark:text-white">
            Credit Report Analyzed
          </h4>
          <p className="text-xs text-credify-navy-light dark:text-white/70">
            {accountCount} accounts found
          </p>
        </div>
      </div>
      
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search accounts..."
          className="pl-9 pr-3 py-2 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg w-full text-sm"
        />
      </div>
    </div>
  );
};

export default ReportHeader;
