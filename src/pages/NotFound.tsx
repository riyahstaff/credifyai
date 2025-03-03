
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the base path and query parameters
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "With search params:",
      location.search
    );
    
    // Check if this is a test mode access to a known route but with query param issue
    if (testMode) {
      console.log("Test mode is active in 404 page, will attempt recovery");
    }
  }, [location.pathname, location.search, testMode]);

  const handleGoHome = () => {
    // If test mode is active, maintain it when redirecting
    if (testMode) {
      navigate('/?testMode=true');
    } else {
      navigate('/');
    }
  };

  const handleTryDashboard = () => {
    // If we're already trying to access /dashboard with testMode
    // but got 404, try a direct navigate that might bypass routing issues
    navigate('/dashboard' + (testMode ? '?testMode=true' : ''));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-credify-dark p-4">
      <div className="bg-white dark:bg-credify-navy shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-credify-teal mb-4">404</h1>
        <p className="text-xl text-credify-navy dark:text-white/80 mb-6">
          Page not found
        </p>
        <p className="text-credify-navy-light dark:text-white/60 mb-8">
          The page you are looking for doesn't exist or has been moved.
          {testMode && (
            <span className="block mt-2 text-credify-teal font-medium">
              Note: Test mode is active
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            className="w-full"
          >
            Go to Home
          </Button>
          {testMode && (
            <Button
              onClick={handleTryDashboard}
              className="w-full bg-credify-teal hover:bg-credify-teal-dark"
            >
              Try Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
