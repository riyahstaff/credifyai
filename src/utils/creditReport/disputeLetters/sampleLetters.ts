
/**
 * Sample dispute letters module
 * This file is a re-export to maintain backward compatibility
 */

// Re-export sample dispute letter functionality
export { findSampleDispute } from './sampleDisputes';
export { loadSampleDisputeLetters } from './sampleLettersLoader';

// Sample report data function
export const getSampleReportData = () => {
  return {
    personalInfo: {
      name: "John Doe",
      address: "123 Main St, Anytown, CA 12345",
      ssn: "xxx-xx-1234",
      dob: "01/01/1980"
    },
    accounts: [
      {
        accountName: "Sample Bank Credit Card",
        accountNumber: "xxxx-xxxx-xxxx-1234",
        accountType: "Credit Card",
        balance: 1500,
        currentBalance: 1500,
        creditLimit: 5000,
        paymentStatus: "Current",
        dateOpened: "01/01/2020",
        lastActivity: "01/01/2023",
        status: "Open",
        isNegative: false,
        dateReported: "01/15/2023",
        bureau: "Experian"
      },
      {
        accountName: "Sample Auto Loan",
        accountNumber: "12345-ABC",
        accountType: "Auto Loan",
        balance: 8000,
        currentBalance: 8000,
        paymentStatus: "Late 30 days",
        dateOpened: "06/15/2019",
        lastActivity: "12/15/2022",
        status: "Open",
        isNegative: true,
        dateReported: "01/15/2023",
        bureau: "TransUnion"
      }
    ],
    inquiries: [
      {
        inquiryDate: "12/01/2022",
        inquiryName: "Sample Lender",
        inquiryType: "Hard inquiry"
      }
    ],
    publicRecords: [],
    rawText: "Sample credit report text content"
  };
};
