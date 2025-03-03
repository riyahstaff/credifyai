
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Send, Eye } from 'lucide-react';

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
  onViewLetter: (letter: Letter) => void;
  onDownloadLetter: (letter: Letter) => void;
  onSendLetter: (letter: Letter) => void;
}

const DisputeLettersList: React.FC<DisputeLettersListProps> = ({
  letters,
  onViewLetter,
  onDownloadLetter,
  onSendLetter
}) => {
  return (
    <div className="space-y-4">
      {letters.map((letter) => (
        <Card key={letter.id} className="hover:shadow-md transition-shadow">
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
                  onClick={() => onViewLetter(letter)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDownloadLetter(letter)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                
                {letter.status !== 'sent' && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onSendLetter(letter)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DisputeLettersList;
