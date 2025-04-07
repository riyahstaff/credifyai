import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { NavLinkType } from './types';

export const useNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
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
  
  // Handle logout using signOut from auth context
  const handleLogout = async () => {
    // Clear test mode subscription flag on logout
    sessionStorage.removeItem('testModeSubscription');
    await signOut();
    navigate('/');
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
