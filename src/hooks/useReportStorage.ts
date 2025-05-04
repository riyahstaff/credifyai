
import { useCallback } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { clearAllLetterData, hasLetterData } from '@/utils/creditReport/clearLetterData';

/**
 * Hook to manage storage of credit report data for dispute generation
 */
export const useReportStorage = () => {
  /**
   * Store credit report and selected account for dispute generation
   */
  const storeForDispute = useCallback((
    reportData: CreditReportData,
    selectedAccount: CreditReportAccount | null = null
  ): boolean => {
    try {
      console.log("Storing credit report data for dispute generation");
      
      // CRITICAL: Clear any existing letters first to prevent reusing old letters
      clearAllLetterData();
      
      // Store the full report data
      sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // Store the selected account if provided
      if (selectedAccount) {
        sessionStorage.setItem('selectedDisputeAccount', JSON.stringify(selectedAccount));
        console.log("Selected account stored:", selectedAccount.accountName);
      }
      
      // Note that a report is ready for letter generation
      sessionStorage.setItem('reportReadyForLetters', 'true');
      
      return true;
    } catch (error) {
      console.error("Error storing report data:", error);
      return false;
    }
  }, []);
  
  /**
   * Check for pending dispute letters
   * This returns boolean (not sample data)
   */
  const checkPendingLetters = useCallback((): boolean => {
    try {
      // Check for any pending letters using the utility function
      return hasLetterData();
    } catch (error) {
      return false;
    }
  }, []);
  
  /**
   * Clear stored report data
   */
  const clearStoredReport = useCallback((): void => {
    sessionStorage.removeItem('creditReportData');
    sessionStorage.removeItem('selectedDisputeAccount');
    sessionStorage.removeItem('reportReadyForLetters');
    clearAllLetterData(); // Also clear all letter data
    console.log("Cleared stored report data and all letter data");
  }, []);
  
  /**
   * Load stored credit report data
   */
  const loadStoredReport = useCallback((): CreditReportData | null => {
    try {
      const storedData = sessionStorage.getItem('creditReportData');
      if (!storedData) return null;
      
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error loading stored report data:", error);
      return null;
    }
  }, []);
  
  return {
    storeForDispute,
    checkPendingLetters,
    clearStoredReport,
    loadStoredReport,
    clearAllLetterData
  };
};
