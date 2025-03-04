
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
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
        setTimeout(() => {
          navigate('/dispute-letters');
        }, 500);
      }
    };
    
    return () => {
      // Restore original console.log when component unmounts
      console.log = originalConsoleLog;
    };
  }, [navigate]);

  // Navigate to dispute letters page
  const navigateToDisputeLetters = () => {
    navigate('/dispute-letters');
  };

  return {
    navigateToDisputeLetters,
    navigate,
    toast
  };
};
