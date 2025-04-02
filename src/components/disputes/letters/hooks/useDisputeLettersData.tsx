
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
  const [usingSampleData, setUsingSampleData] = useState(false);
  const location = useLocation();
  
  // Load letters from storage on component mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        setIsLoading(true);
        console.log("Loading dispute letters...");
        
        // Always force a fresh reload when coming from the analysis page
        const forceReload = sessionStorage.getItem('forceLettersReload');
        if (forceReload === 'true') {
          console.log("[useDisputeLettersData] Force reload flag detected, clearing it");
          sessionStorage.removeItem('forceLettersReload');
          
          // This helps ensure we're getting the most recent letters
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Try to load letters from session storage first (from real report processing)
        const generatedLettersJson = sessionStorage.getItem('generatedDisputeLetters');
        const pendingLetterJSON = sessionStorage.getItem('pendingDisputeLetter');
        const timestamp = sessionStorage.getItem('disputeLettersTimestamp');
        
        let foundRealLetters = false;
        
        // Check for generated letters first
        if (generatedLettersJson) {
          console.log(`Found generated letters in storage with timestamp: ${timestamp}`);
          
          try {
            const parsedLetters = JSON.parse(generatedLettersJson);
            
            if (Array.isArray(parsedLetters) && parsedLetters.length > 0) {
              console.log(`Successfully parsed ${parsedLetters.length} letters from storage`);
              
              // Verify these are real letters by checking content length
              if (parsedLetters.some(letter => letter.content && letter.content.length > 300)) {
                console.log("Found valid letters with substantial content");
                // Use the letters directly from storage
                setLetters(parsedLetters);
                setSelectedLetter(parsedLetters[0]);
                setUsingSampleData(false);
                foundRealLetters = true;
                
                toast({
                  title: "Dispute Letters Loaded",
                  description: `${parsedLetters.length} dispute ${parsedLetters.length === 1 ? 'letter has' : 'letters have'} been loaded from your credit report analysis.`,
                  duration: 5000,
                });
                
                setIsLoading(false);
                return;
              } else {
                console.warn("Generated letters found but content appears to be too short or invalid");
              }
            }
          } catch (error) {
            console.error("Error parsing letters from storage:", error);
          }
        }
        
        // Check for a pending letter if no generated letters found
        if (!foundRealLetters && pendingLetterJSON) {
          try {
            const pendingLetter = JSON.parse(pendingLetterJSON);
            console.log("Found pending letter in session storage");
            
            // Verify this is a real letter with substantial content
            if (pendingLetter.content && pendingLetter.content.length > 300) {
              console.log("Found valid pending letter with substantial content");
              
              // Create formatted letter
              const formattedLetter = {
                id: pendingLetter.id || Date.now(),
                title: pendingLetter.title || `${pendingLetter.errorType || 'Dispute'} (${pendingLetter.accountName || 'Account'})`,
                recipient: pendingLetter.bureau || pendingLetter.recipient || 'Credit Bureau',
                createdAt: pendingLetter.createdAt || new Date().toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                }),
                status: pendingLetter.status || 'draft',
                bureaus: pendingLetter.bureaus || [pendingLetter.bureau || 'Unknown'],
                content: pendingLetter.letterContent || pendingLetter.content,
                accountName: pendingLetter.accountName,
                accountNumber: pendingLetter.accountNumber,
                errorType: pendingLetter.errorType
              };
              
              setLetters([formattedLetter]);
              setSelectedLetter(formattedLetter);
              setUsingSampleData(false);
              foundRealLetters = true;
              
              toast({
                title: "Dispute Letter Loaded",
                description: "Your dispute letter has been loaded from your credit report analysis.",
                duration: 5000,
              });
              
              setIsLoading(false);
              return;
            } else {
              console.warn("Pending letter found but content appears to be too short or invalid");
            }
          } catch (error) {
            console.error("Error parsing pending letter:", error);
          }
        }
        
        // If no valid letters in storage, try loading from database if user is logged in
        if (!foundRealLetters && user?.id) {
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
              setSelectedLetter(formattedLetters[0]);
              setUsingSampleData(false);
              foundRealLetters = true;
              
              console.log("Loaded letters from database:", formattedLetters.length);
              
              toast({
                title: "Dispute Letters Loaded",
                description: `${formattedLetters.length} dispute ${formattedLetters.length === 1 ? 'letter has' : 'letters have'} been loaded from your account.`,
                duration: 5000,
              });
              
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error loading letters from database:", error);
          }
        }
        
        // If no real letters found after all attempts, use sample letters with clear notification
        if (!foundRealLetters) {
          console.log("[useDisputeLettersData] No real letters found, using sample letters");
          const sampleLetters = getSampleLetters();
          setLetters(sampleLetters);
          setSelectedLetter(sampleLetters[0]);
          setUsingSampleData(true);
          
          toast({
            title: "Using Sample Letters",
            description: "No dispute letters were generated from your credit report. Showing sample letters instead. Please upload and analyze your credit report first.",
            duration: 8000,
          });
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[useDisputeLettersData] Error loading dispute letters:", error);
        
        // Use sample letters as fallback
        const sampleLetters = getSampleLetters();
        setLetters(sampleLetters);
        setSelectedLetter(sampleLetters[0]);
        setUsingSampleData(true);
        
        toast({
          title: "Error Loading Letters",
          description: "There was a problem loading your dispute letters. Sample letters are displayed instead.",
          variant: "destructive",
          duration: 5000,
        });
        
        setIsLoading(false);
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
    setUsingSampleData(false);
    
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
    saveLetter,
    usingSampleData
  };
};
