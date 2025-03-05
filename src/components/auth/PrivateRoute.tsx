
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; // Updated import
import { handleAuthError } from '@/utils/auth/authRedirect';

type PrivateRouteProps = {
  children: React.ReactNode;
  requiresSubscription?: boolean;
};

const PrivateRoute = ({ children, requiresSubscription = false }: PrivateRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // If in test mode, bypass subscription requirement
  const hasRequiredAccess = 
    !requiresSubscription || 
    profile?.has_subscription || 
    testMode;

  useEffect(() => {
    // If the user is logged out but we previously had a session
    // this might be due to a session timeout or error
    if (!isLoading && !user && sessionStorage.getItem('had_previous_session') === 'true') {
      console.log('Session expired, handling auth error');
      
      // Don't immediately redirect on first error - may be a temporary network issue
      const errorCount = parseInt(sessionStorage.getItem('auth_error_count') || '0', 10);
      if (errorCount > 2) {
        // Only force logout after multiple errors
        handleAuthError(navigate, new Error('Session expired'), location.pathname);
        // Reset error count after redirecting
        sessionStorage.setItem('auth_error_count', '0');
      } else {
        // Increment error count
        sessionStorage.setItem('auth_error_count', (errorCount + 1).toString());
        console.warn(`Auth error detected (${errorCount + 1}/3), waiting for recovery`);
      }
    } else if (user) {
      // Reset error count when user is logged in
      sessionStorage.setItem('auth_error_count', '0');
      // Track that we've had a session
      sessionStorage.setItem('had_previous_session', 'true');
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-t-credify-teal border-b-credify-teal border-r-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // User is not logged in, redirect to login
    return <Navigate to={`/login${testMode ? '?testMode=true' : ''}`} state={{ from: location }} replace />;
  }

  if (requiresSubscription && !hasRequiredAccess) {
    // Store the current path so we can return after subscription
    sessionStorage.setItem('returnToAfterSubscription', location.pathname + location.search);
    // User does not have subscription, redirect to subscription page
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  // User is authenticated and has access, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
