
import { CreditReportData, Issue, IdentifiedIssue } from '@/utils/creditReport/types';
import { getDisputeLanguageForType, getDisputeTypeTitle } from './disputeLanguage';

/**
 * Generate an enhanced dispute letter with comprehensive issue support
 * @param disputeType The type of dispute (late_payment, collection_account, inquiry, personal_info, charge_off, etc.)
 * @param accountDetails Details about the account being disputed
 * @param userInfo User's personal information
 * @returns Generated dispute letter
 */
export function generateEnhancedDisputeLetter(
  disputeType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    balance?: string | number;
    dateOpened?: string;
    status?: string;
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    ssn?: string;
  }
): string {
  try {
    console.log("Generating dispute letter with:", { 
      disputeType, 
      accountDetails: {
        accountName: accountDetails.accountName,
        bureau: accountDetails.bureau
      }, 
      userInfo: {
        name: userInfo.name
      }
    });
    
    // Generate the current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Bureau addresses
    const bureauAddresses: Record<string, string> = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    // Normalize bureau name for address lookup
    const bureau = accountDetails.bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureau] || `${accountDetails.bureau}`;
    
    // Clean up account name and number
    const accountName = accountDetails.accountName || '';
    
    // Format account number with masked format if available
    let accountNumber = '';
    if (accountDetails.accountNumber) {
      accountNumber = accountDetails.accountNumber.length > 4 
        ? 'xxxx-' + accountDetails.accountNumber.slice(-4) 
        : accountDetails.accountNumber;
    }
    
    // Get issue-specific dispute language
    const disputeLanguage = getDisputeLanguageForType(disputeType, accountDetails);
    
    // Format the account section with comprehensive details
    const accountSection = accountName ? `
DISPUTED ITEM(S):
Account Name: ${accountName.toUpperCase()}
${accountNumber ? `Account Number: ${accountNumber}` : ''}
${accountDetails.balance ? `Current Balance: $${accountDetails.balance}` : ''}
${accountDetails.dateOpened ? `Date Opened: ${accountDetails.dateOpened}` : ''}
${accountDetails.status ? `Payment Status: ${accountDetails.status}` : ''}

DISPUTE REASON:
${disputeLanguage}
` : 'I am disputing information in my credit report that may be inaccurate.';
    
    // Format address only with real data - NO PLACEHOLDERS
    const formattedAddress = userInfo.address || '';
    
    // Only format location info if ALL parts exist
    let locationInfo = '';
    if (userInfo.city && userInfo.state && userInfo.zip) {
      locationInfo = `${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;
    }

    // Generate the final letter with proper formatting
    let result = '';
    
    // Consumer Information Header (MUST come first)
    if (userInfo.name) {
      result += `${userInfo.name}\n`;
      
      if (formattedAddress) {
        result += `${formattedAddress}\n`;
      }
      
      if (locationInfo) {
        result += `${locationInfo}\n`;
      }
      
      result += `\n${currentDate}\n\n`;
    }
    
    // Bureau Address
    if (bureauAddress) {
      result += `${bureauAddress}\n\n`;
    }
    
    // Letter Header with SSN if available
    result += `Re: Dispute of Credit Information - ${getDisputeTypeTitle(disputeType)}\n`;
    if (userInfo.ssn) {
      result += `SSN: ${userInfo.ssn}\n`;
    }
    result += `\nTo Whom It May Concern:\n\n`;
    
    // Opening paragraph
    result += `I am writing to formally dispute inaccurate information on my credit report in accordance with the Fair Credit Reporting Act (FCRA), 15 USC § 1681i. After carefully reviewing my credit report, I have identified the following item(s) that require investigation:\n\n`;
    
    // Account details section
    result += `${accountSection}\n`;
    
    // Legal requirements section
    result += `LEGAL REQUIREMENTS:\n`;
    result += `Under the Fair Credit Reporting Act (FCRA), you are legally required to:\n`;
    result += `• Conduct a reasonable investigation of all disputed information within 30 days\n`;
    result += `• Forward all relevant documentation to the furnisher of this information\n`;
    result += `• Delete any information that cannot be verified as accurate and complete\n`;
    result += `• Provide written notice of investigation results\n\n`;
    
    // Closing paragraph
    result += `I request that you investigate this matter promptly and remove any information that cannot be verified. Please send me written confirmation of your findings and any changes made to my credit file.\n\n`;
    result += `Thank you for your immediate attention to this matter.\n\n`;
    result += `Sincerely,\n\n`;
    
    if (userInfo.name) {
      result += `${userInfo.name}\n`;
      result += `\nSignature: _________________________\n\n`;
    }
    
    result += `Enclosures:\n`;
    result += `• Copy of government-issued ID\n`;
    result += `• Proof of address (utility bill)\n`;
    result += `• Supporting documentation\n`;

    console.log("Generated letter content length:", result.length);
    return result;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    return "Error generating dispute letter. Please try again.";
  }
}

/**
 * Generate dispute letters from identified issues
 * @param issues Array of identified issues
 * @param personalInfo User's personal information
 * @param bureau Primary bureau for the report
 * @returns Array of generated dispute letters
 */
export async function generateDisputeLettersFromIssues(
  issues: IdentifiedIssue[],
  personalInfo: any,
  bureau: string
): Promise<any[]> {
  console.log(`Generating letters for ${issues.length} issues`);
  
  const generatedLetters = [];
  
  for (const issue of issues) {
    try {
      // Extract comprehensive account details if available
      const accountDetails = {
        accountName: issue.account?.accountName || issue.title || 'Credit Report Issue',
        accountNumber: issue.account?.accountNumber,
        errorDescription: issue.description,
        bureau: issue.bureau || bureau,
        balance: issue.account?.currentBalance || issue.account?.balance,
        dateOpened: issue.account?.dateOpened || issue.account?.openDate,
        status: issue.account?.status || issue.account?.paymentStatus
      };
      
      // Format comprehensive user info
      const userInfo = {
        name: personalInfo?.name || 'Credit Report User',
        address: personalInfo?.address,
        city: personalInfo?.city,
        state: personalInfo?.state,
        zip: personalInfo?.zip,
        ssn: personalInfo?.ssn
      };
      
      // Generate the letter content
      const letterContent = generateEnhancedDisputeLetter(
        issue.type.replace(/_/g, ' '),
        accountDetails,
        userInfo
      );
      
      // Create the letter object
      const letter = {
        id: issue.id || `letter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: `Dispute Letter - ${issue.title}`,
        content: letterContent,
        bureau: issue.bureau || bureau,
        accountName: accountDetails.accountName,
        accountNumber: accountDetails.accountNumber || '',
        issueType: issue.type,
        severity: issue.severity,
        impact: issue.impact,
        generatedAt: new Date().toISOString(),
        laws: issue.laws || []
      };
      
      generatedLetters.push(letter);
      console.log(`Generated letter for issue: ${issue.title}`);
      
    } catch (error) {
      console.error(`Error generating letter for issue ${issue.id}:`, error);
      // Continue with other issues
    }
  }
  
  console.log(`Successfully generated ${generatedLetters.length} letters`);
  return generatedLetters;
}

/**
 * Generate a letter for disputing a credit report discrepancy
 * @param discrepancyType Type of discrepancy to dispute
 * @param accountDetails Details of the account with the discrepancy
 * @param userInfo User's personal information
 * @returns Generated dispute letter
 */
export function generateDisputeLetterForDiscrepancy(
  discrepancyType: string,
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
  // This is a wrapper around the enhanced generator for backwards compatibility
  return generateEnhancedDisputeLetter(discrepancyType, accountDetails, userInfo);
}
