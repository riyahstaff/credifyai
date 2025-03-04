
import { useNavigate } from 'react-router-dom';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';

export const useReportStorage = () => {
  const navigate = useNavigate();

  const storeForDispute = (reportData: CreditReportData, selectedAccount?: CreditReportAccount) => {
    try {
      // Store the report data in session storage
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // If a specific account was selected, store that too
      if (selectedAccount) {
        sessionStorage.setItem('selectedAccount', JSON.stringify(selectedAccount));
      }
      
      // Create a pending dispute letter flag
      sessionStorage.setItem('pendingDisputeLetter', 'true');
      
      // Store HTML content if available
      if (reportData.htmlContent) {
        sessionStorage.setItem('reportHtmlContent', reportData.htmlContent);
      }
      
      console.log("Report data stored for dispute generation", { 
        hasSelectedAccount: !!selectedAccount,
        hasPendingLetter: true
      });
      
      return true;
    } catch (error) {
      console.error("Error storing report data:", error);
      return false;
    }
  };

  const checkPendingLetters = (): boolean => {
    return sessionStorage.getItem('pendingDisputeLetter') === 'true';
  };

  const clearPendingLetters = (): void => {
    sessionStorage.removeItem('pendingDisputeLetter');
    sessionStorage.removeItem('selectedAccount');
    // Don't remove the report data yet, as it might be needed for reference
  };

  return {
    storeForDispute,
    checkPendingLetters,
    clearPendingLetters
  };
};
