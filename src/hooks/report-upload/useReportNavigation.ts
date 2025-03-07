
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
          toast({
            title: "Navigation Error",
            description: "No dispute letters found to display. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        // Prevent multiple navigations
        if (navigationInProgress.current) {
          originalConsoleLog("Navigation already in progress, skipping");
          return;
        }
        
        // Set navigation in progress flag
        navigationInProgress.current = true;
        sessionStorage.setItem('navigationInProgress', 'true');
        
        // Include the current timestamp in the URL to force a fresh load
        const timestamp = Date.now();
        
        // Preserve authentication by using state in navigation
        setTimeout(() => {
          // Check if test mode is active
          const isTestMode = window.location.search.includes('testMode=true');
          
          // Important: Use the History API to preserve auth state
          // This is more reliable than window.location for maintaining auth
          sessionStorage.setItem('forceAuthPersistence', 'true');
          sessionStorage.setItem('authTimestamp', timestamp.toString());
          
          // Force a full page refresh to ensure clean state
          window.location.href = `/dispute-letters?t=${timestamp}${isTestMode ? '&testMode=true' : ''}`;
        }, 500);
      }
    };
    
    return () => {
      // Restore original console.log when component unmounts
      console.log = originalConsoleLog;
      // Clear navigation flag on unmount
      navigationInProgress.current = false;
      sessionStorage.removeItem('navigationInProgress');
    };
  }, [navigate, toast]);

  // Navigate to dispute letters page with more forceful approach
  const navigateToDisputeLetters = () => {
    console.log("Forcefully navigating to dispute letters page");
    
    // Check if navigation is already in progress
    if (navigationInProgress.current) {
      console.log("Navigation already in progress, skipping");
      return;
    }
    
    // Set navigation in progress flag
    navigationInProgress.current = true;
    sessionStorage.setItem('navigationInProgress', 'true');
    
    // Verify letters exist before navigating
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
    
    // Add timestamp to force a refresh of the page
    const timestamp = Date.now();
    
    // Check if test mode is active
    const isTestMode = window.location.search.includes('testMode=true');
    
    // Set flag to force reload on letters page and include timestamp
    sessionStorage.setItem('forceLettersReload', 'true');
    sessionStorage.setItem('forceAuthPersistence', 'true');
    sessionStorage.setItem('authTimestamp', timestamp.toString());
    
    // Use window.location for the most reliable navigation that preserves auth state
    window.location.href = `/dispute-letters?t=${timestamp}${isTestMode ? '&testMode=true' : ''}`;
  };

  return {
    navigateToDisputeLetters,
    navigate,
    toast
  };
};
