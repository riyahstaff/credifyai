
import { CreditReportAccount, CreditReportData, IdentifiedIssue } from "@/utils/creditReport/types";
import { generateLettersForIssues, generateDisputeLetter } from "@/utils/creditReport/disputeLetters";
import { createFallbackLetter } from "../handlers/fallbackLetterCreator";

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
    
    // Convert IdentifiedIssue[] to the format expected by generateDisputeLetter
    const convertedIssues = issues.map(issue => ({
      id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: issue.type,
      description: issue.description,
      bureau: issue.bureau || reportData.primaryBureau || "Equifax",
      accountName: issue.account?.accountName,
      accountNumber: issue.account?.accountNumber,
      reason: issue.description,
      severity: (issue.severity === 'high' || issue.impact?.includes('High')) ? 'high' : 
                (issue.severity === 'medium' || issue.impact?.includes('Medium')) ? 'medium' : 'low' as "high" | "medium" | "low",
      legalBasis: issue.laws?.join(', ') || "15 USC 1681e(b)"
    }));
    
    // Check if we have extracted actual issues from the report
    if (convertedIssues.length === 0) {
      console.warn("No issues found for letter generation, creating fallback letter");
      const fallbackLetter = createFallbackLetter(reportData);
      return [fallbackLetter];
    }
    
    // Generate letters for each issue
    const generatedLetters = [];
    
    for (const issue of convertedIssues) {
      try {
        const accountName = issue.accountName || (reportData.accounts && reportData.accounts.length > 0 ? reportData.accounts[0].accountName : "");
        const accountNumber = issue.accountNumber || (reportData.accounts && reportData.accounts.length > 0 ? reportData.accounts[0].accountNumber : "");
        
        console.log(`Generating letter for issue: ${issue.type} on account: ${accountName}`);
        
        // Generate a letter for this issue
        const letterContent = await generateDisputeLetter(
          issue.type,
          {
            accountName: accountName,
            accountNumber: accountNumber,
            errorDescription: issue.description || "Information appears to be inaccurate",
            bureau: issue.bureau || reportData.primaryBureau || "Equifax",
            relevantReportText: reportData.rawText?.substring(0, 1000) || ""
          },
          userInfo,
          reportData
        );
        
        if (letterContent && letterContent.length > 200) {
          generatedLetters.push({
            id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: `${issue.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Dispute`,
            content: letterContent,
            letterContent: letterContent,
            bureau: issue.bureau || reportData.primaryBureau || "Equifax",
            accountName: accountName,
            accountNumber: accountNumber,
            errorType: issue.type,
            status: "ready",
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });
          
          console.log(`Successfully generated letter for ${issue.type}`);
        } else {
          console.warn(`Generated letter for ${issue.type} was too short or empty`);
        }
      } catch (error) {
        console.error(`Error generating letter for issue ${issue.type}:`, error);
      }
    }
    
    if (generatedLetters.length > 0) {
      console.log(`Successfully generated ${generatedLetters.length} letters`);
      console.log("First letter content sample:", generatedLetters[0].content?.substring(0, 100));
      return generatedLetters;
    } else {
      console.warn("No valid letters were generated, creating fallback letter");
      const fallbackLetter = createFallbackLetter(reportData);
      return [fallbackLetter];
    }
  } catch (error) {
    console.error("Error generating dispute letters:", error);
    
    // Create and return a fallback letter using ONLY real data
    const fallbackLetter = createFallbackLetter(reportData);
    return [fallbackLetter];
  }
};

/**
 * Get user information from storage
 */
function getUserInfoFromStorage(): { name: string; address?: string; city?: string; state?: string; zip?: string; } {
  try {
    console.log("Getting user info from storage");
    
    // Get user info from report data first
    const reportData = sessionStorage.getItem('creditReportData');
    if (reportData) {
      try {
        const parsedReport = JSON.parse(reportData);
        if (parsedReport.personalInfo && parsedReport.personalInfo.name) {
          console.log("Using personal info from report data");
          return {
            name: parsedReport.personalInfo.name,
            address: parsedReport.personalInfo.address,
            city: parsedReport.personalInfo.city,
            state: parsedReport.personalInfo.state,
            zip: parsedReport.personalInfo.zip
          };
        }
      } catch (e) {
        console.error("Error parsing report data:", e);
      }
    }
    
    // Fallback to other storage options
    let userName = localStorage.getItem('userName') || 
                  sessionStorage.getItem('userName') ||
                  JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name ||
                  '';
                  
    console.log("User name retrieved for letter:", userName);
    
    if (!userName) {
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
      name: userName || '',
      address,
      city,
      state,
      zip
    };
  } catch (error) {
    console.error("Error getting user info from storage:", error);
    return { name: '' };
  }
}

/**
 * Create a generic dispute letter when no specific issues are found
 * This enhanced version extracts more details from the report data
 */
export async function createGenericLetterWithDetails(reportData: CreditReportData): Promise<any> {
  // Create a fallback letter using our dedicated handler that uses ONLY report data
  return createFallbackLetter(reportData);
}
