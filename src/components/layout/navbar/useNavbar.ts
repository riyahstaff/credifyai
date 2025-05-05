
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
  
  // Create nav links without test mode parameters
  const navLinks: NavLinkType[] = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload Report', path: '/upload-report' },
    { name: 'Dispute Letters', path: '/dispute-letters' },
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
    console.log("CRITICAL: Navbar: Logout initiated with hard redirect");
    
    try {
      // Add a body class to signal immediate logout intent
      document.body.classList.add('logout-in-progress');
      
      // Clear session storage first for immediate feedback
      sessionStorage.clear();
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userName');
      
      // Start a direct navigation timer that will trigger regardless of auth outcome
      const immediateTimer = setTimeout(() => {
        console.log("CRITICAL: Immediate logout timer triggered");
        window.location.replace('/');
      }, 100);
      
      // Use a fallback timer to ensure navigation happens even if logout hangs
      const fallbackTimer = setTimeout(() => {
        console.log("CRITICAL: Logout fallback timer triggered - forcing navigation");
        window.location.replace('/');
      }, 500);
      
      // Call the logout function
      await logout();
      
      // Clear the timers if logout completes normally
      clearTimeout(immediateTimer);
      clearTimeout(fallbackTimer);
      
      // Force navigation to ensure we leave the page
      console.log("CRITICAL: Logout successful, forcing navigation");
      window.location.replace('/');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      });
    } catch (error) {
      console.error("CRITICAL: Logout error:", error);
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

  // Check if user has subscription from profile
  const hasSubscription = profile?.has_subscription === true || true; // Force to true to remove subscription banner

  return {
    user,
    profile,
    navLinks,
    isOpen,
    scrolled,
    hasSubscription,
    isPremiumRoute: location.pathname === '/dispute-letters',
    setIsOpen,
    isActive,
    handleLogout
  };
};
