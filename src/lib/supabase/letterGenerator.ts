
import { fetchDisputeTemplate } from './legalTemplates';
import { getRelevantFCRASections } from './legalTemplates';
import { getSuccessfulDisputeExamples } from './disputeLetters';
import { DISPUTE_TEMPLATES } from './constants';
import { CreditReportData, CreditReportAccount, UserInfo } from '@/utils/creditReport/types';

/**
 * Enhanced function to generate comprehensive dispute letters using templates and FCRA provisions
 * @param disputeType Type of dispute (identity theft, incorrect balance, etc.)
 * @param accountDetails Details about the account being disputed
 * @param userInfo User's personal information
 * @param creditReportData Optional full credit report data for enhanced letter generation
 * @returns Generated dispute letter
 */
export async function generateEnhancedDisputeLetter(
  disputeType: string,
  accountDetails: {
    accountName: string;
    accountNumber?: string;
    errorDescription: string;
    bureau: string;
    relevantReportText?: string; // Add this as an optional parameter
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
    
    // Skip generation if critical information is missing
    if (!accountDetails.bureau) {
      console.error("Cannot generate letter - bureau information missing");
      return "ERROR: Bureau information is missing from the credit report. Please ensure you've uploaded a valid credit report.";
    }
    
    if (!userInfo.name || userInfo.name === "[YOUR NAME]") {
      console.error("Cannot generate letter - consumer name missing");
      return "ERROR: Consumer name information is missing from the credit report. Please ensure you've uploaded a valid credit report.";
    }
    
    // Determine the dispute category and type based on the input
    let disputeCategory: keyof typeof DISPUTE_TEMPLATES = 'general';
    let templateType = 'GENERAL_DISPUTE';
    
    // Get relevant FCRA sections
    const fcraSections = await getRelevantFCRASections(templateType);
    
    // Get successful dispute examples
    const successfulExamples = await getSuccessfulDisputeExamples(templateType);
    
    // Use a successful example if available
    let additionalLanguage = '';
    if (successfulExamples.length > 0) {
      // Extract the most relevant paragraph from a successful example
      const example = successfulExamples[0];
      const paragraphs = example.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.length > 30 && paragraph.length < 300) {
          // Find a reasonably sized, relevant paragraph
          additionalLanguage = paragraph;
          break;
        }
      }
    }
    
    // Generate full letter with all components
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generate a unique credit report number or use one from the report if available
    let creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    
    // If we have credit report data, try to extract a report number
    if (creditReportData && creditReportData.rawText) {
      const reportNumberMatch = creditReportData.rawText.match(/Report\s*#?:?\s*(\w+[-\d]+)/i);
      if (reportNumberMatch && reportNumberMatch[1]) {
        creditReportNumber = reportNumberMatch[1];
      }
    }
    
    // Bureau addresses - ONLY use these if we have a valid bureau
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    // Normalize bureau name for address lookup
    const bureau = accountDetails.bureau.toLowerCase();
    let bureauAddress = '';
    
    if (bureau.includes('experian')) {
      bureauAddress = bureauAddresses.experian;
    } else if (bureau.includes('equifax')) {
      bureauAddress = bureauAddresses.equifax;
    } else if (bureau.includes('transunion') || bureau.includes('trans union')) {
      bureauAddress = bureauAddresses.transunion;
    } else {
      // Just use the bureau name directly with no address
      bureauAddress = `${accountDetails.bureau}`;
      console.error("Unknown bureau for address lookup:", accountDetails.bureau);
    }
    
    // Clean up account name and number
    const accountName = accountDetails.accountName || '';
    
    // Format account number with masked format if available, but don't use a placeholder
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

    // Use personal info from credit report if available
    let finalUserInfo = { ...userInfo };
    
    if (creditReportData && creditReportData.personalInfo) {
      console.log("Using personal info from credit report:", creditReportData.personalInfo);
      
      // Only use credit report data if the user info is empty or placeholder
      if (!finalUserInfo.name || finalUserInfo.name === "[YOUR NAME]") {
        finalUserInfo.name = creditReportData.personalInfo.name || finalUserInfo.name;
      }
      
      if (!finalUserInfo.address || finalUserInfo.address === "[YOUR ADDRESS]") {
        finalUserInfo.address = creditReportData.personalInfo.address || finalUserInfo.address;
      }
      
      if (!finalUserInfo.city || finalUserInfo.city === "[CITY]") {
        finalUserInfo.city = creditReportData.personalInfo.city || finalUserInfo.city;
      }
      
      if (!finalUserInfo.state || finalUserInfo.state === "[STATE]") {
        finalUserInfo.state = creditReportData.personalInfo.state || finalUserInfo.state;
      }
      
      if (!finalUserInfo.zip || finalUserInfo.zip === "[ZIP]") {
        finalUserInfo.zip = creditReportData.personalInfo.zip || finalUserInfo.zip;
      }
    }
    
    // Format address only with real data - NO PLACEHOLDERS
    const formattedAddress = finalUserInfo.address || '';
    
    // Only format location info if ALL parts exist
    let locationInfo = '';
    if (finalUserInfo.city && finalUserInfo.state && finalUserInfo.zip) {
      locationInfo = `${finalUserInfo.city}, ${finalUserInfo.state} ${finalUserInfo.zip}`;
    }

    // Generate the final letter - ONLY include sections if we have the necessary data
    let result = '';
    
    // Only include header and consumer info if available
    if (finalUserInfo.name) {
      result += `${finalUserInfo.name}\n`;
      
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
    
    // Only include other sections if we have a valid bureau
    if (bureauAddress) {
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
      result += `I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law. The industry standard Metro 2 format requires specific, accurate reporting practices that have not been followed in this case.\n\n`;
      result += `${accountDetails.errorDescription || "The information appears to be incorrect and should be verified or removed from my credit report."}\n\n`;
      result += `Please investigate this matter and provide me with the results within 30 days as required by the FCRA.\n\n`;
      result += `Sincerely,\n\n`;
      
      if (finalUserInfo.name) {
        result += `${finalUserInfo.name}\n\n`;
      }
      
      result += `Enclosures:\n`;
      result += `- Copy of ID\n`;
      result += `- Copy of social security card\n`;
      result += `- Copy of utility bill\n`;
    } else {
      // If we don't have a bureau, provide an error message
      result = "ERROR: Could not generate letter because bureau information is missing from the credit report.";
    }

    // Ensure the KEY explanation is removed
    result = result.replace(
      /Please utilize the following KEY to explain markings[\s\S]*?Do Not Attack/g,
      ''
    );
    
    // Remove any "KEY" section explaining acronyms
    result = result.replace(
      /\*\s*means\s*REQUIRED\s*ALWAYS[\s\S]*?(?=\n\n)/g,
      ''
    );

    console.log("Generated letter content length:", result.length);
    return result;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    throw new Error("Failed to generate dispute letter");
  }
}
