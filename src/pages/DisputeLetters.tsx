
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DisputeLettersPage from '../components/disputes/letters/DisputeLettersPage';
import { useToast } from '@/hooks/use-toast';

const DisputeLetters = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [lettersLoaded, setLettersLoaded] = useState(false);
  
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
      
      // Wait a bit to ensure storage operations complete
      setTimeout(() => {
        console.log("[DisputeLetters] Executing forced page reload");
        window.location.reload();
      }, 500);
      return;
    }
    
    // Check if the letters have valid content
    let validLetters = false;
    
    if (pendingLetter) {
      try {
        const letterObj = JSON.parse(pendingLetter);
        // Verify that the letter has real content, not just a placeholder
        if (letterObj.content && 
            letterObj.content.length > 100 && 
            letterObj.content !== "Sample dispute letter content") {
          validLetters = true;
          console.log("[DisputeLetters] Valid letter content found");
        } else {
          console.warn("[DisputeLetters] Found letter with invalid/placeholder content");
        }
      } catch (e) {
        console.error("[DisputeLetters] Error parsing letter:", e);
      }
    }
    
    // If there are valid letters, mark them as loaded
    if (validLetters) {
      console.log("[DisputeLetters] Valid letters found in storage");
      setLettersLoaded(true);
    } 
    // If auto-generated flag is true but no valid letters found, regenerate letters
    else if (autoGeneratedFlag === 'true') {
      console.log("[DisputeLetters] Auto-generated flag is true but no valid letters found");
      toast({
        title: "Invalid Letter Content",
        description: "The generated letters contain placeholder content. Redirecting to try again.",
        variant: "destructive",
      });
      
      // Clear invalid letters
      sessionStorage.removeItem('autoGeneratedLetter');
      sessionStorage.removeItem('pendingDisputeLetter');
      sessionStorage.removeItem('generatedDisputeLetters');
      
      // Delay navigation back to upload page
      setTimeout(() => {
        navigate('/upload-report');
      }, 2000);
    }
  }, [toast, testMode, navigate]);

  return (
    <DisputeLettersPage testMode={testMode} />
  );
};

export default DisputeLetters;
