
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
        content: letterContent,
        status: 'draft',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        bureaus: [bureau],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error generating letter for ${issue.title}:`, error);
      return null;
    }
  }));
  
  const validLetters = letters.filter(letter => letter !== null);
  
  // Store the letters
  if (validLetters.length > 0) {
    const stored = storeGeneratedLetters(validLetters);
    console.log(`Letters stored successfully: ${stored} - ${validLetters.length} letters`);
    return validLetters;
  } else {
    console.warn("No valid letters were generated");
    return [];
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
    console.log(`Storing ${formattedLetters.length} generated letters in session storage`);
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
