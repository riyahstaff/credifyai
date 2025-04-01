
/**
 * Generate dispute letters for credit report issues
 */
import { CreditReportAccount, CreditReportData } from '@/utils/creditReportParser';
import { determineBureau, getBureauAddress } from './bureauUtils';
import { generateFallbackLatePaymentDisputeLetter } from '@/utils/creditReport/disputeLetters/fallbackTemplates/latePaymentLetter';

/**
 * Generate dispute letters for credit report issues
 */
export const generateDisputeLetters = async (issues: Array<any>, reportData: CreditReportData | null): Promise<any[]> => {
  try {
    console.log(`Generating dispute letters for ${issues.length} issues`);
    
    // Clear any existing letters in session storage before generating new ones
    sessionStorage.removeItem('pendingDisputeLetter');
    sessionStorage.removeItem('generatedDisputeLetters');
    sessionStorage.removeItem('autoGeneratedLetter');
    
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
      // Avoid using "Multiple Accounts" as the account name
      let accountName = issue.account?.accountName || '';
      if (!accountName || accountName.toLowerCase().includes('multiple accounts') || accountName.toLowerCase().includes('unknown account')) {
        // Use account type or generic name based on issue type
        const issueType = issue.type || 'Credit Issue';
        accountName = `${issueType.replace(' Dispute', '')} Account #${index + 1}`;
      }
      
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
      
      // Generate letter content based on issue type
      let letterContent = '';
      
      // For late payment issues, use the enhanced late payment template
      if (issue.type === 'late_payment') {
        letterContent = generateFallbackLatePaymentDisputeLetter();
        
        // Replace placeholders with actual values
        letterContent = letterContent
          .replace('[YOUR NAME]', userInfo.name)
          .replace('[YOUR ADDRESS]', userInfo.address)
          .replace('[CITY], [STATE] [ZIP]', `${userInfo.city}, ${userInfo.state} ${userInfo.zip}`)
          .replace('[BUREAU]', bureau)
          .replace('[BUREAU ADDRESS]', bureauAddress)
          .replace('[ACCOUNT_NAME]', accountName.toUpperCase())
          .replace('[ACCOUNT_NUMBER]', accountNumber || 'xxxx-xxxx-xxxx-xxxx')
          .replace('[DATES OF REPORTED LATE PAYMENTS]', 'As reported on my credit report');
          
        // If we have reportData with multiple accounts that have late payments, add them
        if (reportData && reportData.accounts && reportData.accounts.length > 0) {
          const accountsWithLatePayments = reportData.accounts.filter(account => 
            account.isNegative || 
            (account.paymentStatus && account.paymentStatus.toLowerCase().includes('late')) ||
            (account.remarks && account.remarks.some(remark => remark.toLowerCase().includes('late')))
          );
          
          if (accountsWithLatePayments.length > 1) {
            // Replace the standard single account format with multiple accounts
            const accountsSection = accountsWithLatePayments.map(account => {
              return `- **Creditor:** ${account.accountName.toUpperCase()}\n` +
                     `- **Account #:** ${account.accountNumber ? account.accountNumber : 'xxxx-xxxx-xxxx-xxxx'}\n` +
                     `- **Alleged Late Payments:** As reported on my credit report\n`;
            }).join('\n');
            
            // Replace the placeholder disputed items section with our multi-account format
            letterContent = letterContent.replace(
              /DISPUTED ITEMS:\n- \*\*Creditor:\*\* \[ACCOUNT_NAME\]\n- \*\*Account #:\*\* \[ACCOUNT_NUMBER\]\n- \*\*Alleged Late Payments:\*\* \[DATES OF REPORTED LATE PAYMENTS\]\n\n/,
              `DISPUTED ITEMS:\n${accountsSection}\n`
            );
          }
        }
      } else {
        // For other issue types, use standard letter template
        // Generate a properly formatted dispute letter
        letterContent = `Credit Report #: CR${Math.floor(Math.random() * 10000000)}\nToday is ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}\n\n`;
        
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
        } else {
          // Generate a placeholder number if none exists
          const placeholderNum = `xx-xxxx-${1000 + index}`;
          letterContent += `Account Number: ${placeholderNum}\n`;
        }
        letterContent += `Reason for Dispute: ${disputeData.reason}\n\n`;
        
        // Add explanation
        letterContent += `${disputeData.explanation}\n\n`;
        
        // Add legal basis with Metro 2 verbiage
        letterContent += `According to the Fair Credit Reporting Act, Section 611 (15 U.S.C. § 1681i), you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Furthermore, under the CDIA Metro 2® Format which is MANDATED for all furnishers, all aspects of an account must be reported with precise accuracy, including proper use of specific codes that communicate payment status.\n\n`;
        
        letterContent += `Per CRSA enacted, CDIA implemented laws, ANY and ALL reporting must be deleted if not CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility, and also fully Metro 2 compliant. The information being reported fails to comply with these strict standards and must be removed immediately.\n\n`;
        
        // Add request
        letterContent += `Please investigate this matter and correct your records within the 30-day timeframe provided by the FCRA. Additionally, please provide me with notification of the results of your investigation and a free updated copy of my credit report if changes are made, as required by law.\n\n`;
        
        // Add closing
        letterContent += `Sincerely,\n\n`;
        letterContent += `${userInfo.name}\n\n`;
        
        // Add enclosures
        letterContent += `Enclosures:\n`;
        letterContent += `- Copy of Driver's License\n`;
        letterContent += `- Copy of Social Security Card\n`;
      }
      
      // Create basic letter structure with an incrementing ID to ensure each letter is unique
      return {
        id: letterId + index,
        title: `Dispute for ${accountName} - ${issue.type || 'Credit Error'}`,
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
        timestamp: new Date().toISOString(),
        // Add a unique marker to identify new letters
        newLetter: true,
        analysisTimestamp: Date.now()
      };
    });
    
    // Wait for all letters to be generated
    const letters = await Promise.all(letterPromises);
    
    console.log(`Generated ${letters.length} dispute letters`);
    
    // Ensure we're storing completely fresh letters
    sessionStorage.removeItem('pendingDisputeLetter');
    sessionStorage.removeItem('generatedDisputeLetters');
    sessionStorage.removeItem('autoGeneratedLetter');
    
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
    // First, ensure we're clearing any existing letters
    sessionStorage.removeItem('pendingDisputeLetter');
    sessionStorage.removeItem('generatedDisputeLetters');
    sessionStorage.removeItem('autoGeneratedLetter');
    
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
    
    console.log(`Storing ${formattedLetters.length} fresh formatted letters:`, formattedLetters);
    
    // Create a unique key for this batch of letters to prevent caching issues
    const timestamp = Date.now();
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(formattedLetters));
    sessionStorage.setItem('disputeLettersTimestamp', timestamp.toString());
    
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
