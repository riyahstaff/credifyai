
import { NavigateFunction } from 'react-router-dom';

/**
 * Handle authentication errors by redirecting to login with appropriate params
 */
export const handleAuthError = (navigate: NavigateFunction, error: Error | null, returnPath: string = '') => {
  console.warn('Auth error detected, redirecting to login:', error);
  
  const searchParams = new URLSearchParams();
  
  // Add auth error flag
  searchParams.append('authError', 'true');
  
  // Save the current path to return after login
  if (returnPath) {
    searchParams.append('returnTo', returnPath);
  }
  
  // Redirect to login with these params
  navigate(`/login?${searchParams.toString()}`);
};
