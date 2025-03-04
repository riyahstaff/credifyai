
import React from 'react';
import { Check } from 'lucide-react';

const AnalysisHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <Check className="text-green-600 dark:text-green-400" size={24} />
      </div>
      <h3 className="text-xl font-semibold text-credify-navy dark:text-white">
        Analysis Complete
      </h3>
    </div>
  );
};

export default AnalysisHeader;
