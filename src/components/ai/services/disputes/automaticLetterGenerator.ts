
import { CreditReportData, CreditReportAccount, PersonalInfo, IdentifiedIssue } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter, generateLettersForIssues } from '@/utils/creditReport/disputeLetters';
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
  
  if (!reportData) {
    throw new Error('No credit report data provided');
  }

  try {
    // Debug the report data
    console.log("Report data summary:", {
      hasAccounts: reportData.accounts && reportData.accounts.length > 0,
      accountCount: reportData.accounts?.length || 0,
      firstAccountName: reportData.accounts && reportData.accounts.length > 0 ? 
        reportData.accounts[0].accountName : 'No accounts',
      hasRawText: Boolean(reportData.rawText),
      rawTextLength: reportData.rawText?.length || 0,
      bureaus: reportData.bureaus,
      primaryBureau: reportData.primaryBureau || 'Not set',
      bureau: reportData.bureau || 'Not set'
    });
    
    // Find the target account
    let targetAccount: CreditReportAccount | undefined;
    
    if (targetAccountName && reportData.accounts) {
      targetAccount = reportData.accounts.find(
        acc => acc.accountName.toLowerCase().includes(targetAccountName.toLowerCase())
      );
      console.log("Looking for account:", targetAccountName, "Found:", Boolean(targetAccount));
    }
    
    // If no target account is found, use the first account
    if (!targetAccount && reportData.accounts && reportData.accounts.length > 0) {
      targetAccount = reportData.accounts[0];
      console.log("Using first account as target:", targetAccount.accountName);
    }
    
    if (!targetAccount) {
      console.warn('No account found in credit report data, creating placeholder');
      // Create a placeholder account to avoid errors
      targetAccount = {
        accountName: 'Account in Question',
        accountNumber: 'XXXXXXXXXXXX',
        bureau: determineBureauFromReport(reportData)
      };
    }
    
    // Determine which bureau to address the letter to
    const bureau = determineBureauFromReport(reportData);
    console.log("Determined bureau:", bureau);
    
    // Get user information from params or localStorage
    const userData = {
      name: userInfo?.name || localStorage.getItem('userName') || '[YOUR NAME]',
      address: userInfo?.address || localStorage.getItem('userAddress') || '[YOUR ADDRESS]',
      city: userInfo?.city || localStorage.getItem('userCity') || '[CITY]',
      state: userInfo?.state || localStorage.getItem('userState') || '[STATE]',
      zip: userInfo?.zip || localStorage.getItem('userZip') || '[ZIP]',
    };
    console.log("User data for letter:", userData);
    
    // Check if the report already has issues identified
    let issues: IdentifiedIssue[] = reportData.issues || [];
    
    // If not, analyze the report using identifyIssues
    if (issues.length === 0) {
      console.log("No issues found in report data, analyzing now...");
      issues = identifyIssues(reportData);
      console.log(`Found ${issues.length} issues in report`);
      
      // Store the issues back to the report data
      reportData.issues = issues;
    }
    
    // If we have issues, generate a letter for them
    if (issues.length > 0) {
      console.log("Generating letter from detected issues");
      
      // Convert IdentifiedIssues to the format expected by generateLettersForIssues
      const convertedIssues = issues.map(issue => ({
        id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: issue.type,
        description: issue.description,
        bureau: issue.bureau || reportData.primaryBureau || bureau,
        accountName: issue.account?.accountName || targetAccount.accountName,
        accountNumber: issue.account?.accountNumber || targetAccount.accountNumber || "",
        reason: issue.description,
        severity: (issue.severity === 'high' || issue.impact?.includes('High') || issue.impact?.includes('Critical')) ? 'high' : 
                 (issue.severity === 'medium' || issue.impact?.includes('Medium')) ? 'medium' : 'low' as "high" | "medium" | "low",
        legalBasis: issue.laws.join(', ')
      }));
      
      // Generate letters for all issues
      const generatedLetters = await generateLettersForIssues(convertedIssues, userData, reportData);
      
      if (generatedLetters.length > 0) {
        // Store all generated letters
        const lettersToStore = generatedLetters.map((letter, index) => {
          return {
            id: Date.now() + index,
            title: `${letter.bureau} Dispute Letter`,
            content: letter.content,
            letterContent: letter.content,
            bureau: letter.bureau,
            accountName: targetAccount?.accountName || "Multiple Accounts",
            accountNumber: targetAccount?.accountNumber || "",
            errorType: issues[0]?.type || 'general',
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'ready'
          };
        });
        
        // Store the generated letters in session storage
        try {
          sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(lettersToStore));
          console.log(`Stored ${lettersToStore.length} letters in session storage`);
        } catch (e) {
          console.error("Error updating generated letters:", e);
        }
        
        // Return the first letter (most relevant)
        return generatedLetters[0].content;
      }
    }
    
    // Fallback: if no issues were detected or letter generation failed, use the enhanced dispute letter
    // Look for specific issue types in the account
    const issueType = determineMainIssueType(targetAccount, reportData);
    
    // Check if we need to include personal info issues
    const hasPersonalInfoIssues = checkForPersonalInfoIssues(reportData);
    const finalIssueType = hasPersonalInfoIssues ? 'personal_info' : issueType;
    
    console.log("Generating fallback letter with issue type:", finalIssueType);
    console.log("Target account for letter:", {
      name: targetAccount.accountName,
      number: targetAccount.accountNumber,
      bureau: bureau
    });
    
    // Generate letter using our enhanced generator
    const letterContent = await generateEnhancedDisputeLetter(
      finalIssueType,
      {
        accountName: targetAccount.accountName,
        accountNumber: targetAccount.accountNumber || 'XXXX',
        errorDescription: generateErrorDescription(targetAccount, finalIssueType),
        bureau: bureau,
        relevantReportText: extractRelevantText(reportData, targetAccount)
      },
      userData,
      reportData
    );
    
    // Store the generated letter
    const letter = {
      id: Date.now(),
      title: `${targetAccount.accountName} Dispute`,
      content: letterContent,
      letterContent: letterContent,
      bureau: bureau,
      accountName: targetAccount.accountName,
      accountNumber: targetAccount.accountNumber || '',
      errorType: finalIssueType,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'ready'
    };
    
    // Store the letter in session storage
    sessionStorage.setItem('autoGeneratedLetter', JSON.stringify(letter));
    
    // Add to generatedDisputeLetters array if it exists
    try {
      const existingLetters = sessionStorage.getItem('generatedDisputeLetters');
      if (existingLetters) {
        const letters = JSON.parse(existingLetters);
        letters.push(letter);
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
      } else {
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([letter]));
      }
    } catch (e) {
      console.error("Error updating generated letters:", e);
    }
    
    return letterContent;
  } catch (error) {
    console.error('Error generating automatic dispute letter:', error);
    throw error;
  }
}

/**
 * Extract relevant text from the report about a specific account
 */
function extractRelevantText(reportData: CreditReportData, account: CreditReportAccount): string {
  if (!reportData.rawText || !account.accountName) {
    return '';
  }
  
  const accountName = account.accountName;
  const regex = new RegExp(`(.{0,200}${accountName}.{0,500})`, 'gi');
  const matches = [...(reportData.rawText.matchAll(regex) || [])];
  
  if (matches.length > 0) {
    return matches.map(m => m[0]).join(' ');
  }
  
  return '';
}

/**
 * Determine which bureau to address the letter to
 */
function determineBureauFromReport(reportData: CreditReportData): string {
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
 * Determine the main issue type for an account
 */
function determineMainIssueType(account: CreditReportAccount, reportData: CreditReportData): string {
  const accountName = account.accountName.toLowerCase();
  const status = (account.paymentStatus || account.status || '').toLowerCase();
  
  // Check for collection accounts
  if (accountName.includes('collect') || 
      accountName.includes('recovery') || 
      accountName.includes('asset') || 
      status.includes('collection')) {
    return 'collection';
  }
  
  // Check for late payments
  if (status.includes('late') || 
      status.includes('past due') || 
      status.includes('delinq')) {
    return 'late_payment';
  }
  
  // Check for student loans with potential duplicates
  if (accountName.includes('loan') ||
      accountName.includes('dept of ed') ||
      accountName.includes('navient') ||
      accountName.includes('sallie')) {
    
    // Check for potential duplicates
    const balance = parseFloat(String(account.balance || account.currentBalance || 0));
    const possibleDuplicates = reportData.accounts?.filter(acc => {
      // Skip the current account
      if (acc.accountNumber === account.accountNumber && 
          acc.accountName === account.accountName) {
        return false;
      }
      
      // Convert balance to number for comparison
      const accBalance = parseFloat(String(acc.balance || acc.currentBalance || 0));
      
      // Check if balances match or are very close (within 1%)
      return Math.abs(accBalance - balance) / balance < 0.01;
    });
    
    if (possibleDuplicates && possibleDuplicates.length > 0) {
      return 'student_loan';
    }
  }
  
  // Check for bankruptcy
  if (accountName.includes('bankrupt') || status.includes('bankrupt')) {
    return 'bankruptcy';
  }
  
  // Default to inaccuracy
  return 'inaccuracy';
}

/**
 * Check for personal information issues
 */
function checkForPersonalInfoIssues(reportData: CreditReportData): boolean {
  if (!reportData.personalInfo) {
    return false;
  }
  
  const personalInfo = reportData.personalInfo;
  
  // Check for multiple names
  if (personalInfo.name && personalInfo.name.includes(',')) {
    return true;
  }
  
  // Check for multiple addresses
  if (personalInfo.address && personalInfo.address.includes(',')) {
    return true;
  }
  
  // Check for multiple employers
  if (personalInfo.employer && personalInfo.employer.includes(',')) {
    return true;
  }
  
  // SSN issues
  if (personalInfo.ssn && 
     (personalInfo.ssn.includes(',') || personalInfo.ssn.length !== 9)) {
    return true;
  }
  
  return false;
}

/**
 * Generate an error description based on the account and issue type
 */
function generateErrorDescription(account: CreditReportAccount, issueType: string): string {
  switch (issueType) {
    case 'personal_info':
      return "My personal information contains inaccuracies that need to be corrected";
    
    case 'late_payment':
      return `The payment history for account ${account.accountName}${account.accountNumber ? ` (${account.accountNumber})` : ''} contains inaccurate late payment information`;
    
    case 'collection':
      return `This collection account ${account.accountName}${account.accountNumber ? ` (${account.accountNumber})` : ''} is disputed as inaccurate and unverified`;
    
    case 'student_loan':
      return `This student loan ${account.accountName}${account.accountNumber ? ` (${account.accountNumber})` : ''} appears to be reported multiple times on my credit report with the same or very similar loan amounts`;
    
    case 'bankruptcy':
      return `This bankruptcy information for ${account.accountName}${account.accountNumber ? ` (${account.accountNumber})` : ''} is inaccurate or outdated`;
    
    case 'inquiry':
      return `This inquiry from ${account.accountName} was not authorized by me and should be removed`;
    
    default:
      return `The account ${account.accountName}${account.accountNumber ? ` (${account.accountNumber})` : ''} contains inaccurate information that requires verification`;
  }
}
