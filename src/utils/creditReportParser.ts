
/**
 * Credit Report Parser Utility
 * This module parses uploaded credit reports to extract relevant information
 * for generating dispute letters.
 */

export interface CreditReportAccount {
  accountName: string;
  accountNumber?: string;
  accountType?: string;
  currentBalance?: string;
  paymentStatus?: string;
  dateOpened?: string;
  dateReported?: string;
  bureau?: string;
  remarks?: string[];
}

export interface CreditReportData {
  bureaus: {
    experian?: boolean;
    equifax?: boolean;
    transunion?: boolean;
  };
  personalInfo?: {
    name?: string;
    address?: string;
    previousAddresses?: string[];
    employers?: string[];
  };
  accounts: CreditReportAccount[];
  inquiries?: Array<{
    inquiryDate: string;
    creditor: string;
    bureau: string;
  }>;
  publicRecords?: Array<{
    recordType: string;
    bureau: string;
    dateReported: string;
    status: string;
  }>;
}

/**
 * Extract text content from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  // In a real implementation, this would use a PDF parsing library
  // For now, we'll simulate text extraction
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated content from a credit report PDF
      resolve(`
CREDIT REPORT
===============
PERSONAL INFORMATION:
Name: John Smith
Address: 123 Main St, Anytown, CA 90210
Previous Address: 456 Oak Ave, Oldtown, CA 90211
Employer: ABC Corporation

ACCOUNTS:
------------------
BANK OF AMERICA
Account #: xxxx-xxxx-xxxx-1234
Type: Credit Card
Balance: $1,452.00
Status: Current
Opened: 05/2018
Last Reported: 06/2023
Reporting to: Experian, Equifax, TransUnion

CHASE MORTGAGE
Account #: xxxxx789
Type: Mortgage
Balance: $245,800.00
Status: 30 Days Late
Opened: 03/2015
Last Reported: 06/2023
Reporting to: Experian, Equifax, TransUnion
Remarks: Late payment Feb 2023

CAPITAL ONE
Account #: xxxx-xxxx-xxxx-5678
Type: Credit Card
Balance: $0
Status: Closed
Opened: 07/2014
Closed: 09/2020
Last Reported: 10/2020
Reporting to: Experian, TransUnion

INQUIRIES:
------------------
05/12/2023 - DISCOVER FINANCIAL
04/02/2023 - TESLA FINANCING
02/15/2023 - LENDING CLUB

PUBLIC RECORDS:
------------------
None
      `);
    }, 1000);
  });
};

/**
 * Parse text content from a credit report into structured data
 */
export const parseReportContent = (content: string): CreditReportData => {
  // In a real implementation, this would use regex or NLP to parse content
  // For now, we'll return mock data that simulates the parsed content
  
  // This is a simplified parsing algorithm that would be expanded in production
  const bureaus = {
    experian: content.includes('Experian'),
    equifax: content.includes('Equifax'),
    transunion: content.includes('TransUnion'),
  };
  
  const hasNameMatch = content.match(/Name:\s*(.*)/i);
  const hasAddressMatch = content.match(/Address:\s*(.*)/i);
  
  const personalInfo = {
    name: hasNameMatch ? hasNameMatch[1] : undefined,
    address: hasAddressMatch ? hasAddressMatch[1] : undefined,
  };
  
  // Extract accounts (simplified for demo)
  const accounts: CreditReportAccount[] = [];
  
  // Very simple account extraction
  if (content.includes('BANK OF AMERICA')) {
    accounts.push({
      accountName: 'BANK OF AMERICA',
      accountNumber: 'xxxx-xxxx-xxxx-1234',
      accountType: 'Credit Card',
      currentBalance: '$1,452.00',
      paymentStatus: 'Current',
      dateOpened: '05/2018',
      dateReported: '06/2023',
      bureau: 'Experian, Equifax, TransUnion',
    });
  }
  
  if (content.includes('CHASE MORTGAGE')) {
    accounts.push({
      accountName: 'CHASE MORTGAGE',
      accountNumber: 'xxxxx789',
      accountType: 'Mortgage',
      currentBalance: '$245,800.00',
      paymentStatus: '30 Days Late',
      dateOpened: '03/2015',
      dateReported: '06/2023',
      bureau: 'Experian, Equifax, TransUnion',
      remarks: ['Late payment Feb 2023'],
    });
  }
  
  if (content.includes('CAPITAL ONE')) {
    accounts.push({
      accountName: 'CAPITAL ONE',
      accountNumber: 'xxxx-xxxx-xxxx-5678',
      accountType: 'Credit Card',
      currentBalance: '$0',
      paymentStatus: 'Closed',
      dateOpened: '07/2014',
      dateReported: '10/2020',
      bureau: 'Experian, TransUnion',
    });
  }
  
  // Extract inquiries
  const inquiries = [];
  if (content.includes('DISCOVER FINANCIAL')) {
    inquiries.push({
      inquiryDate: '05/12/2023',
      creditor: 'DISCOVER FINANCIAL',
      bureau: 'Experian, Equifax'
    });
  }
  
  return { bureaus, personalInfo, accounts, inquiries };
};

/**
 * Process uploaded credit report file
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'pdf') {
    const textContent = await extractTextFromPDF(file);
    return parseReportContent(textContent);
  } else if (fileExtension === 'txt' || fileExtension === 'text') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(parseReportContent(content));
      };
      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or TXT file.');
  }
};
