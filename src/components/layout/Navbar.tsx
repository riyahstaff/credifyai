
import React from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { useNavbar } from './navbar/useNavbar';
import DesktopNav from './navbar/DesktopNav';
import MobileMenu from './navbar/MobileMenu';
import { Profile } from '@/lib/supabase/client';

const Navbar = () => {
  const {
    user,
    profile,
    navLinks,
    isOpen,
    scrolled,
    testMode,
    hasSubscription,
    setIsOpen,
    isActive,
    handleLogout,
    toggleTestMode
  } = useNavbar();

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-credify-dark/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/30 py-3' : 'py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Logo />
          
          <DesktopNav 
            user={user}
            profile={profile as Profile}
            navLinks={navLinks}
            isActive={isActive}
            testMode={testMode}
            hasSubscription={hasSubscription}
            toggleTestMode={toggleTestMode}
            handleLogout={handleLogout}
          />

          <button
            className="block md:hidden text-credify-navy dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <MobileMenu 
        isOpen={isOpen}
        navLinks={navLinks}
        user={user}
        profile={profile as Profile}
        testMode={testMode}
        hasSubscription={hasSubscription}
        toggleTestMode={toggleTestMode}
        handleLogout={handleLogout}
        isActive={isActive}
      />
    </nav>
  );
};

export default Navbar;
