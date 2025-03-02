
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SignupForm from '../components/home/SignupForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Signup = () => {
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    // Check if Supabase credentials are missing
    const hasSupabaseCredentials = 
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-url.supabase.co' &&
      import.meta.env.VITE_SUPABASE_ANON_KEY && 
      import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key';
    
    setConnectionError(!hasSupabaseCredentials);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-20">
        {connectionError ? (
          <div className="container mx-auto px-4 max-w-3xl">
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Unable to connect to authentication services. This could be due to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Missing Supabase API credentials</li>
                  <li>Network connectivity issues</li>
                  <li>Authentication server downtime</li>
                </ul>
                <p className="mt-3 font-medium">
                  For a quick demo, you can explore the app interface without signing up. Contact support if this issue persists.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
