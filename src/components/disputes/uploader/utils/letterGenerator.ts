
import { CreditReportAccount, CreditReportData, IdentifiedIssue } from "@/utils/creditReport/types";
import { generateDisputeLetter } from "@/services/externalBackendService";

/**
 * Generates dispute letters based on identified issues in a credit report
 */
export const generateDisputeLetters = async (
  issues: IdentifiedIssue[],
  reportData: CreditReportData
): Promise<any[]> => {
  console.log(`Generating dispute letters for ${issues.length} issues with report data:`, {
    accounts: reportData.accounts?.length || 0,
    personalInfo: reportData.personalInfo ? 'present' : 'missing',
    bureaus: reportData.bureaus,
    rawText: reportData.rawText ? `${reportData.rawText.length} chars` : 'missing'
  });

  try {
    // Use the external backend service to generate letters
    let letters = [];
    
    // Process each issue and generate letters
    for (const issue of issues) {
      console.log(`Generating letter for issue: ${issue.title}`);
      
      // Get the account from the issue
      const account = issue.account || undefined;
      
      if (account) {
        console.log(`Found account for issue: ${account.accountName}`);
      } else {
        console.log("No account found for issue");
      }

      // Get user information from localStorage or session storage
      const userInfo = getUserInfoFromStorage();

      // Create letter using the external backend service
      const response = await generateDisputeLetter(
        {
          issue: issue,
          account: account,
          reportData: reportData
        },
        userInfo
      );
      
      if (response.success && response.data) {
        console.log("Successfully generated letter using external API");
        
        // Create a properly formatted letter object
        const letter = {
          id: Date.now(),
          title: issue.title || "Credit Report Dispute",
          bureau: reportData?.primaryBureau || "Experian",
          accountName: account?.accountName || "Multiple Accounts",
          accountNumber: account?.accountNumber || "",
          content: response.data,
          letterContent: response.data,
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: "ready",
          errorType: issue.type || "Data Inaccuracy",
          recipient: reportData?.primaryBureau || "Credit Bureau",
          bureaus: [reportData?.primaryBureau || "Experian"]
        };
        
        letters.push(letter);
      } else {
        console.error("Failed to generate letter using external API:", response.error);
        
        // Fall back to local letter generation
        const letter = await createLetterFromIssue(issue, account, reportData);
        
        if (letter) {
          letters.push(letter);
        }
      }
    }
    
    if (letters.length === 0) {
      // Create a generic letter
      const genericLetter = createGenericLetter(reportData);
      letters.push(genericLetter);
    }

    console.log(`Generated ${letters.length} letters`);
    return letters;
  } catch (error) {
    console.error("Error generating dispute letters:", error);
    // Return a fallback letter
    return [createFallbackLetter()];
  }
};

/**
 * Get user information from storage
 */
function getUserInfoFromStorage(): { name: string; address?: string; city?: string; state?: string; zip?: string; } {
  try {
    // Get user name from various sources
    const userName = localStorage.getItem('userName') || 
                    sessionStorage.getItem('userName') ||
                    JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name ||
                    '[YOUR NAME]';
    
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
 * Create a letter from an identified issue
 */
async function createLetterFromIssue(
  issue: IdentifiedIssue, 
  account?: CreditReportAccount,
  reportData?: CreditReportData
): Promise<any> {
  try {
    // Determine the bureau from the report data
    const bureau = reportData?.primaryBureau || "Experian";
    
    // Get user information from storage
    const userInfo = getUserInfoFromStorage();
    
    // Create the letter object
    const letter = {
      id: Date.now(),
      title: issue.title || "Credit Report Dispute",
      bureau: bureau,
      accountName: account?.accountName || "Multiple Accounts",
      accountNumber: account?.accountNumber || "",
      content: issue.description || "",
      letterContent: issue.description || "",
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: "ready",
      errorType: issue.type || "Data Inaccuracy",
      recipient: bureau,
      bureaus: [bureau]
    };
    
    return letter;
  } catch (error) {
    console.error("Error creating letter from issue:", error);
    return null;
  }
}

/**
 * Create a generic dispute letter when no specific issues are found
 */
function createGenericLetter(reportData: CreditReportData): any {
  // Get user information from storage
  const userInfo = getUserInfoFromStorage();
  
  // Determine the bureau from the report data
  const bureau = reportData?.primaryBureau || 
               (reportData?.bureaus?.experian ? "Experian" : 
                reportData?.bureaus?.equifax ? "Equifax" : 
                reportData?.bureaus?.transunion ? "TransUnion" : "Experian");
  
  return {
    id: Date.now(),
    title: "General Credit Report Dispute",
    bureau: bureau,
    accountName: "Multiple Accounts",
    accountNumber: "",
    content: `Dear ${bureau},\n\nI am writing to dispute information in my credit report that I believe is inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.\n\nPlease conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n${userInfo.name}`,
    letterContent: `Dear ${bureau},\n\nI am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.\n\nPlease conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n${userInfo.name}`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: "ready",
    errorType: "Data Inaccuracy",
    recipient: bureau,
    bureaus: [bureau]
  };
}

/**
 * Create a fallback letter when letter generation fails
 */
export function createFallbackLetter(): any {
  // Get user information from storage
  const userInfo = getUserInfoFromStorage();
  
  return {
    id: Date.now(),
    title: "Credit Report Dispute",
    bureau: "Credit Bureau",
    accountName: "Account in Question",
    accountNumber: "",
    content: "Dear Credit Bureau,\n\nI am writing to dispute information in my credit report. After reviewing my credit report, I have identified information that I believe to be inaccurate.\n\nAs per my rights under the Fair Credit Reporting Act, I request that you investigate this matter and correct the disputed information. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n" + userInfo.name,
    letterContent: "Dear Credit Bureau,\n\nI am writing to dispute information in my credit report. After reviewing my credit report, I have identified information that I believe to be inaccurate.\n\nAs per my rights under the Fair Credit Reporting Act, I request that you investigate this matter and correct the disputed information. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n" + userInfo.name,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: "ready",
    errorType: "General Dispute",
    recipient: "Credit Bureau",
    bureaus: ["Credit Bureau"]
  };
}
