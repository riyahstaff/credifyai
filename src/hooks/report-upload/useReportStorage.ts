
import { useState, useCallback } from 'react';
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';

export const useReportStorage = () => {
  // Store report data for dispute generation
  const storeForDispute = useCallback((reportData: CreditReportData, targetAccount: CreditReportAccount | null): boolean => {
    try {
      console.log("Storing report data for dispute generation");
      
      // Store the full report data in localStorage
      localStorage.setItem('creditReportData', JSON.stringify(reportData));
      
      // Also store a copy in session storage
      try {
        sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
      } catch (e) {
        console.warn("Could not store full report in session storage", e);
        // Store a minimal version
        const minimalData = {
          personalInfo: reportData.personalInfo,
          accounts: reportData.accounts?.slice(0, 3), 
          inquiries: reportData.inquiries?.slice(0, 3),
          bureaus: reportData.bureaus,
          primaryBureau: reportData.primaryBureau
        };
        sessionStorage.setItem('creditReportData', JSON.stringify(minimalData));
      }
      
      // Store the target account if provided
      if (targetAccount) {
        localStorage.setItem('disputeTargetAccount', JSON.stringify(targetAccount));
        sessionStorage.setItem('disputeTargetAccount', JSON.stringify(targetAccount));
        console.log("Target account stored:", targetAccount.accountName);
      } else {
        console.warn("No target account provided for dispute");
        // If report has accounts, store the first one as default target
        if (reportData.accounts && reportData.accounts.length > 0) {
          // Try to find an account with issues first instead of just the first one
          const problematicAccount = findProblematicAccount(reportData.accounts);
          localStorage.setItem('disputeTargetAccount', JSON.stringify(problematicAccount));
          sessionStorage.setItem('disputeTargetAccount', JSON.stringify(problematicAccount));
          console.log("Using account with issues as target:", problematicAccount.accountName);
        }
      }
      
      // Set a timestamp for when the data was stored
      const timestamp = Date.now().toString();
      localStorage.setItem('reportStorageTime', timestamp);
      sessionStorage.setItem('reportStorageTime', timestamp);
      
      // Set flags for letter generation - set these IMMEDIATELY to prevent race conditions
      sessionStorage.setItem('reportReadyForLetters', 'true');
      sessionStorage.setItem('forceLetterGeneration', 'true');
      sessionStorage.setItem('shouldNavigateToLetters', 'true');
      sessionStorage.setItem('reportAnalyzed', 'true');
      sessionStorage.setItem('analysisComplete', 'true');
      
      // Set account count flag to indicate the report has accounts
      if (reportData.accounts) {
        sessionStorage.setItem('reportAccountCount', reportData.accounts.length.toString());
      }
      
      console.log("Successfully stored report data for dispute generation");
      return true;
    } catch (error) {
      console.error("Error storing report data for dispute:", error);
      return false;
    }
  }, []);
  
  // Check for pending letters
  const checkPendingLetters = useCallback((): boolean => {
    // Check if there's a pending letter in any storage
    const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
    const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
    const autoLetter = sessionStorage.getItem('autoGeneratedLetter');
    
    console.log("Checking for pending letters:", {
      pendingLetter: pendingLetter ? "exists" : "missing",
      generatedLetters: generatedLetters ? "exists" : "missing",
      autoLetter: autoLetter ? "exists" : "missing"
    });
    
    return !!(pendingLetter || generatedLetters || autoLetter);
  }, []);
  
  // Clear stored report
  const clearStoredReport = useCallback(() => {
    // Clear report data
    localStorage.removeItem('creditReportData');
    localStorage.removeItem('disputeTargetAccount');
    localStorage.removeItem('reportStorageTime');
    
    // Clear session storage
    sessionStorage.removeItem('creditReportData');
    sessionStorage.removeItem('disputeTargetAccount');
    sessionStorage.removeItem('reportStorageTime');
    sessionStorage.removeItem('currentReportAnalysis');
    sessionStorage.removeItem('reportIssues');
    sessionStorage.removeItem('reportReadyForLetters');
    sessionStorage.removeItem('reportAccountCount');
    
    console.log("Cleared all stored report data");
  }, []);
  
  // Prepare report for letter generation (useful for manual trigger)
  const prepareForLetterGeneration = useCallback(() => {
    sessionStorage.setItem('reportReadyForLetters', 'true');
    sessionStorage.setItem('forceLetterGeneration', 'true');
    sessionStorage.setItem('shouldNavigateToLetters', 'true');
    sessionStorage.setItem('analysisComplete', 'true');
    
    console.log("Report prepared for letter generation, flags set");
    
    return checkPendingLetters();
  }, [checkPendingLetters]);

  /**
   * Find an account with potential issues for disputing
   */
  function findProblematicAccount(accounts: CreditReportAccount[]): CreditReportAccount {
    // First try to find accounts with negative statuses
    const negativeStatusAccount = accounts.find(account => {
      const status = (account.paymentStatus || account.status || '').toLowerCase();
      return status.includes('late') || 
            status.includes('past due') || 
            status.includes('delinq') || 
            status.includes('charge') || 
            status.includes('collection');
    });
    
    if (negativeStatusAccount) {
      return negativeStatusAccount;
    }
    
    // Next look for collection agencies or debt buyers
    const collectionAccount = accounts.find(account => {
      const name = (account.accountName || '').toLowerCase();
      return name.includes('collect') || 
            name.includes('recovery') || 
            name.includes('asset') || 
            name.includes('portfolio') ||
            name.includes('lvnv') ||
            name.includes('midland');
    });
    
    if (collectionAccount) {
      return collectionAccount;
    }
    
    // Next look for accounts with high balances
    const accountsWithBalance = accounts
      .filter(a => a.balance || a.currentBalance)
      .sort((a, b) => {
        const balA = parseFloat(String(a.balance || a.currentBalance || 0));
        const balB = parseFloat(String(b.balance || b.currentBalance || 0));
        return balB - balA; // Descending order
      });
      
    if (accountsWithBalance.length > 0) {
      return accountsWithBalance[0];
    }
    
    // Just return the first account if nothing else is found
    return accounts[0];
  }
  
  return {
    storeForDispute,
    checkPendingLetters,
    clearStoredReport,
    prepareForLetterGeneration
  };
};
