
import React from 'react';
import { Brain, FileText } from 'lucide-react';

interface DisputeAgentProps {
  onGenerateDispute: (disputeData: any) => void;
}

const DisputeAgent: React.FC<DisputeAgentProps> = ({ onGenerateDispute }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative group">
        <button 
          className="w-16 h-16 rounded-full bg-gradient-to-br from-credify-teal to-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          aria-label="CLEO AI Assistant"
        >
          <Brain size={28} className="animate-pulse" />
        </button>
        
        <div className="absolute bottom-full right-0 mb-3 w-64 p-3 bg-white dark:bg-credify-navy rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <div className="text-credify-navy dark:text-white font-medium mb-1">CLEO AI Assistant</div>
          <div className="text-credify-navy-light dark:text-white/70 text-sm">
            I use DeepSeek-level AI to analyze credit reports, identify FCRA violations, and generate powerful dispute letters.
          </div>
          <div className="mt-2 flex gap-2">
            <button 
              className="text-xs bg-credify-teal/10 hover:bg-credify-teal/20 text-credify-teal px-2 py-1 rounded-full flex items-center gap-1"
              onClick={() => window.location.href = '/upload-report'}
            >
              <FileText size={12} />
              <span>Upload Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeAgent;
