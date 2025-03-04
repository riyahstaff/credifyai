
import { CreditReportData } from '@/utils/creditReportParser';

/**
 * Store report data in session storage
 */
export const storeReportData = (enhancedData: CreditReportData): boolean => {
  try {
    const slimReportData = {
      personalInfo: enhancedData.personalInfo,
      accounts: enhancedData.accounts?.slice(0, 5) || [],
      inquiries: enhancedData.inquiries?.slice(0, 5) || [],
      fileContent: null,
      reportSections: null,
      // Store only the first 5000 characters of HTML content for preview purposes
      htmlContent: enhancedData.htmlContent?.substring(0, 5000) || null
    };
    
    sessionStorage.setItem('creditReportData', JSON.stringify(slimReportData));
    return true;
  } catch (storageError) {
    console.warn("Could not store full report data in session storage, storing minimal data", storageError);
    
    try {
      const minimalData = {
        personalInfo: enhancedData.personalInfo,
        accounts: (enhancedData.accounts || []).slice(0, 2).map(account => ({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          // Only include bureau if it exists
          ...(account.bureau ? { bureau: account.bureau } : {})
        }))
      };
      sessionStorage.setItem('creditReportData', JSON.stringify(minimalData));
      return true;
    } catch (error) {
      console.error("Failed to store even minimal report data:", error);
      return false;
    }
  }
};
