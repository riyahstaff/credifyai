
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check login status whenever component mounts or location changes
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      const name = localStorage.getItem('userName') || '';
      setUserName(name);
    }
  }, [location]);

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
  
  const handleLogout = () => {
    localStorage.setItem('userLoggedIn', 'false');
    setIsLoggedIn(false);
    navigate('/');
    
    // Show toast message (you can implement this with the toast hook)
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-credify-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/30 py-3' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Logo />
          
          {isLoggedIn && (
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
                <div className="flex items-center gap-2 px-3 py-2 text-credify-navy dark:text-white/90">
                  <User size={18} className="text-credify-teal" />
                  <span className="font-medium">{userName.split(' ')[0]}</span>
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
          
          {!isLoggedIn && location.pathname !== '/signup' && (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/signup"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <button
              className="block md:hidden text-credify-navy dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu - only shown when logged in */}
      {isLoggedIn && (
        <div
          className={`md:hidden absolute w-full bg-white dark:bg-credify-dark border-b border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen py-4' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 space-y-3">
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
            <div className="pt-4 pb-2 space-y-3 border-t border-gray-200 dark:border-gray-700/30 mt-2">
              <div className="flex items-center gap-2 py-2">
                <User size={18} className="text-credify-teal" />
                <span className="font-medium text-credify-navy dark:text-white/90">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full py-2 text-left font-medium text-credify-navy dark:text-white/90 flex items-center gap-2"
              >
                <LogOut size={18} className="text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
