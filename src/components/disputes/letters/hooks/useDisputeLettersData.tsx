
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/lib/supabase/client';

export interface Letter {
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

export interface UseDisputeLettersDataReturn {
  letters: Letter[];
  setLetters: (letters: Letter[]) => void;
  addLetter: (letter: Letter) => void;
  selectedLetter: Letter | null;
  setSelectedLetter: (letter: Letter | null) => void;
  isLoading: boolean;
  profile?: Profile;
  saveLetter?: (letter: Letter) => Promise<boolean>;
}

export function useDisputeLettersData(testMode: boolean = false): UseDisputeLettersDataReturn {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  
  // Define the loadSampleLetters function that was referenced but not found
  const loadSampleLetters = () => {
    console.log("Loading sample letters as fallback");
    
    const sampleLetters: Letter[] = [
      {
        id: 1,
        title: 'Sample Dispute Letter',
        recipient: 'Experian',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'ready',
        bureaus: ['Experian'],
        content: `Dear Experian,\n\nI am writing to dispute information in my credit report that I believe to be inaccurate. Under the Fair Credit Reporting Act, I request that you investigate and correct the following item:\n\nAccount: Capital One\nReason for dispute: This account does not belong to me.\n\nPlease investigate this matter and update my credit report accordingly.\n\nSincerely,\n[Your Name]`,
        accountName: 'Capital One',
        errorType: 'Identity Theft'
      }
    ];
    
    setLetters(sampleLetters);
    setSelectedLetter(sampleLetters[0]);
    setIsLoading(false);
    
    toast({
      title: "Sample Letter Created",
      description: "We've created a sample dispute letter for you to review.",
    });
  };
  
  // Load user profile if available
  useEffect(() => {
    try {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }, []);
  
  // Force exit loading state after 10 seconds - this is our failsafe
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.log("Forcing exit from loading state after timeout");
        setIsLoading(false);
        
        // Check if we still have no letters and show message
        if (letters.length === 0) {
          toast({
            title: "Loading timeout reached",
            description: "We couldn't load your dispute letters. Please try refreshing the page or creating a new letter.",
          });
          
          // Try to load sample letters as fallback
          loadSampleLetters();
        }
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, letters.length, toast]);

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
              
              // Set first letter as selected by default
              if (formattedLetters.length > 0 && !selectedLetter) {
                setSelectedLetter(formattedLetters[0]);
              }
              
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
            setSelectedLetter(formattedLetter);
            
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
        
        // If no letters found, try loading sample letters
        loadSampleLetters();
        
      } catch (error) {
        console.error("Error loading dispute letters:", error);
        setLetters([]);
        setIsLoading(false);
        
        toast({
          title: "Error Loading Letters",
          description: "There was a problem loading your dispute letters.",
          variant: "destructive",
        });
        
        // Load sample letters as fallback
        loadSampleLetters();
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
    
    // Auto-select the new letter
    setSelectedLetter(newLetter);
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
  
  // Function to save a letter (stub)
  const saveLetter = async (letter: Letter): Promise<boolean> => {
    // For now this just updates the local state
    // In a real implementation, this would save to the backend
    try {
      const updatedLetters = letters.map(l => 
        l.id === letter.id ? { ...l, ...letter } : l
      );
      updateLetters(updatedLetters);
      return true;
    } catch (error) {
      console.error("Error saving letter:", error);
      return false;
    }
  };
  
  return {
    letters,
    setLetters: updateLetters,
    addLetter,
    selectedLetter,
    setSelectedLetter,
    isLoading,
    profile,
    saveLetter
  };
}
