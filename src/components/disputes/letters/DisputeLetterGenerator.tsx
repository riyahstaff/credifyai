
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
    console.log('Generating dispute with full data:', disputeData);
    
    try {
      // Get user info from local storage or use placeholder
      // If we have actual account data, use it
      const actualAccountInfo = disputeData.actualAccountInfo || {};
      
      // Extract user info from storage or dispute data
      const userInfo = {
        name: localStorage.getItem('userName') || localStorage.getItem('name') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      console.log("User info for letter:", userInfo);
      console.log("Account info for letter:", actualAccountInfo);
      
      // If letterContent is not provided, generate it
      if (!disputeData.letterContent) {
        // Generate letter content with detailed account information
        disputeData.letterContent = await generateEnhancedDisputeLetter(
          disputeData.errorType,
          {
            accountName: disputeData.accountName || actualAccountInfo.name || "Unknown Account",
            accountNumber: disputeData.accountNumber || actualAccountInfo.number || "xxxx",
            errorDescription: disputeData.explanation,
            bureau: disputeData.bureau
          },
          userInfo
        );
        
        // Remove the KEY explanation if present
        if (disputeData.letterContent) {
          disputeData.letterContent = disputeData.letterContent.replace(
            /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
            ''
          );
        }
      }
      
      // Create a new letter from the dispute data
      const newLetter = {
        id: Date.now(),
        title: `${disputeData.errorType} (${disputeData.accountName || actualAccountInfo.name || "Unknown Account"})`,
        recipient: disputeData.bureau,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'ready', // Status is "ready"
        bureaus: [disputeData.bureau],
        laws: ['FCRA § 611', 'FCRA § 623'],
        content: disputeData.letterContent
      };
      
      // Log the generated letter
      console.log("Generated letter:", {
        title: newLetter.title,
        contentLength: newLetter.content.length,
        content: newLetter.content.substring(0, 100) + "..." // Log just the beginning
      });
      
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
