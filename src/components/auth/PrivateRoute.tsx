import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiresSubscription = false }) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if we're in testing mode via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  // Log test mode status
  useEffect(() => {
    if (testMode) {
      console.log(`Test mode active for route: ${location.pathname}${location.search}`);
    }
  }, [testMode, location]);
  
  // Store the current path for potential redirect after subscription
  useEffect(() => {
    if (requiresSubscription && user && profile && !profile.has_subscription && !testMode) {
      // Include testMode in the stored path if it was present
      const returnPath = testMode ? `${location.pathname}?testMode=true` : location.pathname;
      sessionStorage.setItem('returnToAfterSubscription', returnPath);
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
    // Preserve test mode when redirecting to login
    const redirectTo = testMode ? `/login?testMode=true&redirect=${encodeURIComponent(location.pathname)}` : '/login';
    
    // Notify about redirect
    if (testMode) {
      toast({
        title: "Authentication Required",
        description: "Redirecting to login with test mode active",
        duration: 3000,
      });
    }
    
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} replace />;
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
  
  // If test mode is active and this is a premium route, notify
  useEffect(() => {
    if (testMode && requiresSubscription) {
      toast({
        title: "Test Mode Active",
        description: "Premium features unlocked for testing",
        duration: 3000,
      });
    }
  }, [testMode, requiresSubscription, toast]);
  
  // We need to update this method to properly handle children that don't accept testMode prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // If the child's type has a propTypes or defaultProps that includes testMode, it accepts testMode
      // Otherwise, we won't pass it
      // For simplicity, we'll check the displayName or name
      const childType = child.type;
      const displayName = typeof childType === 'function' ? childType.name : '';
      
      // List of components known to accept testMode
      const testModeComponents = [
        'DisputeLettersPage',
        'DisputeGenerator',
        'UploadReport'
      ];
      
      if (testModeComponents.includes(displayName)) {
        // Only pass testMode to components that accept it
        return React.cloneElement(child, { testMode });
      }
    }
    return child;
  });
  
  // Render children if authenticated and subscription requirements are met (or bypassed in test mode)
  return <>{childrenWithProps}</>;
};

export default PrivateRoute;
