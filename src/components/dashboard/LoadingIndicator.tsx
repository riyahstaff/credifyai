
import React, { useState, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const LoadingIndicator = () => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    // If loading takes more than 5 seconds, show timeout message
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, 5000);
    
    return () => clearTimeout(timer);
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
                <Alert variant="warning" className="mt-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Taking longer than expected</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    <p className="mb-2">We're having trouble connecting to our authentication services. This could be due to:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Connection issues with our authentication provider</li>
                      <li>High server load at the moment</li>
                      <li>Missing API credentials in the preview environment</li>
                    </ul>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <Link to="/login" className="text-amber-700 dark:text-amber-300 font-medium px-4 py-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-sm hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors">
                        Try logging in again
                      </Link>
                      <Link to="/" className="text-amber-700 dark:text-amber-300 font-medium px-4 py-2 bg-amber-100 dark:bg-amber-900/40 rounded-md text-sm hover:bg-amber-200 dark:hover:bg-amber-800/40 transition-colors">
                        Return to home page
                      </Link>
                    </div>
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
