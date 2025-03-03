
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
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
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
${currentDate}

Experian
P.O. Box 4500
Allen, TX 75013

RE: FORMAL DISPUTE OF INACCURATE CREDIT INFORMATION
REFERENCE: COMPREHENSIVE REPORT REVIEW

To Whom It May Concern:

I am writing to dispute inaccurate information in my credit report. I have the right under the Fair Credit Reporting Act (FCRA), Section 611, to dispute incomplete or inaccurate information.

After reviewing my credit report from Experian, I have identified multiple items that I believe are inaccurate or incomplete and request that they be verified and corrected according to the provisions of the FCRA.

LEGAL BASIS FOR DISPUTE:
Under FCRA Section 611(a), you are required to conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate. If the information cannot be verified, you must promptly delete it. Additionally, FCRA Section 623(a)(8) requires information furnishers to conduct investigations of disputed information.

I request that all items in my credit report be verified for accuracy, including but not limited to:
- Personal information (name, address, employment history)
- Account details (balances, payment history, account status)
- Public records (judgments, liens, bankruptcies)
- Inquiries (both hard and soft inquiries)

If any information cannot be fully verified, it must be removed from my credit report as required by the FCRA.

Please investigate these matters and correct my credit report accordingly. I expect a response within the timeframe specified by the FCRA (30 days, or 45 days if additional information is provided).

Sincerely,

[YOUR NAME]

Enclosures:
- Copy of credit report with highlighted items
- [SUPPORTING DOCUMENTATION]
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
    const accountNumber = issue.account?.accountNumber || "";
    
    try {
      console.log(`Generating dispute letter for: ${accountName} - ${issue.title}`);
      
      // Build a detailed description that includes specific details from the account
      let detailedDescription = issue.description;
      
      // Add account details to the description if available
      if (issue.account) {
        detailedDescription += `\n\nAccount details:\n`;
        if (issue.account.dateOpened) detailedDescription += `- Date Opened: ${issue.account.dateOpened}\n`;
        if (issue.account.lastReportedDate) detailedDescription += `- Last Reported: ${issue.account.lastReportedDate}\n`;
        if (issue.account.currentBalance) detailedDescription += `- Current Balance: ${issue.account.currentBalance}\n`;
        if (issue.account.paymentStatus) detailedDescription += `- Payment Status: ${issue.account.paymentStatus}\n`;
        if (issue.account.accountType) detailedDescription += `- Account Type: ${issue.account.accountType}\n`;
        
        // Include any remarks
        if (issue.account.remarks && issue.account.remarks.length > 0) {
          detailedDescription += `- Remarks: ${issue.account.remarks.join(', ')}\n`;
        }
      }
      
      // Add reference to applicable laws
      if (issue.laws && issue.laws.length > 0) {
        detailedDescription += `\nThis dispute is based on the following legal provisions: ${issue.laws.join(', ')}`;
      }
      
      // Use a try-catch with timeout to prevent hanging
      const letterContentPromise = Promise.race([
        generateEnhancedDisputeLetter(
          issue.title,
          {
            accountName: accountName,
            accountNumber: accountNumber,
            errorDescription: detailedDescription,
            bureau: bureauName
          },
          userInfo
        ),
        // Timeout after 10 seconds to prevent hanging
        new Promise<string>((resolve) => {
          setTimeout(() => {
            const currentDate = new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            resolve(`
${userInfo.name}
${userInfo.address}
${userInfo.city}, ${userInfo.state} ${userInfo.zip}

${currentDate}

${bureauName}
P.O. Box 4500
Allen, TX 75013

RE: FORMAL DISPUTE OF INACCURATE CREDIT INFORMATION
ACCOUNT NAME: ${accountName}
ACCOUNT NUMBER: ${accountNumber || "[ACCOUNT NUMBER]"}
DISPUTE REASON: ${issue.title}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), Section 611, to dispute the following inaccurate information that appears on my credit report:

ACCOUNT DETAILS BEING DISPUTED:
- Account Name: ${accountName}
- Account Number: ${accountNumber || "[ACCOUNT NUMBER]"}
- Reason for Dispute: ${issue.title}
- Impact Level: ${issue.impact}

EXPLANATION OF INACCURACY:
${detailedDescription}

LEGAL BASIS FOR DISPUTE:
${issue.laws ? issue.laws.join(', ') : 'FCRA Section 611(a) - Procedure in case of disputed accuracy'}

Under the FCRA, you are required to conduct a reasonable investigation into this matter and correct or delete any information that cannot be verified. If your investigation does not resolve the dispute, I have the right to add a brief statement to my file.

I REQUEST THAT YOU:
- Conduct a thorough investigation of this disputed information
- Remove the inaccurate information from my credit report
- Provide me with written confirmation of the results of your investigation

Please respond within the 30-day timeframe required by the FCRA.

Sincerely,

${userInfo.name}

Enclosures:
- Copy of credit report with disputed item highlighted
- [SUPPORTING DOCUMENTATION]
            `);
          }, 10000);
        })
      ]);
      
      const letterContent = await letterContentPromise;
      
      const disputeData = {
        bureau: bureauName,
        accountName: accountName,
        accountNumber: accountNumber || "",
        errorType: issue.title,
        explanation: detailedDescription,
        letterContent: letterContent,
        impact: issue.impact,
        laws: issue.laws || ['FCRA § 611'],
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
