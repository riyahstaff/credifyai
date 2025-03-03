
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the base path and query parameters
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  const fullPath = pathname + location.search;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
      "With search params:",
      location.search,
      "Full path:",
      fullPath
    );
    
    // Check if this is a test mode access to a known route but with query param issue
    if (testMode) {
      console.log("Test mode is active in 404 page, will attempt recovery");
      
      // Special handling for dashboard with testMode
      if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
        console.log("Dashboard path detected with testMode, attempting direct access");
      }
    }
  }, [pathname, location.search, testMode, fullPath]);

  const handleGoHome = () => {
    // If test mode is active, maintain it when redirecting
    if (testMode) {
      navigate('/?testMode=true');
    } else {
      navigate('/');
    }
  };

  const handleAccessDashboard = () => {
    // Direct access to dashboard with testMode
    navigate('/dashboard?testMode=true', { replace: true });
  };

  const handleTryDashboard = () => {
    // If we're already trying to access /dashboard with testMode
    // but got 404, try a direct navigate that might bypass routing issues
    navigate('/dashboard' + (testMode ? '?testMode=true' : ''));
  };

  const handleTryUploadReport = () => {
    navigate('/upload-report' + (testMode ? '?testMode=true' : ''));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-credify-dark p-4">
      <div className="bg-white dark:bg-credify-navy shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h1 className="text-5xl font-bold text-credify-teal mb-4">404</h1>
        <p className="text-xl text-credify-navy dark:text-white/80 mb-6">
          Page not found
        </p>
        <p className="text-credify-navy-light dark:text-white/60 mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="bg-gray-50 dark:bg-credify-navy-light/20 p-4 rounded-md mb-6 text-left">
          <p className="text-sm font-medium text-credify-navy-light dark:text-white/70 mb-2">
            Attempted to access:
          </p>
          <code className="block bg-gray-100 dark:bg-credify-navy-light/40 p-2 rounded text-sm mb-4 overflow-auto">
            {fullPath}
          </code>
          
          {testMode && (
            <div className="mt-2 mb-4">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Test Mode is active
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500">
                You can try accessing specific test routes directly using the buttons below.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            className="w-full"
          >
            Go to Home
          </Button>
          
          {testMode && (
            <>
              <Button
                onClick={handleAccessDashboard}
                className="w-full bg-credify-teal hover:bg-credify-teal-dark"
              >
                Go to Dashboard
              </Button>
              
              <Button
                onClick={handleTryUploadReport}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Go to Upload Report
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
