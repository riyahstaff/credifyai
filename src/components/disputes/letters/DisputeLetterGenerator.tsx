
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

interface DisputeLetterGeneratorProps {
  onAddNewLetter: (newLetter: Letter) => void;
  saveLetter: (disputeData: any) => Promise<boolean>;
}

const DisputeLetterGenerator: React.FC<DisputeLetterGeneratorProps> = ({ 
  onAddNewLetter,
  saveLetter
}) => {
  const { toast } = useToast();

  const handleGenerateDispute = async (disputeData: any) => {
    // Create a new letter from the dispute data
    console.log('Generated dispute:', disputeData);
    
    const newLetter = {
      id: Date.now(),
      title: `${disputeData.errorType} Dispute (${disputeData.accountName})`,
      recipient: disputeData.bureau,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'draft',
      bureaus: [disputeData.bureau],
      laws: ['FCRA § 611', 'FCRA § 623'],
      content: disputeData.letterContent
    };
    
    // Add the new letter 
    onAddNewLetter(newLetter);
    
    // Save the letter to Supabase if user is logged in
    try {
      const saved = await saveLetter(disputeData);
      if (saved) {
        toast({
          title: "Dispute letter saved",
          description: "Your dispute letter has been saved to your account.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error in handleGenerateDispute:', error);
    }
    
    toast({
      title: "Dispute letter created",
      description: "Your dispute letter has been generated and is ready for review.",
      duration: 5000,
    });
  };

  return { handleGenerateDispute };
};

export default DisputeLetterGenerator;
