
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
 * Get successful dispute phrases by category
 * This provides template phrases that have worked well in successful disputes
 */
export const getSuccessfulDisputePhrases = async (): Promise<Record<string, string[]>> => {
  try {
    console.log("Getting successful dispute phrases");
    // In a production environment, these would be fetched from a database or API
    // For now, return a static set of phrases
    return {
      'late_payment': [
        "I have never been late on this account as evidenced by my payment records.",
        "This reported late payment is inaccurate and should be removed under FCRA guidelines.",
        "My records show on-time payments for all periods in question.",
        "The reported late payment on {date} is incorrect, as I have documentation showing the payment was made on time."
      ],
      'not_mine': [
        "This account does not belong to me and I have no connection to it.",
        "I have never opened an account with this creditor.",
        "This appears to be a case of identity theft or mixed credit file.",
        "I have no record of ever applying for or opening this account with {creditor}."
      ],
      'balance': [
        "The balance shown is incorrect and does not reflect actual account status.",
        "This balance has been paid in full as of {date}.",
        "The reported balance of {amount} exceeds the actual amount owed by {difference}.",
        "The balance reported is incorrect as I have documentation showing a different amount."
      ],
      'inquiry': [
        "I did not authorize this inquiry and it should be removed.",
        "This inquiry was made without my knowledge or consent.",
        "This appears to be an unauthorized access to my credit file.",
        "I have no record of applying for credit with {creditor} on {date}, making this inquiry unauthorized."
      ],
      'collection': [
        "This debt has been paid in full and should not be reported as a collection.",
        "This collection account is being reported multiple times.",
        "This collection account is beyond the 7-year reporting period allowed by law.",
        "The collection reported by {collector} for {amount} was satisfied on {date} and should be removed."
      ],
      'personal_information': [
        "This is not my correct address and should be updated.",
        "The Social Security Number associated with this account is incorrect.",
        "My name is misspelled and needs to be corrected in your records.",
        "The employment information listed is outdated and should be updated to reflect my current position."
      ],
      'account_status': [
        "This account is incorrectly reported as open when it was closed on {date}.",
        "The account status is incorrectly shown as {status} when it should be {correct_status}.",
        "This account was paid as agreed but is being reported with a negative status."
      ],
      'bankruptcy': [
        "This bankruptcy was discharged on {date} and certain accounts included in it are still showing as outstanding.",
        "Accounts included in my bankruptcy should be reported as discharged, not as charged-off or in collections.",
        "This bankruptcy filing is reported with incorrect dates and information."
      ],
      'public_records': [
        "This judgment was satisfied on {date} but is still being reported as outstanding.",
        "This tax lien was released on {date} and should be removed from my report.",
        "This public record contains incorrect information about the amount and status."
      ],
      'general': [
        "Under the Fair Credit Reporting Act, you are required to verify this information with the original creditor.",
        "This error is negatively impacting my credit score and must be corrected according to FCRA guidelines.",
        "I request a thorough investigation of this matter as required by federal law.",
        "According to FCRA Section 611, you must investigate and remove inaccurate information from my credit report."
      ]
    };
  } catch (error) {
    console.error("Error getting successful dispute phrases:", error);
    return {};
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
