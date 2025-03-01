
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error, success } = await signUp(email, password, name);
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (success) {
        setShowDialog(true);
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="signup" className="py-16 md:py-24 bg-credify-navy/5 dark:bg-credify-navy/40 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-credify-navy dark:text-white mb-4">
            Start Fixing Your Credit Today
          </h2>
          <p className="text-xl text-credify-navy-light dark:text-white/70">
            Join thousands of members who are improving their credit scores with our AI-powered platform.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white dark:bg-credify-navy/60 rounded-xl shadow-soft p-6 md:p-8 border border-gray-100 dark:border-gray-700/30">
          <h3 className="text-xl font-semibold text-credify-navy dark:text-white mb-6 text-center">
            Create Your Free Account
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
                placeholder="Enter your name"
                required
              />
            </div>
            
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
              <p className="mt-1 text-xs text-credify-navy-light dark:text-white/60">
                This will be your username for login
              </p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-credify-teal focus:border-transparent transition-colors"
                  placeholder="Create a password"
                  required
                  minLength={8}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-credify-navy-light dark:text-white/60">
                Must be at least 8 characters
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {isSubmitting ? "Creating Account..." : "Join Free for 7 Days"}
              </button>
            </div>
            
            <p className="text-xs text-center text-credify-navy-light dark:text-white/70">
              No credit card required. Cancel anytime.
            </p>
          </form>
        </div>
      </div>

      {/* Email Verification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              Check Your Email
            </DialogTitle>
            <DialogDescription className="text-center">
              We've sent a verification link to {email}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center">
            <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h3 className="text-lg font-medium text-center mb-2">
              Verify Your Account
            </h3>
            <p className="text-sm text-center text-credify-navy-light dark:text-white/70 mb-6">
              Click the link in the email to verify your account and start improving your credit.
            </p>
            
            <Link 
              to="/login"
              className="bg-credify-teal hover:bg-credify-teal-light text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center mb-4 w-full"
            >
              Go to Login Page
            </Link>
            
            <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
              <h4 className="text-center font-medium mb-3">Before you start:</h4>
              <a 
                href="https://www.annualcreditreport.com/index.action" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-credify-navy dark:text-white border border-gray-200 dark:border-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center w-full"
              >
                Get Your Free Credit Reports
                <ArrowUpRight size={16} className="ml-2" />
              </a>
              <p className="text-xs text-center text-credify-navy-light dark:text-white/70 mt-2">
                This will take you to the official Annual Credit Report website.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SignupForm;
