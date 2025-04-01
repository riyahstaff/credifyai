
import { useState } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';

export const useReportStorage = () => {
  const storeForDispute = (reportData: CreditReportData, targetAccount: CreditReportAccount | null) => {
    try {
      // Store the report data for dispute generation
      localStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // Store the target account if provided
      if (targetAccount) {
        localStorage.setItem('disputeTargetAccount', JSON.stringify(targetAccount));
      }
      
      // Set a timestamp for when the data was stored
      localStorage.setItem('reportStorageTime', Date.now().toString());
      
      return true;
    } catch (error) {
      console.error("Error storing report data for dispute:", error);
      return false;
    }
  };
  
  const checkPendingLetters = (): boolean => {
    // Check if there's a pending letter in the session storage
    const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
    
    return pendingLetter !== null;
  };
  
  const clearStoredReport = () => {
    // Clear report data
    localStorage.removeItem('creditReportData');
    localStorage.removeItem('disputeTargetAccount');
    localStorage.removeItem('reportStorageTime');
    
    // Clear any report-related session storage
    sessionStorage.removeItem('currentReportAnalysis');
    sessionStorage.removeItem('reportIssues');
    
    console.log("Cleared all stored report data");
  };
  
  return {
    storeForDispute,
    checkPendingLetters,
    clearStoredReport
  };
};
