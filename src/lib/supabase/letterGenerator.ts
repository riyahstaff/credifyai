
import { fetchDisputeTemplate } from './legalTemplates';
import { getRelevantFCRASections } from './legalTemplates';
import { getSuccessfulDisputeExamples } from './disputeLetters';
import { DISPUTE_TEMPLATES } from './constants';
import { CreditReportData, CreditReportAccount, UserInfo, FCRA_LAWS } from '@/utils/creditReport/types';
import { generateDisputeLetter } from '@/services/externalBackendService';

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
    
    // Try to get analysis data from session storage
    let analysisData = null;
    try {
      const storedAnalysis = sessionStorage.getItem('creditReportAnalysis');
      if (storedAnalysis) {
        analysisData = JSON.parse(storedAnalysis);
      }
    } catch (e) {
      console.error("Error retrieving analysis data from storage:", e);
    }
    
    // Use the external backend service to generate the letter
    const response = await generateDisputeLetter(
      {
        analysisData,
        disputeType,
        accountDetails,
        creditReportData
      },
      userInfo
    );
    
    if (!response.success || !response.data) {
      // If external service fails, fall back to the original letter generation method
      console.warn("External letter generation failed, falling back to local generation");
      return generateLocalFallbackLetter(disputeType, accountDetails, userInfo, creditReportData);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error generating enhanced dispute letter:", error);
    // Fall back to local generation if the API call fails
    return generateLocalFallbackLetter(disputeType, accountDetails, userInfo, creditReportData);
  }
}

// Get the appropriate legal references for a dispute type
function getLegalReferences(disputeType: string): string[] {
  // Map the dispute type to FCRA_LAWS categories
  const lowerType = disputeType.toLowerCase();
  
  if (lowerType.includes('late') || lowerType.includes('payment')) {
    return FCRA_LAWS.latePayments || [];
  } else if (lowerType.includes('collection') || lowerType.includes('debt')) {
    return FCRA_LAWS.collections || [];
  } else if (lowerType.includes('inquiry') || lowerType.includes('inquiries')) {
    return FCRA_LAWS.inquiries || [];
  } else if (lowerType.includes('personal') || lowerType.includes('info') || lowerType.includes('name') || lowerType.includes('address') || lowerType.includes('ssn')) {
    return FCRA_LAWS.personalInfo || [];
  } else if (lowerType.includes('student') || lowerType.includes('loan')) {
    return FCRA_LAWS.studentLoans || [];
  } else if (lowerType.includes('bankruptcy')) {
    return FCRA_LAWS.bankruptcy || [];
  } else {
    // Default to general inaccuracies
    return FCRA_LAWS.inaccuracies || [];
  }
}

// Format legal references for inclusion in the letter
function formatLegalReferencesForLetter(references: string[]): string {
  if (!references || references.length === 0) {
    return "As required by the Fair Credit Reporting Act (FCRA), specifically 15 USC 1681i(a)(1), you must conduct a reasonable investigation regarding the information I am disputing.";
  }
  
  let legalText = "I am disputing this information under the following laws and regulations:\n\n";
  
  references.forEach((reference, index) => {
    legalText += `${index + 1}. ${reference}: `;
    
    // Add description for common FCRA sections
    if (reference === "15 USC 1681e(b)") {
      legalText += "Requires credit reporting agencies to follow reasonable procedures to assure maximum possible accuracy.";
    } else if (reference === "15 USC 1681i(a)(1)") {
      legalText += "Requires credit reporting agencies to conduct a reasonable investigation of disputed information.";
    } else if (reference === "15 USC 1681s-2(a)(3)") {
      legalText += "Prohibits furnishers from continuing to report information that is discovered to be inaccurate.";
    } else if (reference === "15 USC 1681c") {
      legalText += "Governs requirements for what information may be included in consumer reports.";
    } else if (reference.includes("Metro 2")) {
      legalText += "Industry standard reporting format requires specific, accurate account information and status codes.";
    } else {
      legalText += "Requires accuracy and proper procedures in credit reporting.";
    }
    
    legalText += "\n";
  });
  
  return legalText;
}

// Original letter generation function renamed as a fallback
async function generateLocalFallbackLetter(
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
    // Get relevant legal references for this dispute type
    const legalReferences = getLegalReferences(disputeType);
    
    // Format legal references for inclusion in the letter
    const formattedLegalText = formatLegalReferencesForLetter(legalReferences);
    
    // Get relevant FCRA sections
    const fcraSections = await getRelevantFCRASections(disputeType);
    
    // Get successful dispute examples
    const successfulExamples = await getSuccessfulDisputeExamples(disputeType);
    
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
    
    // Bureau addresses - use the correct bureau address based on the bureau name
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    // Normalize bureau name for address lookup
    const bureau = accountDetails.bureau.toLowerCase();
    let bureauName = accountDetails.bureau;
    let bureauAddress = '';
    
    if (bureau.includes('experian')) {
      bureauAddress = bureauAddresses.experian;
      bureauName = 'Experian';
    } else if (bureau.includes('equifax')) {
      bureauAddress = bureauAddresses.equifax;
      bureauName = 'Equifax';
    } else if (bureau.includes('transunion') || bureau.includes('trans union')) {
      bureauAddress = bureauAddresses.transunion;
      bureauName = 'TransUnion';
    } else {
      // If no specific bureau is identified, try to determine from credit report data
      if (creditReportData) {
        if (creditReportData.bureaus?.experian) {
          bureauAddress = bureauAddresses.experian;
          bureauName = 'Experian';
        } else if (creditReportData.bureaus?.equifax) {
          bureauAddress = bureauAddresses.equifax;
          bureauName = 'Equifax';
        } else if (creditReportData.bureaus?.transunion) {
          bureauAddress = bureauAddresses.transunion;
          bureauName = 'TransUnion';
        } else if (creditReportData.primaryBureau) {
          bureauName = creditReportData.primaryBureau;
          // Try to match bureau name
          if (bureauName.toLowerCase().includes('experian')) {
            bureauAddress = bureauAddresses.experian;
          } else if (bureauName.toLowerCase().includes('equifax')) {
            bureauAddress = bureauAddresses.equifax;
          } else if (bureauName.toLowerCase().includes('transunion')) {
            bureauAddress = bureauAddresses.transunion;
          } else {
            bureauAddress = `${bureauName}\n[Bureau Address]`;
          }
        } else {
          // Default fallback
          bureauAddress = "Credit Bureau\n[Bureau Address]";
        }
      } else {
        // Just use the bureau name directly with no address
        bureauAddress = `${accountDetails.bureau}\n[Bureau Address]`;
      }
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
    if (bureauName) {
      result += `${bureauName}\n`;
      
      if (bureauAddress) {
        // Extract just the address lines, not the bureau name
        const addressLines = bureauAddress.split('\n');
        if (addressLines.length > 1) {
          result += `${addressLines.slice(1).join('\n')}\n\n`;
        } else {
          result += `[ADDRESS NEEDED]\n\n`;
        }
      }
    }
    
    // Only include other sections if we have a valid bureau
    if (bureauName) {
      result += `Re: Dispute of Inaccurate Information - ${disputeType}\n\n`;
      result += `To Whom It May Concern:\n\n`;
      result += `I am writing to dispute the following information in my credit report. I have identified the following item(s) that are inaccurate or incomplete:\n\n`;
      result += `${accountSection}\n\n`;
      
      // Include legal references section
      result += `${formattedLegalText}\n\n`;
      
      result += `Under the Fair Credit Reporting Act (FCRA), you are required to:\n`;
      result += `1. Conduct a reasonable investigation into the information I am disputing\n`;
      result += `2. Forward all relevant information that I provide to the furnisher\n`;
      result += `3. Review and consider all relevant information\n`;
      result += `4. Provide me the results of your investigation\n`;
      result += `5. Delete the disputed information if it cannot be verified\n\n`;
      
      result += `I am disputing this information as it is inaccurate and the creditor may be unable to provide adequate verification as required by law. The industry standard Metro 2 format requires specific, accurate reporting practices that have not been followed in this case.\n\n`;
      
      if (accountDetails.errorDescription) {
        result += `${accountDetails.errorDescription}\n\n`;
      }
      
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
    console.error("Error generating fallback dispute letter:", error);
    return "Failed to generate dispute letter. Please try again later.";
  }
}
