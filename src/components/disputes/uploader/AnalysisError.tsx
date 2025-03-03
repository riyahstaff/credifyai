
import React from 'react';

interface AnalysisErrorProps {
  error: string | null;
  onReset: () => void;
}

const AnalysisError: React.FC<AnalysisErrorProps> = ({ error, onReset }) => {
  if (!error) return null;
  
  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400">
      <p className="font-medium mb-1">Error analyzing report:</p>
      <p>{error}</p>
      <button 
        onClick={onReset}
        className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default AnalysisError;
