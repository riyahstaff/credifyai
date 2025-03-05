
import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, LogOut, User, CreditCard, Shield, LogIn } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';
import { NavLinkType } from './types';

type DesktopNavProps = {
  user: any;
  profile: Profile | null;
  navLinks: NavLinkType[];
  isActive: (path: string) => boolean;
  testMode: boolean;
  hasSubscription: boolean;
  toggleTestMode: () => void;
  handleLogout: () => void;
};

const DesktopNav = ({
  user,
  profile,
  navLinks,
  isActive,
  testMode,
  hasSubscription,
  toggleTestMode,
  handleLogout,
}: DesktopNavProps) => {
  if (!user) {
    return (
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
    );
  }

  return (
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
  );
};

export default DesktopNav;
