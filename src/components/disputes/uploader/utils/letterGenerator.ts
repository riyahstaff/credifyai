
/**
 * Generate dispute letters for credit report issues
 */
import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';
import { determineBureau, getBureauAddress } from './bureauUtils';
import { generateFallbackDisputeLetter } from '@/utils/creditReport/disputeLetters/fallbackTemplates';

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
      
      // Generate new formatted letter content with proper layout
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Credit report number
      const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
      
      // Generate a properly formatted dispute letter
      let letterContent = `Credit Report #: ${creditReportNumber}\nToday is ${currentDate}\n\n`;
      
      // Add sender information
      letterContent += `${userInfo.name}\n`;
      letterContent += `${userInfo.address}\n`;
      letterContent += `${userInfo.city}, ${userInfo.state} ${userInfo.zip}\n\n`;
      
      // Add recipient information
      letterContent += `${bureau}\n`;
      letterContent += `${bureauAddress}\n\n`;
      
      // Add subject line
      letterContent += `Re: Dispute of Inaccurate Information - ${accountName}\n\n`;
      
      // Add salutation and introduction
      letterContent += `To Whom It May Concern:\n\n`;
      letterContent += `I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n\n`;
      
      // Add account details
      letterContent += `DISPUTED ITEM(S):\n`;
      letterContent += `Account Name: ${accountName.toUpperCase()}\n`;
      if (accountNumber) {
        letterContent += `Account Number: ${'x'.repeat(Math.max(0, accountNumber.length - 4))}${accountNumber.slice(-4)}\n`;
      }
      letterContent += `Reason for Dispute: ${disputeData.reason}\n\n`;
      
      // Add explanation
      letterContent += `${disputeData.explanation}\n\n`;
      
      // Add legal basis
      letterContent += `According to the Fair Credit Reporting Act, Section 611 (15 U.S.C. § 1681i), you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Furthermore, as a consumer reporting agency, you are obligated to follow reasonable procedures to assure maximum possible accuracy of the information in consumer reports, as required by Section 607 (15 U.S.C. § 1681e).\n\n`;
      
      // Add request
      letterContent += `Please investigate this matter and correct your records within the 30-day timeframe provided by the FCRA. Additionally, please provide me with notification of the results of your investigation and a free updated copy of my credit report if changes are made, as required by law.\n\n`;
      
      // Add closing
      letterContent += `Sincerely,\n\n`;
      letterContent += `${userInfo.name}\n\n`;
      
      // Add enclosures
      letterContent += `Enclosures:\n`;
      letterContent += `- Copy of Driver's License\n`;
      letterContent += `- Copy of Social Security Card\n`;
      
      // Create basic letter structure
      return {
        id: letterId,
        title: `Dispute for ${accountName}`,
        bureau: bureau,
        recipient: bureau,
        accountName: accountName,
        accountNumber: accountNumber,
        errorType: issue.type || 'Credit Error',
        content: letterContent,
        letterContent: letterContent,
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
