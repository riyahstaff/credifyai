
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  content: string;
  accountName?: string;
  accountNumber?: string;
  errorType?: string;
}

export function useDisputeLettersData(testMode: boolean = false) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  
  // Load letters from storage on component mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        setIsLoading(true);
        console.log("[useDisputeLettersData] Loading dispute letters...");
        
        // First check session storage for automatically generated letters
        const generatedLettersJSON = sessionStorage.getItem('generatedDisputeLetters');
        const pendingLetterJSON = sessionStorage.getItem('pendingDisputeLetter');
        const autoGeneratedFlag = sessionStorage.getItem('autoGeneratedLetter');
        
        console.log("[useDisputeLettersData] Auto-generated flag:", autoGeneratedFlag);
        console.log("[useDisputeLettersData] Generated letters JSON exists:", !!generatedLettersJSON);
        console.log("[useDisputeLettersData] Pending letter JSON exists:", !!pendingLetterJSON);
        
        if (generatedLettersJSON) {
          try {
            const parsedLetters = JSON.parse(generatedLettersJSON);
            console.log("[useDisputeLettersData] Parsed generated letters:", parsedLetters);
            
            if (Array.isArray(parsedLetters) && parsedLetters.length > 0) {
              console.log(`[useDisputeLettersData] Found ${parsedLetters.length} generated letters in session storage`);
              
              // Transform the letters to match our Letter interface
              const formattedLetters = parsedLetters.map((letter, index) => ({
                id: letter.id || Date.now() + index,
                title: letter.title || `${letter.errorType || 'Dispute'} (${letter.accountName || 'Account'})`,
                recipient: letter.bureau || letter.recipient || 'Credit Bureau',
                createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                }),
                status: letter.status || 'draft',
                bureaus: letter.bureaus || [letter.bureau || 'Unknown'],
                content: letter.letterContent || letter.content || '',
                accountName: letter.accountName || '',
                accountNumber: letter.accountNumber || '',
                errorType: letter.errorType || 'General Dispute'
              }));
              
              console.log("[useDisputeLettersData] Formatted letters:", formattedLetters);
              setLetters(formattedLetters);
              
              // Also select the first letter
              if (formattedLetters.length > 0) {
                setSelectedLetter(formattedLetters[0]);
                console.log("[useDisputeLettersData] Selected first letter:", formattedLetters[0]);
              }
              
              // Toast notification about loaded letters
              if (autoGeneratedFlag === 'true') {
                toast({
                  title: testMode ? "Test Letters Loaded" : "Dispute Letters Loaded",
                  description: `${formattedLetters.length} dispute ${formattedLetters.length === 1 ? 'letter has' : 'letters have'} been loaded${testMode ? ' in test mode' : ''}.`,
                  duration: 5000,
                });
              }
              
              setIsLoading(false);
              return;
            } else {
              console.warn("[useDisputeLettersData] Parsed generated letters is not an array or is empty");
            }
          } catch (error) {
            console.error("[useDisputeLettersData] Error parsing generated letters:", error);
          }
        } 
        
        // If we don't have multiple letters, check for a single pending letter
        if (pendingLetterJSON) {
          try {
            const pendingLetter = JSON.parse(pendingLetterJSON);
            console.log("[useDisputeLettersData] Found pending letter in session storage", pendingLetter);
            
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
              content: pendingLetter.letterContent || pendingLetter.content || '',
              accountName: pendingLetter.accountName || '',
              accountNumber: pendingLetter.accountNumber || '',
              errorType: pendingLetter.errorType || 'General Dispute'
            };
            
            // Ensure the letter content is not empty
            if (!formattedLetter.content || formattedLetter.content.length < 10) {
              formattedLetter.content = `
Dear ${formattedLetter.recipient},

I am writing to dispute the following information in my credit report:

Account Name: ${formattedLetter.accountName || "Unknown"}
Account Number: ${formattedLetter.accountNumber || "Unknown"}
Issue: ${formattedLetter.errorType || "Inaccurate Information"}

Under the Fair Credit Reporting Act, you are required to investigate this dispute and remove any inaccurate information.

Sincerely,
[YOUR NAME]
              `;
            }
            
            console.log("[useDisputeLettersData] Formatted pending letter:", formattedLetter);
            setLetters([formattedLetter]);
            setSelectedLetter(formattedLetter);
            
            // Toast notification
            if (autoGeneratedFlag === 'true') {
              toast({
                title: testMode ? "Test Letter Loaded" : "Dispute Letter Loaded",
                description: "Your dispute letter has been loaded from session storage.",
                duration: 5000,
              });
            }
            
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("[useDisputeLettersData] Error parsing pending letter:", error);
          }
        }
        
        // Try once more after a short delay (handles race conditions)
        setTimeout(() => {
          const retryGeneratedLetters = sessionStorage.getItem('generatedDisputeLetters');
          const retryPendingLetter = sessionStorage.getItem('pendingDisputeLetter');
          
          if (retryGeneratedLetters || retryPendingLetter) {
            console.log("[useDisputeLettersData] Found letters on retry, reloading page");
            window.location.reload();
            return;
          }
          
          // If no letters found in session storage, set empty array
          console.log("[useDisputeLettersData] No letters found in session storage after retry");
          setLetters([]);
          setIsLoading(false);
        }, 500);
        
      } catch (error) {
        console.error("[useDisputeLettersData] Error loading dispute letters:", error);
        setLetters([]);
        setIsLoading(false);
        
        toast({
          title: "Error Loading Letters",
          description: "There was a problem loading your dispute letters.",
          variant: "destructive",
        });
      }
    };
    
    loadLetters();
  }, [toast, testMode, location.pathname]);
  
  // Function to add a new letter
  const addLetter = (newLetter: Letter) => {
    setLetters(prevLetters => {
      const updatedLetters = [...prevLetters, newLetter];
      try {
        // Ensure the letter has required fields
        if (!newLetter.content && newLetter.letterContent) {
          newLetter.content = newLetter.letterContent;
        }
        
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(updatedLetters));
        // Also update the pendingDisputeLetter
        if (updatedLetters.length === 1) {
          sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(updatedLetters[0]));
        }
        sessionStorage.setItem('autoGeneratedLetter', 'true');
      } catch (error) {
        console.error("[useDisputeLettersData] Error storing updated letters:", error);
      }
      return updatedLetters;
    });
    
    // Select the newly added letter
    setSelectedLetter(newLetter);
  };
  
  // Function to save changes to letters
  const updateLetters = (updatedLetters: Letter[]) => {
    setLetters(updatedLetters);
    try {
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(updatedLetters));
      // Also update the pendingDisputeLetter if it exists
      if (updatedLetters.length > 0) {
        if (selectedLetter) {
          // Find and update the current selected letter
          const updatedSelectedLetter = updatedLetters.find(letter => letter.id === selectedLetter.id);
          if (updatedSelectedLetter) {
            setSelectedLetter(updatedSelectedLetter);
            sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(updatedSelectedLetter));
          } else {
            // If the selected letter was deleted, select the first one
            setSelectedLetter(updatedLetters[0]);
            sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(updatedLetters[0]));
          }
        } else {
          // If no letter is selected, select the first one
          setSelectedLetter(updatedLetters[0]);
          sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(updatedLetters[0]));
        }
        
        // Ensure the auto-generated flag is set
        sessionStorage.setItem('autoGeneratedLetter', 'true');
      } else {
        // If all letters were deleted, clear the selected letter
        setSelectedLetter(null);
        sessionStorage.removeItem('pendingDisputeLetter');
        sessionStorage.removeItem('autoGeneratedLetter');
      }
    } catch (error) {
      console.error("[useDisputeLettersData] Error storing updated letters:", error);
    }
  };
  
  return {
    letters,
    setLetters: updateLetters,
    addLetter,
    selectedLetter,
    setSelectedLetter,
    isLoading
  };
}
