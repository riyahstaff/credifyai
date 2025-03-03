import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Login = () => {
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const testMode = searchParams.get('testMode') === 'true';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    console.log("Login page - testMode:", testMode, "Current path:", location.pathname, "Search:", location.search);
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frfeyttlztydgwahjjsw.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmV5dHRsenR5ZGd3YWhqanN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM5NTIsImV4cCI6MjA1NjI4OTk1Mn0.oQ60NfU_HD9wyqDoGrx763wfIvFWg5CpMixKYvOW1QY';
    
    const hasSupabaseCredentials = 
      supabaseUrl !== 'https://placeholder-url.supabase.co' &&
      supabaseAnonKey !== 'placeholder-key';
    
    setConnectionError(!hasSupabaseCredentials);
  }, [location.pathname, location.search, testMode]);
  
  useEffect(() => {
    if (user) {
      const redirectTarget = testMode ? '/dashboard?testMode=true' : '/dashboard';
      console.log("User logged in, redirecting to:", redirectTarget);
      navigate(redirectTarget);
    }
  }, [user, navigate, testMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error, success } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
          duration: 3000,
        });
        
        if (testMode) {
          console.log("Login successful with testMode, redirecting to dashboard with testMode");
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getTestModeUrl = (path: string) => {
    return testMode ? `${path}?testMode=true` : path;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {connectionError ? (
            <div className="max-w-3xl mx-auto">
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
                    For a quick demo, you can explore the app interface without signing in. Contact support if this issue persists.
                  </p>
                  
                  {testMode && (
                    <div className="mt-4 py-2 px-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700/50 rounded-md">
                      <p className="font-medium text-orange-800 dark:text-orange-400">Test Mode Active</p>
                      <p className="text-sm text-orange-700 dark:text-orange-500">
                        You can access premium features by using <code>?testMode=true</code> in the URL.
                      </p>
                      <div className="mt-2">
                        <Link 
                          to="/dashboard?testMode=true" 
                          className="text-white bg-credify-teal hover:bg-credify-teal-dark px-3 py-1.5 rounded-md text-sm inline-block"
                        >
                          Go to Dashboard (Test Mode)
                        </Link>
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
          
          <div className="max-w-md mx-auto bg-white dark:bg-credify-navy/60 rounded-xl shadow-soft p-6 md:p-8 border border-gray-100 dark:border-gray-700/30">
            <h1 className="text-2xl font-bold text-credify-navy dark:text-white mb-6 text-center">
              Log In to Your Account
            </h1>
            
            {testMode && (
              <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-md">
                <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
                  ⚠️ Test Mode Active
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  You'll be redirected to dashboard with premium features enabled after login.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="/forgot-password" className="text-sm text-credify-teal hover:text-credify-teal-light transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
              
              {testMode && (
                <div className="text-center mt-4">
                  <Link
                    to={getTestModeUrl('/dashboard')}
                    className="text-credify-teal hover:text-credify-teal-dark font-medium"
                  >
                    Skip login and go to Dashboard (Test Mode)
                  </Link>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-sm text-credify-navy-light dark:text-white/70">
                  Don't have an account?{' '}
                  <Link to={getTestModeUrl('/signup')} className="text-credify-teal hover:text-credify-teal-light transition-colors font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
