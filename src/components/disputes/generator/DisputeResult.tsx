
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Check,
  Download,
  Mail,
  Eye,
  ArrowRight, 
  Copy
} from 'lucide-react';

interface DisputeResultProps {
  letterContent: string;
  selectedAccount: any;
  selectedBureau: string;
  onReset: () => void;
  onDownload: () => void;
  testMode?: boolean;
}

const DisputeResult: React.FC<DisputeResultProps> = ({
  letterContent,
  selectedAccount,
  selectedBureau,
  onReset,
  onDownload,
  testMode
}) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    toast({
      title: "Copied",
      description: "Letter content copied to clipboard",
    });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Check size={16} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-medium text-credify-navy dark:text-white">
              {testMode ? "Test " : ""}Dispute Letter Generated
              {testMode && <span className="ml-2 text-xs text-amber-500">(Test Mode)</span>}
            </h4>
            <p className="text-xs text-credify-navy-light dark:text-white/70">
              For {selectedAccount?.accountName} with {selectedBureau}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={onDownload}
            className="p-2 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-credify-navy/40 rounded-lg p-4 max-h-[500px] overflow-y-auto">
        <pre className="font-sans text-sm whitespace-pre-wrap text-credify-navy dark:text-white">
          {letterContent}
        </pre>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={onReset}
          className="px-4 py-2 text-credify-navy-light dark:text-white/70 hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors flex items-center gap-2"
        >
          <Eye size={16} />
          <span>Edit Letter</span>
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700/50 text-credify-navy dark:text-white hover:bg-gray-50 dark:hover:bg-credify-navy/60 rounded-lg transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
        <button
          onClick={() => {
            // Would integrate with mail sending API in production
            toast({
              title: testMode ? "Test Mode Active" : "Letter ready to send",
              description: testMode 
                ? "In test mode, letters are not actually sent." 
                : "Your dispute letter will be sent to the credit bureau.",
            });
          }}
          className="px-4 py-2 bg-credify-teal hover:bg-credify-teal-dark text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Mail size={16} />
          <span>Send to Bureau</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DisputeResult;
