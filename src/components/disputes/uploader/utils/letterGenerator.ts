
import { CreditReportAccount } from '@/utils/creditReportParser';
import { generateManualDisputeLetter } from '@/components/ai/services/disputes/manualLetterGenerator';

export const generateDisputeLetters = async (
  issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    account?: CreditReportAccount;
    laws: string[];
  }>,
  reportData?: any
) => {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  // Extract accounts for dispute letters
  const accounts = reportData?.accounts || [];
  
  // Extract the most important issues to generate letters for
  const priorityIssues = issues
    .filter(issue => issue.impact === 'Critical Impact' || issue.impact === 'High Impact')
    .slice(0, 5);
    
  const mediumIssues = issues
    .filter(issue => issue.impact === 'Medium Impact')
    .slice(0, 3 - priorityIssues.length);
  
  const selectedIssues = [...priorityIssues, ...mediumIssues];
  
  // If no specific issues were selected but we have issues, take the first three
  if (selectedIssues.length === 0 && issues.length > 0) {
    console.log("No priority issues found, using first 3 available issues");
    selectedIssues.push(...issues.slice(0, 3));
  }
  
  console.log(`Selected ${selectedIssues.length} issues for letter generation`);
  
  // Generate letters
  const letters = await Promise.all(selectedIssues.map(async (issue, index) => {
    console.log(`Generating dispute letter for: ${issue.title} - ${issue.account?.accountName || 'General Issue'}`);
    
    const bureau = determineBureau(issue);
    const accountName = issue.account?.accountName || issue.title;
    const accountNumber = issue.account?.accountNumber || '';
    
    const disputeParams = {
      bureau: bureau,
      accountName: accountName,
      accountNumber: accountNumber,
      errorType: issue.title,
      explanation: issue.description,
      accounts: accounts, // Include all accounts from the report
      reportData: reportData // Pass the entire report data
    };
    
    try {
      const letterContent = await generateManualDisputeLetter(
        disputeParams,
        {},
        {
          testMode: false,
          accounts: accounts
        }
      );
      
      if (!letterContent || letterContent.trim().length < 10) {
        console.error(`Empty or invalid letter content generated for ${issue.title}`);
        return null;
      }
      
      console.log(`Successfully generated letter for ${issue.title} (${letterContent.length} chars)`);
      
      // Create letter object with all required fields
      return {
        id: Date.now() + index,
        title: `${issue.title} (${accountName})`,
        bureau: bureau,
        recipient: bureau,
        accountName: accountName,
        accountNumber: accountNumber,
        errorType: issue.title,
        explanation: issue.description,
        letterContent: letterContent,
        content: letterContent, // Duplicate for compatibility
        status: 'draft',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        bureaus: [bureau],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error generating letter for ${issue.title}:`, error);
      // Create a fallback letter with error information
      return {
        id: Date.now() + index,
        title: `${issue.title} (${accountName})`,
        bureau: bureau,
        recipient: bureau,
        accountName: accountName,
        accountNumber: accountNumber,
        errorType: issue.title,
        explanation: issue.description,
        letterContent: `
Dear ${bureau},

I am writing to dispute the following information in my credit report:

Account Name: ${accountName}
Account Number: ${accountNumber || "Unknown"}
Issue: ${issue.title}

This information is inaccurate because: ${issue.description}

Under the Fair Credit Reporting Act, Section 611, you are required to investigate this matter and correct any inaccurate information. Please investigate this matter and remove or correct this information immediately.

Sincerely,
[YOUR NAME]
        `,
        content: `
Dear ${bureau},

I am writing to dispute the following information in my credit report:

Account Name: ${accountName}
Account Number: ${accountNumber || "Unknown"}
Issue: ${issue.title}

This information is inaccurate because: ${issue.description}

Under the Fair Credit Reporting Act, Section 611, you are required to investigate this matter and correct any inaccurate information. Please investigate this matter and remove or correct this information immediately.

Sincerely,
[YOUR NAME]
        `,
        status: 'draft',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        bureaus: [bureau],
        timestamp: new Date().toISOString()
      };
    }
  }));
  
  // Filter out null letters
  const validLetters = letters.filter(letter => letter !== null);
  console.log(`Generated ${validLetters.length} valid letters`);
  
  // Store the letters - with enhanced error logging
  if (validLetters.length > 0) {
    try {
      // Store all letters
      console.log(`Storing ${validLetters.length} letters in session storage`);
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(validLetters));
      
      // Also store the first letter for legacy support
      console.log(`Storing first letter as pendingDisputeLetter: ${validLetters[0].title}`);
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(validLetters[0]));
      
      // Set the auto-generated flag
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Set autoGeneratedLetter flag to true");
      
      // Log storage state to verify
      console.log("✓ Storage state after saving letters:");
      console.log("  - autoGeneratedLetter:", sessionStorage.getItem('autoGeneratedLetter'));
      console.log("  - pendingDisputeLetter exists:", !!sessionStorage.getItem('pendingDisputeLetter'));
      console.log("  - generatedDisputeLetters exists:", !!sessionStorage.getItem('generatedDisputeLetters'));
      
      return validLetters;
    } catch (error) {
      console.error("Error storing generated letters:", error);
      // On error, create a simple letter to ensure something is returned
      const errorLetter = {
        id: Date.now(),
        title: "Error Recovery Letter",
        bureau: "Experian",
        recipient: "Experian",
        accountName: "Error Recovery",
        accountNumber: "",
        errorType: "System Error",
        explanation: "This letter was generated due to an error in the letter generation process.",
        letterContent: "This is a recovery letter. Please try generating a new letter.",
        content: "This is a recovery letter. Please try generating a new letter.",
        status: 'draft',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        bureaus: ["Experian"],
        timestamp: new Date().toISOString()
      };
      
      // Try to store at least this letter
      try {
        sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(errorLetter));
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([errorLetter]));
        sessionStorage.setItem('autoGeneratedLetter', 'true');
      } catch (storageError) {
        console.error("Error storing recovery letter:", storageError);
      }
      
      return [errorLetter];
    }
  } else {
    console.warn("No valid letters were generated");
    
    // Create a fallback letter if no valid letters were generated
    const fallbackLetter = {
      id: Date.now(),
      title: "General Dispute Letter",
      bureau: "Experian",
      recipient: "Experian",
      accountName: "General Dispute",
      accountNumber: "",
      errorType: "Multiple Issues",
      explanation: "This letter addresses multiple issues found in your credit report.",
      letterContent: `
Dear Credit Bureau,

I am writing to dispute the following information in my credit report.

Under the Fair Credit Reporting Act, Section 611, you are required to investigate the items in question and remove or correct any information that cannot be verified.

Please investigate and correct these issues in my credit report.

Sincerely,
[YOUR NAME]
      `,
      content: `
Dear Credit Bureau,

I am writing to dispute the following information in my credit report.

Under the Fair Credit Reporting Act, Section 611, you are required to investigate the items in question and remove or correct any information that cannot be verified.

Please investigate and correct these issues in my credit report.

Sincerely,
[YOUR NAME]
      `,
      status: 'draft',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      bureaus: ["Experian"],
      timestamp: new Date().toISOString()
    };
    
    // Store the fallback letter
    try {
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(fallbackLetter));
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([fallbackLetter]));
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Stored fallback letter in session storage");
    } catch (error) {
      console.error("Error storing fallback letter:", error);
    }
    
    return [fallbackLetter];
  }
};

/**
 * Determine which bureau to send the dispute to based on the issue
 */
function determineBureau(issue: any): string {
  // If the issue specifies a bureau, use that
  if (issue.bureau) {
    return issue.bureau;
  }
  
  // If the account specifies a bureau, use that
  if (issue.account?.bureau) {
    return issue.account.bureau;
  }
  
  // Otherwise try to determine from the issue description
  const description = (issue.description || '').toLowerCase();
  if (description.includes('equifax')) {
    return 'Equifax';
  } else if (description.includes('experian')) {
    return 'Experian';
  } else if (description.includes('transunion')) {
    return 'TransUnion';
  }
  
  // Default to Experian if we can't determine
  return 'Experian';
}

/**
 * Store generated letters in session storage
 */
export const storeGeneratedLetters = (letters: any[]) => {
  try {
    // Format letters to ensure they have proper fields
    const formattedLetters = letters.map((letter, index) => ({
      ...letter,
      id: letter.id || Date.now() + index,
      title: letter.title || `${letter.errorType || 'Dispute'} (${letter.accountName || 'Account'})`,
      content: letter.letterContent || letter.content,
      status: letter.status || 'draft',
      bureaus: letter.bureaus || [letter.bureau || 'Unknown'],
      createdAt: letter.createdAt || new Date().toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
      })
    }));
    
    // Store all letters in session storage with clear logging
    console.log(`Storing ${formattedLetters.length} generated letters in session storage:`, formattedLetters);
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(formattedLetters));
    
    // Also store the first letter for quick access
    if (formattedLetters.length > 0) {
      console.log(`Storing first letter in pendingDisputeLetter: ${formattedLetters[0].title}`);
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(formattedLetters[0]));
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      console.log("Set autoGeneratedLetter flag to true");
    }
    
    return true;
  } catch (error) {
    console.error("Error storing generated letters:", error);
    return false;
  }
};
