
import { CreditReportData, Issue } from '@/utils/creditReport/types';

/**
 * Generate an enhanced dispute letter
 * @param disputeType The type of dispute
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
  },
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
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
        ? 'xx-xxxx-' + accountDetails.accountNumber.slice(-4) 
        : accountDetails.accountNumber;
    }
    
    // Format the account section with real information ONLY
    const accountSection = accountName ? `
DISPUTED ITEM(S):
Account Name: ${accountName.toUpperCase()}
${accountNumber ? `Account Number: ${accountNumber}` : ''}
Reason for Dispute: ${disputeType}
` : 'I am disputing information in my credit report that may be inaccurate.';
    
    // Format address only with real data - NO PLACEHOLDERS
    const formattedAddress = userInfo.address || '';
    
    // Only format location info if ALL parts exist
    let locationInfo = '';
    if (userInfo.city && userInfo.state && userInfo.zip) {
      locationInfo = `${userInfo.city}, ${userInfo.state} ${userInfo.zip}`;
    }

    // Generate the final letter
    let result = '';
    
    // Only include header and consumer info if available
    if (userInfo.name) {
      result += `${userInfo.name}\n`;
      
      if (formattedAddress) {
        result += `${formattedAddress}\n`;
      }
      
      if (locationInfo) {
        result += `${locationInfo}\n`;
      }
      
      result += `${currentDate}\n\n`;
    }
    
    // Only include bureau section if we have it
    if (bureauAddress) {
      result += `${bureauAddress}\n\n`;
    }
    
    result += `Re: Dispute of Inaccurate Information - ${disputeType}\n\n`;
    result += `To Whom It May Concern:\n\n`;
    result += `I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n\n`;
    result += `${accountSection}\n\n`;
    result += `Under the Fair Credit Reporting Act (FCRA), you are required to:\n`;
    result += `1. Conduct a reasonable investigation into the information I am disputing\n`;
    result += `2. Forward all relevant information that I provide to the furnisher\n`;
    result += `3. Review and consider all relevant information\n`;
    result += `4. Provide me the results of your investigation\n`;
    result += `5. Delete the disputed information if it cannot be verified\n\n`;
    result += `I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law.\n\n`;
    result += `${accountDetails.errorDescription || "The information appears to be incorrect and should be verified or removed from my credit report."}\n\n`;
    result += `Please investigate this matter and provide me with the results within 30 days as required by the FCRA.\n\n`;
    result += `Sincerely,\n\n`;
    
    if (userInfo.name) {
      result += `${userInfo.name}\n\n`;
    }
    
    result += `Enclosures:\n`;
    result += `- Copy of ID\n`;
    result += `- Copy of social security card\n`;
    result += `- Copy of utility bill\n`;

    console.log("Generated letter content length:", result.length);
    return result;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    return "Error generating dispute letter. Please try again.";
  }
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
