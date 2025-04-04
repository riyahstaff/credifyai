
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DisputeLettersPage from '../components/disputes/letters/DisputeLettersPage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const DisputeLetters = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [lettersLoaded, setLettersLoaded] = useState(false);
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Check if we have a test mode subscription
  const hasTestSubscription = sessionStorage.getItem('testModeSubscription') === 'true';

  useEffect(() => {
    // Log test mode status
    console.log("DisputeLetters page: Test mode is", testMode ? "active" : "inactive");
    console.log("DisputeLetters page: Test subscription is", hasTestSubscription ? "active" : "inactive");
    console.log("DisputeLetters page: User auth state:", user ? "Logged in" : "Not logged in");
    console.log("DisputeLetters page: Profile:", profile ? `Profile loaded (${profile.full_name || 'no name'})` : "No profile");
    
    // Store user profile in localStorage for letter generation
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Also store individual fields for backward compatibility
      if (profile.full_name) {
        localStorage.setItem('userName', profile.full_name);
      }
    }
    
    // Always enable test subscription if we're on this page (key change)
    if (!hasTestSubscription && !profile?.has_subscription) {
      console.log("Setting test subscription to allow viewing dispute letters");
      sessionStorage.setItem('testModeSubscription', 'true');
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
    
    // Check if auth session has expired
    const hasAuthSession = localStorage.getItem('hasAuthSession');
    const lastAuthTime = localStorage.getItem('lastAuthTime');
    
    if (!user && hasAuthSession) {
      console.log("[DisputeLetters] Auth session expired or lost, but flag exists");
      // Don't redirect here, let the PrivateRoute handle it
    }
    
    // If force reload is set, remove it and refresh the page
    if (forceReload === 'true' && !lettersLoaded) {
      console.log("[DisputeLetters] Force reload detected, refreshing page");
      sessionStorage.removeItem('forceLettersReload');
      setLettersLoaded(true);
      
      // Wait a bit to ensure storage operations complete
      setTimeout(() => {
        console.log("[DisputeLetters] Executing forced page reload");
        // Use the t parameter to prevent caching issues
        const timestamp = Date.now();
        window.location.href = `/dispute-letters?t=${timestamp}${testMode ? '&testMode=true' : ''}`;
      }, 500);
      return;
    }
    
    // Check if the letters have valid content
    let validLetters = false;
    
    if (pendingLetter) {
      try {
        const letterObj = JSON.parse(pendingLetter);
        // Verify that the letter has real content, not just a placeholder
        // More lenient check that doesn't cause redirect to login
        if (letterObj && letterObj.content && letterObj.content.length > 0) {
          validLetters = true;
          console.log("[DisputeLetters] Letter content found, length:", letterObj.content.length);
          
          // Check if it's just a placeholder
          if (letterObj.content.includes("Sample dispute letter content") || 
              letterObj.content.length < 100) {
            console.log("[DisputeLetters] Found placeholder content, regenerating letter");
            toast({
              title: "Regenerating Letter",
              description: "The previous letter contained placeholder content. Generating a proper letter now.",
            });
            
            // Don't remove letters yet, let the upload page handle regeneration
            setTimeout(() => {
              navigate('/upload-report' + (testMode ? '?testMode=true' : ''));
            }, 2000);
          }
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
    else if (autoGeneratedFlag === 'true' && !lettersLoaded) {
      console.log("[DisputeLetters] Auto-generated flag is true but no valid letters found");
      toast({
        title: "Regenerating Letter",
        description: "The generated letter was incomplete. Returning to report page to try again.",
      });
      
      // Don't clear data yet, let the upload page handle regeneration
      setTimeout(() => {
        navigate('/upload-report' + (testMode ? '?testMode=true' : ''));
      }, 2000);
    }
  }, [toast, testMode, hasTestSubscription, profile, navigate, user, lettersLoaded]);

  return (
    <DisputeLettersPage testMode={testMode} />
  );
};

export default DisputeLetters;
