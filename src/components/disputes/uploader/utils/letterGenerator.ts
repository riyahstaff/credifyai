
import { CreditReportData } from '@/utils/creditReportParser';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';
import { IssueItem } from '../types/analysisTypes';

interface UserInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * Get user information from local storage or provide defaults
 */
export const getUserInfo = (): UserInfo => {
  return {
    name: localStorage.getItem('userName') || "[YOUR NAME]",
    address: localStorage.getItem('userAddress') || "[YOUR ADDRESS]",
    city: localStorage.getItem('userCity') || "[CITY]",
    state: localStorage.getItem('userState') || "[STATE]",
    zip: localStorage.getItem('userZip') || "[ZIP]"
  };
};

/**
 * Create a fallback dispute letter when no issues can be processed
 */
export const createFallbackLetter = (): any => {
  return {
    bureau: "Experian",
    accountName: "All Accounts",
    accountNumber: "",
    errorType: "General Dispute",
    explanation: "I am disputing all information in my credit report that may be inaccurate or incomplete under my rights provided by the Fair Credit Reporting Act.",
    letterContent: `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]
[DATE]

Experian
P.O. Box 4500
Allen, TX 75013

RE: Dispute of Inaccurate Credit Information

To Whom It May Concern:

I am writing to dispute inaccurate information in my credit report. I have the right under the Fair Credit Reporting Act (FCRA), Section 611, to dispute incomplete or inaccurate information.

After reviewing my credit report, I have identified multiple items that I believe are inaccurate and request that they be verified and corrected.

I request that all items in my credit report be verified for accuracy. If any information cannot be fully verified, it must be removed from my credit report as required by the FCRA.

Please investigate these matters and correct my credit report accordingly.

Sincerely,

[YOUR NAME]
    `,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate dispute letters based on identified issues
 */
export const generateDisputeLetters = async (
  issues: IssueItem[],
  maxLetters = 3
): Promise<any[]> => {
  const userInfo = getUserInfo();
  const generatedLetters = [];
  
  // If no issues are provided, return a fallback letter
  if (!issues || issues.length === 0) {
    return [createFallbackLetter()];
  }
  
  // Try to generate letters for each issue, up to maxLetters
  for (const issue of issues.slice(0, maxLetters)) { 
    const bureauName = issue.account?.bureau || "Experian";
    const accountName = issue.account?.accountName || issue.title;
    const accountNumber = issue.account?.accountNumber || "Unknown";
    
    try {
      console.log(`Generating dispute letter for: ${accountName} - ${issue.title}`);
      
      // Use a try-catch with timeout to prevent hanging
      const letterContentPromise = Promise.race([
        generateEnhancedDisputeLetter(
          issue.title,
          {
            accountName: accountName,
            accountNumber: accountNumber,
            errorDescription: issue.description,
            bureau: bureauName
          },
          userInfo
        ),
        // Timeout after 5 seconds to prevent hanging
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${bureauName}
P.O. Box 4500
Allen, TX 75013

Re: Dispute of Inaccurate Information - ${accountName}

To Whom It May Concern:

I am writing to dispute the following information in my credit report:

Account Name: ${accountName}
Account Number: ${accountNumber || "[ACCOUNT NUMBER]"}
Reason for Dispute: ${issue.title}

This information is inaccurate because: ${issue.description}

Under Section 611 of the Fair Credit Reporting Act, you are required to investigate this dispute and remove information that cannot be verified.

Sincerely,

${userInfo.name}
            `);
          }, 5000);
        })
      ]);
      
      const letterContent = await letterContentPromise;
      
      const disputeData = {
        bureau: bureauName,
        accountName: accountName,
        accountNumber: accountNumber || "",
        errorType: issue.title,
        explanation: issue.description,
        letterContent: letterContent,
        timestamp: new Date().toISOString()
      };
      
      generatedLetters.push(disputeData);
      console.log(`Letter generated for ${accountName} - ${issue.title}`);
    } catch (error) {
      console.error(`Error generating letter for ${accountName}:`, error);
    }
  }
  
  // If no letters were generated, create a fallback letter
  if (generatedLetters.length === 0) {
    console.log("No letters generated, creating fallback letter");
    generatedLetters.push(createFallbackLetter());
  }
  
  return generatedLetters;
};

/**
 * Store generated letters in session storage
 */
export const storeGeneratedLetters = (
  letters: any[]
): boolean => {
  if (!letters || letters.length === 0) {
    console.error("No letters to store");
    return false;
  }
  
  try {
    // Always store at least the first letter
    const firstLetter = letters[0];
    sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(firstLetter));
    
    try {
      // Try to store all letters if possible
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    } catch (storageError) {
      console.warn("Could not store all letters, only storing first letter:", storageError);
    }
    
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    console.log(`${letters.length} letters generated and stored in session storage`);
    return true;
  } catch (error) {
    console.error("Failed to store letters in session storage:", error);
    return false;
  }
};
