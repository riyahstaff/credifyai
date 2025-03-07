
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
        
        // Set a flag to prevent multiple navigations
        if (sessionStorage.getItem('navigationInProgress') === 'true') {
          originalConsoleLog("Navigation already in progress, skipping");
          return;
        }
        
        // Set navigation in progress flag
        sessionStorage.setItem('navigationInProgress', 'true');
        
        // Use a clean direct navigation to dispute-letters
        setTimeout(() => {
          window.location.href = '/dispute-letters?testMode=true';
        }, 500);
      }
    };
    
    return () => {
      // Restore original console.log when component unmounts
      console.log = originalConsoleLog;
    };
  }, [navigate, toast]);

  // Navigate to dispute letters page with more forceful approach
  const navigateToDisputeLetters = () => {
    console.log("Forcefully navigating to dispute letters page");
    
    // Check if navigation is already in progress
    if (sessionStorage.getItem('navigationInProgress') === 'true') {
      console.log("Navigation already in progress, skipping");
      return;
    }
    
    // Set navigation in progress flag
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
      sessionStorage.removeItem('navigationInProgress');
      return;
    }
    
    // Set flag to force reload on letters page
    sessionStorage.setItem('forceLettersReload', 'true');
    
    // Use window.location for the most reliable navigation that doesn't trigger multiple rerenders
    window.location.href = '/dispute-letters?testMode=true';
  };

  return {
    navigateToDisputeLetters,
    navigate,
    toast
  };
};
