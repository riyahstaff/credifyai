
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import { AuthProvider } from './contexts/auth';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscription from './pages/Subscription';
import TemplateManagerPage from './pages/TemplateManager';
import DisputeLetters from './pages/DisputeLetters';
import LoadingIndicator from './components/dashboard/LoadingIndicator';
import Index from './pages/Index';

// Force logout handler component
const LogoutHandler = () => {
  const location = useLocation();
  useEffect(() => {
    // Check for logout flag in URL or class on body
    if (location.search.includes('logout=true') || document.body.classList.contains('logout-in-progress') || document.body.classList.contains('logging-out')) {
      console.log("CRITICAL: Logout detected via URL parameter or body class");
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  }, [location]);
  
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    // Log when App component mounts to verify initialization
    console.log('App component mounted');
    
    // For preview environments, automatically enable test mode
    if (window.location.host.includes('lovableproject.com')) {
      sessionStorage.setItem('testModeSubscription', 'true');
      console.log('Preview environment detected, test mode enabled');
    }
    
    // Listen for logout-specific events
    const handleBeforeUnload = () => {
      if (document.body.classList.contains('logout-in-progress') || document.body.classList.contains('logging-out')) {
        console.log("CRITICAL: Clearing storage on beforeunload during logout");
        sessionStorage.clear();
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userName');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check if we need to clear auth on initial load
    const shouldClearAuth = localStorage.getItem('clearAuthOnLoad') === 'true';
    if (shouldClearAuth) {
      console.log("CRITICAL: Clearing auth on load as requested");
      localStorage.removeItem('clearAuthOnLoad');
      localStorage.removeItem('sb-frfeyttlztydgwahjjsw-auth-token');
      localStorage.removeItem('hasAuthSession');
      localStorage.removeItem('lastAuthTime');
      localStorage.removeItem('supabase.auth.token');
    }
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <LogoutHandler />
        <Toaster />
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dispute-letters" element={<PrivateRoute><DisputeLetters /></PrivateRoute>} />
            <Route path="/upload-report" element={<PrivateRoute><UploadReport /></PrivateRoute>} />
            <Route path="/template-manager" element={<PrivateRoute><TemplateManagerPage /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
