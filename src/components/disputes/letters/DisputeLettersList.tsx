
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Send, Eye, Plus, FileUp } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  content: string;
  accountName?: string;
  accountNumber?: string;
  errorType?: string;
}

interface DisputeLettersListProps {
  letters: Letter[];
  selectedLetter: Letter | null;
  onSelectLetter: (letter: Letter) => void;
  isLoading: boolean;
  onCreateLetter: () => void;
  testMode?: boolean;
}

const DisputeLettersList: React.FC<DisputeLettersListProps> = ({
  letters,
  selectedLetter,
  onSelectLetter,
  isLoading,
  onCreateLetter,
  testMode = false
}) => {
  const handleViewLetter = (letter: Letter) => {
    onSelectLetter(letter);
  };

  const handleDownloadLetter = (letter: Letter) => {
    // Create a blob with the letter content
    const blob = new Blob([letter.content], { type: 'text/plain' });
    
    // Create a link and click it to trigger download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${letter.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendLetter = (letter: Letter) => {
    // Implementation for sending the letter would go here
    console.log('Sending letter:', letter.title);
    alert('This feature is coming soon! Letter sending is not yet implemented.');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full mb-4 border-dashed"
          onClick={onCreateLetter}
        >
          <Plus className="mr-2 h-4 w-4" />
          Generate New Letter
        </Button>
        
        {[1, 2].map((i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Skeleton className="w-3/4 h-5 mb-3" />
              <Skeleton className="w-2/3 h-4 mb-2" />
              <Skeleton className="w-1/2 h-4 mb-4" />
              <div className="flex justify-end space-x-2">
                <Skeleton className="w-20 h-8" />
                <Skeleton className="w-20 h-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full mb-4 border-dashed"
        onClick={onCreateLetter}
      >
        <FileUp className="mr-2 h-4 w-4" />
        Create From Credit Report
      </Button>
      
      {letters.length === 0 ? (
        <Card className="text-center p-6">
          <p className="text-muted-foreground mb-4">No dispute letters found</p>
          <Button 
            variant="default" 
            onClick={onCreateLetter}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Letter
          </Button>
        </Card>
      ) : (
        letters.map((letter) => (
          <Card 
            key={letter.id} 
            className={`hover:shadow-md transition-shadow ${selectedLetter?.id === letter.id ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold">{letter.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>To: {letter.recipient}</span>
                    <span className="text-xs">•</span>
                    <span>Created: {letter.createdAt}</span>
                    <span className="text-xs">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      letter.status === 'sent' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {letter.status === 'sent' ? 'Sent' : 'Draft'}
                    </span>
                  </div>
                  {letter.accountName && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Account:</span> {letter.accountName}
                      {letter.accountNumber && <span> (#{letter.accountNumber})</span>}
                    </div>
                  )}
                  {letter.errorType && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Issue Type:</span> {letter.errorType}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewLetter(letter)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadLetter(letter)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  
                  {letter.status !== 'sent' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleSendLetter(letter)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default DisputeLettersList;
