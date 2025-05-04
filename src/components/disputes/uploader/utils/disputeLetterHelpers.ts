
import { useToast } from '@/hooks/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { clearAllLetterData } from '@/utils/creditReport/clearLetterData';

/**
 * Store generated letters in session storage
 */
export const storeGeneratedLetters = (letters: any[]): boolean => {
  try {
    // Generate unique IDs for each letter if not already present
    const lettersWithIds = letters.map((letter, index) => ({
      ...letter,
      id: letter.id || Date.now() + index
    }));
    
    // Store the letters in session storage
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(lettersWithIds));
    
    // Mark that we have dispute letters
    sessionStorage.setItem('hasDisputeLetters', 'true');
    
    console.log(`Stored ${lettersWithIds.length} letters in session storage`);
    return true;
  } catch (error) {
    console.error("Error storing generated letters:", error);
    return false;
  }
};

/**
 * Create a fallback letter when letter generation fails
 */
export const createFallbackLetter = (): any => {
  // Get current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Create a simple letter template
  return {
    id: `fallback-${Date.now()}`,
    title: "Credit Report Dispute Letter",
    content: `
${currentDate}

Credit Bureau
Dispute Department
P.O. Box 12345
City, State 12345

Re: Dispute of Inaccurate Information on My Credit Report

To Whom It May Concern:

I am writing to dispute inaccurate information on my credit report. I have the right to dispute inaccurate information under the Fair Credit Reporting Act, Section 611 [15 USC §1681i].

After reviewing my credit report, I have identified items that require your investigation and correction. Please investigate these disputed items, and upon completion, provide me with an updated copy of my credit report.

Sincerely,

[Your Name]
    `,
    letterContent: `
${currentDate}

Credit Bureau
Dispute Department
P.O. Box 12345
City, State 12345

Re: Dispute of Inaccurate Information on My Credit Report

To Whom It May Concern:

I am writing to dispute inaccurate information on my credit report. I have the right to dispute inaccurate information under the Fair Credit Reporting Act, Section 611 [15 USC §1681i].

After reviewing my credit report, I have identified items that require your investigation and correction. Please investigate these disputed items, and upon completion, provide me with an updated copy of my credit report.

Sincerely,

[Your Name]
    `,
    bureau: "Credit Bureau",
    accountName: "All Accounts",
    errorType: "General Dispute",
    createdAt: new Date().toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    }),
    status: 'ready'
  };
};

/**
 * Handle letter generation errors gracefully
 */
export const handleLetterGenerationError = (
  error: unknown,
  toast: ReturnType<typeof useToast>['toast'],
  navigate: NavigateFunction
) => {
  console.error("Error in letter generation:", error);
  
  // Clear any partial data to prevent future issues
  clearAllLetterData();
  
  toast({
    title: "Error generating letters",
    description: "There was a problem creating your dispute letters. Please try again.",
    variant: "destructive"
  });
  
  // Navigate back to upload page
  setTimeout(() => {
    navigate('/upload-report');
  }, 2000);
};
