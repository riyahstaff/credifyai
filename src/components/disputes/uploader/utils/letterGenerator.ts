import { CreditReportAccount, CreditReportData, IdentifiedIssue } from "@/utils/creditReport/types";
import { generateLettersForIssues } from "@/utils/creditReport/disputeLetters";
import { useToast } from "@/hooks/use-toast";

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
    
    // Use the enhanced letter generation function
    const letters = await generateLettersForIssues(issues, reportData, userInfo);
    
    if (letters && letters.length > 0) {
      console.log(`Successfully generated ${letters.length} letters`);
      return letters;
    } else {
      console.warn("No letters were generated, creating fallback letter");
      return [createFallbackLetter()];
    }
  } catch (error) {
    console.error("Error generating dispute letters:", error);
    return [createFallbackLetter()];
  }
};

/**
 * Get user information from storage
 */
function getUserInfoFromStorage(): { name: string; address?: string; city?: string; state?: string; zip?: string; } {
  try {
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

/**
 * Create a generic dispute letter when no specific issues are found
 */
export function createGenericLetter(reportData: CreditReportData): any {
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
