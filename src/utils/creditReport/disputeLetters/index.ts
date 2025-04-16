
/**
 * Dispute Letters Module
 * Contains all functionality related to dispute letter generation
 */

import { CreditReportData, CreditReportAccount, IdentifiedIssue } from '../types';
import { UserInfo } from '../types/letterTypes';
import { generateLetterContent } from './letterContent';
import { getLetterTemplate } from './templates';

/**
 * Generates an enhanced dispute letter based on the provided data
 * @param disputeType The type of dispute to generate
 * @param accountDetails Details about the account being disputed
 * @param userInfo Information about the user generating the letter
 * @param creditReportData Optional full credit report data
 * @returns The generated letter content
 */
export async function generateEnhancedDisputeLetter(
  disputeType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  creditReportData?: CreditReportData | null
): Promise<string> {
  try {
    console.log("Starting letter generation process for:", disputeType, accountDetails.accountName);
    
    // Get the appropriate template based on the dispute type
    const template = getLetterTemplate(disputeType);
    
    // Generate the letter content
    const letterContent = generateLetterContent(
      template,
      accountDetails,
      userInfo,
      creditReportData
    );
    
    console.log(`Letter generated successfully: ${letterContent.substring(0, 50)}...`);
    return letterContent;
  } catch (error) {
    console.error("Error generating dispute letter:", error);
    return generateFallbackLetter(disputeType, accountDetails, userInfo);
  }
}

/**
 * Generates a fallback letter when the primary generation method fails
 */
function generateFallbackLetter(
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
  }
): string {
  console.log("Generating fallback letter for:", disputeType, accountDetails.accountName);
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Bureau addresses
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
  };
  
  // Get bureau address
  const bureau = accountDetails.bureau.toLowerCase();
  let bureauAddress = '';
  
  if (bureau.includes('experian')) {
    bureauAddress = bureauAddresses.experian;
  } else if (bureau.includes('equifax')) {
    bureauAddress = bureauAddresses.equifax;
  } else if (bureau.includes('transunion')) {
    bureauAddress = bureauAddresses.transunion;
  } else {
    bureauAddress = `${accountDetails.bureau}`;
  }
  
  // Format user information
  let userInfoStr = userInfo.name || '[YOUR NAME]';
  
  if (userInfo.address) {
    userInfoStr += `\n${userInfo.address}`;
    
    if (userInfo.city && userInfo.state && userInfo.zip) {
      userInfoStr += `\n${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;
    }
  }
  
  // Generate basic dispute letter
  return `${userInfoStr}\n${currentDate}\n\n${bureauAddress}\n\nRe: Dispute of Credit Report Information\n\nTo Whom It May Concern:\n\nI am writing to dispute information in my credit report. I have identified the following item(s) that are inaccurate:\n\nAccount Name: ${accountDetails.accountName}\n${accountDetails.accountNumber ? `Account Number: ${accountDetails.accountNumber}\n` : ''}Issue: ${disputeType}\n\nReason for Dispute: ${accountDetails.errorDescription || 'This information appears to be inaccurate or incomplete.'}\n\nUnder the Fair Credit Reporting Act, you are required to investigate this dispute and provide me with the results within 30 days. If you cannot verify this information, please remove it from my credit report.\n\nThank you for your attention to this matter.\n\nSincerely,\n\n${userInfo.name || '[YOUR NAME]'}`;
}

/**
 * Generate letters for multiple identified credit report issues
 */
export async function generateLettersForIssues(
  issues: IdentifiedIssue[],
  reportData: CreditReportData | null,
  userInfo?: UserInfo
): Promise<any[]> {
  try {
    console.log(`Starting generation of ${issues.length} dispute letters`);
    
    const generatedLetters = [];
    const userDetails = userInfo || getUserInfoFromStorage();
    
    // Process each issue
    for (const issue of issues) {
      console.log(`Processing issue: ${issue.title}`);
      
      // Get the associated account
      const account = issue.account || null;
      
      // Determine the bureau
      const bureau = reportData?.primaryBureau || 
                     (reportData?.bureaus?.experian ? 'experian' : 
                      reportData?.bureaus?.equifax ? 'equifax' :
                      reportData?.bureaus?.transunion ? 'transunion' : 'experian');
      
      // Generate the letter content
      const letterContent = await generateEnhancedDisputeLetter(
        issue.type || 'general',
        {
          accountName: account?.accountName || issue.title || 'Account in Question',
          accountNumber: account?.accountNumber || '',
          errorDescription: issue.description || 'This information appears to be inaccurate.',
          bureau: bureau
        },
        userDetails, // This now matches the required type with name as non-optional
        reportData
      );
      
      // Create the letter object
      const letter = {
        id: Date.now() + Math.random(),
        title: issue.title || 'Credit Report Dispute',
        bureau: bureau,
        accountName: account?.accountName || issue.title || 'Multiple Accounts',
        accountNumber: account?.accountNumber || '',
        content: letterContent,
        letterContent: letterContent,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        status: 'ready',
        errorType: issue.type || 'Data Inaccuracy',
        recipient: bureau,
        bureaus: [bureau]
      };
      
      generatedLetters.push(letter);
      console.log(`Letter created for: ${letter.accountName}`);
    }
    
    return generatedLetters;
  } catch (error) {
    console.error('Error generating letters for issues:', error);
    
    // Return a fallback letter
    return [{
      id: Date.now(),
      title: 'Credit Report Dispute',
      bureau: 'Credit Bureau',
      accountName: 'Account in Question',
      accountNumber: '',
      content: 'Dear Credit Bureau,\n\nI am writing to dispute information in my credit report.\n\nSincerely,\n[YOUR NAME]',
      letterContent: 'Dear Credit Bureau,\n\nI am writing to dispute information in my credit report.\n\nSincerely,\n[YOUR NAME]',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      status: 'ready',
      errorType: 'General Dispute',
      recipient: 'Credit Bureau',
      bureaus: ['Credit Bureau']
    }];
  }
}

/**
 * Gets user information from local storage
 */
function getUserInfoFromStorage(): {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
} {
  try {
    const userName = localStorage.getItem('userName') || 
                    sessionStorage.getItem('userName') ||
                    JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name ||
                    '[YOUR NAME]';
                  
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
    console.error('Error retrieving user info from storage:', error);
    return { name: '[YOUR NAME]' };
  }
}

// Re-export for backward compatibility
export { getSampleDisputeLanguage } from './sampleText';
export { generateDisputeLetterForDiscrepancy } from './discrepancyLetters';
