
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser, signOutUser } from '@/utils/auth/authUtils';

export function useAuthActions() {
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const result = await signUpUser(email, password, fullName);
    
    if (result.success) {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
        duration: 5000,
      });
    }
    
    return result;
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await signInUser(email, password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        duration: 3000,
      });
    }
    
    return result;
  };

  const handleSignOut = async () => {
    const { error } = await signOutUser();
    
    if (!error) {
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return {
    handleSignUp,
    handleSignIn,
    handleSignOut
  };
}
