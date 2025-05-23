
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
        console.log("Loading dispute letters...");
        
        // First check session storage for automatically generated letters
        const generatedLettersJSON = sessionStorage.getItem('generatedDisputeLetters');
        const pendingLetterJSON = sessionStorage.getItem('pendingDisputeLetter');
        
        if (generatedLettersJSON) {
          try {
            const parsedLetters = JSON.parse(generatedLettersJSON);
            if (Array.isArray(parsedLetters) && parsedLetters.length > 0) {
              console.log(`Found ${parsedLetters.length} generated letters in session storage`);
              
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
                content: letter.letterContent || letter.content,
                accountName: letter.accountName,
                accountNumber: letter.accountNumber,
                errorType: letter.errorType
              }));
              
              setLetters(formattedLetters);
              
              // Toast notification about loaded letters
              toast({
                title: testMode ? "Test Letters Loaded" : "Dispute Letters Loaded",
                description: `${formattedLetters.length} dispute ${formattedLetters.length === 1 ? 'letter has' : 'letters have'} been loaded${testMode ? ' in test mode' : ''}.`,
                duration: 5000,
              });
              
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error parsing generated letters:", error);
          }
        } 
        
        // If we don't have multiple letters, check for a single pending letter
        if (pendingLetterJSON) {
          try {
            const pendingLetter = JSON.parse(pendingLetterJSON);
            console.log("Found pending letter in session storage");
            
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
            
            // Toast notification
            toast({
              title: testMode ? "Test Letter Loaded" : "Dispute Letter Loaded",
              description: "Your dispute letter has been loaded from session storage.",
              duration: 5000,
            });
            
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing pending letter:", error);
          }
        }
        
        // If no letters found in session storage, set empty array
        console.log("No letters found in session storage");
        setLetters([]);
        setIsLoading(false);
        
      } catch (error) {
        console.error("Error loading dispute letters:", error);
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
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(updatedLetters));
      } catch (error) {
        console.error("Error storing updated letters:", error);
      }
      return updatedLetters;
    });
  };
  
  // Function to save changes to letters
  const updateLetters = (updatedLetters: Letter[]) => {
    setLetters(updatedLetters);
    try {
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(updatedLetters));
    } catch (error) {
      console.error("Error storing updated letters:", error);
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
