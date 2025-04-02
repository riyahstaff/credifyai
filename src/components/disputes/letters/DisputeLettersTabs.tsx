
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DisputeLettersList from './DisputeLettersList';
import DisputeGenerator from '../DisputeGenerator';
import { Loader2 } from 'lucide-react';

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

interface DisputeLettersTabsProps {
  selectedView: string;
  onViewChange: (view: string) => void;
  letters: Letter[];
  isLoading: boolean;
  selectedLetter: Letter | null;
  onSelectLetter: (letter: Letter) => void;
  onCreateLetter: () => void;
  onGenerateDispute: (disputeData: any) => void;
  hideGeneratorTab?: boolean;
  testMode?: boolean;
}

const DisputeLettersTabs: React.FC<DisputeLettersTabsProps> = ({
  selectedView,
  onViewChange,
  letters,
  isLoading,
  selectedLetter,
  onSelectLetter,
  onCreateLetter,
  onGenerateDispute,
  hideGeneratorTab = false,
  testMode = false
}) => {
  return (
    <Tabs value={selectedView} onValueChange={onViewChange} className="w-full mb-8">
      <TabsList className="w-full bg-white dark:bg-gray-800 mb-6">
        <TabsTrigger value="letters" className="flex-1">
          My Dispute Letters ({letters?.length || 0})
        </TabsTrigger>
        {!hideGeneratorTab && (
          <TabsTrigger value="generator" className="flex-1">
            Create New Letter
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="letters">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-credify-blue animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading your dispute letters...</p>
          </div>
        ) : letters && letters.length > 0 ? (
          <DisputeLettersList 
            letters={letters}
            selectedLetter={selectedLetter}
            onSelectLetter={onSelectLetter}
            isLoading={isLoading}
            onCreateLetter={onCreateLetter}
            testMode={testMode}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-credify-navy/10 rounded-xl border border-gray-200 dark:border-gray-700/30">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">No Dispute Letters Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              {!hideGeneratorTab ? 
                "You haven't created any dispute letters yet. Use the generator to create your first letter." :
                "You haven't created any dispute letters yet. Upload a credit report to generate dispute letters automatically."}
            </p>
          </div>
        )}
      </TabsContent>

      {!hideGeneratorTab && (
        <TabsContent value="generator">
          <DisputeGenerator onGenerateDispute={onGenerateDispute} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default DisputeLettersTabs;
