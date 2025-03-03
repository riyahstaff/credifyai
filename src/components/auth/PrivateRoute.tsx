
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresSubscription = false }) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();
  
  // Check if we're in testing mode via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Store the current path for potential redirect after subscription
  useEffect(() => {
    if (requiresSubscription && user && profile && !profile.has_subscription && !testMode) {
      sessionStorage.setItem('returnToAfterSubscription', location.pathname);
    }
  }, [requiresSubscription, user, profile, location.pathname, testMode]);
  
  if (isLoading) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-credify-teal/30 border-t-credify-teal rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if this route requires subscription (bypass if in test mode)
  if (requiresSubscription && profile && !testMode) {
    // Check if user has an active subscription
    const hasActiveSubscription = profile.has_subscription === true;
    
    if (!hasActiveSubscription) {
      // Redirect to subscription page if no active subscription
      return <Navigate to="/subscription" replace />;
    }
  }
  
  // Render children if authenticated and subscription requirements are met (or bypassed in test mode)
  return <>{children}</>;
};

export default PrivateRoute;
