
/**
 * Sample dispute language extraction
 */
import { findSampleDispute } from './sampleDisputes';

/**
 * Get sample dispute language based on dispute type and bureau
 */
export const getSampleDisputeLanguage = async (
  disputeType: string, 
  bureau?: string
): Promise<string> => {
  try {
    console.log(`Getting sample dispute language for ${disputeType} and bureau ${bureau || 'any'}`);
    // First try to find a sample letter
    const sampleLetter = await findSampleDispute(disputeType, bureau);
    
    if (sampleLetter && sampleLetter.effectiveLanguage && sampleLetter.effectiveLanguage.length > 0) {
      console.log("Found sample letter with effective language");
      // Return the most relevant paragraph from the sample letter
      return sampleLetter.effectiveLanguage[0];
    }
    
    // If no sample letter found, use fallback dispute language based on dispute type
    console.log("No sample letter found, using fallback dispute language");
    return getFallbackDisputeLanguage(disputeType);
  } catch (error) {
    console.error("Error getting sample dispute language:", error);
    return getFallbackDisputeLanguage(disputeType);
  }
};

/**
 * Get fallback dispute language based on dispute type
 */
const getFallbackDisputeLanguage = (disputeType: string): string => {
  const lowerType = disputeType.toLowerCase();
  
  if (lowerType.includes('late') || lowerType.includes('payment')) {
    return "This late payment report is inaccurate. My payment history for this account shows that all payments were made on time according to the terms of the agreement. Under FCRA Section 623(a)(3), furnishers of information must accurately report payment history. This inaccurate late payment notation is having a significant negative impact on my credit score and should be removed.";
  }
  
  if (lowerType.includes('not mine') || lowerType.includes('fraud') || lowerType.includes('identity')) {
    return "This account does not belong to me and I have no knowledge of it. I have never opened an account with this creditor and have not authorized anyone else to do so in my name. Under FCRA Section 605B, information resulting from identity theft should be blocked from appearing on consumer reports. I request that you conduct a thorough investigation and remove this fraudulent account from my credit report.";
  }
  
  if (lowerType.includes('balance')) {
    return "The balance reported for this account is incorrect. My records indicate a different balance amount, and this discrepancy must be corrected. Under FCRA Section 623, furnishers of information must provide accurate account balance information to credit reporting agencies. This incorrect balance is misleading to potential creditors and negatively impacts my credit utilization ratio.";
  }
  
  if (lowerType.includes('inquiry') || lowerType.includes('hard pull')) {
    return "I did not authorize this credit inquiry, and it appears on my credit report without my permission. Under FCRA Section 604, consumer reporting agencies may only furnish consumer reports with a permissible purpose, which typically requires my explicit authorization for most credit inquiries. This unauthorized inquiry has damaged my credit score and should be removed.";
  }
  
  if (lowerType.includes('collection') || lowerType.includes('debt')) {
    return "This collection account is being disputed because it contains inaccurate information. Under FDCPA Section 809, debt collectors must verify debts upon dispute, and FCRA Section 623 requires accurate reporting. The collection agency has not provided proper validation of this debt, and the reporting appears to violate these consumer protection laws.";
  }
  
  if (lowerType.includes('account status') || lowerType.includes('status')) {
    return "The status of this account is being reported incorrectly. My records indicate that the actual status differs from what is being reported. Under FCRA Section 623, furnishers of information must accurately report account status information. This inaccurate status is misleading and should be corrected to reflect the true standing of the account.";
  }
  
  if (lowerType.includes('closed')) {
    return "This account has been closed, but it is not being reported as such. My records show that the account was closed on [DATE], but the credit report incorrectly shows it as open. Under FCRA Section 623, furnishers must accurately report account status, including whether an account is closed. This inaccuracy should be corrected to properly reflect the closed status of this account.";
  }
  
  if (lowerType.includes('bankruptcy')) {
    return "The bankruptcy information on my credit report is inaccurate. Under FCRA Section 605, bankruptcy information must be reported accurately and removed after the appropriate time period (10 years for Chapter 7, 7 years for completed Chapter 13). This inaccurate bankruptcy information is causing significant damage to my creditworthiness and should be corrected immediately.";
  }
  
  if (lowerType.includes('personal') || lowerType.includes('information')) {
    return "My personal information as reported on my credit report is incorrect. Accurate personal information is essential for proper credit reporting and to prevent identity confusion. Under FCRA Section 611, credit reporting agencies must investigate and correct inaccurate personal information. This error should be corrected to ensure my credit information is properly associated with my correct identity.";
  }
  
  // Default response for other dispute types
  return "This information is inaccurate and does not correctly reflect the account details or my credit history. Under FCRA Section 611, I have the right to dispute incomplete or inaccurate information, and credit reporting agencies must investigate and correct errors. This inaccuracy is negatively impacting my credit standing and should be corrected after proper investigation.";
};
