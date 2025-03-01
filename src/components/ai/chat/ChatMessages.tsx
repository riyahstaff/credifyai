import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import MessageItem from './MessageItem';
import AgentAvatar from '../AgentAvatar';
import DisputeSuccessCard from './DisputeSuccessCard';
import { MessageType } from '../types';
import { RecommendedDispute } from '../types';

interface ChatMessagesProps {
  messages: MessageType[];
  isAgentTyping: boolean;
  isProcessingFile: boolean;
  disputeGenerated: boolean;
  handleDiscrepancySelection: (discrepancy: RecommendedDispute) => void;
  handleDownloadDispute: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isAgentTyping,
  isProcessingFile,
  disputeGenerated,
  handleDiscrepancySelection,
  handleDownloadDispute
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAgentTyping, isProcessingFile, disputeGenerated]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id}
          message={message}
          handleDiscrepancySelection={handleDiscrepancySelection}
        />
      ))}
      
      {isAgentTyping && (
        <div className="flex justify-start">
          <div className="mr-2 mt-1">
            <AgentAvatar size="sm" isSpeaking={true} />
          </div>
          <div className="bg-gray-100 dark:bg-credify-navy/60 text-credify-navy dark:text-white p-3 rounded-xl rounded-tl-none shadow-sm flex items-center">
            <span className="flex gap-1">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
            </span>
          </div>
        </div>
      )}
      
      {/* Processing indicator for file uploads */}
      {isProcessingFile && !isAgentTyping && (
        <div className="flex justify-center my-2">
          <div className="bg-credify-teal/10 text-credify-navy dark:text-white border border-credify-teal/30 rounded-lg p-2 flex items-center gap-2 text-sm">
            <Loader2 size={16} className="animate-spin text-credify-teal" />
            <span>Analyzing your credit report...</span>
          </div>
        </div>
      )}
      
      {disputeGenerated && (
        <DisputeSuccessCard onDownload={handleDownloadDispute} />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
