
import React from 'react';
import { FileText, X } from 'lucide-react';
import AgentAvatar from '../AgentAvatar';

interface ChatHeaderProps {
  agentName: string;
  agentFullName: string;
  resetConversation: () => void;
  closeChat: () => void;
  isAgentTyping: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  agentName, 
  agentFullName, 
  resetConversation, 
  closeChat,
  isAgentTyping
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/30">
      <div className="flex items-center gap-3">
        <AgentAvatar size="sm" isSpeaking={isAgentTyping} />
        <div>
          <h3 className="font-semibold text-credify-navy dark:text-white flex items-center gap-1">
            {agentName}
            <span className="bg-credify-teal/10 text-credify-teal text-xs px-1.5 py-0.5 rounded-full ml-1">AI</span>
          </h3>
          <p className="text-xs text-credify-navy-light dark:text-white/70">{agentFullName}</p>
        </div>
      </div>
      <div className="flex gap-1">
        <button 
          onClick={resetConversation}
          className="p-1.5 text-gray-500 hover:text-credify-navy dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-full transition-colors"
          title="New conversation"
        >
          <FileText size={16} />
        </button>
        <button 
          onClick={closeChat}
          className="p-1.5 text-gray-500 hover:text-credify-navy dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
