
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DisputeLettersList from './DisputeLettersList';
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
  hideGeneratorTab?: boolean;
}

const DisputeLettersTabs: React.FC<DisputeLettersTabsProps> = ({
  selectedView,
  onViewChange,
  letters,
  isLoading,
  onViewLetter,
  onDownloadLetter,
  onSendLetter,
  onGenerateDispute,
  hideGeneratorTab = false
}) => {
  return (
    <Tabs defaultValue={selectedView} value={selectedView} onValueChange={onViewChange} className="w-full">
      <TabsList className="grid w-full grid-cols-1 mb-8">
        <TabsTrigger value="letters">Your Dispute Letters</TabsTrigger>
        {!hideGeneratorTab && (
          <TabsTrigger value="generator">Create New Letter</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="letters" className="mt-0">
        <DisputeLettersList
          letters={letters}
          isLoading={isLoading}
          onViewLetter={onViewLetter}
          onDownloadLetter={onDownloadLetter}
          onSendLetter={onSendLetter}
        />
      </TabsContent>
      
      {!hideGeneratorTab && (
        <TabsContent value="generator" className="mt-0">
          <DisputeGenerator onGenerateDispute={onGenerateDispute} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default DisputeLettersTabs;
