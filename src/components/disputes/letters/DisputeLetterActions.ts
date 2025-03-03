
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useDisputeLetterActions = ({ onUpdateLetters }: { onUpdateLetters: (letters: any[]) => void }) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  
  const handleDownloadLetter = (letter: any) => {
    try {
      // Create a download link for the letter
      const element = document.createElement('a');
      const file = new Blob([letter.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      
      // Format a file name based on the letter properties
      const recipient = letter.recipient?.replace(/\s+/g, '_') || 'Credit_Bureau';
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `Dispute_Letter_${recipient}_${dateStr}.txt`;
      
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: 'Letter Downloaded',
        description: 'Your dispute letter has been saved to your device.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading letter:', error);
      toast({
        title: 'Download Failed',
        description: 'There was a problem downloading your letter. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };
  
  const handleSendLetter = async (letter: any, allLetters: any[]) => {
    setIsSending(true);
    try {
      // In a real implementation, we would send the letter via an API
      // For now, we'll simulate sending and update the status
      
      // Create a delay to simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the letter status to sent
      const updatedLetters = allLetters.map(l => {
        if (l.id === letter.id) {
          return {
            ...l,
            status: 'sent',
            resolvedAt: new Date().toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            })
          };
        }
        return l;
      });
      
      // Update letters in session storage
      try {
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(updatedLetters));
      } catch (error) {
        console.warn('Could not update letters in session storage:', error);
      }
      
      // Call the update function to refresh the UI
      onUpdateLetters(updatedLetters);
      
      toast({
        title: 'Letter Sent',
        description: `Your dispute letter has been sent to ${letter.recipient}.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error sending letter:', error);
      toast({
        title: 'Send Failed',
        description: 'There was a problem sending your letter. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return {
    isSending,
    handleDownloadLetter,
    handleSendLetter
  };
};
