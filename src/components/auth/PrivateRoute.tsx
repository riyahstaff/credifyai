
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { handleAuthError } from '@/utils/auth/authRedirect';

type PrivateRouteProps = {
  children: React.ReactNode;
  requiresSubscription?: boolean;
};

const PrivateRoute = ({ children, requiresSubscription = false }: PrivateRouteProps) => {
  const { user, profile, isLoading, logout } = useAuth();
  const location = useLocation();
  
  // Check if we're in test mode
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Session storage check for test mode subscription bypass
  const hasTestSubscription = sessionStorage.getItem('testModeSubscription') === 'true';
  
  // In test mode, we bypass subscription requirement completely
  const hasRequiredAccess = 
    !requiresSubscription || 
    profile?.has_subscription || 
    (testMode || hasTestSubscription);

  // Handle case where session expired but page is still loaded
  // Clear stale session and force re-authentication
  useEffect(() => {
    // If loaded (not in loading state) and no user but expected one
    if (!isLoading && !user && sessionStorage.getItem('had_previous_session') === 'true') {
      console.log('Session expired, handling auth error');
      
      // Try to clean up and redirect to login
      const handleExpiredSession = async () => {
        try {
          // Try to clear auth state
          await logout();
        } catch (e) {
          console.error("Error during session cleanup:", e);
        } finally {
          // Force redirect to login page
          const returnPath = encodeURIComponent(location.pathname);
          window.location.replace(`/login?authError=true&returnTo=${returnPath}`);
        }
      };
      
      handleExpiredSession();
    } else if (user) {
      // Reset error count when user is logged in
      sessionStorage.setItem('auth_error_count', '0');
      // Track that we've had a session
      sessionStorage.setItem('had_previous_session', 'true');
    }
  }, [user, isLoading, location.pathname, logout]);

  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-t-blue-500 border-blue-200 border-r-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    // User is not logged in, redirect to login
    console.log("PrivateRoute: No user found, redirecting to login");
    return <Navigate to={`/login${testMode ? '?testMode=true' : ''}`} state={{ from: location }} replace />;
  }

  // Critical change: Handle test mode more reliably for subscription requirements
  if (requiresSubscription && !hasRequiredAccess) {
    console.log("Subscription required but not found - checking for test mode bypass");
    
    // Set test mode subscription flag to allow viewing dispute letters
    if (testMode) {
      console.log("Test mode active - forcing subscription bypass");
      sessionStorage.setItem('testModeSubscription', 'true');
      
      // In test mode, we automatically give access to premium features
      return <>{children}</>;
    }
    
    // Store the current path so we can return after subscription
    sessionStorage.setItem('returnToAfterSubscription', location.pathname + location.search);
    
    // User does not have subscription, redirect to subscription page
    // Keep the test mode parameter if it exists
    return <Navigate to={`/subscription${testMode ? '?testMode=true' : ''}`} state={{ from: location }} replace />;
  }

  // User is authenticated and has access, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
