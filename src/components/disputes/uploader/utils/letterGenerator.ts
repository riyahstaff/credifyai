import { CreditReportAccount, CreditReportData, IdentifiedIssue, FCRA_LAWS } from "@/utils/creditReport/types";
import { 
  generateLettersForIssues, 
  generateDisputeLetter, 
  generateAndStoreDisputeLetters 
} from "@/utils/creditReport/disputeLetters";
import { getTemplateForIssueType } from "@/utils/creditReport/disputeLetters/templateLoader";

/**
 * Generates dispute letters based on identified issues in a credit report
 */
export const generateDisputeLetters = async (
  issues: IdentifiedIssue[],
  reportData: CreditReportData
): Promise<any[]> => {
  console.log(`Generating dispute letters for ${issues.length} issues with report data`);

  try {
    // Get user information from localStorage
    const userInfo = getUserInfoFromStorage();
    console.log("User info retrieved:", userInfo.name);
    
    // Convert IdentifiedIssue[] to the format expected by generateAndStoreDisputeLetters
    const convertedIssues = issues.map(issue => ({
      id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: issue.type,
      description: issue.description,
      bureau: issue.bureau || reportData.primaryBureau || "Unknown",
      accountName: issue.account?.accountName,
      accountNumber: issue.account?.accountNumber,
      reason: issue.description,
      severity: (issue.severity === 'high' || issue.impact.includes('High') || issue.impact.includes('Critical')) ? 'high' : 
                (issue.severity === 'medium' || issue.impact.includes('Medium')) ? 'medium' : 'low' as "high" | "medium" | "low",
      legalBasis: issue.laws.join(', ')
    }));
    
    // Use our enhanced letter generation system
    const letters = await generateAndStoreDisputeLetters(convertedIssues, reportData, userInfo);
    
    if (letters && letters.length > 0) {
      console.log(`Successfully generated ${letters.length} letters`);
      return letters;
    } else {
      console.warn("No letters were generated, creating generic letter");
      const genericLetter = await createGenericLetter(reportData);
      
      // Store the generic letter
      try {
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([genericLetter]));
        console.log("Stored generic letter in session storage");
      } catch (error) {
        console.error("Failed to store generic letter in session:", error);
      }
      
      return [genericLetter];
    }
  } catch (error) {
    console.error("Error generating dispute letters:", error);
    
    // Create and store a fallback letter
    const fallbackLetter = await createGenericLetter(reportData);
    try {
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([fallbackLetter]));
    } catch (storageError) {
      console.error("Failed to store fallback letter:", storageError);
    }
    
    return [fallbackLetter];
  }
};

/**
 * Get user information from storage
 */
function getUserInfoFromStorage(): { name: string; address?: string; city?: string; state?: string; zip?: string; } {
  try {
    console.log("Getting user info from storage");
    
    // Get user name from various sources
    let userName = localStorage.getItem('userName') || 
                  sessionStorage.getItem('userName') ||
                  JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name ||
                  '[YOUR NAME]';
                  
    console.log("User name retrieved for letter:", userName);
    
    if (userName === '[YOUR NAME]') {
      // Try to get the profile from session storage as a last resort
      try {
        const profile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        if (profile && profile.full_name) {
          userName = profile.full_name;
          console.log("Retrieved user name from session profile:", userName);
        }
      } catch (e) {
        console.error("Error parsing user profile from session:", e);
      }
    }
    
    // Get address info
    const address = localStorage.getItem('userAddress') || sessionStorage.getItem('userAddress');
    const city = localStorage.getItem('userCity') || sessionStorage.getItem('userCity');
    const state = localStorage.getItem('userState') || sessionStorage.getItem('userState');
    const zip = localStorage.getItem('userZip') || sessionStorage.getItem('userZip');
    
    return {
      name: userName,
      address,
      city,
      state,
      zip
    };
  } catch (error) {
    console.error("Error getting user info from storage:", error);
    return { name: '[YOUR NAME]' };
  }
}

/**
 * Create a generic dispute letter when no specific issues are found
 */
export async function createGenericLetter(reportData: CreditReportData): Promise<any> {
  // Get user information from storage
  const userInfo = getUserInfoFromStorage();
  
  // Determine the bureau from the report data
  let bureauName = "Credit Bureau";
  
  if (reportData?.primaryBureau) {
    bureauName = reportData.primaryBureau;
  } else if (reportData?.bureau) {
    bureauName = reportData.bureau;
  } else if (reportData?.bureaus) {
    if (reportData.bureaus.experian) {
      bureauName = "Experian";
    } else if (reportData.bureaus.equifax) {
      bureauName = "Equifax"; 
    } else if (reportData.bureaus.transunion) {
      bureauName = "TransUnion";
    }
  }
  
  console.log("Using bureau for letter:", bureauName);
  
  const letterId = Date.now();
  const letterDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Find an account to use in the letter - prefer problematic accounts
  let accountName = "Multiple Accounts";
  let accountNumber = "";
  
  if (reportData.accounts && reportData.accounts.length > 0) {
    // Try to find a problematic account first
    const problematicAccount = findProblematicAccount(reportData.accounts);
    accountName = problematicAccount.accountName;
    accountNumber = problematicAccount.accountNumber || "";
    console.log(`Using account for letter: ${accountName}, number: ${accountNumber || 'not available'}`);
  }
  
  // Generate a proper letter using our generator
  let letterContent;
  try {
    letterContent = await generateDisputeLetter(
      'general',
      {
        accountName,
        accountNumber,
        bureau: bureauName
      },
      userInfo,
      reportData
    );
  } catch (error) {
    console.error("Error generating letter from template:", error);
    // If letter generation fails, use a basic fallback template
    letterContent = `${userInfo.name}
${userInfo.address ? userInfo.address + '\n' : ''}${userInfo.city ? userInfo.city + ', ' : ''}${userInfo.state || ''} ${userInfo.zip || ''}

${letterDate}

${bureauName}
${getBureauAddress(bureauName)}

RE: Dispute of Inaccurate Information in Credit Report

To Whom It May Concern:

I am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.

Account Name: ${accountName}
${accountNumber ? `Account Number: ${accountNumber}\n` : ''}

I am disputing this information under the following laws and regulations:

1. 15 USC 1681e(b): Requires credit reporting agencies to follow reasonable procedures to assure maximum possible accuracy.
2. 15 USC 1681i(a)(1): Requires credit reporting agencies to conduct a reasonable investigation of disputed information.
3. 15 USC 1681s-2(a)(3): Prohibits furnishers from continuing to report information that is discovered to be inaccurate.

Please conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.

I understand that according to the Fair Credit Reporting Act, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.

In accordance with Metro 2 reporting guidelines, I request that you properly code this account as "disputed by consumer" (compliance code XB) during your investigation.

Thank you for your prompt attention to this matter.

Sincerely,

${userInfo.name}`;
  }
  
  return {
    id: letterId,
    title: "Credit Report Dispute",
    bureau: bureauName,
    recipient: bureauName,
    accountName: accountName,
    accountNumber: accountNumber,
    content: letterContent,
    letterContent: letterContent,
    bureaus: [bureauName],
    createdAt: letterDate,
    status: "ready",
    errorType: "Data Inaccuracy"
  };
}

/**
 * Get the address for a credit bureau
 */
function getBureauAddress(bureau: string): string {
  // Normalize bureau name for better matching
  const normalizedBureau = bureau.toLowerCase().trim();
  
  if (normalizedBureau.includes('experian')) {
    return 'P.O. Box 4500\nAllen, TX 75013';
  } else if (normalizedBureau.includes('equifax')) {
    return 'P.O. Box 740256\nAtlanta, GA 30374';
  } else if (normalizedBureau.includes('transunion') || normalizedBureau.includes('trans union')) {
    return 'Consumer Dispute Center\nP.O. Box 2000\nChester, PA 19016';
  } else {
    return '[BUREAU ADDRESS]';
  }
}

/**
 * Find an account with potential issues for disputing
 */
function findProblematicAccount(accounts: CreditReportAccount[]): CreditReportAccount {
  // First try to find accounts with negative statuses
  const negativeStatusAccount = accounts.find(account => {
    const status = (account.paymentStatus || account.status || '').toLowerCase();
    return status.includes('late') || 
           status.includes('past due') || 
           status.includes('delinq') || 
           status.includes('charge') || 
           status.includes('collection');
  });
  
  if (negativeStatusAccount) {
    return negativeStatusAccount;
  }
  
  // Next look for collection agencies or debt buyers
  const collectionAccount = accounts.find(account => {
    const name = (account.accountName || '').toLowerCase();
    return name.includes('collect') || 
           name.includes('recovery') || 
           name.includes('asset') || 
           name.includes('portfolio') ||
           name.includes('lvnv') ||
           name.includes('midland');
  });
  
  if (collectionAccount) {
    return collectionAccount;
  }
  
  // Next look for accounts with high balances
  const accountsWithBalance = accounts
    .filter(a => a.balance || a.currentBalance)
    .sort((a, b) => {
      const balA = parseFloat(String(a.balance || a.currentBalance || 0));
      const balB = parseFloat(String(b.balance || b.currentBalance || 0));
      return balB - balA; // Descending order
    });
    
  if (accountsWithBalance.length > 0) {
    return accountsWithBalance[0];
  }
  
  // Just return the first account if nothing else is found
  return accounts[0];
}
