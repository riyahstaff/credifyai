
import React from 'react';
import { Bot } from 'lucide-react';

interface AiAssistantPromptProps {
  testMode?: boolean;
}

const AiAssistantPrompt: React.FC<AiAssistantPromptProps> = ({ testMode }) => {
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-credify-teal/10 rounded-full">
          <Bot size={20} className="text-credify-teal" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-1">
            Need Help? Use Our AI Assistant
            {testMode && <span className="text-amber-500 text-sm ml-2">(Test Mode)</span>}
          </h3>
          <p className="text-credify-navy-light dark:text-white/70 mb-4">
            Our AI can write a personalized dispute letter for you. Simply click the chat icon in the bottom right corner of your screen to get started.
            {testMode && " In test mode, all letters will be generated as samples and not sent to credit bureaus."}
          </p>
          <div className="text-sm text-credify-navy-light dark:text-white/70 bg-gray-50 dark:bg-credify-navy/40 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30">
            <p className="italic">
              "Help me write a dispute letter to TransUnion about my Capital One account showing incorrect late payments"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPrompt;
