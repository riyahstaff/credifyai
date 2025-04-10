
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const navigationInProgress = useRef(false);
  
  // Set up navigation listener for analysis completion
  useEffect(() => {
    // Create a MutationObserver to watch for the special console log
    const originalConsoleLog = console.log;
    console.log = function() {
      // Call the original console.log
      originalConsoleLog.apply(console, arguments);
      
      // Check if this is our special navigation trigger message
      if (arguments[0] === "ANALYSIS_COMPLETE_READY_FOR_NAVIGATION") {
        originalConsoleLog("Detected navigation trigger - redirecting to dispute letters page");
        
        // First check if we have letters in storage before navigating
        const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
        if (!generatedLetters) {
          // Try to get letters from the backend before showing an error
          checkForLettersInBackend().then(hasBackendLetters => {
            if (!hasBackendLetters) {
              toast({
                title: "Navigation Error",
                description: "No dispute letters found to display. Please try again.",
                variant: "destructive",
              });
            } else {
              // Backend letters exist, proceed with navigation
              proceedWithNavigation();
            }
          });
          return;
        }
        
        proceedWithNavigation();
      }
    };
    
    function proceedWithNavigation() {
      // Prevent multiple navigations
      if (navigationInProgress.current) {
        originalConsoleLog("Navigation already in progress, skipping");
        return;
      }
      
      // Check if we're already on the dispute letters page
      if (window.location.pathname === '/dispute-letters') {
        originalConsoleLog("Already on dispute letters page, skipping navigation");
        return;
      }
      
      // Set navigation in progress flag
      navigationInProgress.current = true;
      sessionStorage.setItem('navigationInProgress', 'true');
      
      // Set force reload flag to ensure letters are properly loaded
      sessionStorage.setItem('forceLettersReload', 'true');
      
      // Use window.location for the most reliable navigation
      setTimeout(() => {
        // Check if test mode is active
        const isTestMode = window.location.search.includes('testMode=true');
        
        // Force a full page refresh to ensure clean state
        window.location.href = `/dispute-letters${isTestMode ? '?testMode=true' : ''}`;
      }, 500);
    }
    
    async function checkForLettersInBackend() {
      try {
        // Try to fetch letters from the backend using Supabase client
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: letters } = await supabase
          .from('dispute_letters')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(10);
        
        if (letters && letters.length > 0) {
          // Store these letters in session storage for the dispute letters page to use
          sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
          return true;
        }
        
        return false;
      } catch (error) {
        console.error("Error checking for backend letters:", error);
        return false;
      }
    }
    
    return () => {
      // Restore original console.log when component unmounts
      console.log = originalConsoleLog;
      // Clear navigation flag on unmount
      navigationInProgress.current = false;
      sessionStorage.removeItem('navigationInProgress');
    };
  }, [navigate, toast]);

  // Navigate to dispute letters page with more forceful approach
  const navigateToDisputeLetters = async () => {
    console.log("Forcefully navigating to dispute letters page");
    
    // Check if navigation is already in progress
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, skipping");
      return;
    }
    
    // Check if we're already on the dispute letters page
    if (window.location.pathname === '/dispute-letters') {
      console.log("Already on dispute letters page, skipping navigation");
      return;
    }
    
    // Try to check for letters in the backend first
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: letters } = await supabase
        .from('dispute_letters')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(10);
      
      if (letters && letters.length > 0) {
        // Store these letters in session storage for the dispute letters page to use
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
      } else {
        // No letters found in backend, check session storage
        const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
        if (!generatedLetters) {
          toast({
            title: "Navigation Error",
            description: "No dispute letters found to display. Please try again.",
            variant: "destructive",
          });
          
          // Clear navigation flag
          navigationInProgress.current = false;
          sessionStorage.removeItem('navigationInProgress');
          return;
        }
      }
    } catch (error) {
      console.error("Error checking for backend letters:", error);
      // Continue with local letters if available
      const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
      if (!generatedLetters) {
        toast({
          title: "Navigation Error",
          description: "No dispute letters found to display. Please try again.",
          variant: "destructive",
        });
        
        // Clear navigation flag
        navigationInProgress.current = false;
        sessionStorage.removeItem('navigationInProgress');
        return;
      }
    }
    
    // Set navigation in progress flag
    navigationInProgress.current = true;
    sessionStorage.setItem('navigationInProgress', 'true');
    
    // Reset the forceLettersReload flag
    sessionStorage.setItem('forceLettersReload', 'true');
    
    // Check if test mode is active
    const isTestMode = window.location.search.includes('testMode=true');
    
    // Use window.location for the most reliable navigation that preserves auth state
    window.location.href = `/dispute-letters${isTestMode ? '?testMode=true' : ''}`;
  };

  return {
    navigateToDisputeLetters,
    navigate,
    toast
  };
};
