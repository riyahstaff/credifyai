import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getUserDisputeLetters, saveDisputeLetter } from '@/lib/supabase/disputeLetters';
import type { Letter } from './sampleLettersData';
import { getSampleLetters } from './sampleLettersData';
import { 
  loadLettersFromStorage, 
  saveLettersToStorage, 
  addLetterToStorage 
} from './letterStorageUtils';

// Import the useAuth hook instead of AuthContext
import { useAuth } from '@/contexts/AuthContext';

export type { Letter }; // Export the Letter type properly

export const useDisputeLettersData = (testMode: boolean = false) => {
  const { toast } = useToast();
  const { user } = useAuth(); // Using useAuth hook which is correctly exported
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Load letters from storage on component mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        setIsLoading(true);
        console.log("Loading dispute letters...");
        
        const forceReload = sessionStorage.getItem('forceLettersReload');
        if (forceReload === 'true') {
          console.log("[useDisputeLettersData] Force reload flag detected, clearing it");
          sessionStorage.removeItem('forceLettersReload');
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Try to load letters from session storage first
        const { letters: storageLetters, selectedLetter: storageLetter, foundLetters } = loadLettersFromStorage();
        
        if (foundLetters) {
          setLetters(storageLetters);
          setSelectedLetter(storageLetter);
          
          const autoGeneratedFlag = sessionStorage.getItem('autoGeneratedLetter');
          if (autoGeneratedFlag === 'true') {
            toast({
              title: testMode ? "Test Letters Loaded" : "Dispute Letters Loaded",
              description: `${storageLetters.length} dispute ${storageLetters.length === 1 ? 'letter has' : 'letters have'} been loaded${testMode ? ' in test mode' : ''}.`,
              duration: 5000,
            });
          }
          
          setIsLoading(false);
          return;
        }
        
        // If no letters in storage, try loading from database if user is logged in
        if (user?.id) {
          try {
            const userLetters = await getUserDisputeLetters(user.id);
            if (userLetters && userLetters.length > 0) {
              const formattedLetters = userLetters.map(letter => ({
                id: letter.id,
                title: `${letter.error_type} Dispute (${letter.account_name})`,
                recipient: letter.bureau,
                createdAt: new Date(letter.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'in-progress',
                bureaus: [letter.bureau],
                laws: ['FCRA § 611', 'FCRA § 623'],
                content: letter.letter_content,
                letterContent: letter.letter_content,
                accountName: letter.account_name,
                accountNumber: letter.account_number,
                errorType: letter.error_type
              }));
              setLetters(formattedLetters);
              
              if (formattedLetters.length > 0) {
                setSelectedLetter(formattedLetters[0]);
              }
              
              console.log("Loaded letters from DB:", formattedLetters.length);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error loading letters from database:", error);
          }
        }
        
        // If no letters found in storage or database, use sample letters
        console.log("[useDisputeLettersData] No letters found in storage or database, creating sample letters");
        const sampleLetters = getSampleLetters();
        setLetters(sampleLetters);
        
        if (sampleLetters.length > 0) {
          setSelectedLetter(sampleLetters[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("[useDisputeLettersData] Error loading dispute letters:", error);
        
        // Use sample letters as fallback
        const sampleLetters = getSampleLetters();
        setLetters(sampleLetters);
        
        if (sampleLetters.length > 0) {
          setSelectedLetter(sampleLetters[0]);
        }
        
        setIsLoading(false);
        
        toast({
          title: "Error Loading Letters",
          description: "There was a problem loading your dispute letters. Sample letters are displayed instead.",
          variant: "destructive",
        });
      }
    };
    
    loadLetters();
  }, [toast, testMode, location.pathname, user?.id]);
  
  // Function to add a new letter
  const addLetter = (newLetter: Letter) => {
    // Add letter to state
    setLetters(prevLetters => {
      const updatedLetters = [newLetter, ...prevLetters];
      return updatedLetters;
    });
    
    // Update selected letter
    setSelectedLetter(newLetter);
    
    // Save to storage
    addLetterToStorage(newLetter);
  };
  
  // Function to save changes to letters
  const updateLetters = (updatedLetters: Letter[]) => {
    setLetters(updatedLetters);
    saveLettersToStorage(updatedLetters, selectedLetter);
  };

  // Function to save letter to database if user is logged in
  const saveLetter = async (disputeData: any) => {
    if (user?.id) {
      try {
        console.log("Saving letter to database:", disputeData.accountName);
        const saved = await saveDisputeLetter(user.id, disputeData);
        return saved;
      } catch (error) {
        console.error('Error saving dispute letter:', error);
        toast({
          title: "Error saving letter",
          description: "There was a problem saving your dispute letter to your account.",
          variant: "destructive",
        });
      }
    }
    return false;
  };
  
  return {
    letters,
    setLetters: updateLetters,
    addLetter,
    selectedLetter,
    setSelectedLetter,
    isLoading,
    saveLetter
  };
};
