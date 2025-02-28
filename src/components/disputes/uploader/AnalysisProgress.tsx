
import React from 'react';
import { Brain, Check } from 'lucide-react';

interface AnalysisProgressProps {
  steps: Array<{
    name: string;
    progress: number;
    isComplete: boolean;
  }>;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="text-credify-teal" size={18} />
        <p className="text-sm font-medium text-credify-navy dark:text-white">AI Analysis Progress</p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs text-credify-navy-light dark:text-white/70 mb-1">
              <span>{step.name}</span>
              {step.isComplete ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check size={12} />
                  Complete
                </span>
              ) : (
                <span>{step.progress}%</span>
              )}
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${step.isComplete ? 'bg-green-500' : 'bg-credify-teal animate-pulse-slow'} rounded-full`} 
                style={{ width: `${step.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisProgress;
