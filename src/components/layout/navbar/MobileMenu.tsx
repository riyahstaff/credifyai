
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User, CreditCard, Shield } from 'lucide-react';
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
  hasSubscription,
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
  );
};

export default MobileMenu;
