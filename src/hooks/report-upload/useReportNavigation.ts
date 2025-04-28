
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to handle navigation after report analysis and letter generation
 */
export const useReportNavigation = () => {
  const navigate = useNavigate();
  
  // Listen for navigation event based on localStorage flag
  useEffect(() => {
    const checkNavigationFlag = () => {
      const shouldNavigate = sessionStorage.getItem('shouldNavigateToLetters');
      if (shouldNavigate === 'true') {
        console.log("Navigation flag detected, redirecting to dispute letters page");
        
        // Clear flag to prevent multiple redirects
        sessionStorage.removeItem('shouldNavigateToLetters');
        
        // Navigate to dispute letters page
        setTimeout(() => {
          navigate('/dispute-letters');
        }, 1500);
      }
    };
    
    // Check flag initially
    checkNavigationFlag();
    
    // Set up interval to check flag periodically (every 2 seconds)
    const intervalId = setInterval(checkNavigationFlag, 2000);
    
    // Add event listener for custom navigation event
    const handleCustomNavigationEvent = (e: any) => {
      if (e.detail && e.detail.navigateTo === 'letters') {
        console.log("Custom navigation event detected");
        navigate('/dispute-letters');
      }
    };
    
    window.addEventListener('navigateToLetters', handleCustomNavigationEvent);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('navigateToLetters', handleCustomNavigationEvent);
    };
  }, [navigate]);
  
  return {
    triggerNavigation: () => {
      sessionStorage.setItem('shouldNavigateToLetters', 'true');
      
      // Also dispatch event in case listener is active
      const event = new CustomEvent('navigateToLetters', { 
        detail: { navigateTo: 'letters' } 
      });
      window.dispatchEvent(event);
    }
  };
};
