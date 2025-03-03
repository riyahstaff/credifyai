
/**
 * Helper functions for credit report processing
 */
import { CreditReportData, CreditReportAccount } from './types';

/**
 * Create a minimal valid CreditReportData object that can be used for testing
 */
export const createMinimalReportData = (): CreditReportData => {
  return {
    bureaus: {
      experian: true,
      equifax: false, 
      transunion: false
    },
    accounts: [],
    inquiries: [],
    publicRecords: [],
    rawText: "Sample credit report data",
    analysisResults: {
      totalAccounts: 0,
      openAccounts: 0,
      closedAccounts: 0,
      negativeItems: 0,
      inquiryCount: 0,
      publicRecordCount: 0,
      accountTypeSummary: {},
      totalDiscrepancies: 0,
      highSeverityIssues: 0,
      accountsWithIssues: 0,
      recommendedDisputes: []
    }
  };
};

/**
 * Create a sample credit account that can be used for testing
 */
export const createSampleAccount = (accountName: string = "Sample Account"): CreditReportAccount => {
  return {
    accountName,
    accountNumber: "XXXX1234",
    accountType: "Credit Card",
    openDate: "01/01/2020",
    status: "Open",
    lastReportedDate: "01/01/2023",
    creditLimit: "$5,000",
    highBalance: "$3,000",
    currentBalance: "$1,500",
    paymentStatus: "Current",
    isNegative: false,
    bureau: "Experian"
  };
};

/**
 * Add a sample account to a report
 */
export const addSampleAccountToReport = (report: CreditReportData, accountDetails?: Partial<CreditReportAccount>): CreditReportData => {
  const account = {
    ...createSampleAccount(),
    ...accountDetails
  };
  
  return {
    ...report,
    accounts: [...report.accounts, account],
    analysisResults: {
      ...report.analysisResults,
      totalAccounts: report.accounts.length + 1,
      openAccounts: (report.analysisResults?.openAccounts || 0) + (account.status === "Open" ? 1 : 0),
      closedAccounts: (report.analysisResults?.closedAccounts || 0) + (account.status === "Closed" ? 1 : 0),
    }
  };
};
