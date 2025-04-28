
import React from 'react';
import { Letter } from './hooks/useDisputeLettersData';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';

interface DisputeLettersListProps {
  letters: Letter[];
  selectedLetter: Letter | null;
  onSelectLetter: (letter: Letter) => void;
  isLoading: boolean;
  onCreateLetter: () => void;
  testMode?: boolean;
  userProfile?: Profile | null;
}

const DisputeLettersList: React.FC<DisputeLettersListProps> = ({
  letters,
  selectedLetter,
  onSelectLetter,
  isLoading,
  onCreateLetter,
  testMode = false,
  userProfile
}) => {
  const userName = userProfile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Your Letters</h2>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
          onClick={onCreateLetter}
        >
          <Plus size={14} />
          <span>New</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-muted-foreground">Loading letters...</p>
        </div>
      ) : letters.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-4 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-4">
            Hello {userName}, you don't have any dispute letters yet
          </p>
          <Button 
            className="w-full"
            onClick={onCreateLetter}
          >
            <Plus size={16} className="mr-1" />
            Create Letter
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedLetter?.id === letter.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted/50 border border-border'
              }`}
              onClick={() => onSelectLetter(letter)}
            >
              <h3 className="font-medium truncate">
                {letter.title || `Dispute Letter #${letter.id}`}
              </h3>
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-muted-foreground">
                  {letter.bureaus?.join(', ') || letter.recipient || 'Credit Bureau'}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {letter.createdAt || 'No date'}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium">
                  {letter.accountName ? (
                    <span className="truncate inline-block max-w-[140px]">{letter.accountName}</span>
                  ) : (
                    'General Dispute'
                  )}
                </div>
                
                <div className={`text-xs px-2 py-0.5 rounded-full ${
                  letter.status === 'sent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  letter.status === 'ready' ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {letter.status === 'sent' ? 'Sent' :
                   letter.status === 'ready' ? 'Ready' : 'Draft'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisputeLettersList;
