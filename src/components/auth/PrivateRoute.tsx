
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresSubscription = false }) => {
  const { user, isLoading, isTestMode, profile } = useAuth();
  
  // Get test user from localStorage if in test mode and no user is set
  const getTestUser = () => {
    if (isTestMode && !user) {
      const testUserData = localStorage.getItem('test_user');
      return testUserData ? true : false;
    }
    return false;
  };
  
  const hasTestUser = getTestUser();
  
  if (isLoading) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-credify-teal/30 border-t-credify-teal rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user && !hasTestUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if this route requires subscription
  if (requiresSubscription && profile) {
    // Check if user has an active subscription
    const hasActiveSubscription = profile.has_subscription === true;
    
    if (!hasActiveSubscription) {
      // Redirect to subscription page if no active subscription
      return <Navigate to="/subscription" replace />;
    }
  }
  
  // Render children if authenticated and subscription requirements are met
  return <>{children}</>;
};

export default PrivateRoute;
