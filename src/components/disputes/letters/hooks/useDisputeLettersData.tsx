
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

  // Add reload trigger based on URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const forceReload = params.get('reload') === 'true';
    
    if (forceReload) {
      console.log("Force reload triggered by URL parameter");
      sessionStorage.setItem('forceLettersReload', 'true');
    }
  }, [location]);
  
  // Force exit loading state after timeout - this is our failsafe
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.log("Forcing exit from loading state after timeout");
        setIsLoading(false);
        
        if (letters.length === 0) {
          toast({
            title: "Loading timeout reached",
            description: "We couldn't load your dispute letters. Please try refreshing the page.",
          });
        }
      }, 3000); // 3 second timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, letters.length, toast]);

  // Check if there's credit report data that should trigger letter generation
  useEffect(() => {
    const checkForCreditReport = async () => {
      console.log("Checking for credit report data...");
      
      const reportData = sessionStorage.getItem('creditReportData');
      const forceGeneration = sessionStorage.getItem('forceLetterGeneration') === 'true';
      const isReportReady = sessionStorage.getItem('reportReadyForLetters') === 'true';
      
      if (reportData && (forceGeneration || isReportReady)) {
        // If we're here, we should generate a letter if one doesn't exist
        if (!sessionStorage.getItem('pendingDisputeLetter') && !sessionStorage.getItem('generatedDisputeLetters')) {
          console.log("Credit report found with force generation flag, but no letter exists - generating one now");
          
          try {
            // Import the letter generator dynamically
            const { generateAutomaticDisputeLetter } = await import('@/components/ai/services/disputes/automaticLetterGenerator');
            
            // Generate a letter using the report data
            const parsedData = JSON.parse(reportData);
            
            // Get target account if specified
            const targetAccountJSON = sessionStorage.getItem('disputeTargetAccount');
            let accountName: string | undefined = undefined;
            
            if (targetAccountJSON) {
              try {
                const targetAccount = JSON.parse(targetAccountJSON);
                accountName = targetAccount.accountName;
              } catch (e) {
                console.error("Error parsing target account:", e);
              }
            }
            
            await generateAutomaticDisputeLetter(parsedData, accountName);
            console.log("Generated letter from credit report data on letters page");
            
            // Clear the force generation flag
            sessionStorage.removeItem('forceLetterGeneration');
          } catch (error) {
            console.error("Error auto-generating letter:", error);
          }
        } else {
          console.log("Credit report found but letter already exists - not generating");
          // Clear the force generation flag
          sessionStorage.removeItem('forceLetterGeneration');
        }
      }
    };
    
    checkForCreditReport();
  }, []);

  // Load letters from storage on component mount
  useEffect(() => {
    const loadLetters = async () => {
      try {
        setIsLoading(true);
        console.log("Loading dispute letters...");
        
        // First check session storage for automatically generated letters
        const generatedLettersJSON = sessionStorage.getItem('generatedDisputeLetters');
        const pendingLetterJSON = sessionStorage.getItem('pendingDisputeLetter');
        const autoLetterJSON = sessionStorage.getItem('autoGeneratedLetter');
        
        // Try generatedDisputeLetters first (multiple letters)
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
                content: letter.letterContent || letter.content || "",
                accountName: letter.accountName || "Unknown Account",
                accountNumber: letter.accountNumber || "",
                errorType: letter.errorType || "General Dispute"
              }));
              
              setLetters(formattedLetters);
              
              // Set first letter as selected by default
              if (formattedLetters.length > 0 && !selectedLetter) {
                setSelectedLetter(formattedLetters[0]);
              }
              
              toast({
                title: testMode ? "Test Letters Loaded" : "Dispute Letters Loaded",
                description: `${formattedLetters.length} dispute ${formattedLetters.length === 1 ? 'letter has' : 'letters have'} been loaded.`,
                duration: 3000,
              });
              
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error parsing generated letters:", error);
          }
        } 
        
        // Try autoGeneratedLetter next
        if (autoLetterJSON) {
          try {
            const autoLetter = JSON.parse(autoLetterJSON);
            console.log("Found auto-generated letter in session storage");
            
            // Create formatted letter
            const formattedLetter = {
              id: autoLetter.id || Date.now(),
              title: autoLetter.title || `${autoLetter.errorType || 'Dispute'} (${autoLetter.accountName || 'Account'})`,
              recipient: autoLetter.bureau || autoLetter.recipient || 'Credit Bureau',
              createdAt: autoLetter.createdAt || new Date().toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric' 
              }),
              status: autoLetter.status || 'ready',
              bureaus: autoLetter.bureaus || [autoLetter.bureau || 'Unknown'],
              content: autoLetter.letterContent || autoLetter.content || "",
              accountName: autoLetter.accountName || "Unknown Account",
              accountNumber: autoLetter.accountNumber || "",
              errorType: autoLetter.errorType || "General Dispute"
            };
            
            setLetters([formattedLetter]);
            setSelectedLetter(formattedLetter);
            
            toast({
              title: testMode ? "Test Letter Loaded" : "Dispute Letter Loaded",
              description: "Your dispute letter has been loaded from session storage.",
              duration: 3000,
            });
            
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing auto-generated letter:", error);
          }
        }
        
        // If no auto letter, try pendingLetter last
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
              content: pendingLetter.letterContent || pendingLetter.content || "",
              accountName: pendingLetter.accountName || "Unknown Account",
              accountNumber: pendingLetter.accountNumber || "",
              errorType: pendingLetter.errorType || "General Dispute"
            };
            
            setLetters([formattedLetter]);
            setSelectedLetter(formattedLetter);
            
            toast({
              title: testMode ? "Test Letter Loaded" : "Dispute Letter Loaded",
              description: "Your dispute letter has been loaded from session storage.",
              duration: 3000,
            });
            
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing pending letter:", error);
          }
        }
        
        // If no letters found, try to generate one from credit report data one last time
        const reportData = sessionStorage.getItem('creditReportData');
        if (reportData) {
          try {
            console.log("No letters found but credit report data exists, attempting to generate letter");
            
            // Import the letter generator dynamically
            const { generateAutomaticDisputeLetter } = await import('@/components/ai/services/disputes/automaticLetterGenerator');
            
            // Generate a letter using the report data
            const parsedData = JSON.parse(reportData);
            await generateAutomaticDisputeLetter(parsedData);
            
            // Now check for the letter again (it should be in storage now)
            const newAutoLetterJSON = sessionStorage.getItem('autoGeneratedLetter');
            if (newAutoLetterJSON) {
              const newAutoLetter = JSON.parse(newAutoLetterJSON);
              
              const formattedLetter = {
                id: newAutoLetter.id || Date.now(),
                title: newAutoLetter.title || `${newAutoLetter.errorType || 'Dispute'} (${newAutoLetter.accountName || 'Account'})`,
                recipient: newAutoLetter.bureau || newAutoLetter.recipient || 'Credit Bureau',
                createdAt: newAutoLetter.createdAt || new Date().toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                }),
                status: newAutoLetter.status || 'ready',
                bureaus: newAutoLetter.bureaus || [newAutoLetter.bureau || 'Unknown'],
                content: newAutoLetter.letterContent || newAutoLetter.content || "",
                accountName: newAutoLetter.accountName || "Unknown Account",
                accountNumber: newAutoLetter.accountNumber || "",
                errorType: newAutoLetter.errorType || "General Dispute"
              };
              
              setLetters([formattedLetter]);
              setSelectedLetter(formattedLetter);
              
              toast({
                title: "Letter Generated",
                description: "A dispute letter has been generated from your credit report.",
                duration: 3000,
              });
              
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error generating letter from report data:", error);
          }
        }
        
        // If still no letters found, show empty state
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
  }, [toast, testMode, location.pathname, selectedLetter]);
  
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
