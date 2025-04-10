
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
        
        // Check if we're already on the dispute letters page
        if (window.location.pathname === '/dispute-letters') {
          originalConsoleLog("Already on dispute letters page, skipping navigation");
          return;
        }
        
        // Set navigation in progress flag
        navigationInProgress.current = true;
        sessionStorage.setItem('navigationInProgress', 'true');
        
        // Reset force reload flag to prevent loops
        sessionStorage.setItem('forceLettersReload', 'done');
        
        // Use window.location for the most reliable navigation
        setTimeout(() => {
          // Check if test mode is active
          const isTestMode = window.location.search.includes('testMode=true');
          
          // Force a full page refresh to ensure clean state
          window.location.href = `/dispute-letters${isTestMode ? '?testMode=true' : ''}`;
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
    
    // Check if we're already on the dispute letters page
    if (window.location.pathname === '/dispute-letters') {
      console.log("Already on dispute letters page, skipping navigation");
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
    
    // Reset the forceLettersReload flag to prevent loops
    sessionStorage.setItem('forceLettersReload', 'done');
    
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
