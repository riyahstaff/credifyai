
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="text-primary" size={20} />
            </div>
            <h3 className="font-semibold text-foreground">Dispute Letter Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span className="text-sm">Copy</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
          <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <pre className="font-sans whitespace-pre-wrap text-foreground">
              {letterContent}
            </pre>
          </div>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className="px-4 py-2 text-foreground border border-border hover:bg-muted/50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            
            <button
              onClick={onSend}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center gap-1.5"
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
