
import React, { useState } from 'react';
import { Download, Send, Printer, Copy, CheckCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Letter } from './hooks/useDisputeLettersData';
import { Profile } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DisputePreview from '../DisputePreview';

interface DisputeLetterViewerProps {
  letter: Letter | null;
  isLoading: boolean;
  testMode?: boolean;
  userProfile?: Profile | null;
}

const DisputeLetterViewer: React.FC<DisputeLetterViewerProps> = ({
  letter,
  isLoading,
  testMode = false,
  userProfile
}) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6 h-full min-h-[500px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-primary border-primary/30 rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading letter content...</p>
      </div>
    );
  }
  
  // Empty state
  if (!letter) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6 h-full min-h-[500px] flex flex-col items-center justify-center">
        <div className="w-20 h-20 border border-dashed border-border rounded-full flex items-center justify-center mb-4">
          <RotateCw size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Letter Selected</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Select a letter from the list on the left or create a new dispute letter.
        </p>
      </div>
    );
  }
  
  // Get bureau for the selected letter
  const bureau = letter.bureaus && letter.bureaus.length > 0 
    ? letter.bureaus[0] 
    : 'Credit Bureau';
    
  // Handle copy to clipboard
  const handleCopy = () => {
    if (letter) {
      navigator.clipboard.writeText(letter.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Letter content has been copied to your clipboard."
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Handle download
  const handleDownload = () => {
    if (!letter) return;
    
    const fileName = `${bureau.toLowerCase()}_dispute_${letter.accountName || 'general'}.txt`.replace(/\s+/g, '_');
    
    const element = document.createElement('a');
    const file = new Blob([letter.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter Downloaded",
      description: `Your dispute letter has been downloaded as ${fileName}.`
    });
  };
  
  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Error",
        description: "Could not open print window. Please check if pop-ups are blocked.",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${letter.title || 'Dispute Letter'} - ${bureau}</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              line-height: 1.5;
              padding: 1in;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <pre>${letter.content}</pre>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Add slight delay before printing
    setTimeout(() => {
      printWindow.print();
      // Close window after print dialog is closed (optional)
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 1000);
    }, 500);
  };
  
  // Handle sending letter
  const handleSendLetter = () => {
    toast({
      title: "Letter Submitted",
      description: `Your dispute letter to ${bureau} has been prepared for sending.`
    });
    
    setShowPreview(true);
  };
  
  return (
    <>
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm flex flex-col h-full min-h-[500px]">
        {/* Letter Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">{letter.title || 'Dispute Letter'}</h3>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopy}
                className={`rounded-full ${copied ? 'text-primary' : ''}`}
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              <span>To: {bureau}</span>
              {letter.accountName && (
                <span className="ml-2">• {letter.accountName}</span>
              )}
            </div>
            <div>{letter.createdAt || 'No date'}</div>
          </div>
        </div>
        
        {/* Letter Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="whitespace-pre-wrap font-mono text-sm bg-muted/20 p-5 rounded-md min-h-[400px]">
            {letter.content}
          </div>
        </div>
        
        {/* Letter Actions */}
        <div className="border-t border-border p-4">
          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex items-center gap-1.5"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span>Copy</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-1.5"
            >
              <Printer size={16} />
              <span>Print</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="flex items-center gap-1.5"
            >
              <Download size={16} />
              <span>Download</span>
            </Button>
            
            <Button 
              onClick={handleSendLetter}
              className="flex items-center gap-1.5"
            >
              <Send size={16} />
              <span>Send to Bureau</span>
            </Button>
          </div>
        </div>
      </div>
      
      {showPreview && (
        <DisputePreview 
          letterContent={letter.content} 
          onClose={() => setShowPreview(false)}
          onSend={() => {
            toast({
              title: "Letter Sent",
              description: `Your dispute letter has been sent to ${bureau}.`,
            });
            setShowPreview(false);
          }}
          onDownload={handleDownload}
        />
      )}
    </>
  );
};

export default DisputeLetterViewer;
