
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  setShowDialog: (show: boolean) => void;
  setErrorMessage: (message: string) => void;
}

const SignupForm = ({ email, setEmail, setShowDialog, setErrorMessage }: SignupFormProps) => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      console.log('Starting signup process for:', email);
      const { error, success } = await signUp(email, password, name);
      
      if (error) {
        console.error('Signup error details:', error);
        let errorMsg = error.message || "Failed to create account. Please try again.";
        
        // Provide more user-friendly error messages
        if (error.message?.includes('User already registered')) {
          errorMsg = "This email is already registered. Please login instead.";
        } else if (error.message?.includes('password')) {
          errorMsg = "Password doesn't meet requirements. Use at least 8 characters.";
        }
        
        setErrorMessage(errorMsg);
        
        toast({
          title: "Signup failed",
          description: errorMsg,
          variant: "destructive",
          duration: 5000,
        });
      } else if (success) {
        console.log('Signup successful, showing confirmation dialog');
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          {isSubmitting ? "Creating Account..." : "Create Free Account"}
        </button>
      </div>
      
      <p className="text-xs text-center text-credify-navy-light dark:text-white/70">
        Free account creation. Pay only for dispute letters.
      </p>
    </form>
  );
};

export default SignupForm;
