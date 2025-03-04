
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DisputeLettersPage from '../components/disputes/letters/DisputeLettersPage';
import { useToast } from '@/hooks/use-toast';

const DisputeLetters = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';

  useEffect(() => {
    // Log test mode status
    if (testMode) {
      console.log("DisputeLetters page: Test mode is active");
    }
    
    // Check for any generated letters when this page loads
    const autoGeneratedFlag = sessionStorage.getItem('autoGeneratedLetter');
    const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
    const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
    const forceReload = sessionStorage.getItem('forceLettersReload');
    
    console.log("[DisputeLetters] Checking for auto-generated letter flags");
    console.log("[DisputeLetters] autoGeneratedFlag:", autoGeneratedFlag);
    console.log("[DisputeLetters] pendingLetter:", pendingLetter ? "Present" : "Not present");
    console.log("[DisputeLetters] generatedLetters:", generatedLetters ? "Present" : "Not present");
    console.log("[DisputeLetters] forceReload:", forceReload);
    
    // If force reload is set, remove it and refresh the page
    if (forceReload === 'true') {
      console.log("[DisputeLetters] Force reload detected, refreshing page");
      sessionStorage.removeItem('forceLettersReload');
      // Wait a short time to ensure storage operations complete
      setTimeout(() => {
        window.location.reload();
      }, 300);
      return;
    }
    
    let letterCount = 0;
    
    // Count letters to show appropriate toast
    if (generatedLetters) {
      try {
        const letters = JSON.parse(generatedLetters);
        letterCount = letters.length;
        console.log(`[DisputeLetters] Found ${letterCount} generated letters in session storage:`, letters);
      } catch (e) {
        console.error("Error parsing generated letters:", e);
      }
    } else if (pendingLetter) {
      letterCount = 1;
      console.log("[DisputeLetters] Found 1 pending letter in session storage");
    }
    
    // Show appropriate toast if we have letters
    if (autoGeneratedFlag === 'true') {
      if (letterCount > 0) {
        console.log(`[DisputeLetters] Showing toast for ${letterCount} letters`);
        toast({
          title: testMode ? "Test Letters Ready" : "Dispute Letters Ready",
          description: `${letterCount} dispute ${letterCount === 1 ? 'letter has' : 'letters have'} been generated based on your credit report analysis${testMode ? ' in test mode' : ''}.`,
          duration: 5000,
        });
      } else {
        // If the flag is true but no letters were found, check one more time
        // This is a safeguard against race conditions in storage
        setTimeout(() => {
          const reCheckPending = sessionStorage.getItem('pendingDisputeLetter');
          const reCheckGenerated = sessionStorage.getItem('generatedDisputeLetters');
          
          if (reCheckPending || reCheckGenerated) {
            console.log("[DisputeLetters] Letters found after secondary check");
            
            let secondCheckCount = 0;
            if (reCheckGenerated) {
              try {
                const letters = JSON.parse(reCheckGenerated);
                secondCheckCount = letters.length;
              } catch (e) {
                console.error("Error parsing generated letters in second check:", e);
              }
            } else if (reCheckPending) {
              secondCheckCount = 1;
            }
            
            if (secondCheckCount > 0) {
              toast({
                title: testMode ? "Test Letters Ready" : "Dispute Letters Ready",
                description: `${secondCheckCount} dispute ${secondCheckCount === 1 ? 'letter has' : 'letters have'} been generated based on your credit report analysis${testMode ? ' in test mode' : ''}.`,
                duration: 5000,
              });
              
              // Force a reload to ensure the letters are displayed
              window.location.reload();
              return;
            }
          }
          
          // If still no letters found, show an error
          console.log("[DisputeLetters] No letters found despite flag being true");
          toast({
            title: "Letter Generation Issue",
            description: "There was a problem generating dispute letters. Please try again or contact support.",
            variant: "destructive",
            duration: 5000,
          });
          
          // Redirect back to upload page after a delay
          setTimeout(() => {
            navigate('/upload-report');
          }, 3000);
        }, 500);
      }
    } else if (letterCount === 0) {
      // If we're on the letters page with no letters and no auto-generated flag
      setTimeout(() => {
        // One last check for race conditions
        const lastCheck = sessionStorage.getItem('pendingDisputeLetter') || sessionStorage.getItem('generatedDisputeLetters');
        if (!lastCheck) {
          console.log("[DisputeLetters] No letters found and no auto-generated flag");
          toast({
            title: "No Letters Found",
            description: "No dispute letters were found. Please generate letters from your credit report analysis.",
            duration: 5000,
          });
        }
      }, 1000);
    }
  }, [toast, testMode, navigate]);

  return <DisputeLettersPage testMode={testMode} />;
};

export default DisputeLetters;
