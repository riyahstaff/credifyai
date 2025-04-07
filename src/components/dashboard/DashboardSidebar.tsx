
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon, Home, Users, Settings, HelpCircle, LogOut, FileText } from 'lucide-react';

interface DashboardSidebarProps {
  testMode?: boolean;
  hasSubscription?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ testMode = false, hasSubscription = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Use logout function from context
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full h-full p-4 bg-white dark:bg-credify-navy-light/20 border-r border-gray-200 dark:border-gray-800/30 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-credify-navy-medium flex items-center justify-center">
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <span className="text-lg font-semibold text-gray-800 dark:text-white">Credify</span>
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
