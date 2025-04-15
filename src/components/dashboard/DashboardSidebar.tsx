import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon, Home, Users, Settings, FileText, LogOut } from 'lucide-react';

interface DashboardSidebarProps {
  hasSubscription?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ hasSubscription = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    console.log("CRITICAL: Dashboard sidebar: Logout initiated with hard redirect");
    
    try {
      // Mark the logout in progress
      document.body.classList.add('logout-in-progress');
      
      // Clear storage immediately for faster feedback
      sessionStorage.clear();
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userName');
      
      // Trigger immediate navigation
      const immediateTimer = setTimeout(() => {
        console.log("CRITICAL: Immediate redirect triggered");
        window.location.replace('/');
      }, 50);
      
      // Use a fallback timer to ensure navigation happens even if logout hangs
      const fallbackTimer = setTimeout(() => {
        console.log("CRITICAL: Logout fallback timer triggered - forcing navigation");
        window.location.replace('/');
      }, 300);
      
      // Call the logout function
      await logout();
      
      // Clear the timers if logout completes normally
      clearTimeout(immediateTimer);
      clearTimeout(fallbackTimer);
      
      // Force hard navigation to home page
      console.log("CRITICAL: Forcing navigation to home page");
      window.location.replace('/');
    } catch (error) {
      console.error("CRITICAL: Logout failed:", error);
      // Force navigation even on error
      window.location.replace('/');
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-credify-navy-light/20 border-r border-gray-200 dark:border-gray-800/30 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-credify-navy-medium flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {user?.email?.split('@')[0] || 'User'}
          </span>
        </div>
      </div>
      
      <nav className="space-y-0.5 mt-6">
        <Link 
          to="/dashboard" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group ${location.pathname === '/dashboard' ? 'bg-credify-teal/10 text-credify-teal' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-credify-navy-light/10'}`}
        >
          <Home size={20} className={location.pathname === '/dashboard' ? 'text-credify-teal' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white'} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group ${location.pathname === '/profile' ? 'bg-credify-teal/10 text-credify-teal' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-credify-navy-light/10'}`}
        >
          <Users size={20} className={location.pathname === '/profile' ? 'text-credify-teal' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white'} />
          <span>Profile</span>
        </Link>

        <Link 
          to="/dispute-letters" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group ${location.pathname === '/dispute-letters' ? 'bg-credify-teal/10 text-credify-teal' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-credify-navy-light/10'}`}
        >
          <FileText size={20} className={location.pathname === '/dispute-letters' ? 'text-credify-teal' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white'} />
          <span>Dispute Letters</span>
        </Link>
        
        <Link 
          to="/settings" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group ${location.pathname === '/settings' ? 'bg-credify-teal/10 text-credify-teal' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-credify-navy-light/10'}`}
        >
          <Settings size={20} className={location.pathname === '/settings' ? 'text-credify-teal' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white'} />
          <span>Settings</span>
        </Link>

        <Link 
          to="/template-manager" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group ${location.pathname === '/template-manager' ? 'bg-credify-teal/10 text-credify-teal' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-credify-navy-light/10'}`}
        >
          <FileText size={20} className={location.pathname === '/template-manager' ? 'text-credify-teal' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white'} />
          <span>Template Manager</span>
        </Link>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800/30">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-credify-navy-light/10"
        >
          {theme === 'dark' ? (
            <>
              <SunIcon size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <MoonIcon size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-credify-navy-light/10"
        >
          <LogOut size={20} className="text-red-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
