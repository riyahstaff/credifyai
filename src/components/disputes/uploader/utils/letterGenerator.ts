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
  
  // Extract the most important issues to generate letters for
  const priorityIssues = issues
    .filter(issue => issue.impact === 'Critical Impact' || issue.impact === 'High Impact')
    .slice(0, 5); // Limit to top 5 high-priority issues
  
  // If we don't have enough priority issues, add some medium impact ones
  const mediumIssues = issues
    .filter(issue => issue.impact === 'Medium Impact')
    .slice(0, 3 - priorityIssues.length);
  
  // Combine high priority and medium issues
  const selectedIssues = [...priorityIssues, ...mediumIssues];
  
  // Make sure we have at least one issue to generate a letter for
  if (selectedIssues.length === 0 && issues.length > 0) {
    selectedIssues.push(issues[0]);
  }
  
  // Generate a letter for each issue
  const letters = await Promise.all(selectedIssues.map(async issue => {
    console.log(`Generating dispute letter for: ${issue.title} - ${issue.account?.accountName || 'General Issue'}`);
    
    // A rough extraction of bureau information from issues or accounts
    const bureau = determineBureau(issue);
    
    // Get account information from the issue if available
    const accountName = issue.account?.accountName || issue.title;
    const accountNumber = issue.account?.accountNumber || '';
    
    // Prepare the parameters for the letter generator
    const disputeParams = {
      bureau: bureau,
      accountName: accountName,
      accountNumber: accountNumber,
      errorType: issue.title,
      explanation: issue.description
    };
    
    // Prepare sample phrases to use in the letter
    const samplePhrases: Record<string, string[]> = {};
    if (issue.type.includes('balance')) {
      samplePhrases.balanceDisputes = ["The balance reported is incorrect and should be verified with supporting documentation."];
    } else if (issue.type.includes('payment') || issue.title.toLowerCase().includes('late')) {
      samplePhrases.latePaymentDisputes = ["The payment history reported is inaccurate and must be verified with original documentation."];
    } else if (issue.type.includes('ownership') || issue.title.toLowerCase().includes('not mine')) {
      samplePhrases.accountOwnershipDisputes = ["This account does not belong to me and should be removed from my credit report."];
    }
    
    try {
      // Get accounts from the report data if available
      const accounts = reportData?.accounts || [];
      
      // Generate the letter content
      const letterContent = await generateManualDisputeLetter(
        disputeParams,
        samplePhrases,
        {
          testMode: false,
          accounts: accounts 
        }
      );
      
      console.log(`Letter generated for ${issue.title} - ${accountName}`);
      
      // Return the letter data
      return {
        bureau: bureau,
        accountName: accountName,
        accountNumber: accountNumber,
        errorType: issue.title,
        explanation: issue.description,
        letterContent: letterContent,
        timestamp: new Date().toISOString(),
        accounts: accounts // Include all accounts from the report
      };
    } catch (error) {
      console.error(`Error generating letter for ${issue.title}:`, error);
      return null;
    }
  }));
  
  // Filter out any null values (failed generation)
  return letters.filter(letter => letter !== null);
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
    // Store all letters in session storage
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    
    // Also store the first letter for quick access
    if (letters.length > 0) {
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(letters[0]));
      sessionStorage.setItem('autoGeneratedLetter', 'true');
    }
    
    console.log(`${letters.length} letters generated and stored in session storage`);
    return true;
  } catch (error) {
    console.error("Error storing generated letters:", error);
    return false;
  }
};
