
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Destructure to get the toast function
  
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

  // Navigate to dispute letters page with more forceful approach
  const navigateToDisputeLetters = () => {
    console.log("Forcefully navigating to dispute letters page");
    
    // Set flag to force reload on letters page
    sessionStorage.setItem('forceLettersReload', 'true');
    
    // Add a small delay to ensure storage operations complete
    setTimeout(() => {
      console.log("Executing navigation to /dispute-letters");
      // Use window.location for a full page navigation
      window.location.href = '/dispute-letters';
    }, 300);
  };

  return {
    navigateToDisputeLetters,
    navigate,
    toast // Return the actual toast function, not the entire hook result
  };
};
