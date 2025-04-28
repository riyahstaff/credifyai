
import { CreditReportData, IdentifiedIssue } from '../types';
import { getTemplateForIssueType } from './templateLoader';
import { generateLetterContent } from './letterContent';

/**
 * Generate enhanced dispute letter for a specific issue
 */
export function generateEnhancedDisputeLetter(
  disputeType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  creditReportData?: CreditReportData | null
): string {
  return generateLetterContent('', accountDetails, userInfo, creditReportData);
}

/**
 * Get sample dispute language for a specific dispute type
 */
export function getSampleDisputeLanguage(disputeType: string): string {
  const sampleLanguage: Record<string, string> = {
    'late_payment': 'I am disputing the late payment reported on this account. This information is inaccurate because I have made all payments on time.',
    'collection': 'I am disputing this collection account. This debt is not mine/has been paid/is too old to report.',
    'inquiry': 'I am disputing this inquiry as I did not authorize this company to check my credit.',
    'account_ownership': 'I am disputing this account as it does not belong to me.',
    'balance': 'I am disputing the balance shown on this account as it is incorrect.'
  };
  
  return sampleLanguage[disputeType] || 'I am disputing this information as it appears inaccurate on my credit report.';
}

/**
 * Generate dispute letters for identified issues in a credit report
 */
export async function generateLettersForIssues(
  issues: IdentifiedIssue[],
  reportData: CreditReportData,
  userInfo: { 
    name: string; 
    address?: string; 
    city?: string; 
    state?: string; 
    zip?: string; 
  }
): Promise<any[]> {
  console.log(`Generating dispute letters for ${issues.length} issues`);
  
  const letters = [];
  const processedIssues = new Set(); // Track which issues we've already processed
  
  // Create a letter for each unique issue type
  for (const issue of issues) {
    try {
      // Skip duplicate issue types - only generate one letter per issue type
      if (processedIssues.has(issue.type)) continue;
      processedIssues.add(issue.type);
      
      console.log(`Generating letter for issue type: ${issue.type}`);
      
      // Get the relevant bureau
      const bureau = issue.bureau || reportData?.primaryBureau || "Credit Bureau";
      
      // Get account information
      const account = issue.account || findAccountInReportData(issue.account?.id, reportData);
      
      // Get the appropriate template for this issue
      const templateContent = await getTemplateForIssueType(issue.type);
      
      if (!templateContent) {
        console.warn(`No template found for issue type: ${issue.type}`);
        continue;
      }
      
      // Format current date
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Get bureau address
      const bureauAddress = getBureauAddress(bureau);
      
      // Format account details
      const accountName = account?.accountName || issue.account?.accountName || "Account in question";
      const accountNumber = account?.accountNumber || '';
      
      // Replace placeholders in the template
      let letterContent = templateContent
        .replace(/\{NAME\}|\{CONSUMER_NAME\}|\{USER_NAME\}/gi, userInfo.name)
        .replace(/\{ADDRESS\}|\{CONSUMER_ADDRESS\}/gi, userInfo.address || '')
        .replace(/\{CITY\}|\{CONSUMER_CITY\}/gi, userInfo.city || '')
        .replace(/\{STATE\}|\{CONSUMER_STATE\}/gi, userInfo.state || '')
        .replace(/\{ZIP\}|\{CONSUMER_ZIP\}/gi, userInfo.zip || '')
        .replace(/\{DATE\}|\{CURRENT_DATE\}/gi, currentDate)
        .replace(/\{BUREAU\}|\{CREDIT_BUREAU\}/gi, bureau)
        .replace(/\{BUREAU_ADDRESS\}/gi, bureauAddress)
        .replace(/\{ACCOUNT_NAME\}/gi, accountName)
        .replace(/\{ACCOUNT_NUMBER\}/gi, accountNumber)
        .replace(/\{ISSUE_TYPE\}/gi, issue.type)
        .replace(/\{ISSUE_DESCRIPTION\}/gi, issue.description || '');
      
      // Add a header with user info if not already present
      if (!letterContent.trim().startsWith(userInfo.name)) {
        letterContent = `${userInfo.name}
${userInfo.address ? userInfo.address + '\n' : ''}${userInfo.city ? userInfo.city + ', ' : ''}${userInfo.state || ''} ${userInfo.zip || ''}

${currentDate}

${bureau}
${bureauAddress}

${letterContent}`;
      }
      
      // Create letter object
      const letter = {
        id: Date.now() + letters.length,
        title: `${formatIssueType(issue.type)} - ${accountName}`,
        bureau: bureau,
        recipient: bureau,
        accountName: accountName,
        accountNumber: accountNumber,
        content: letterContent,
        letterContent: letterContent,
        bureaus: [bureau],
        createdAt: currentDate,
        status: "ready",
        errorType: formatIssueType(issue.type)
      };
      
      letters.push(letter);
      console.log(`Generated letter for ${issue.type} - ${accountName}`);
    } catch (error) {
      console.error(`Error generating letter for issue type ${issue.type}:`, error);
    }
  }
  
  return letters;
}

/**
 * Find account in report data by ID or by matching account name
 */
function findAccountInReportData(accountId: string | undefined, reportData: CreditReportData) {
  if (!reportData.accounts || reportData.accounts.length === 0) {
    return null;
  }
  
  // If we have an ID, try to find by ID first
  if (accountId) {
    const accountById = reportData.accounts.find(acc => acc.accountNumber === accountId);
    if (accountById) return accountById;
  }
  
  // Default to first account
  return reportData.accounts[0];
}

/**
 * Format issue type for display
 */
function formatIssueType(type: string): string {
  // Convert snake_case to Title Case
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get address for credit bureau
 */
function getBureauAddress(bureau: string): string {
  const bureauLower = bureau.toLowerCase();
  
  if (bureauLower.includes('experian')) {
    return 'Experian\nP.O. Box 4500\nAllen, TX 75013';
  } else if (bureauLower.includes('equifax')) {
    return 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374';
  } else if (bureauLower.includes('transunion') || bureauLower.includes('trans union')) {
    return 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016';
  }
  
  return '[BUREAU ADDRESS]';
}

/**
 * Generate a letter for credit report discrepancies
 */
export async function generateDisputeLetterForDiscrepancy(
  discrepancyType: string,
  accountDetails: any,
  userInfo: any,
  creditReportData?: any
): Promise<string> {
  console.log("Generating letter for discrepancy:", discrepancyType);
  
  // Forward to the main letter generation function
  return generateEnhancedDisputeLetter(
    discrepancyType,
    {
      accountName: accountDetails.accountName || 'Account in Question',
      accountNumber: accountDetails.accountNumber || '',
      errorDescription: accountDetails.errorDescription || `This ${discrepancyType} appears to be inaccurate.`,
      bureau: accountDetails.bureau || 'Credit Bureau'
    },
    userInfo,
    creditReportData
  );
}
