
import { CreditReportData, CreditReportAccount } from '@/utils/creditReportParser';

// Store the entire report in session storage
export const storeReportData = (reportData: CreditReportData): void => {
  try {
    sessionStorage.setItem('creditReportData', JSON.stringify(reportData));
    console.log('Credit report data stored in session storage');
  } catch (error) {
    console.error('Error storing credit report data:', error);
  }
};

// Retrieve the stored report data
export const getStoredReportData = (): CreditReportData | null => {
  try {
    const storedData = sessionStorage.getItem('creditReportData');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error retrieving credit report data:', error);
  }
  return null;
};

// Store an account for dispute
export const storeAccountForDispute = (account: CreditReportAccount): void => {
  try {
    // Safely access the optional bureau property
    const bureau = account.bureau || (account.bureauReporting && account.bureauReporting.length > 0 ? account.bureauReporting[0] : 'Experian');
    
    const disputeData = {
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      bureau: bureau,
      errorType: 'General Dispute',
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('pendingDisputeAccount', JSON.stringify(disputeData));
    console.log('Account stored for dispute:', disputeData);
  } catch (error) {
    console.error('Error storing account for dispute:', error);
  }
};

// Retrieve the stored account for dispute
export const getStoredDisputeAccount = (): any | null => {
  try {
    const storedAccount = sessionStorage.getItem('pendingDisputeAccount');
    if (storedAccount) {
      return JSON.parse(storedAccount);
    }
  } catch (error) {
    console.error('Error retrieving stored dispute account:', error);
  }
  return null;
};

// Clear stored dispute data
export const clearStoredDisputeData = (): void => {
  try {
    sessionStorage.removeItem('pendingDisputeAccount');
    sessionStorage.removeItem('generatedDisputeLetters');
    sessionStorage.removeItem('autoGeneratedLetter');
    console.log('Cleared stored dispute data');
  } catch (error) {
    console.error('Error clearing stored dispute data:', error);
  }
};

// Store generated dispute letters
export const storeGeneratedLetters = (letters: any[]): void => {
  try {
    sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    console.log(`Stored ${letters.length} generated letters in session storage`);
  } catch (error) {
    console.error('Error storing generated letters:', error);
  }
};
