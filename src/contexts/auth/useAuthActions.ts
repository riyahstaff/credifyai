
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
    console.log("CRITICAL: Performing logout operation with forced navigation");
    
    // Clear all session data before signout
    sessionStorage.clear();
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userName');
    
    // Remove any Supabase tokens from localStorage
    try {
      localStorage.removeItem('sb-frfeyttlztydgwahjjsw-auth-token');
      localStorage.removeItem('sb-nnpsiyuwlovbngqzyxlg-auth-token');
      localStorage.removeItem('hasAuthSession');
      localStorage.removeItem('lastAuthTime');
      localStorage.removeItem('supabase.auth.token');
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
    
    // IMPORTANT: Set immediate redirect flag for instant feedback
    document.body.classList.add('logging-out');
    
    // Start a forced redirect with timeout to ensure it happens
    const forceRedirectTimer = setTimeout(() => {
      console.log("CRITICAL: Force redirect timer activated");
      try {
        // Try multiple methods to ensure navigation happens
        window.location.href = '/';
      } catch (e) {
        console.error("Navigation error:", e);
        window.location.href = '/';
      }
    }, 300); // Very short timeout
    
    try {
      console.log("Starting forceful signout process...");
      
      // Clear token from local storage directly
      console.log("Removing localStorage key: sb-nnpsiyuwlovbngqzyxlg-auth-token");
      localStorage.removeItem('sb-nnpsiyuwlovbngqzyxlg-auth-token');
      
      console.log("Storage cleared, signing out from Supabase...");
      const { error } = await signOutUser();
      
      if (error) {
        console.error("Error during Supabase signout:", error);
        // Continue with forced navigation despite error
      } else {
        console.log("Supabase signout successful");
      }
    } catch (error) {
      console.error("Exception during signout process:", error);
    }
    
    clearTimeout(forceRedirectTimer); // Clear the timer if Supabase signout completes quickly
    
    // Force a hard refresh to ensure all React state is cleared - MOST IMPORTANT PART
    console.log("CRITICAL: Forcing immediate hard redirect after logout");
    try {
      // Set flag to clear auth on next load - important for handling edge cases
      localStorage.setItem('clearAuthOnLoad', 'true');
      
      // Force navigation to home page
      window.location.href = '/';
    } catch (e) {
      console.error("Navigation error:", e);
      window.location.href = '/';
    }
    
    toast({
      title: "Signed out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
  };

  return {
    handleSignUp,
    handleSignIn,
    handleSignOut
  };
}
