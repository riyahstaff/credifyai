
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
    
    // Debug the issues we're using to generate letters
    console.log("Issue details for letter generation:", 
      issues.map(i => ({
        type: i.type,
        description: i.description,
        account: i.account,
        bureau: i.bureau
      }))
    );
    
    // Convert IdentifiedIssue[] to the format expected by generateAndStoreDisputeLetters
    const convertedIssues = issues.map(issue => ({
      id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: issue.type,
      description: issue.description,
      bureau: issue.bureau || reportData.primaryBureau || "Unknown",
      accountName: issue.account?.accountName,
      accountNumber: issue.account?.accountNumber,
      reason: issue.description,
      severity: (issue.severity === 'high' || issue.impact?.includes('High') || issue.impact?.includes('Critical')) ? 'high' : 
                (issue.severity === 'medium' || issue.impact?.includes('Medium')) ? 'medium' : 'low' as "high" | "medium" | "low",
      legalBasis: issue.laws?.join(', ') || "15 USC 1681e(b)"
    }));
    
    // Check if we have extracted actual issues from the report
    if (convertedIssues.length === 0) {
      console.warn("No issues found for letter generation, creating fallback issue");
      // Create a generic issue if none were found
      const fallbackIssue = {
        id: `fallback-${Date.now()}`,
        type: 'inaccurate_information',
        description: 'Potential inaccurate information found in credit report',
        bureau: reportData.primaryBureau || "Unknown",
        accountName: reportData.accounts && reportData.accounts.length > 0 ? 
          reportData.accounts[0].accountName : 'Unknown Account',
        accountNumber: reportData.accounts && reportData.accounts.length > 0 ? 
          reportData.accounts[0].accountNumber : '',
        reason: 'Information appears to be inaccurate and requires verification',
        severity: 'medium' as "medium",
        legalBasis: "15 USC 1681e(b)"
      };
      convertedIssues.push(fallbackIssue);
    }
    
    // Use our enhanced letter generation system
    const letters = await generateAndStoreDisputeLetters(convertedIssues, reportData, userInfo);
    
    if (letters && letters.length > 0) {
      console.log(`Successfully generated ${letters.length} letters`);
      console.log("First letter content sample:", letters[0].content?.substring(0, 100));
      return letters;
    } else {
      console.warn("No letters were generated, creating generic letter");
      const genericLetter = await createGenericLetterWithDetails(reportData);
      
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
    const fallbackLetter = await createGenericLetterWithDetails(reportData);
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
 * This enhanced version extracts more details from the report data
 */
export async function createGenericLetterWithDetails(reportData: CreditReportData): Promise<any> {
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
  
  // Find accounts to use in the letter
  let accountsText = "";
  
  if (reportData.accounts && reportData.accounts.length > 0) {
    // Get up to 3 accounts to include
    const accountsToInclude = reportData.accounts.slice(0, 3);
    
    accountsText = accountsToInclude.map(account => {
      return `
Account Name: ${account.accountName}
${account.accountNumber ? `Account Number: ${account.accountNumber}\n` : ''}${account.currentBalance ? `Current Balance: $${account.currentBalance}\n` : ''}${account.paymentStatus ? `Status: ${account.paymentStatus}\n` : ''}`;
    }).join("\n");
    
    console.log(`Including ${accountsToInclude.length} accounts in letter`);
  } else {
    accountsText = "Multiple accounts on my credit report";
  }
  
  // Generate a proper letter using our generator
  let letterContent;
  try {
    // Try to find an account for the letter
    const firstAccount = reportData.accounts && reportData.accounts.length > 0 
      ? reportData.accounts[0] : null;
    
    letterContent = await generateDisputeLetter(
      'general',
      {
        accountName: firstAccount?.accountName || "Multiple Accounts",
        accountNumber: firstAccount?.accountNumber || "",
        errorDescription: "Information appears to be inaccurate",
        bureau: bureauName,
        relevantReportText: reportData.rawText?.substring(0, 1000) || ""
      },
      userInfo,
      reportData
    );
    
    if (!letterContent || letterContent.length < 200) {
      throw new Error("Generated letter content is too short or empty");
    }
  } catch (error) {
    console.error("Error generating letter from template:", error);
    
    // If letter generation fails, create a detailed fallback template
    letterContent = `${userInfo.name || '[YOUR NAME]'}
${userInfo.address ? userInfo.address + '\n' : ''}${userInfo.city ? userInfo.city + ', ' : ''}${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${letterDate}

${bureauName}
${getBureauAddress(bureauName)}

RE: Dispute of Inaccurate Information in Credit Report
${reportData.personalInfo?.ssn ? `\nSSN: ${reportData.personalInfo.ssn}` : ''}

To Whom It May Concern:

I am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.

I am disputing the following accounts:

${accountsText}

These items appear to be inaccurate because:
- The information does not belong to me
- The account details are incorrectly reported
- The payment history contains errors
- Other information appears to be inaccurate

I am disputing this information under the following laws and regulations:

1. 15 USC 1681e(b): Requires credit reporting agencies to follow reasonable procedures to assure maximum possible accuracy.
2. 15 USC 1681i(a)(1): Requires credit reporting agencies to conduct a reasonable investigation of disputed information.
3. 15 USC 1681s-2(a)(3): Prohibits furnishers from continuing to report information that is discovered to be inaccurate.

Please conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information with the original creditors, please remove it from my credit report.

I understand that according to the Fair Credit Reporting Act, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.

Thank you for your prompt attention to this matter.

Sincerely,

${userInfo.name || '[YOUR NAME]'}`;
  }
  
  return {
    id: `letter-${Date.now()}`,
    title: `Dispute Letter to ${bureauName}`,
    content: letterContent,
    letterContent: letterContent,
    bureau: bureauName,
    accountName: reportData.accounts?.[0]?.accountName || "Multiple Accounts",
    accountNumber: reportData.accounts?.[0]?.accountNumber || "",
    errorType: "general_dispute",
    status: "ready",
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

/**
 * Find an account with issues to focus on in the letter
 */
function findProblematicAccount(accounts: CreditReportAccount[]): CreditReportAccount {
  // Look for accounts with late payments or collections first
  const problematicAccount = accounts.find(account => 
    (account.paymentStatus && account.paymentStatus.toLowerCase().includes('late')) ||
    (account.accountType && account.accountType.toLowerCase().includes('collection')) ||
    (account.accountName && account.accountName.toLowerCase().includes('collection'))
  );
  
  return problematicAccount || accounts[0];
}

/**
 * Get the address for a credit bureau
 */
function getBureauAddress(bureau: string): string {
  switch (bureau.toLowerCase()) {
    case 'experian':
      return 'Experian\nP.O. Box 4500\nAllen, TX 75013';
    case 'equifax':
      return 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374';
    case 'transunion':
      return 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016';
    default:
      return 'P.O. Box 4500\nAllen, TX 75013';
  }
}
