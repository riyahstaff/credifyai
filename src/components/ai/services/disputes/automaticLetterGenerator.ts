
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
    // Identify issues in the credit report
    let issues = reportData.issues || [];
    
    // If no issues are already identified, try to identify them now
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
          issue.account?.accountName === targetAccount?.accountName ||
          issue.accountName === targetAccount?.accountName
        );
      }
    }
    
    // If no target issue found but we have issues, use the first one
    if (!targetIssue && issues.length > 0) {
      console.log("No target issue found, using first issue");
      targetIssue = issues[0];
    }
    
    // Extract user info from provided data or reportData
    const userName = userInfo?.name || reportData.personalInfo?.name || "[YOUR NAME]";
    
    const formattedUserInfo = {
      name: userName,
      address: userInfo?.address || reportData.personalInfo?.address || "",
      city: userInfo?.city || reportData.personalInfo?.city || "",
      state: userInfo?.state || reportData.personalInfo?.state || "",
      zip: userInfo?.zip || reportData.personalInfo?.zip || ""
    };
    
    // If we have a target issue, generate a letter for it
    if (targetIssue) {
      console.log("Generating letter for issue:", targetIssue.type);
      
      const issueType = targetIssue.type || 'inaccurate_information';
      const accountName = targetIssue.account?.accountName || targetAccount?.accountName || 'Account in Question';
      const accountNumber = targetIssue.account?.accountNumber || targetAccount?.accountNumber || '';
      const errorDescription = targetIssue.description || 'Information appears to be inaccurate';
      const bureau = targetIssue.bureau || reportData.primaryBureau || 'Equifax';
      
      console.log("Letter details:", {
        issueType, 
        accountName,
        bureau,
        user: userName
      });
      
      // Generate a letter using the enhanced dispute letter function
      return generateEnhancedDisputeLetter(
        issueType,
        {
          accountName,
          accountNumber,
          errorDescription,
          bureau
        },
        formattedUserInfo
      );
      
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
      console.log("No accounts or issues found, generating generic letter");
      
      return generateEnhancedDisputeLetter(
        'general',
        {
          accountName: 'Multiple Accounts',
          errorDescription: 'After reviewing my credit report, I have identified information that appears to be inaccurate and requires investigation.',
          bureau: reportData.primaryBureau || 'Equifax'
        },
        formattedUserInfo
      );
    }
    
  } catch (error) {
    console.error("Error generating automatic dispute letter:", error);
    
    // Return a simple generic letter as a last resort
    return `${userInfo?.name || "[YOUR NAME]"}\n\n` +
           `${new Date().toLocaleDateString()}\n\n` +
           `Credit Bureau\n` +
           `P.O. Box\n\n` +
           `Re: Dispute of Inaccurate Credit Report Information\n\n` +
           `To Whom It May Concern:\n\n` +
           `I am writing to dispute inaccurate information in my credit report. Please investigate and correct these errors per the Fair Credit Reporting Act.\n\n` +
           `Sincerely,\n\n` +
           `${userInfo?.name || "[YOUR NAME]"}`;
  }
}
