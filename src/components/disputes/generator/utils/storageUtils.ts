
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';
import { determineBureau } from './bureauUtils';

export const loadStoredData = () => {
  const storedReportData = sessionStorage.getItem('creditReportData');
  const storedSelectedAccount = sessionStorage.getItem('selectedAccount');
  
  let reportData: CreditReportData | null = null;
  let selectedAccount: CreditReportAccount | null = null;
  let selectedBureau: string | null = null;
  
  if (storedReportData) {
    try {
      reportData = JSON.parse(storedReportData);
    } catch (error) {
      console.error("Error parsing stored credit report data:", error);
    }
  }
  
  if (storedSelectedAccount) {
    try {
      selectedAccount = JSON.parse(storedSelectedAccount);
      if (selectedAccount?.bureau) {
        selectedBureau = determineBureau(selectedAccount.bureau);
      }
    } catch (error) {
      console.error("Error parsing stored selected account:", error);
    }
  }
  
  return { reportData, selectedAccount, selectedBureau };
};

export const saveAccountToStorage = (account: CreditReportAccount) => {
  sessionStorage.setItem('selectedAccount', JSON.stringify(account));
};

export const saveReportToStorage = (data: CreditReportData) => {
  sessionStorage.setItem('creditReportData', JSON.stringify(data));
};
