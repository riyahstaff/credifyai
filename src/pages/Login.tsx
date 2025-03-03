
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    // Updated check to use the hardcoded fallback values from supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://frfeyttlztydgwahjjsw.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmV5dHRsenR5ZGd3YWhqanN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTM5NTIsImV4cCI6MjA1NjI4OTk1Mn0.oQ60NfU_HD9wyqDoGrx763wfIvFWg5CpMixKYvOW1QY';
    
    const hasSupabaseCredentials = 
      supabaseUrl !== 'https://placeholder-url.supabase.co' &&
      supabaseAnonKey !== 'placeholder-key';
    
    setConnectionError(!hasSupabaseCredentials);
  }, []);
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
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
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
          
          <div className="max-w-md mx-auto bg-white dark:bg-credify-navy/60 rounded-xl shadow-soft p-6 md:p-8 border border-gray-100 dark:border-gray-700/30">
            <h1 className="text-2xl font-bold text-credify-navy dark:text-white mb-6 text-center">
              Log In to Your Account
            </h1>
            
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
              
              <div className="text-center">
                <p className="text-sm text-credify-navy-light dark:text-white/70">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-credify-teal hover:text-credify-teal-light transition-colors font-medium">
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
