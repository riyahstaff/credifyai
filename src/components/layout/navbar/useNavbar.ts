
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { NavLinkType } from './types';

export const useNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Check if we have a test mode subscription
  const hasTestSubscription = sessionStorage.getItem('testModeSubscription') === 'true';

  // Setup scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Log test mode status on component mount
  useEffect(() => {
    if (testMode) {
      console.log(`Navbar detected test mode: ${testMode}`);
      console.log(`Test subscription status: ${hasTestSubscription ? 'active' : 'inactive'}`);
    }
  }, [testMode, hasTestSubscription]);

  // Add testMode parameter to nav links if in test mode
  const navLinks: NavLinkType[] = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' + (testMode ? '?testMode=true' : '') },
    { name: 'Upload Report', path: '/upload-report' + (testMode ? '?testMode=true' : '') },
    { name: 'Dispute Letters', path: '/dispute-letters' + (testMode ? '?testMode=true' : '') },
    { name: 'Education', path: '/education' },
  ];

  // Check if the current path matches the link path, ignoring query parameters
  const isActive = (path: string) => {
    const linkPathWithoutQuery = path.split('?')[0];
    const currentPathWithoutQuery = location.pathname;
    return currentPathWithoutQuery === linkPathWithoutQuery;
  };
  
  // Handle logout with improved error handling and fallback
  const handleLogout = async () => {
    console.log("Navbar: Logout initiated with hard redirect");
    
    try {
      // Clear session storage first for immediate feedback
      sessionStorage.clear();
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userName');
      
      // Use a fallback timer to ensure navigation happens even if logout hangs
      const fallbackTimer = setTimeout(() => {
        console.log("Logout fallback timer triggered - forcing navigation");
        window.location.replace('/');
      }, 1000);
      
      // Call the logout function
      await logout();
      
      // Clear the fallback timer if logout completes normally
      clearTimeout(fallbackTimer);
      
      // Force navigation to ensure we leave the page
      console.log("Logout successful, forcing navigation");
      window.location.replace('/');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was an issue during logout. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      
      // Force navigation even if there's an error
      window.location.replace('/');
    }
  };

  // Toggle test mode function
  const toggleTestMode = () => {
    const currentPath = location.pathname;
    if (testMode) {
      // Turn off test mode
      sessionStorage.removeItem('testModeSubscription');
      navigate(currentPath);
      toast({
        title: "Test Mode Disabled",
        description: "Returning to standard mode",
        duration: 3000,
      });
    } else {
      // Turn on test mode
      navigate(`${currentPath}?testMode=true`);
      toast({
        title: "Test Mode Enabled",
        description: "Premium features unlocked for testing",
        duration: 3000,
      });
    }
  };

  // Check if current route requires subscription
  const isPremiumRoute = location.pathname === '/dispute-letters';
  
  // In test mode, consider the user subscribed if they have the test subscription flag
  const hasSubscription = profile?.has_subscription === true || (testMode && hasTestSubscription);

  return {
    user,
    profile,
    navLinks,
    isOpen,
    scrolled,
    testMode,
    hasSubscription,
    isPremiumRoute,
    setIsOpen,
    isActive,
    handleLogout,
    toggleTestMode
  };
};
