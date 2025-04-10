
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import {
  loadLettersFromStorage,
  saveLettersToStorage,
  addLetterToStorage
} from './letterStorageUtils';
import { supabase } from '@/integrations/supabase/client';

// Export the Letter interface/type separately so it can be imported elsewhere
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
  recipient: string;
  bureaus: string[]; // Required property for compatibility
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
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  // Effect to load letters on mount
  useEffect(() => {
    // Prevent double-loading or infinite loops
    if (loadAttempt > 3) {
      setIsLoading(false);
      return;
    }
    
    const loadLetters = async () => {
      try {
        setIsLoading(true);
        console.log("Loading letters from storage, user:", user?.id, "profile:", profile?.id);
        
        // Check if we should reload based on the forceLettersReload flag
        const forceReload = sessionStorage.getItem('forceLettersReload');
        if (forceReload === 'true') {
          console.log("Force reload flag detected, clearing cached letters");
          // Clear the flag so it doesn't cause infinite reloads
          sessionStorage.setItem('forceLettersReload', 'done');
        }
        
        // Check if we should load from Supabase
        if (user?.id && !testMode) {
          console.log("Attempting to load letters from Supabase for user:", user.id);
          
          try {
            const { data: dbLetters, error } = await supabase
              .from('dispute_letters')
              .select('*')
              .eq('userId', user.id)
              .order('createdAt', { ascending: false });
              
            if (error) {
              console.error("Error loading letters from Supabase:", error);
              throw error;
            }
            
            if (dbLetters && dbLetters.length > 0) {
              console.log("Successfully loaded letters from Supabase:", dbLetters.length);
              
              // Format letters to match our interface
              const formattedLetters: Letter[] = dbLetters.map(letter => ({
                id: letter.id,
                title: letter.title,
                bureau: letter.bureau,
                accountName: letter.accountName || '',
                accountNumber: letter.accountNumber || '',
                content: letter.letterContent || letter.content,
                letterContent: letter.content || letter.letterContent,
                createdAt: new Date(letter.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                }),
                status: letter.status,
                errorType: letter.errorType,
                recipient: letter.bureau,
                bureaus: [letter.bureau]
              }));
              
              setLetters(formattedLetters);
              
              if (formattedLetters.length > 0 && !selectedLetter) {
                setSelectedLetter(formattedLetters[0]);
              }
              
              setIsLoading(false);
              return;
            } else {
              console.log("No letters found in Supabase, falling back to session storage");
            }
          } catch (error) {
            console.error("Error in Supabase letter lookup:", error);
            // Continue to local storage as fallback
          }
        }
        
        // Fallback to local storage
        const loadedLetters = await loadLettersFromStorage();
        console.log("Loaded letters from local storage:", loadedLetters.length);
        
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
        
        // Increment attempt counter and try again if we still have attempts left
        setLoadAttempt(prev => prev + 1);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLetters();
  }, [user, profile, toast, testMode, loadAttempt, selectedLetter]);

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
        bureaus: letterData.bureaus || [letterData.bureau || "Credit Bureau"],
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
      
      // Try to save to Supabase if we have a user
      if (user?.id && !testMode) {
        try {
          // Format for Supabase
          const letterForDb = {
            title: newLetter.title,
            bureau: newLetter.bureau,
            accountName: newLetter.accountName,
            accountNumber: newLetter.accountNumber,
            content: newLetter.content,
            letterContent: newLetter.letterContent || newLetter.content,
            errorType: newLetter.errorType,
            status: newLetter.status,
            userId: user.id
          };
          
          const { data, error } = await supabase
            .from('dispute_letters')
            .insert(letterForDb)
            .select();
            
          if (error) {
            console.error("Error saving letter to Supabase:", error);
            // Continue to save locally if Supabase fails
          } else if (data && data[0]) {
            console.log("Letter saved to Supabase successfully:", data[0].id);
            
            // Update the letter with the database ID
            newLetter.id = data[0].id;
            updatedLetters[updatedLetters.length - 1] = newLetter;
            setLetters([...updatedLetters]);
            setSelectedLetter(newLetter);
          }
        } catch (dbError) {
          console.error("Error in Supabase letter insertion:", dbError);
          // Continue with local storage as fallback
        }
      }
      
      // Save to local storage (as fallback or if not using Supabase)
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
      
      // Try to save to Supabase if we have a user and a valid UUID
      if (user?.id && !testMode && typeof letter.id === 'string' && letter.id.includes('-')) {
        try {
          // Format for Supabase
          const letterForDb = {
            title: letter.title,
            bureau: letter.bureau,
            accountName: letter.accountName,
            accountNumber: letter.accountNumber,
            content: letter.content,
            letterContent: letter.letterContent || letter.content,
            errorType: letter.errorType,
            status: letter.status,
          };
          
          const { error } = await supabase
            .from('dispute_letters')
            .update(letterForDb)
            .eq('id', letter.id)
            .eq('userId', user.id);
            
          if (error) {
            console.error("Error updating letter in Supabase:", error);
            // Continue to save locally if Supabase fails
          } else {
            console.log("Letter updated in Supabase successfully");
          }
        } catch (dbError) {
          console.error("Error in Supabase letter update:", dbError);
          // Continue with local storage as fallback
        }
      }
      
      // Save to storage as fallback
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
