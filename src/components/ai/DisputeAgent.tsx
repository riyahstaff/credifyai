
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AgentAvatar from './AgentAvatar';
import { 
  Send, 
  Paperclip, 
  FileText, 
  AlertCircle, 
  X, 
  Download, 
  MessageSquare, 
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DisputeAgentProps {
  onGenerateDispute?: (disputeData: any) => void;
}

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isLoading?: boolean;
};

type DisputeType = {
  bureau: string;
  accountName: string;
  errorType: string;
  explanation: string;
};

const AGENT_NAME = "CLEO";
const AGENT_FULL_NAME = "Credit Litigation Expert Operator";

const DisputeAgent: React.FC<DisputeAgentProps> = ({ onGenerateDispute }) => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [currentDispute, setCurrentDispute] = useState<DisputeType | null>(null);
  const [disputeGenerated, setDisputeGenerated] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: MessageType = {
        id: Date.now().toString(),
        content: `Hello${profile?.full_name ? ' ' + profile.full_name.split(' ')[0] : ''}! I'm ${AGENT_NAME}, your ${AGENT_FULL_NAME}. I can help you create personalized dispute letters for credit report errors. Tell me about the issue you'd like to dispute.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    }
  }, [profile, messages]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAgentTyping(true);
    
    // Simulate agent analyzing the message
    setTimeout(() => {
      handleAgentResponse(userMessage.content);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleAgentResponse = (userMessage: string) => {
    // Simple pattern matching to simulate AI conversation
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // If there's a current dispute in progress
    if (currentDispute) {
      if (Object.values(currentDispute).filter(Boolean).length === 3) {
        // We need the explanation now
        setCurrentDispute({
          ...currentDispute,
          explanation: userMessage
        });
        
        // Response after receiving explanation
        const explanationResponse: MessageType = {
          id: Date.now().toString(),
          content: "Thank you for providing the details. I'm now generating your personalized dispute letter citing the appropriate FCRA regulations and legal precedent.",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, explanationResponse]);
        
        // Simulate generating the dispute letter
        setTimeout(() => {
          setIsAgentTyping(true);
          
          setTimeout(() => {
            const disputeData = {
              ...currentDispute,
              explanation: userMessage,
              timestamp: new Date(),
              letterContent: generateDisputeLetter({
                ...currentDispute,
                explanation: userMessage
              })
            };
            
            // Notify parent component about generated dispute
            if (onGenerateDispute) {
              onGenerateDispute(disputeData);
            }
            
            const generatedResponse: MessageType = {
              id: Date.now().toString(),
              content: "I've generated your dispute letter! It includes citations to FCRA Section 611 regarding accuracy disputes and Section 623 regarding furnisher responsibilities. You can now download it or send it directly to the credit bureau.",
              sender: 'agent',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, generatedResponse]);
            setIsAgentTyping(false);
            setDisputeGenerated(true);
          }, 3000);
        }, 1000);
        
        return;
      }
      
      // Handle partial dispute information collection
      if (!currentDispute.bureau) {
        // Bureau was just asked
        setCurrentDispute({
          ...currentDispute,
          bureau: userMessage
        });
        
        const nextQuestion: MessageType = {
          id: Date.now().toString(),
          content: "Which account or item on your credit report contains the error? (For example: 'Bank of America Credit Card', 'Chase Auto Loan', etc.)",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsAgentTyping(false);
        return;
      }
      
      if (!currentDispute.accountName) {
        // Account name was just asked
        setCurrentDispute({
          ...currentDispute,
          accountName: userMessage
        });
        
        const nextQuestion: MessageType = {
          id: Date.now().toString(),
          content: "What type of error are you disputing? (For example: 'Incorrect balance', 'Account not mine', 'Late payment', 'Account shown as open but was closed', etc.)",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsAgentTyping(false);
        return;
      }
      
      if (!currentDispute.errorType) {
        // Error type was just asked
        setCurrentDispute({
          ...currentDispute,
          errorType: userMessage
        });
        
        const nextQuestion: MessageType = {
          id: Date.now().toString(),
          content: "Please provide additional details to explain why this information is incorrect. This will strengthen your dispute case.",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsAgentTyping(false);
        return;
      }
    }
    
    // Handle initial inquiry about disputes
    if (
      lowerCaseMessage.includes('dispute') || 
      lowerCaseMessage.includes('letter') ||
      lowerCaseMessage.includes('credit report') ||
      lowerCaseMessage.includes('error') ||
      lowerCaseMessage.includes('inaccurate') ||
      lowerCaseMessage.includes('incorrect')
    ) {
      const response: MessageType = {
        id: Date.now().toString(),
        content: "I'll help you create a dispute letter. Let's gather some information to make your dispute as effective as possible. Which credit bureau would you like to send this dispute to? (Experian, Equifax, or TransUnion)",
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      setCurrentDispute({} as DisputeType);
      setIsAgentTyping(false);
      return;
    }
    
    // Default response if no specific patterns matched
    const defaultResponse: MessageType = {
      id: Date.now().toString(),
      content: "I'm here to help with credit dispute letters. If you have an error on your credit report that you'd like to dispute, let me know and I can guide you through creating a personalized FCRA-compliant dispute letter.",
      sender: 'agent',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, defaultResponse]);
    setIsAgentTyping(false);
  };
  
  const generateDisputeLetter = (dispute: DisputeType) => {
    // This would be replaced with actual AI-generated content
    return `
      [YOUR NAME]
      [YOUR ADDRESS]
      [CITY, STATE ZIP]
      
      [DATE]
      
      ${dispute.bureau}
      [BUREAU ADDRESS]
      [CITY, STATE ZIP]
      
      Re: Dispute of Inaccurate Information
      
      To Whom It May Concern:
      
      I am writing to dispute incorrect information that appears on my credit report. I have identified the following item that should be investigated and corrected:
      
      Account Name: ${dispute.accountName}
      Error Type: ${dispute.errorType}
      Explanation: ${dispute.explanation}
      
      Under Section 611 of the Fair Credit Reporting Act, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data.
      
      Please investigate this matter and correct your records accordingly. I have attached relevant documentation to support my dispute.
      
      Sincerely,
      
      [YOUR SIGNATURE]
      [YOUR PRINTED NAME]
    `;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const resetConversation = () => {
    setMessages([]);
    setCurrentDispute(null);
    setDisputeGenerated(false);
    
    // Add back welcome message
    setTimeout(() => {
      const welcomeMessage: MessageType = {
        id: Date.now().toString(),
        content: `Hello${profile?.full_name ? ' ' + profile.full_name.split(' ')[0] : ''}! I'm ${AGENT_NAME}, your ${AGENT_FULL_NAME}. I can help you create personalized dispute letters for credit report errors. Tell me about the issue you'd like to dispute.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    }, 300);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="bg-white dark:bg-credify-navy/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 w-full max-w-md mb-4 flex flex-col"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 480 }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/30">
              <div className="flex items-center gap-3">
                <AgentAvatar size="sm" isSpeaking={isAgentTyping} />
                <div>
                  <h3 className="font-semibold text-credify-navy dark:text-white flex items-center gap-1">
                    {AGENT_NAME}
                    <span className="bg-credify-teal/10 text-credify-teal text-xs px-1.5 py-0.5 rounded-full ml-1">AI</span>
                  </h3>
                  <p className="text-xs text-credify-navy-light dark:text-white/70">{AGENT_FULL_NAME}</p>
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
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-credify-navy dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
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
                    {message.content}
                  </div>
                </div>
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
              
              {disputeGenerated && (
                <div className="flex justify-center">
                  <div className="bg-credify-teal/10 text-credify-teal border border-credify-teal/20 rounded-xl p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Check size={16} className="text-credify-teal" />
                      <span className="font-medium">Dispute Letter Generated</span>
                    </div>
                    <button 
                      className="bg-credify-teal text-white py-1.5 px-3 rounded-lg text-sm flex items-center gap-1.5"
                      onClick={() => {
                        // This would trigger the download or preview in the parent component
                        if (onGenerateDispute && currentDispute) {
                          onGenerateDispute({
                            ...currentDispute,
                            timestamp: new Date(),
                            letterContent: generateDisputeLetter(currentDispute as DisputeType)
                          });
                        }
                      }}
                    >
                      <Download size={14} />
                      <span>Download Letter</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
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
                  disabled={isAgentTyping}
                />
                <button 
                  className="p-2 text-credify-teal hover:bg-credify-teal/10 rounded-full transition-colors"
                  onClick={() => {}}
                >
                  <Paperclip size={18} />
                </button>
                <button 
                  className={`p-2 text-white bg-credify-teal rounded-full transition-colors ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-credify-teal-dark'}`}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isAgentTyping}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-credify-teal hover:bg-credify-teal-dark text-white px-4 py-3 rounded-full shadow-lg transition-colors"
      >
        {!isOpen ? (
          <>
            <AgentAvatar size="sm" />
            <span className="font-medium">Ask {AGENT_NAME}</span>
            <Sparkles size={16} className="text-white/70" />
          </>
        ) : (
          <X size={24} />
        )}
      </motion.button>
    </div>
  );
};

export default DisputeAgent;
