
import React, { useState } from 'react';
import { 
  Download, 
  Send, 
  Mail, 
  FileText, 
  Copy, 
  CheckCircle,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DisputePreviewProps {
  letterContent: string;
  onClose: () => void;
  onSend?: () => void;
  onDownload?: () => void;
}

const DisputePreview: React.FC<DisputePreviewProps> = ({
  letterContent,
  onClose,
  onSend,
  onDownload
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Letter content has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-credify-navy-dark rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-credify-teal/10">
              <FileText className="text-credify-teal" size={20} />
            </div>
            <h3 className="font-semibold text-credify-navy dark:text-white">Dispute Letter Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-credify-navy-light dark:text-white/70 hover:text-credify-teal hover:bg-credify-teal/10 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span className="text-sm">Copy</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-credify-navy-light dark:text-white/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-credify-navy/20">
          <div className="bg-white dark:bg-credify-navy/60 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/30">
            <pre className="font-sans whitespace-pre-wrap text-credify-navy dark:text-white">
              {letterContent}
            </pre>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-credify-navy-light dark:text-white/70 hover:text-credify-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="px-4 py-2 text-credify-navy dark:text-white border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-credify-navy/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            
            <button
              onClick={onSend}
              className="px-4 py-2 bg-credify-teal hover:bg-credify-teal-dark text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Mail size={16} />
              <span>Send to Bureau</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputePreview;
