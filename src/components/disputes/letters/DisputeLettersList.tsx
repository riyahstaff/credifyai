
import React from 'react';
import { Download, Send, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  laws: string[];
  content: string;
  resolvedAt?: string;
}

interface DisputeLettersListProps {
  letters: Letter[];
  isLoading: boolean;
  onViewLetter: (letter: Letter) => void;
  onDownloadLetter: (letter: Letter) => void;
  onSendLetter: (letter: Letter) => void;
}

const DisputeLettersList: React.FC<DisputeLettersListProps> = ({
  letters,
  isLoading,
  onViewLetter,
  onDownloadLetter,
  onSendLetter
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full animate-pulse bg-gray-100 dark:bg-gray-800">
            <CardContent className="p-6 h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No dispute letters yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a credit report to have CLEO analyze it and generate dispute letters for you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {letters.map((letter) => (
        <Card key={letter.id} className="w-full hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium text-credify-navy dark:text-white">{letter.title}</h3>
                  <Badge 
                    variant={letter.status === 'resolved' ? 'secondary' : 'default'}
                    className={letter.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : ''}
                  >
                    {letter.status === 'resolved' ? 'Resolved' : 'In Progress'}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="mr-3">To: {letter.recipient}</span>
                  <span>Created: {letter.createdAt}</span>
                  {letter.resolvedAt && <span className="ml-3">Resolved: {letter.resolvedAt}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {letter.bureaus.map((bureau) => (
                    <Badge key={bureau} variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      {bureau}
                    </Badge>
                  ))}
                  {letter.laws.map((law) => (
                    <Badge key={law} variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                      {law}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-credify-navy dark:text-white"
                  onClick={() => onViewLetter(letter)}
                >
                  <Eye size={16} className="mr-1" /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-credify-navy dark:text-white"
                  onClick={() => onDownloadLetter(letter)}
                >
                  <Download size={16} className="mr-1" /> Download
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-credify-teal hover:bg-credify-teal/90 text-white"
                  onClick={() => onSendLetter(letter)}
                >
                  <Send size={16} className="mr-1" /> Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DisputeLettersList;
