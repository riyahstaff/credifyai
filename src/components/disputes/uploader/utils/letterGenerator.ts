
import { CreditReportAccount, CreditReportData, IdentifiedIssue } from "@/utils/creditReport/types";

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
    // Fetch templates from external backend service
    let letters = [];
    
    // Process each issue and generate letters
    for (const issue of issues) {
      console.log(`Generating letter for issue: ${issue.title}`);
      
      // Find the account referenced in the issue - adjust this to use account from issue directly
      // instead of an accountIndex which doesn't exist in IdentifiedIssue
      const account = issue.account || undefined;
      
      if (account) {
        console.log(`Found account for issue: ${account.accountName}`);
      } else {
        console.log("No account found for issue");
      }

      // Create letter and add to collection
      const letter = await createLetterFromIssue(issue, account, reportData);
      
      if (letter) {
        letters.push(letter);
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
 * Create a letter from an identified issue
 */
async function createLetterFromIssue(
  issue: IdentifiedIssue, 
  account?: CreditReportAccount,
  reportData?: CreditReportData
): Promise<any> {
  try {
    // Determine the bureau from the issue or report data
    // Use a fallback approach since issue.bureau might not exist
    const bureau = reportData?.primaryBureau || "Experian";
    
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
      errorType: issue.type || "Data Inaccuracy"
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
    content: `Dear ${bureau},\n\nI am writing to dispute information in my credit report that I believe is inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.\n\nPlease conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n[YOUR NAME]`,
    letterContent: `Dear ${bureau},\n\nI am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.\n\nPlease conduct a thorough investigation of all items I am disputing, as required by the Fair Credit Reporting Act. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n[YOUR NAME]`,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: "ready",
    errorType: "Data Inaccuracy"
  };
}

/**
 * Create a fallback letter when letter generation fails
 */
export function createFallbackLetter(): any {
  return {
    id: Date.now(),
    title: "Credit Report Dispute",
    bureau: "Credit Bureau",
    accountName: "Account in Question",
    accountNumber: "",
    content: "Dear Credit Bureau,\n\nI am writing to dispute information in my credit report. After reviewing my credit report, I have identified information that I believe to be inaccurate.\n\nAs per my rights under the Fair Credit Reporting Act, I request that you investigate this matter and correct the disputed information. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n[YOUR NAME]",
    letterContent: "Dear Credit Bureau,\n\nI am writing to dispute information in my credit report. After reviewing my credit report, I have identified information that I believe to be inaccurate.\n\nAs per my rights under the Fair Credit Reporting Act, I request that you investigate this matter and correct the disputed information. If you cannot verify this information, please remove it from my credit report.\n\nSincerely,\n[YOUR NAME]",
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: "ready",
    errorType: "General Dispute"
  };
}
