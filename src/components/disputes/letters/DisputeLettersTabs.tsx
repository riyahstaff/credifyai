
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LettersTabContent from './LettersTabContent';
import TemplatesTabContent from './TemplatesTabContent';
import DisputeGenerator from '../DisputeGenerator';

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

interface DisputeLettersTabsProps {
  selectedView: string;
  onViewChange: (view: string) => void;
  letters: Letter[];
  isLoading: boolean;
  onViewLetter: (letter: Letter) => void;
  onDownloadLetter: (letter: Letter) => void;
  onSendLetter: (letter: Letter) => void;
  onGenerateDispute: (disputeData: any) => void;
}

const DisputeLettersTabs: React.FC<DisputeLettersTabsProps> = ({
  selectedView,
  onViewChange,
  letters,
  isLoading,
  onViewLetter,
  onDownloadLetter,
  onSendLetter,
  onGenerateDispute
}) => {
  return (
    <Tabs value={selectedView} onValueChange={onViewChange} className="mb-8">
      <TabsList className="mb-6">
        <TabsTrigger value="letters">My Letters</TabsTrigger>
        <TabsTrigger value="generator">Create New Letter</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="letters">
        <LettersTabContent 
          letters={letters}
          isLoading={isLoading}
          onViewLetter={onViewLetter}
          onDownloadLetter={onDownloadLetter}
          onSendLetter={onSendLetter}
          onCreateNewLetter={() => onViewChange('generator')}
        />
      </TabsContent>
      
      <TabsContent value="generator">
        <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-4 md:p-6">
          <h2 className="text-xl font-bold text-credify-navy dark:text-white mb-6">Create Dispute Letter</h2>
          <DisputeGenerator onGenerateDispute={onGenerateDispute} />
        </div>
      </TabsContent>
      
      <TabsContent value="templates">
        <TemplatesTabContent onUseTemplate={() => onViewChange('generator')} />
      </TabsContent>
    </Tabs>
  );
};

export default DisputeLettersTabs;
