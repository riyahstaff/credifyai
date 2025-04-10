
import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, LogIn, LogOut, User, CreditCard, Shield } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';
import { NavLinkType } from './types';

type MobileMenuProps = {
  isOpen: boolean;
  navLinks: NavLinkType[];
  user: any;
  profile: Profile | null;
  testMode: boolean;
  hasSubscription: boolean;
  toggleTestMode: () => void;
  handleLogout: () => Promise<void>;
  isActive: (path: string) => boolean;
};

const MobileMenu = ({
  isOpen,
  navLinks,
  user,
  profile,
  testMode,
  hasSubscription,
  toggleTestMode,
  handleLogout,
  isActive,
}: MobileMenuProps) => {
  return (
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
  );
};

export default MobileMenu;
