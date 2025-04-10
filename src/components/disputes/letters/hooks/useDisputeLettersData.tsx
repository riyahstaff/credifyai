
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import {
  loadLettersFromStorage,
  saveLettersToStorage,
  addLetterToStorage
} from './letterStorageUtils';

export interface Letter {
  id: number | string;
  title: string;
  bureau: string;
  accountName: string;
  accountNumber?: string;
  content: string;
  letterContent?: string; // For compatibility
  createdAt: string;
  status: string;
  errorType?: string;
  recipient?: string;
}

/**
 * Hook to manage dispute letter data
 */
export function useDisputeLettersData(testMode: boolean = false) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect to load letters on mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        setIsLoading(true);
        console.log("Loading letters from storage, user:", user?.id, "profile:", profile?.id);
        
        // Load letters from storage
        const loadedLetters = await loadLettersFromStorage();
        console.log("Loaded letters:", loadedLetters.length);
        
        // Set letters state
        setLetters(loadedLetters);
        
        // Select the first letter if available
        if (loadedLetters.length > 0 && !selectedLetter) {
          setSelectedLetter(loadedLetters[0]);
        }
      } catch (error) {
        console.error("Error loading letters:", error);
        toast({
          title: "Error Loading Letters",
          description: "Failed to load dispute letters. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLetters();
    
    // Add an interval to check for new letters (useful when navigated back from letter generation)
    const checkInterval = setInterval(() => {
      if (letters.length === 0) {
        console.log("Checking for new letters...");
        loadLetters();
      }
    }, 2000);
    
    return () => clearInterval(checkInterval);
  }, [user, profile, toast]);

  // Function to add a new letter
  const addLetter = async (letterData: any) => {
    try {
      // Create a new letter object
      const newLetter: Letter = {
        id: Date.now(),
        title: letterData.title || "Credit Report Dispute",
        bureau: letterData.bureau || "Credit Bureau",
        accountName: letterData.accountName || "Multiple Accounts",
        accountNumber: letterData.accountNumber || "",
        content: letterData.content || letterData.letterContent || "",
        letterContent: letterData.letterContent || letterData.content || "",
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "ready",
        errorType: letterData.errorType || "General Dispute",
        recipient: letterData.recipient || letterData.bureau || "Credit Bureau",
      };
      
      // Validate letter content
      if (!newLetter.content || newLetter.content.length < 10) {
        console.error("Invalid letter content:", newLetter.content);
        toast({
          title: "Error Adding Letter",
          description: "The letter content is invalid or too short.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Adding new letter:", newLetter);
      
      // Update state
      const updatedLetters = [...letters, newLetter];
      setLetters(updatedLetters);
      setSelectedLetter(newLetter);
      
      // Save to storage
      await addLetterToStorage(newLetter);
      
      // Show success toast
      toast({
        title: "Letter Added",
        description: "Your dispute letter has been added successfully.",
      });
      
      return newLetter;
    } catch (error) {
      console.error("Error adding letter:", error);
      toast({
        title: "Error Adding Letter",
        description: "Failed to add dispute letter. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to save a letter
  const saveLetter = async (letter: Letter) => {
    try {
      // Find and update the letter
      const updatedLetters = letters.map((l) => (l.id === letter.id ? letter : l));
      setLetters(updatedLetters);
      
      // Update selection if this is the selected letter
      if (selectedLetter && selectedLetter.id === letter.id) {
        setSelectedLetter(letter);
      }
      
      // Save to storage
      await saveLettersToStorage(updatedLetters);
      
      // Show success toast
      toast({
        title: "Letter Saved",
        description: "Your dispute letter has been saved successfully.",
      });
      
      return letter;
    } catch (error) {
      console.error("Error saving letter:", error);
      toast({
        title: "Error Saving Letter",
        description: "Failed to save dispute letter. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return {
    letters,
    setLetters,
    selectedLetter,
    setSelectedLetter,
    isLoading,
    addLetter,
    saveLetter,
    profile,
  };
}
