
import { CreditReportData, CreditReportAccount, Issue, PersonalInfo } from '@/utils/creditReport/types';

/**
 * Generate enhanced dispute letter with account-specific information
 */
export async function generateEnhancedDisputeLetter(
  issueType: string,
  disputeDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string;
  },
  userInfo: any,
  reportData?: CreditReportData
): Promise<string> {
  console.log("Generating enhanced dispute letter for issue type:", issueType);
  console.log("Dispute details:", JSON.stringify(disputeDetails, null, 2));
  
  // Ensure we have all required information
  const accountName = disputeDetails.accountName || 'Account in Question';
  const accountNumber = disputeDetails.accountNumber || 'XXXXXXXXXXXX';
  const errorDescription = disputeDetails.errorDescription || 'contains inaccurate information';
  
  // Get bureau-specific information
  const bureauInfo = getBureauInfo(disputeDetails.bureau);
  
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get user name and address with fallbacks
  const userName = userInfo?.name || localStorage.getItem('userName') || '[YOUR NAME]';
  const userAddress = userInfo?.address || localStorage.getItem('userAddress') || '[YOUR ADDRESS]';
  const userCity = userInfo?.city || localStorage.getItem('userCity') || '[CITY]';
  const userState = userInfo?.state || localStorage.getItem('userState') || '[STATE]';
  const userZip = userInfo?.zip || localStorage.getItem('userZip') || '[ZIP]';
  
  // Generate a section with account details
  let accountDetailsSection = '';
  
  // Try to find the account in the report data for more details
  let accountDetails: CreditReportAccount | undefined;
  if (reportData?.accounts && reportData.accounts.length > 0) {
    accountDetails = reportData.accounts.find(acc => 
      acc.accountName === accountName || accountName.includes(acc.accountName) || acc.accountName.includes(accountName)
    );
    
    if (!accountDetails && accountNumber && accountNumber !== 'XXXXXXXXXXXX') {
      accountDetails = reportData.accounts.find(acc => 
        acc.accountNumber === accountNumber
      );
    }
    
    // If still not found, use the first account as a fallback
    if (!accountDetails) {
      accountDetails = reportData.accounts[0];
    }
  }
  
  // Format account details section based on the issue type
  if (issueType === 'collection' || issueType === 'collection_account') {
    accountDetailsSection = `
DISPUTED ACCOUNTS:

Collection Account: ${accountName.toUpperCase()}
Account Number: ${accountNumber}
${accountDetails?.creditor ? `Original Creditor: ${accountDetails.creditor}\n` : ''}
${accountDetails?.balance ? `Amount: $${accountDetails.balance}\n` : ''}
${accountDetails?.lastReportedDate ? `Reported: ${accountDetails.lastReportedDate}\n` : ''}
Issue: This collection account is disputed as inaccurate and unverified

Pursuant to the Fair Credit Reporting Act (FCRA), I am disputing this collection account as inaccurate. I request verification of this debt as it appears on my credit report or its prompt removal.
`;
  } else if (issueType === 'late_payment') {
    accountDetailsSection = `
DISPUTED ACCOUNTS:

Creditor: ${accountName.toUpperCase()}
Account Number: ${accountNumber}
${accountDetails?.balance ? `Balance: $${accountDetails.balance}\n` : ''}
${accountDetails?.openDate ? `Opened: ${accountDetails.openDate}\n` : ''}
${accountDetails?.lastReportedDate ? `Last Reported: ${accountDetails.lastReportedDate}\n` : ''}
${accountDetails?.status ? `Status: ${accountDetails.status}\n` : ''}
Issue: Late payments reported incorrectly

I dispute the late payment information for this account as it is not accurate. Please verify the payment history or remove the inaccurate late payment notations.
`;
  } else if (issueType === 'inquiry') {
    accountDetailsSection = `
DISPUTED ITEMS:

Inquiry By: ${accountName}
${accountDetails?.lastReportedDate ? `Date of Inquiry: ${accountDetails.lastReportedDate}\n` : ''}
Issue: Unauthorized inquiry

I did not authorize this inquiry and it should be removed from my credit report. Under the FCRA, only companies with a permissible purpose may access my credit information.
`;
  } else if (issueType === 'personal_info') {
    const personalInfo = reportData?.personalInfo;
    
    accountDetailsSection = `
DISPUTED INFORMATION:

Type: Personal Information
Issue: Inaccurate personal information

The following personal information on my credit report is incorrect or needs to be updated:
${personalInfo?.name ? `Name: ${personalInfo.name}\n` : ''}
${personalInfo?.address ? `Address: ${personalInfo.address}\n` : ''}
${personalInfo?.city && personalInfo.state ? `City/State: ${personalInfo.city}, ${personalInfo.state}\n` : ''}
${personalInfo?.employer ? `Employer: ${personalInfo.employer}\n` : ''}

Please correct this information in your records.
`;
  } else {
    accountDetailsSection = `
DISPUTED ACCOUNTS:

Account: ${accountName.toUpperCase()}
Account Number: ${accountNumber}
${accountDetails?.balance ? `Current Balance: $${accountDetails.balance}\n` : ''}
${accountDetails?.openDate ? `Date Opened: ${accountDetails.openDate}\n` : ''}
${accountDetails?.lastReportedDate ? `Last Reported: ${accountDetails.lastReportedDate}\n` : ''}
${accountDetails?.status ? `Status: ${accountDetails.status}\n` : ''}
Issue: ${errorDescription}

This account contains inaccurate information that requires verification. If you cannot verify this information, please remove it from my credit report.
`;
  }
  
  // Generate the full letter
  const letter = `${userName}
${userAddress}
${userCity}, ${userState} ${userZip}

${currentDate}

${bureauInfo.name}
${bureauInfo.address}

RE: Dispute of Inaccurate Information in Credit Report

To Whom It May Concern:

I am writing to dispute information in my credit report that I believe to be inaccurate. After reviewing my credit report, I have identified several discrepancies that require investigation.

${accountDetailsSection}

Under the Fair Credit Reporting Act (FCRA), specifically Section 611(a), you are required to investigate this dispute and either verify the information as accurate or remove it from my credit report. Please conduct a thorough investigation of the disputed information, including contacting the original sources of the information.

If you cannot verify this information, please remove it from my credit report and send me a free copy of my credit report showing the changes.

I understand that according to the FCRA, you are required to forward all relevant information to the information provider and to respond to my dispute within 30 days of receipt.

Thank you for your prompt attention to this matter.

Sincerely,

${userName}
`;

  return letter;
}

/**
 * Get the bureau-specific information for a letter
 */
function getBureauInfo(bureauName: string): { name: string, address: string } {
  const bureau = bureauName.toLowerCase();
  
  if (bureau.includes('experian')) {
    return {
      name: 'Experian',
      address: 'P.O. Box 4500\nAllen, TX 75013'
    };
  } else if (bureau.includes('equifax')) {
    return {
      name: 'Equifax Information Services LLC',
      address: 'P.O. Box 740256\nAtlanta, GA 30374'
    };
  } else if (bureau.includes('transunion') || bureau.includes('trans union')) {
    return {
      name: 'TransUnion LLC',
      address: 'Consumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
  }
  
  // Default fallback
  return {
    name: 'Credit Bureau',
    address: 'P.O. Box 4500\nAllen, TX 75013' // Default to Experian address
  };
}

/**
 * Generate dispute letters for multiple issues
 */
export async function generateLettersForIssues(
  issues: Issue[], 
  userInfo: any, 
  reportData?: CreditReportData
): Promise<Array<{ bureau: string, content: string }>> {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  const letters: Array<{ bureau: string, content: string }> = [];
  
  // Group issues by bureau to avoid duplicate letters
  const issuesByBureau: Record<string, Issue[]> = {};
  
  for (const issue of issues) {
    const bureau = issue.bureau || determineBureauFromReport(reportData);
    
    if (!issuesByBureau[bureau]) {
      issuesByBureau[bureau] = [];
    }
    
    issuesByBureau[bureau].push(issue);
  }
  
  // Generate a letter for each bureau with its issues
  for (const [bureau, bureauIssues] of Object.entries(issuesByBureau)) {
    // Get primary account for this bureau's issues
    const primaryIssue = bureauIssues[0];
    const accountName = primaryIssue.accountName || 'Multiple Accounts';
    const accountNumber = primaryIssue.accountNumber || '';
    
    // Generate description of all issues for this bureau
    let combinedDescription = '';
    let accountDetailsSection = 'DISPUTED ACCOUNTS:\n\n';
    
    // Add details for each account with issues
    for (const issue of bureauIssues) {
      if (issue.accountName) {
        accountDetailsSection += `Account: ${issue.accountName.toUpperCase()}\n`;
        if (issue.accountNumber) {
          accountDetailsSection += `Account Number: ${issue.accountNumber}\n`;
        }
        accountDetailsSection += `Issue: ${issue.description}\n\n`;
      }
    }
    
    // If no specific accounts were found, create a general description
    if (!accountDetailsSection.includes('Account:')) {
      accountDetailsSection = 'DISPUTED ITEMS:\n\n';
      for (const issue of bureauIssues) {
        accountDetailsSection += `Issue Type: ${issue.type.replace(/_/g, ' ').toUpperCase()}\n`;
        accountDetailsSection += `Description: ${issue.description}\n\n`;
      }
    }
    
    // Generate the letter for this bureau
    const letterContent = await generateEnhancedDisputeLetter(
      primaryIssue.type,
      {
        accountName: accountName,
        accountNumber: accountNumber,
        errorDescription: accountDetailsSection,
        bureau: bureau
      },
      userInfo,
      reportData
    );
    
    letters.push({
      bureau: bureau,
      content: letterContent
    });
  }
  
  return letters;
}

/**
 * Determine which bureau a report belongs to
 */
function determineBureauFromReport(reportData?: CreditReportData): string {
  if (!reportData) return 'Credit Bureau';
  
  if (reportData.primaryBureau) {
    return reportData.primaryBureau;
  } else if (reportData.bureau) {
    return reportData.bureau;
  } else if (reportData.bureaus) {
    if (reportData.bureaus.experian) {
      return 'Experian';
    } else if (reportData.bureaus.equifax) {
      return 'Equifax';
    } else if (reportData.bureaus.transunion) {
      return 'TransUnion';
    }
  }
  
  // Try to detect from report text
  if (reportData.rawText) {
    const text = reportData.rawText.toLowerCase();
    if (text.includes('experian')) {
      return 'Experian';
    } else if (text.includes('equifax')) {
      return 'Equifax';
    } else if (text.includes('transunion') || text.includes('trans union')) {
      return 'TransUnion';
    }
  }
  
  return 'Credit Bureau';
}

/**
 * Generate a single dispute letter
 */
export function generateDisputeLetter(
  issueType: string,
  disputeDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string;
  },
  userInfo: any,
  reportData?: CreditReportData
): Promise<string> {
  // This is just a wrapper around generateEnhancedDisputeLetter for backward compatibility
  return generateEnhancedDisputeLetter(issueType, disputeDetails, userInfo, reportData);
}

/**
 * Generate and store multiple dispute letters
 */
export async function generateAndStoreDisputeLetters(
  issues: Issue[],
  reportData: CreditReportData | null,
  userInfo: any
): Promise<Array<{ bureau: string, content: string }>> {
  // Generate letters for all issues
  const letters = await generateLettersForIssues(issues, userInfo, reportData || undefined);
  
  // Store the letters in session storage for later use
  try {
    const formattedLetters = letters.map((letterData, index) => ({
      id: `letter-${Date.now()}-${index}`,
      title: `Dispute Letter to ${letterData.bureau}`,
      content: letterData.content,
      letterContent: letterData.content,
      bureau: letterData.bureau,
      accountName: issues[0]?.accountName || "Multiple Accounts",
      accountNumber: issues[0]?.accountNumber || "",
      errorType: "dispute",
      status: "ready",
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));
    
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(formattedLetters));
    console.log(`Stored ${formattedLetters.length} letters in session storage`);
  } catch (error) {
    console.error("Error storing generated letters:", error);
  }
  
  return letters;
}
