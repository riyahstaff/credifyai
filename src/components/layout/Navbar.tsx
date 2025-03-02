import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '../ui/Logo';
import { Menu, X, ChevronDown, LogOut, User, CreditCard, Shield, LogIn } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload Report', path: '/upload-report' },
    { name: 'Dispute Letters', path: '/dispute-letters' },
    { name: 'Education', path: '/education' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
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
              </div>

              <div className="hidden md:flex items-center space-x-3">
                {!hasSubscription && (
                  <Link
                    to="/subscription"
                    className="px-4 py-2 bg-gradient-to-r from-credify-teal to-credify-teal-dark text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <CreditCard size={16} />
                    <span>Subscribe</span>
                  </Link>
                )}
                
                {hasSubscription && (
                  <div className="px-3 py-1.5 bg-credify-teal/10 text-credify-teal rounded-lg flex items-center gap-1.5">
                    <Shield size={14} />
                    <span className="text-sm font-medium">Premium</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 px-3 py-2 text-credify-navy dark:text-white/90">
                  <User size={18} className="text-credify-teal" />
                  <span className="font-medium">{profile?.full_name.split(' ')[0] || 'User'}</span>
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
              
              {!hasSubscription && (
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
                {hasSubscription && (
                  <div className="flex items-center gap-2 py-2">
                    <Shield size={18} className="text-credify-teal" />
                    <span className="font-medium text-credify-teal">Premium Member</span>
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
