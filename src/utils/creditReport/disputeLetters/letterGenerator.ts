
import { CreditReportData, IdentifiedIssue } from '../types';

/**
 * Generate a basic dispute letter for a specific issue
 */
export function generateDisputeLetter(
  issueType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  reportData?: CreditReportData
): string {
  // Simple implementation that reuses generateEnhancedDisputeLetter
  return generateEnhancedDisputeLetter(
    issueType,
    accountDetails,
    userInfo
  );
}

/**
 * Generate dispute letters for all issues found in a credit report
 */
export async function generateDisputeLetters(reportData: CreditReportData): Promise<any[]> {
  if (!reportData) {
    console.error("No report data provided to letter generator");
    return [];
  }

  const letters: any[] = [];
  
  try {
    console.log("Starting dispute letter generation process");
    const issues = reportData.issues || [];
    
    if (issues.length === 0) {
      console.warn("No issues found in report data for letter generation");
      return [];
    }
    
    console.log(`Found ${issues.length} issues to generate letters for`);
    
    // Group issues by bureau to minimize the number of letters
    const issuesByBureau: Record<string, IdentifiedIssue[]> = {};
    
    for (const issue of issues) {
      const bureau = issue.bureau?.toLowerCase() || 'equifax';
      
      if (!issuesByBureau[bureau]) {
        issuesByBureau[bureau] = [];
      }
      
      issuesByBureau[bureau].push(issue);
    }
    
    // Generate a letter for each bureau
    for (const [bureau, bureauIssues] of Object.entries(issuesByBureau)) {
      console.log(`Generating letter for ${bureau} with ${bureauIssues.length} issues`);
      
      // Group issues by account
      const issuesByAccount: Record<string, IdentifiedIssue[]> = {};
      
      for (const issue of bureauIssues) {
        // Access the account from the account property, not directly from the issue
        const accountName = issue.account?.accountName || 'unknown';
        const accountNumber = issue.account?.accountNumber || 'unknown';
        const accountKey = `${accountName}-${accountNumber}`;
        
        if (!issuesByAccount[accountKey]) {
          issuesByAccount[accountKey] = [];
        }
        
        issuesByAccount[accountKey].push(issue);
      }
      
      // For each account with issues, generate a separate letter
      for (const [accountKey, accountIssues] of Object.entries(issuesByAccount)) {
        try {
          // Get sample issue to extract account details
          const sampleIssue = accountIssues[0];
          
          // Build a summary of all issues for this account
          let issuesSummary = accountIssues.map(issue => 
            `- ${issue.description || issue.type} (${issue.severity || 'medium'} severity)`
          ).join('\n');
          
          // Generate the dispute letter content
          const letterContent = await generateEnhancedDisputeLetter(
            sampleIssue.type || 'inaccurate_information',
            {
              accountName: sampleIssue.account?.accountName || 'Unknown Account',
              accountNumber: sampleIssue.account?.accountNumber || '',
              errorDescription: `Multiple issues found:\n${issuesSummary}`,
              bureau: bureau
            },
            {
              name: '[YOUR NAME]',
              address: '[YOUR ADDRESS]',
              city: '[CITY]',
              state: '[STATE]',
              zip: '[ZIP]'
            }
          );
          
          // Create the letter object
          const letter = {
            id: Date.now() + letters.length,
            title: `${sampleIssue.type || 'Dispute'} (${sampleIssue.account?.accountName || 'Account'})`,
            recipient: bureau.charAt(0).toUpperCase() + bureau.slice(1),
            createdAt: new Date().toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            }),
            status: 'draft',
            bureaus: [bureau],
            content: letterContent,
            letterContent: letterContent,
            accountName: sampleIssue.account?.accountName,
            accountNumber: sampleIssue.account?.accountNumber,
            errorType: sampleIssue.type || 'inaccurate_information'
          };
          
          letters.push(letter);
          console.log(`Generated letter for ${sampleIssue.account?.accountName || 'unknown account'}`);
        } catch (error) {
          console.error(`Error generating letter for account in ${bureau}:`, error);
        }
      }
    }
    
    console.log(`Successfully generated ${letters.length} dispute letters`);
    return letters;
  } catch (error) {
    console.error("Error in dispute letter generation:", error);
    return [];
  }
}

/**
 * Generate an enhanced dispute letter
 */
export function generateEnhancedDisputeLetter(
  disputeType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  reportData?: CreditReportData
): string {
  try {
    console.log("Generating dispute letter with:", { 
      disputeType, 
      accountDetails: {
        accountName: accountDetails.accountName,
        bureau: accountDetails.bureau
      }, 
      userInfo: {
        name: userInfo.name
      }
    });
    
    // Generate the current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Bureau addresses
    const bureauAddresses: Record<string, string> = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    // Normalize bureau name for address lookup
    const bureau = accountDetails.bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureau] || `${accountDetails.bureau}`;
    
    // Clean up account name and number
    const accountName = accountDetails.accountName || '';
    
    // Format account number with masked format if available
    let accountNumber = '';
    if (accountDetails.accountNumber) {
      accountNumber = accountDetails.accountNumber.length > 4 
        ? 'xx-xxxx-' + accountDetails.accountNumber.slice(-4) 
        : accountDetails.accountNumber;
    }
    
    // Format the account section with real information ONLY
    const accountSection = accountName ? `
DISPUTED ITEM(S):
Account Name: ${accountName.toUpperCase()}
${accountNumber ? `Account Number: ${accountNumber}` : ''}
Reason for Dispute: ${disputeType}
` : 'I am disputing information in my credit report that may be inaccurate.';
    
    // Format address only with real data - NO PLACEHOLDERS
    const formattedAddress = userInfo.address || '';
    
    // Only format location info if ALL parts exist
    let locationInfo = '';
    if (userInfo.city && userInfo.state && userInfo.zip) {
      locationInfo = `${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;
    }

    // Generate the final letter
    let result = '';
    
    // Only include header and consumer info if available
    if (userInfo.name) {
      result += `${userInfo.name}\n`;
      
      if (formattedAddress) {
        result += `${formattedAddress}\n`;
      }
      
      if (locationInfo) {
        result += `${locationInfo}\n`;
      }
      
      result += `${currentDate}\n\n`;
    }
    
    // Only include bureau section if we have it
    if (bureauAddress) {
      result += `${bureauAddress}\n\n`;
    }
    
    result += `Re: Dispute of Inaccurate Information - ${disputeType}\n\n`;
    result += `To Whom It May Concern:\n\n`;
    result += `I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n\n`;
    result += `${accountSection}\n\n`;
    result += `Under the Fair Credit Reporting Act (FCRA), you are required to:\n`;
    result += `1. Conduct a reasonable investigation into the information I am disputing\n`;
    result += `2. Forward all relevant information that I provide to the furnisher\n`;
    result += `3. Review and consider all relevant information\n`;
    result += `4. Provide me the results of your investigation\n`;
    result += `5. Delete the disputed information if it cannot be verified\n\n`;
    result += `I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law.\n\n`;
    result += `${accountDetails.errorDescription || "The information appears to be incorrect and should be verified or removed from my credit report."}\n\n`;
    result += `Please investigate this matter and provide me with the results within 30 days as required by the FCRA.\n\n`;
    result += `Sincerely,\n\n`;
    
    if (userInfo.name) {
      result += `${userInfo.name}\n\n`;
    }
    
    result += `Enclosures:\n`;
    result += `- Copy of ID\n`;
    result += `- Copy of social security card\n`;
    result += `- Copy of utility bill\n`;

    console.log("Generated letter content length:", result.length);
    return result;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    return "Error generating dispute letter. Please try again.";
  }
}

/**
 * Generate letters for a list of issues
 */
export async function generateLettersForIssues(
  issues: Array<any>,
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  reportData?: CreditReportData
): Promise<Array<any>> {
  const letters: any[] = [];
  
  // Group issues by bureau
  const issuesByBureau: Record<string, any[]> = {};
  
  // Group issues by bureau
  for (const issue of issues) {
    const bureau = issue.bureau?.toLowerCase() || 'equifax';
    
    if (!issuesByBureau[bureau]) {
      issuesByBureau[bureau] = [];
    }
    
    issuesByBureau[bureau].push(issue);
  }
  
  // Generate a letter for each bureau
  for (const [bureau, bureauIssues] of Object.entries(issuesByBureau)) {
    try {
      const letterContent = generateEnhancedDisputeLetter(
        bureauIssues[0].type || 'inaccurate_information',
        {
          accountName: bureauIssues[0].accountName || 'Account in Question',
          accountNumber: bureauIssues[0].accountNumber || '',
          errorDescription: bureauIssues.map(issue => 
            `- ${issue.description || issue.type}`
          ).join('\n'),
          bureau: bureau
        },
        userInfo,
        reportData
      );
      
      letters.push({
        id: Date.now() + letters.length,
        title: `${bureau} Dispute Letter`,
        content: letterContent,
        letterContent: letterContent,
        bureau: bureau,
        status: 'draft',
        createdAt: new Date().toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        })
      });
    } catch (error) {
      console.error(`Error generating letter for bureau ${bureau}:`, error);
    }
  }
  
  return letters;
}

/**
 * Generate and store dispute letters in session storage
 */
export async function generateAndStoreDisputeLetters(reportData: CreditReportData): Promise<boolean> {
  try {
    const letters = await generateDisputeLetters(reportData);
    
    if (letters && letters.length > 0) {
      // Store the generated letters
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error generating and storing dispute letters:", error);
    return false;
  }
}
