
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

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

/**
 * Custom hook for dispute letter generation
 */
export const useDisputeLetterGenerator = ({ 
  onAddNewLetter,
  saveLetter
}: DisputeLetterGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';

  // Log test mode status
  useEffect(() => {
    if (testMode) {
      console.log("DisputeLetterGenerator: Test mode active");
    }
  }, [testMode]);

  const handleGenerateDispute = async (disputeData: any) => {
    setIsGenerating(true);
    console.log('Generating dispute:', disputeData, 'Test mode:', testMode);
    
    try {
      // If letterContent is not provided, generate it
      if (!disputeData.letterContent) {
        // Get user info from local storage or use placeholder
        const userInfo = {
          name: localStorage.getItem('userName') || "[YOUR NAME]",
          address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
          city: localStorage.getItem('userCity') || "[CITY]",
          state: localStorage.getItem('userState') || "[STATE]",
          zip: localStorage.getItem('userZip') || "[ZIP]"
        };
        
        // Generate letter content
        disputeData.letterContent = await generateEnhancedDisputeLetter(
          disputeData.errorType,
          {
            accountName: disputeData.accountName,
            accountNumber: disputeData.accountNumber,
            errorDescription: disputeData.explanation,
            bureau: disputeData.bureau
          },
          userInfo
        );
      }
      
      // Create a new letter from the dispute data
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
      
      // Only try to save the letter if not in test mode or if user is authenticated
      if (!testMode) {
        try {
          // Save the letter to Supabase if user is logged in
          const saved = await saveLetter(disputeData);
          if (saved) {
            toast({
              title: "Dispute letter saved",
              description: "Your dispute letter has been saved to your account.",
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Error saving letter to account:", error);
          // We still continue even if saving fails
        }
      } else {
        // In test mode, we just notify the user that we're in test mode
        toast({
          title: "Test Mode Active",
          description: "Letter generated but not saved to account in test mode.",
          duration: 5000,
        });
      }
      
      toast({
        title: "Dispute letter created",
        description: "Your dispute letter has been generated and is ready for review.",
        duration: 5000,
      });
      
      // Set flag in session storage to indicate a letter was generated
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      
      return true;
    } catch (error) {
      console.error('Error in handleGenerateDispute:', error);
      toast({
        title: "Error generating letter",
        description: "There was a problem generating your dispute letter. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerateDispute, isGenerating };
};

export default useDisputeLetterGenerator;
