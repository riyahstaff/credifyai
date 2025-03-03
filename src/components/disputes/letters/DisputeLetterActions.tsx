
import React from 'react';
import { useToast } from '@/hooks/use-toast';

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

interface DisputeLetterActionsProps {
  onUpdateLetters: (updatedLetters: Letter[]) => void;
}

/**
 * Custom hook for dispute letter actions
 */
export const useDisputeLetterActions = ({ onUpdateLetters }: DisputeLetterActionsProps) => {
  const { toast } = useToast();

  const handleDownloadLetter = (letter: Letter) => {
    if (!letter) return;
    
    // Create text file with letter content
    const element = document.createElement('a');
    const file = new Blob([letter.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${letter.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter downloaded",
      description: "Your dispute letter has been downloaded to your device.",
    });
  };
  
  const handleSendLetter = (letter: Letter, letters: Letter[]) => {
    // In a real implementation, this would send the letter via API or email
    if (!letter) return;
    
    // Update the letter status to in-progress
    const updatedLetters = letters.map(l => 
      l.id === letter.id 
        ? { ...l, status: 'in-progress' } 
        : l
    );
    
    onUpdateLetters(updatedLetters);
    
    toast({
      title: "Letter queued for sending",
      description: "Your dispute letter will be sent to the credit bureau.",
    });
  };

  return { handleDownloadLetter, handleSendLetter };
};

export default useDisputeLetterActions;
