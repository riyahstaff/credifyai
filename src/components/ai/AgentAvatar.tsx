
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare } from 'lucide-react';

interface AgentAvatarProps {
  isSpeaking?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showChat?: boolean;
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({ 
  isSpeaking = false, 
  onClick,
  size = 'md',
  showChat = false
}) => {
  const [blinking, setBlinking] = useState(false);
  
  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isSpeaking && Math.random() > 0.7) {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 200);
      }
    }, 2000);
    
    return () => clearInterval(blinkInterval);
  }, [isSpeaking]);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  return (
    <motion.div 
      className={`relative cursor-pointer ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-credify-teal to-blue-500 flex items-center justify-center shadow-lg relative overflow-hidden`}
        animate={isSpeaking ? { scale: [1, 1.03, 1] } : {}}
        transition={isSpeaking ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } : {}}
      >
        {/* Agent face */}
        <div className="relative">
          <Bot className="text-white" size={size === 'lg' ? 42 : size === 'md' ? 28 : 20} />
          
          {/* Eyes */}
          <motion.div 
            className="absolute left-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"
            animate={blinking ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{ duration: 0.2 }}
          />
          <motion.div 
            className="absolute right-1/4 top-1/4 w-1.5 h-1.5 bg-white rounded-full"
            animate={blinking ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{ duration: 0.2 }}
          />
        </div>
        
        {/* Speaking animation circles */}
        {isSpeaking && (
          <>
            <motion.div 
              className="absolute inset-0 border-4 border-white/10 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.5, 0.1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute inset-0 border-4 border-white/5 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.3 }}
            />
          </>
        )}
      </motion.div>
      
      {/* Chat indicator */}
      {showChat && (
        <motion.div
          className="absolute -right-1 -bottom-1 bg-credify-navy dark:bg-white text-white dark:text-credify-navy rounded-full p-1.5 shadow-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MessageSquare size={14} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AgentAvatar;
