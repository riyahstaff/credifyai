
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
    try {
      // Clear all session data before signout
      sessionStorage.clear();
      
      // Use Supabase's built-in signout method without manual token manipulation
      const { error } = await signOutUser();
      
      if (error) {
        console.error("Error during signout:", error);
        toast({
          title: "Signout error",
          description: "There was an issue signing out. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
      
      // Navigate to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Exception during signout process:", error);
      toast({
        title: "Signout error", 
        description: "An unexpected error occurred during signout.",
        variant: "destructive",
      });
    }
  };

  return {
    handleSignUp,
    handleSignIn,
    handleSignOut
  };
}
