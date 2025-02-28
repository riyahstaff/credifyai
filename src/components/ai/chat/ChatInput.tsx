
import React, { useRef } from 'react';
import { Send, Upload } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleFileSelect: () => void;
  isAgentTyping: boolean;
  isProcessingFile: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleFileSelect,
  isAgentTyping,
  isProcessingFile
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700/30">
      <div className="flex items-center bg-gray-100 dark:bg-credify-navy/40 rounded-full px-3 py-1">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-none focus:outline-none py-2 px-1 text-credify-navy dark:text-white"
          disabled={isAgentTyping || isProcessingFile}
        />
        <button 
          className={`p-2 text-credify-teal ${isProcessingFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-credify-teal/10'} rounded-full transition-colors`}
          onClick={handleFileSelect}
          disabled={isProcessingFile}
          aria-label="Upload credit report"
        >
          <Upload size={18} />
        </button>
        <button 
          className={`p-2 text-white bg-credify-teal rounded-full transition-colors ${
            !inputValue.trim() || isAgentTyping || isProcessingFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-credify-teal-dark'
          }`}
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isAgentTyping || isProcessingFile}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
