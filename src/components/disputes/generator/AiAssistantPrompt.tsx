
import React from 'react';
import AgentAvatar from '@/components/ai/AgentAvatar';
import { Sparkles } from 'lucide-react';

const AiAssistantPrompt: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-credify-teal/10 to-blue-500/10 dark:from-credify-teal/20 dark:to-blue-500/20 rounded-xl p-5 border border-credify-teal/20 dark:border-credify-teal/30">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <AgentAvatar size="md" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-2">
            Need Help? Ask CLEO
          </h3>
          <p className="text-credify-navy-light dark:text-white/70 mb-4">
            Our AI assistant can help you create a custom dispute letter by asking about your specific situation.
          </p>
          <button
            onClick={() => {
              // This would trigger the CLEO agent
              const cleoButton = document.querySelector('[aria-label="Open AI assistant"]') as HTMLElement;
              if (cleoButton) {
                cleoButton.click();
              }
            }}
            className="inline-flex items-center gap-2 bg-white dark:bg-credify-navy/60 hover:bg-gray-50 dark:hover:bg-credify-navy/80 text-credify-navy dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700/50 transition-colors"
          >
            <Sparkles size={16} className="text-credify-teal" />
            <span>Chat with CLEO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPrompt;
