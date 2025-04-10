
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import EmailInput from './EmailInput';
import PasswordInput from '../password/PasswordInput';
import LoginFormFooter from './LoginFormFooter';
import TestModeSkipLink from './TestModeSkipLink';

interface LoginFormProps {
  testMode: boolean;
}

const LoginForm = ({ testMode }: LoginFormProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <EmailInput email={email} setEmail={setEmail} />
      <PasswordInput password={password} setPassword={setPassword} />
      
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
      
      {testMode && <TestModeSkipLink getTestModeUrl={getTestModeUrl} />}
      
      <LoginFormFooter testMode={testMode} getTestModeUrl={getTestModeUrl} />
    </form>
  );
};

export default LoginForm;
