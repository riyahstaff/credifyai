
import React from 'react';
import { Check, Download, FileText, FileUp, Lightbulb } from 'lucide-react';
import AgentAvatar from '../AgentAvatar';
import { MessageType, RecommendedDispute } from '../types';

interface MessageItemProps {
  message: MessageType;
  handleDiscrepancySelection: (discrepancy: RecommendedDispute) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  handleDiscrepancySelection
}) => {
  // Render a discrepancy item with action button
  const renderDiscrepancy = (discrepancy: RecommendedDispute, index: number) => {
    return (
      <div 
        key={`${discrepancy.accountName}-${discrepancy.reason}-${index}`}
        className="bg-white dark:bg-credify-navy/40 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-700/50 shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${
              discrepancy.severity === 'high' 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : discrepancy.severity === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <Lightbulb size={14} className={`${
                discrepancy.severity === 'high' 
                  ? 'text-red-600 dark:text-red-400' 
                  : discrepancy.severity === 'medium'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <h4 className="font-medium text-credify-navy dark:text-white text-sm">
              {discrepancy.accountName}
            </h4>
          </div>
          <span className="text-xs bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 px-2 py-0.5 rounded">
            {discrepancy.bureau}
          </span>
        </div>
        <p className="text-xs text-credify-navy-light dark:text-white/70 mb-2">
          {discrepancy.description}
        </p>
        {discrepancy.sampleDisputeLanguage && (
          <div className="flex items-start gap-1 text-xs text-credify-navy-light dark:text-white/70 mb-2 p-1 bg-credify-teal/5 border border-credify-teal/10 rounded">
            <Lightbulb size={12} className="text-credify-teal mt-0.5 shrink-0" />
            <p className="italic">{discrepancy.sampleDisputeLanguage.substring(0, 100)}...</p>
          </div>
        )}
        <button
          onClick={() => handleDiscrepancySelection(discrepancy)}
          className="text-xs bg-credify-teal/10 text-credify-teal hover:bg-credify-teal/20 transition-colors rounded px-2 py-1 flex items-center gap-1"
        >
          <FileText size={12} />
          <span>Create Dispute Letter</span>
        </button>
      </div>
    );
  };

  return (
    <div 
      key={message.id} 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      {message.sender === 'agent' && (
        <div className="mr-2 mt-1">
          <AgentAvatar size="sm" />
        </div>
      )}
      <div 
        className={`max-w-[85%] p-3 rounded-xl shadow-sm ${
          message.sender === 'user' 
            ? 'bg-credify-teal text-white rounded-tr-none' 
            : 'bg-gray-100 dark:bg-credify-navy/60 text-credify-navy dark:text-white rounded-tl-none'
        }`}
      >
        {message.isFileUpload ? (
          <div className="flex items-center gap-2">
            <FileUp size={16} />
            <span>{message.content}</span>
          </div>
        ) : (
          message.content
        )}
        
        {/* Render discrepancies list if this message has them */}
        {message.hasDiscrepancies && message.discrepancies && message.discrepancies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600/30">
            <h4 className="font-medium text-sm mb-2">Discrepancies Found:</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {message.discrepancies.slice(0, 3).map((discrepancy, index) => 
                renderDiscrepancy(discrepancy, index)
              )}
              {message.discrepancies.length > 3 && (
                <div className="text-center text-xs">
                  + {message.discrepancies.length - 3} more issues found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
