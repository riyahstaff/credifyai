
import { CreditReportData, CreditReportAccount, PersonalInfo } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter, generateDisputeLetterForDiscrepancy } from '@/utils/creditReport/disputeLetters';
import { analyzeReportForIssues } from '@/utils/creditReport/parser/analyzeReportIssues';
import { identifyIssues } from '@/utils/reportAnalysis/issueIdentification/identifyIssues';

/**
 * Automatically generate a dispute letter based on credit report data
 */
export async function generateAutomaticDisputeLetter(
  reportData: CreditReportData, 
  targetAccountName?: string,
  userInfo?: Partial<PersonalInfo>
): Promise<string> {
  console.log("Generating automatic dispute letter for account:", targetAccountName);
  
  try {
    // Extract and log critical data for debugging
    console.log("Report data structure:", {
      hasPersonalInfo: Boolean(reportData.personalInfo),
      hasAccounts: Boolean(reportData.accounts) && reportData.accounts.length > 0,
      accountCount: reportData.accounts?.length || 0,
      bureau: reportData.primaryBureau || 'Unknown'
    });
    
    if (reportData.personalInfo) {
      console.log("Found personal info:", {
        name: reportData.personalInfo.name || 'Missing',
        hasAddress: Boolean(reportData.personalInfo.address),
        hasCity: Boolean(reportData.personalInfo.city),
        hasState: Boolean(reportData.personalInfo.state)
      });
    }
    
    // Identify issues in the credit report if none exist already
    let issues = reportData.issues || [];
    
    if (issues.length === 0 && reportData) {
      console.log("No issues found in report data, identifying issues now");
      issues = identifyIssues(reportData);
      
      // Store the identified issues in the report data
      reportData.issues = issues;
    }
    
    console.log(`Found ${issues.length} issues in credit report`);
    
    // If we have issues and target account, filter for that account
    let targetIssue = null;
    let targetAccount: CreditReportAccount | undefined;
    
    if (targetAccountName && reportData.accounts) {
      targetAccount = reportData.accounts.find(acc => 
        acc.accountName === targetAccountName || 
        acc.accountName?.toLowerCase().includes(targetAccountName.toLowerCase())
      );
      
      if (targetAccount) {
        console.log("Found target account:", targetAccount.accountName);
        
        // Look for issues specific to this account
        targetIssue = issues.find(issue => 
          issue.account?.accountName === targetAccount?.accountName
        );
      }
    }
    
    // If no target issue found but we have issues, use the first one
    if (!targetIssue && issues.length > 0) {
      console.log("No target issue found, using first issue");
      targetIssue = issues[0];
    }
    
    // Extract user info from provided data or reportData
    // Build complete user info object, preferring direct data over report data
    const formattedUserInfo = {
      name: userInfo?.name || reportData.personalInfo?.name || localStorage.getItem('userName') || "YOUR NAME",
      address: userInfo?.address || reportData.personalInfo?.address || localStorage.getItem('userAddress') || "YOUR ADDRESS",
      city: userInfo?.city || reportData.personalInfo?.city || localStorage.getItem('userCity') || "CITY",
      state: userInfo?.state || reportData.personalInfo?.state || localStorage.getItem('userState') || "STATE",
      zip: userInfo?.zip || reportData.personalInfo?.zip || localStorage.getItem('userZip') || "ZIP"
    };
    
    console.log("User info for letter:", formattedUserInfo);
    
    // If we have a target issue, generate a letter for it
    if (targetIssue) {
      console.log("Generating letter for issue:", targetIssue.type);
      
      const issueType = targetIssue.type || 'inaccurate_information';
      const accountName = targetIssue.account?.accountName || 
                         (targetAccount?.accountName) || 
                         'Account in Question';
      const accountNumber = targetIssue.account?.accountNumber || 
                           (targetAccount?.accountNumber) || 
                           '';
      const errorDescription = targetIssue.description || 'Information appears to be inaccurate';
      const bureau = targetIssue.bureau || reportData.primaryBureau || 'Equifax';
      
      console.log("Letter details:", {
        issueType, 
        accountName,
        accountNumber,
        bureau,
        user: formattedUserInfo.name
      });
      
      // Generate a letter using the dispute letter function
      const letter = generateDisputeLetterForDiscrepancy({
        accountName,
        accountNumber,
        errorDescription,
        bureau
      }, formattedUserInfo);
      
      console.log("Letter generated successfully, length:", letter.length);
      return letter;
      
    } else if (targetAccount) {
      // If no specific issue but we have a target account, create a generic issue for it
      console.log("No specific issue found, generating letter for account:", targetAccount.accountName);
      
      return generateDisputeLetterForDiscrepancy({
        accountName: targetAccount.accountName,
        accountNumber: targetAccount.accountNumber,
        errorDescription: `I am disputing information related to this account that appears on my credit report. The information appears to be inaccurate and should be verified or removed.`,
        bureau: reportData.primaryBureau || 'Equifax'
      }, formattedUserInfo);
      
    } else if (reportData.accounts && reportData.accounts.length > 0) {
      // If no target account specified, use the first account from the credit report
      const firstAccount = reportData.accounts[0];
      console.log("Using first account from report:", firstAccount.accountName);
      
      return generateDisputeLetterForDiscrepancy({
        accountName: firstAccount.accountName,
        accountNumber: firstAccount.accountNumber,
        errorDescription: `I am disputing information related to this account that appears on my credit report. The information appears to be inaccurate and should be verified or removed.`,
        bureau: reportData.primaryBureau || 'Equifax'
      }, formattedUserInfo);
      
    } else {
      // Fallback for when no accounts or issues are found
      console.log("No accounts or issues found, generating generic letter with available data");
      
      return generateDisputeLetterForDiscrepancy({
        accountName: 'Credit Report Accounts',
        errorDescription: 'After reviewing my credit report, I have identified information that appears to be inaccurate and requires investigation.',
        bureau: reportData.primaryBureau || 'Equifax'
      }, formattedUserInfo);
    }
    
  } catch (error) {
    console.error("Error generating automatic dispute letter:", error);
    
    // Get any available user info from localStorage
    const userName = localStorage.getItem('userName') || userInfo?.name || "[YOUR NAME]";
    const userAddress = localStorage.getItem('userAddress') || userInfo?.address || "";
    const userCity = localStorage.getItem('userCity') || userInfo?.city || "";
    const userState = localStorage.getItem('userState') || userInfo?.state || "";
    const userZip = localStorage.getItem('userZip') || userInfo?.zip || "";
    
    // Return a simple generic letter as a last resort
    return `${userName}\n` +
           `${userAddress ? userAddress + '\n' : ''}` +
           `${userCity ? userCity + ', ' : ''}${userState || ''} ${userZip || ''}\n\n` +
           `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n` +
           `Credit Bureau\n` +
           `P.O. Box\n\n` +
           `Re: Dispute of Inaccurate Credit Report Information\n\n` +
           `To Whom It May Concern:\n\n` +
           `I am writing to dispute inaccurate information in my credit report. Please investigate and correct these errors per the Fair Credit Reporting Act.\n\n` +
           `Sincerely,\n\n` +
           `${userName}`;
  }
}
