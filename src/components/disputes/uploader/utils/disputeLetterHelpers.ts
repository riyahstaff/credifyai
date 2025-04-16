
import { useToast } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';

/**
 * Stores generated dispute letters in session storage
 * @param letters The letters to store
 * @returns Boolean indicating success
 */
export function storeGeneratedLetters(letters: any[]): boolean {
  try {
    if (!letters || letters.length === 0) {
      console.error("No letters provided to store");
      return false;
    }
    
    console.log(`Storing ${letters.length} generated letters`);
    
    // Check if letters have proper content
    for (const letter of letters) {
      if (!letter.content || letter.content.length < 10) {
        console.error("Letter is missing content:", letter);
      }
    }
    
    // Store the letters
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    
    // Also store the first letter as a pending letter for compatibility
    if (letters[0]) {
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify({
        ...letters[0],
        status: 'ready'
      }));
    }
    
    // Set a flag to indicate we have fresh letters
    sessionStorage.setItem('hasDisputeLetters', 'true');
    
    // Verify storage succeeded
    const storedLetters = JSON.parse(sessionStorage.getItem('generatedDisputeLetters') || 'null');
    
    if (!storedLetters || storedLetters.length !== letters.length) {
      console.error("Verification failed after storing letters");
      return false;
    }
    
    console.log("Successfully stored dispute letters");
    return true;
  } catch (error) {
    console.error("Error storing generated letters:", error);
    return false;
  }
}

/**
 * Creates a fallback letter when letter generation fails
 */
export function createFallbackLetter(): any {
  // Get user name from storage
  let userName = '[YOUR NAME]';
  try {
    userName = localStorage.getItem('userName') || 
               sessionStorage.getItem('userName') ||
               JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name ||
               '[YOUR NAME]';
  } catch (e) {
    console.error("Error getting user name:", e);
  }
  
  console.log("Creating fallback letter for user:", userName);
  
  return {
    id: Date.now(),
    title: "Credit Report Dispute",
    bureau: "Credit Bureau",
    accountName: "Account in Question",
    accountNumber: "",
    content: "Dear Credit Bureau,\n\nI am writing to dispute information in my credit report. After reviewing my credit report, I have identified information that I believe to be inaccurate.\n\nAs per my rights under the Fair Credit Reporting Act, I request that you investigate this matter and correct the disputed information. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n" + userName,
    letterContent: "Dear Credit Bureau,\n\nI am writing to dispute information in my credit report. After reviewing my credit report, I have identified information that I believe to be inaccurate.\n\nAs per my rights under the Fair Credit Reporting Act, I request that you investigate this matter and correct the disputed information. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n" + userName,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: "ready",
    errorType: "General Dispute",
    recipient: "Credit Bureau",
    bureaus: ["Credit Bureau"]
  };
}

/**
 * Handles errors during letter generation
 */
export function handleLetterGenerationError(error: any, toast: ReturnType<typeof useToast>['toast'], navigate: NavigateFunction): void {
  console.error("Error in letter generation process:", error);

  // Display error toast
  toast({
    title: "Error Generating Letter",
    description: "Unable to generate dispute letter. Creating a basic template instead.",
    variant: "destructive",
    duration: 5000,
  });
  
  try {
    // Create and store a fallback letter
    console.log("Creating fallback letter due to error");
    const fallbackLetter = createFallbackLetter();
    const stored = storeGeneratedLetters([fallbackLetter]);
    
    if (stored) {
      // Set flag to force reload on letters page
      sessionStorage.setItem('forceLettersReload', 'true');
      
      toast({
        title: "Basic Letter Created",
        description: "A simple template has been created that you can customize.",
        duration: 3000,
      });
      
      // Navigate to letters page after a slight delay
      setTimeout(() => {
        console.log("Navigating to dispute letters page after error recovery");
        window.location.href = '/dispute-letters';
      }, 1500);
    } else {
      toast({
        title: "Error Creating Letter",
        description: "Unable to create even a basic letter template. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  } catch (fallbackError) {
    console.error("Error creating fallback letter:", fallbackError);
    toast({
      title: "Critical Error",
      description: "Unable to create any letter templates. Please reload and try again.",
      variant: "destructive",
      duration: 5000,
    });
  }
}
