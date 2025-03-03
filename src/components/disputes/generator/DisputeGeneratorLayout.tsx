
import React from 'react';
import AiAssistantPrompt from './AiAssistantPrompt';

interface DisputeGeneratorLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  testMode?: boolean;
}

const DisputeGeneratorLayout: React.FC<DisputeGeneratorLayoutProps> = ({
  leftContent,
  rightContent,
  testMode = false
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-4">
            Create Detailed Dispute Letter {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
          </h3>
          
          {leftContent}
        </div>
        
        <AiAssistantPrompt testMode={testMode} />
      </div>
      
      <div className="lg:col-span-1 space-y-6">
        {rightContent}
      </div>
    </div>
  );
};

export default DisputeGeneratorLayout;
