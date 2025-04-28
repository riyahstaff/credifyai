
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle navigation after report analysis and letter generation
 */
export const useReportNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
          console.log("EXECUTING NAVIGATION TO /dispute-letters");
          // Use window.location.href for more reliable navigation
          window.location.href = '/dispute-letters';
        }, 1000);
      }
    };
    
    // Check flag initially
    checkNavigationFlag();
    
    // Set up interval to check flag periodically (every 1 second)
    const intervalId = setInterval(checkNavigationFlag, 1000);
    
    // Add event listener for custom navigation event
    const handleCustomNavigationEvent = (e: any) => {
      if (e.detail && e.detail.navigateTo === 'letters') {
        console.log("Custom navigation event detected");
        
        // Use window.location.href for more reliable navigation
        window.location.href = '/dispute-letters';
      }
    };
    
    window.addEventListener('navigateToLetters', handleCustomNavigationEvent);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('navigateToLetters', handleCustomNavigationEvent);
    };
  }, [navigate]);
  
  // Expose a function to directly trigger navigation
  const triggerNavigation = useCallback(() => {
    console.log("Manually triggering navigation to dispute letters page");
    sessionStorage.setItem('shouldNavigateToLetters', 'true');
    
    // Also set a flag to force letter generation
    sessionStorage.setItem('forceLetterGeneration', 'true');
    
    // Also dispatch event in case listener is active
    const event = new CustomEvent('navigateToLetters', { 
      detail: { navigateTo: 'letters' } 
    });
    window.dispatchEvent(event);
    
    // Direct navigation after a short delay
    setTimeout(() => {
      console.log("DIRECT NAVIGATION: Redirecting to dispute letters page");
      window.location.href = '/dispute-letters';
    }, 1000);
    
    toast({
      title: "Generating Letters",
      description: "Your dispute letters are being generated. You'll be redirected momentarily."
    });
    
    return true;
  }, [toast]);
  
  return { triggerNavigation };
};
