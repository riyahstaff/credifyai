import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '../ui/Logo';
import { Menu, X, ChevronDown, LogOut, User, CreditCard, Shield, LogIn, Beaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toast } = useToast();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Log test mode status on component mount
  useEffect(() => {
    if (testMode) {
      console.log(`Navbar detected test mode: ${testMode}`);
    }
  }, [testMode]);

  // Add testMode parameter to nav links if in test mode
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' + (testMode ? '?testMode=true' : '') },
    { name: 'Upload Report', path: '/upload-report' + (testMode ? '?testMode=true' : '') },
    { name: 'Dispute Letters', path: '/dispute-letters' + (testMode ? '?testMode=true' : '') },
    { name: 'Education', path: '/education' },
  ];

  // Modified to check if the current path matches the link path, ignoring query parameters
  const isActive = (path: string) => {
    const linkPathWithoutQuery = path.split('?')[0];
    const currentPathWithoutQuery = location.pathname;
    return currentPathWithoutQuery === linkPathWithoutQuery;
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Toggle test mode function
  const toggleTestMode = () => {
    const currentPath = location.pathname;
    if (testMode) {
      // Turn off test mode
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
  const hasSubscription = profile?.has_subscription === true;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-credify-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/30 py-3' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Logo />
          
          {user && (
            <>
              <div className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'text-credify-teal'
                        : 'text-credify-navy dark:text-white/80 hover:text-credify-teal dark:hover:text-credify-teal'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Test Mode Toggle Button */}
                <button
                  onClick={toggleTestMode}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium ${
                    testMode 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  <Beaker size={14} />
                  <span>{testMode ? "Disable Test Mode" : "Enable Test Mode"}</span>
                </button>
              </div>

              <div className="hidden md:flex items-center space-x-3">
                {!hasSubscription && !testMode && (
                  <Link
                    to="/subscription"
                    className="px-4 py-2 bg-gradient-to-r from-credify-teal to-credify-teal-dark text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <CreditCard size={16} />
                    <span>Subscribe</span>
                  </Link>
                )}
                
                {(hasSubscription || testMode) && (
                  <div className="px-3 py-1.5 bg-credify-teal/10 text-credify-teal rounded-lg flex items-center gap-1.5">
                    <Shield size={14} />
                    <span className="text-sm font-medium">{testMode ? "Test Mode" : "Premium"}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 px-3 py-2 text-credify-navy dark:text-white/90">
                  <User size={18} className="text-credify-teal" />
                  <span className="font-medium">{profile?.full_name?.split(' ')[0] || 'User'}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-medium text-credify-navy dark:text-white/90 hover:text-credify-teal dark:hover:text-credify-teal transition-colors duration-200 flex items-center gap-1"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
          
          {!user && location.pathname !== '/signup' && (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 font-medium text-credify-navy dark:text-white/90 hover:text-credify-teal dark:hover:text-credify-teal transition-colors duration-200 flex items-center gap-1"
              >
                <LogIn size={18} />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Get Started
              </Link>
              
              {/* Test Mode Toggle Button */}
              <button
                onClick={toggleTestMode}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium ${
                  testMode 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <Beaker size={14} />
                <span>{testMode ? "Disable Test Mode" : "Enable Test Mode"}</span>
              </button>
            </div>
          )}

          <button
            className="block md:hidden text-credify-navy dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute w-full bg-white dark:bg-credify-dark border-b border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen py-4' : 'max-h-0'
        }`}
      >
        <div className="container mx-auto px-4 space-y-3">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 font-medium ${
                    isActive(link.path)
                      ? 'text-credify-teal'
                      : 'text-credify-navy dark:text-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Test Mode Toggle Button for Mobile */}
              <button
                onClick={toggleTestMode}
                className={`w-full py-2 mt-2 rounded-lg text-left ${
                  testMode 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 px-2">
                  <Beaker size={16} />
                  <span className="font-medium">{testMode ? "Disable Test Mode" : "Enable Test Mode"}</span>
                </div>
              </button>
              
              {!hasSubscription && !testMode && (
                <Link
                  to="/subscription"
                  className="block py-2 mt-2 bg-gradient-to-r from-credify-teal to-credify-teal-dark text-white rounded-lg hover:opacity-90 transition-opacity text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <CreditCard size={16} />
                    <span>Subscribe Now</span>
                  </div>
                </Link>
              )}
              
              <div className="pt-4 pb-2 space-y-3 border-t border-gray-200 dark:border-gray-700/30 mt-2">
                {(hasSubscription || testMode) && (
                  <div className="flex items-center gap-2 py-2">
                    <Shield size={18} className="text-credify-teal" />
                    <span className="font-medium text-credify-teal">{testMode ? "Test Mode Active" : "Premium Member"}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 py-2">
                  <User size={18} className="text-credify-teal" />
                  <span className="font-medium text-credify-navy dark:text-white/90">{profile?.full_name || 'User'}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="block w-full py-2 text-left font-medium text-credify-navy dark:text-white/90 flex items-center gap-2"
                >
                  <LogOut size={18} className="text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="block py-2 font-medium text-credify-navy dark:text-white/80">Home</Link>
              <Link to="/education" className="block py-2 font-medium text-credify-navy dark:text-white/80">Education</Link>
              
              {/* Test Mode Toggle Button for Mobile */}
              <button
                onClick={toggleTestMode}
                className={`w-full py-2 rounded-lg text-left ${
                  testMode 
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-1.5 px-2">
                  <Beaker size={16} />
                  <span className="font-medium">{testMode ? "Disable Test Mode" : "Enable Test Mode"}</span>
                </div>
              </button>
              
              <div className="pt-4 pb-2 space-y-3 border-t border-gray-200 dark:border-gray-700/30 mt-2">
                <Link to="/login" className="block py-2 font-medium text-credify-navy dark:text-white/90 flex items-center gap-2">
                  <LogIn size={18} className="text-credify-teal" />
                  <span>Log In</span>
                </Link>
                <Link to="/signup" className="block py-2 mt-2 bg-gradient-to-r from-credify-teal to-credify-teal-dark text-white rounded-lg hover:opacity-90 transition-opacity text-center">
                  <span>Get Started</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
