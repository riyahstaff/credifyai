
import React, { useState } from 'react';
import { Letter } from './hooks/useDisputeLettersData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, Mail, Printer, Edit, Check } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';

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
  const [isEditing, setIsEditing] = useState(false);
  const [letterContent, setLetterContent] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  
  const userName = userProfile?.full_name?.split(' ')[0] || 'User';

  // Initialize the editor with letter content when a letter is selected
  React.useEffect(() => {
    if (letter) {
      setLetterContent(letter.content || '');
    }
  }, [letter]);

  // Generate HTML representation with wrapping and formatting
  const formattedContent = React.useMemo(() => {
    if (!letter) return '';
    
    // Replace line breaks with HTML breaks
    const content = letter.content || '';
    return content
      .replace(/\n/g, '<br/>')
      .replace(/\[YOUR NAME\]/g, userProfile?.full_name || '[YOUR NAME]')
      .replace(/\[YOUR ADDRESS\]/g, '[YOUR ADDRESS]')
      .replace(/\[CITY\], \[STATE\] \[ZIP\]/g, '[CITY], [STATE] [ZIP]');
  }, [letter, userProfile]);

  const handleLetterDownload = () => {
    if (!letter) return;
    
    const letterText = letter.content || '';
    const fileName = `dispute-letter-${letter.bureaus[0] || 'bureau'}-${new Date().toISOString().slice(0, 10)}.txt`;
    
    const blob = new Blob([letterText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!letter) return;
    
    const printContent = `
      <html>
        <head>
          <title>Dispute Letter - ${letter.bureaus[0] || 'Credit Bureau'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              margin: 1.5in 1in;
            }
            .letter {
              max-width: 8.5in;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div class="letter">
            ${formattedContent}
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-credify-navy-light/10 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50 p-6 h-full flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-credify-teal animate-spin mb-2" />
        <p className="text-credify-navy-light dark:text-white/70">Loading letters...</p>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="bg-white dark:bg-credify-navy-light/10 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50 p-6 h-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-gray-100 dark:bg-gray-800/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-credify-navy dark:text-white mb-2">
            Hello {userName}, no letter selected
          </h3>
          <p className="text-credify-navy-light dark:text-white/70 max-w-md mx-auto">
            Select a letter from the list to view its contents, or create a new dispute letter by uploading your credit report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-credify-navy-light/10 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/50 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-credify-navy dark:text-white">
            {letter.title || 'Dispute Letter'}
          </h3>
          <p className="text-sm text-credify-navy-light dark:text-white/60">
            {letter.bureaus?.map((bureau) => bureau).join(', ') || 'Credit Bureau'} - {letter.createdAt || 'No date'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button
              variant="outline" 
              size="sm"
              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50"
              onClick={() => setIsEditing(false)}
            >
              <Check size={14} className="mr-1" />
              Done
            </Button>
          ) : (
            <>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={14} className="mr-1" />
                Edit
              </Button>
              
              <Button
                variant="outline" 
                size="sm"
                onClick={handlePrint}
              >
                <Printer size={14} className="mr-1" />
                Print
              </Button>
              
              <Button
                variant="outline" 
                size="sm"
                onClick={handleLetterDownload}
              >
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 border-b border-gray-200 dark:border-gray-700/50">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="preview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-credify-teal data-[state=active]:text-credify-teal rounded-none">
              Preview
            </TabsTrigger>
            <TabsTrigger value="source" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-credify-teal data-[state=active]:text-credify-teal rounded-none">
              Raw Text
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="preview" className="flex-1 p-6 overflow-auto m-0 border-0">
          <div className="max-w-3xl mx-auto">
            <div 
              className="whitespace-pre-line text-credify-navy dark:text-white/90 font-serif text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="source" className="flex-1 p-0 m-0 border-0">
          {isEditing ? (
            <textarea
              className="w-full h-full p-6 text-sm font-mono bg-gray-50 dark:bg-gray-900/50 text-credify-navy dark:text-white/90 border-none focus:outline-none focus:ring-0 resize-none"
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              spellCheck={false}
            />
          ) : (
            <pre className="w-full h-full p-6 text-sm font-mono bg-gray-50 dark:bg-gray-900/50 text-credify-navy dark:text-white/90 overflow-auto">
              {letter.content || ''}
            </pre>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DisputeLetterViewer;
