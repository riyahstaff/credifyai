
import React, { useState, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const LoadingIndicator = () => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [extendedTimeout, setExtendedTimeout] = useState(false);
  const [criticalTimeout, setCriticalTimeout] = useState(false);

  useEffect(() => {
    // Add more detailed console logs for debugging
    console.log("LoadingIndicator mounted, starting timers");
    
    // If loading takes more than 1 second, show initial timeout message
    const timer = setTimeout(() => {
      console.log("Initial loading timeout occurred");
      setShowTimeout(true);
    }, 1000);
    
    // If loading takes more than 2.5 seconds, show extended timeout message
    const extendedTimer = setTimeout(() => {
      console.log("Extended loading timeout occurred");
      setExtendedTimeout(true);
    }, 2500);
    
    // If loading takes more than 10 seconds, show critical timeout message
    const criticalTimer = setTimeout(() => {
      console.log("Critical loading timeout occurred");
      setCriticalTimeout(true);
    }, 10000);
    
    return () => {
      console.log("LoadingIndicator unmounting, clearing timers");
      clearTimeout(timer);
      clearTimeout(extendedTimer);
      clearTimeout(criticalTimer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center max-w-2xl mx-auto">
              <div className="h-16 w-16 border-4 border-credify-teal/30 border-t-credify-teal rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-credify-navy-light dark:text-white/70 mb-4">Loading your dashboard...</p>
              
              {showTimeout && (
                <Alert variant="default" className="mt-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Taking longer than expected</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    {extendedTimeout ? (
                      <>
                        <p className="mb-2">We're having trouble connecting. This could be due to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Network connection issues</li>
                          <li>Server is currently busy</li>
                          <li>Connection timeout on mobile networks</li>
                        </ul>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <Link to="/login" className="text-amber-700 dark:text-amber-300 font-medium px-4 py-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-sm hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors">
                            Try logging in again
                          </Link>
                          <Link to="/" className="text-amber-700 dark:text-amber-300 font-medium px-4 py-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-sm hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors">
                            Return to home page
                          </Link>
                        </div>
                        
                        {criticalTimeout && (
                          <div className="mt-6 p-4 border border-red-300 dark:border-red-700/40 bg-red-50 dark:bg-red-900/20 rounded-md">
                            <p className="text-red-700 dark:text-red-400 font-medium">Critical Timeout</p>
                            <p className="text-sm text-red-600 dark:text-red-300">
                              The application is taking too long to load. Try refreshing the page or clicking the button below to reload with test mode enabled.
                            </p>
                            <button 
                              onClick={() => {
                                // Enable test mode and reload
                                sessionStorage.setItem('testModeSubscription', 'true');
                                window.location.reload();
                              }}
                              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-md text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                            >
                              Enable Test Mode & Reload
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="mb-2">We're connecting to our services. This should only take a moment...</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingIndicator;
