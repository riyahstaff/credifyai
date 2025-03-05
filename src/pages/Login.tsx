
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoginForm } from '@/components/auth';
import AuthErrorAlert from '@/components/auth/AuthErrorAlert';
import TestModeAlert from '@/components/auth/TestModeAlert';

const Login = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  const authError = searchParams.get('authError');
  
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    console.log("Login page - testMode:", testMode, "Current path:", location.pathname, "Search:", location.search);
    
    if (authError) {
      toast({
        title: "Authentication Error",
        description: "Your session expired. Please login again to continue.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frfeyttlztydgwahjjsw.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmV5dHRsenR5ZGd3YWhqanN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM5NTIsImV4cCI6MjA1NjI4OTk1Mn0.oQ60NfU_HD9wyqDoGrx763wfIvFWg5CpMixKYvOW1QY';
    
    const hasSupabaseCredentials = 
      supabaseUrl !== 'https://placeholder-url.supabase.co' &&
      supabaseAnonKey !== 'placeholder-key';
    
    setConnectionError(!hasSupabaseCredentials);
  }, [location.pathname, location.search, testMode, authError, toast]);
  
  useEffect(() => {
    if (user) {
      const returnTo = searchParams.get('returnTo');
      const redirectTarget = returnTo ? returnTo : (testMode ? '/dashboard?testMode=true' : '/dashboard');
      console.log("User logged in, redirecting to:", redirectTarget);
      navigate(redirectTarget);
    }
  }, [user, navigate, testMode, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {connectionError ? (
            <AuthErrorAlert testMode={testMode} />
          ) : null}
          
          <div className="max-w-md mx-auto bg-white dark:bg-credify-navy/60 rounded-xl shadow-soft p-6 md:p-8 border border-gray-100 dark:border-gray-700/30">
            <h1 className="text-2xl font-bold text-credify-navy dark:text-white mb-6 text-center">
              Log In to Your Account
            </h1>
            
            {testMode && <TestModeAlert />}
            
            <LoginForm testMode={testMode} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
