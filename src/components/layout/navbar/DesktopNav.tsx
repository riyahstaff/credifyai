
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, CreditCard, Shield, LogIn } from 'lucide-react';
import { Profile } from '@/lib/supabase/client';
import { NavLinkType } from './types';

type DesktopNavProps = {
  user: any;
  profile: Profile | null;
  navLinks: NavLinkType[];
  isActive: (path: string) => boolean;
  hasSubscription: boolean;
  handleLogout: () => Promise<void>;
};

const DesktopNav = ({
  user,
  profile,
  navLinks,
  isActive,
  hasSubscription,
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
      </div>
    );
  }

  // Get display name for the user with proper fallbacks
  const displayName = profile?.full_name || (user?.email ? user.email.split('@')[0] : 'User');

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
      </div>

      <div className="hidden md:flex items-center space-x-3">
        {hasSubscription && (
          <div className="px-3 py-1.5 bg-credify-teal/10 text-credify-teal rounded-lg flex items-center gap-1.5">
            <Shield size={14} />
            <span className="text-sm font-medium">Premium</span>
          </div>
        )}
        
        {!hasSubscription && (
          <Link
            to="/subscription"
            className="px-4 py-2 bg-gradient-to-r from-credify-teal to-credify-teal-dark text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <CreditCard size={16} />
            <span>Subscribe</span>
          </Link>
        )}
        
        <div className="flex items-center gap-2 px-3 py-2 text-credify-navy dark:text-white/90">
          <User size={18} className="text-credify-teal" />
          <span className="font-medium">{displayName}</span>
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
