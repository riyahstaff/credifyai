
/**
 * Generate dispute letters for credit report issues
 */
import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';
import { determineBureau, getBureauAddress } from './bureauUtils';
import { generateAdvancedDisputeLetter } from '@/utils/creditReport/disputeLetters';

/**
 * Generate dispute letters for credit report issues
 */
export const generateDisputeLetters = async (issues: Array<any>, reportData: CreditReportData | null): Promise<any[]> => {
  try {
    console.log(`Generating dispute letters for ${issues.length} issues`);
    
    // Create a letter for each issue
    const letterPromises = issues.map(async (issue, index) => {
      // Determine bureau from issue data
      const bureauSource = issue.account?.bureau || 
        (issue.account?.accountName || '') || 
        issue.title || 
        'Experian';
        
      const bureau = determineBureau(bureauSource);
      const bureauAddress = getBureauAddress(bureau);
      
      // Generate a unique ID for the letter
      const letterId = Date.now() + index;
      
      // Determine account information from issue or defaults
      const accountName = issue.account?.accountName || 'Multiple Accounts';
      const accountNumber = issue.account?.accountNumber || '';
      
      // Create user info object - Get actual values from localStorage
      const userInfo = {
        name: localStorage.getItem('userName') || localStorage.getItem('name') || "[YOUR NAME]",
        address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
        city: localStorage.getItem('userCity') || "[CITY]",
        state: localStorage.getItem('userState') || "[STATE]",
        zip: localStorage.getItem('userZip') || "[ZIP]"
      };
      
      // Create dispute data object
      const disputeData = {
        bureau,
        accountName,
        accountNumber,
        reason: issue.type || 'Credit Error',
        description: issue.description || 'This information appears inaccurate and should be verified',
        explanation: issue.description || 'This information appears inaccurate and should be verified',
        laws: issue.laws || ["FCRA § 611"]
      };
      
      // Generate dispute content with advanced letter format - fix argument count
      const letterContent = await generateAdvancedDisputeLetter(disputeData, userInfo);
      
      // Remove the KEY explanation if present
      const cleanedLetterContent = letterContent.replace(
        /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
        ''
      ).replace(
        /\*\s*means\s*REQUIRED\s*ALWAYS[\s\S]*?(?=\n\n)/g,
        ''
      );
      
      // Create basic letter structure
      return {
        id: letterId,
        title: `Dispute for ${accountName}`,
        bureau: bureau,
        recipient: bureau,
        accountName: accountName,
        accountNumber: accountNumber,
        errorType: issue.type || 'Credit Error',
        content: cleanedLetterContent,
        letterContent: cleanedLetterContent,
        status: 'ready', // Explicitly set to 'ready', not 'draft'
        createdAt: new Date().toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }),
        bureaus: [bureau],
        laws: issue.laws || ["FCRA § 611"],
        timestamp: new Date().toISOString()
      };
    });
    
    // Wait for all letters to be generated
    const letters = await Promise.all(letterPromises);
    
    console.log(`Generated ${letters.length} dispute letters`);
    
    // Store the letters
    const stored = storeGeneratedLetters(letters);
    
    if (stored) {
      return letters;
    } else {
      throw new Error("Failed to store generated letters");
    }
  } catch (error) {
    console.error("Error generating dispute letters:", error);
    return [];
  }
};

/**
 * Store generated letters in session storage
 */
export const storeGeneratedLetters = (letters: any[]): boolean => {
  try {
    // Format letters to ensure they have all required fields
    const formattedLetters = letters.map(letter => {
      if (letter.content && !letter.letterContent) {
        letter.letterContent = letter.content;
      } else if (letter.letterContent && !letter.content) {
        letter.content = letter.letterContent;
      }
      
      if (!letter.bureaus && letter.bureau) {
        letter.bureaus = [letter.bureau];
      }
      
      // Always explicitly set status to 'ready', not 'draft'
      letter.status = 'ready';
      
      if (!letter.createdAt) {
        letter.createdAt = new Date().toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        });
      }
      
      return letter;
    });
    
    console.log(`Storing ${formattedLetters.length} formatted letters:`, formattedLetters);
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(formattedLetters));
    
    if (formattedLetters.length > 0) {
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(formattedLetters[0]));
    }
    
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    sessionStorage.setItem('forceLettersReload', 'true');
    sessionStorage.setItem('testModeSubscription', 'true');
    
    return true;
  } catch (error) {
    console.error("Error storing letters:", error);
    return false;
  }
};
