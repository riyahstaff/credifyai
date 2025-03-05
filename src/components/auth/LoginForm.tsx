
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  testMode: boolean;
}

const LoginForm = ({ testMode }: LoginFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
          Email Address
        </Label>
        <Input
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
        <Label htmlFor="password" className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
          Password
        </Label>
        <div className="relative">
          <Input
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
      
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="credify"
        className="w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="h-5 w-5 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2"></div>
        ) : null}
        {isSubmitting ? "Logging in..." : "Log In"}
      </Button>
      
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
  );
};

export default LoginForm;
