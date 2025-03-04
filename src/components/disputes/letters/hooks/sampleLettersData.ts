
export interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  laws?: string[];
  content: string;
  resolvedAt?: string;
  accountName?: string;
  accountNumber?: string;
  errorType?: string;
  letterContent?: string;
  explanation?: string;
  bureau?: string;
  timestamp?: string;
}

/**
 * Returns sample dispute letters for demonstration purposes
 */
export const getSampleLetters = (): Letter[] => {
  return [
    {
      id: 1,
      title: 'Duplicate Account Dispute (Bank of America)',
      recipient: 'Experian',
      createdAt: 'May 10, 2023',
      status: 'in-progress',
      bureaus: ['Experian', 'TransUnion'],
      laws: ['FCRA § 611', 'FCRA § 623'],
      content: `Dear Experian,

I am writing to dispute a duplicate account appearing on my credit report. The Bank of America account appears twice with different account numbers. This is affecting my credit utilization ratio negatively.

Account Name: Bank of America
Account Number: XXXX-XXXX-XXXX-1234
Reason for Dispute: Duplicate Account

Under the Fair Credit Reporting Act, I request that you investigate this matter and remove the duplicate entry.

Sincerely,
[YOUR NAME]`,
      letterContent: `Dear Experian,

I am writing to dispute a duplicate account appearing on my credit report. The Bank of America account appears twice with different account numbers. This is affecting my credit utilization ratio negatively.

Account Name: Bank of America
Account Number: XXXX-XXXX-XXXX-1234
Reason for Dispute: Duplicate Account

Under the Fair Credit Reporting Act, I request that you investigate this matter and remove the duplicate entry.

Sincerely,
[YOUR NAME]`,
      accountName: 'Bank of America',
      accountNumber: 'XXXX-XXXX-XXXX-1234',
      errorType: 'Duplicate Account'
    },
    {
      id: 2,
      title: 'Incorrect Balance Dispute (Chase Card)',
      recipient: 'All Bureaus',
      createdAt: 'Apr 22, 2023',
      status: 'resolved',
      bureaus: ['Experian', 'Equifax', 'TransUnion'],
      laws: ['FCRA § 623'],
      resolvedAt: 'May 12, 2023',
      content: `Dear Credit Bureau,

I am writing to dispute an incorrect balance on my Chase credit card. The current balance is reported as $8,450, but my actual balance is $4,225.

Account Name: Chase Card Services
Account Number: XXXX-XXXX-XXXX-5678
Reason for Dispute: Incorrect Balance

Please investigate this matter as required by the FCRA and update the information accordingly.

Sincerely,
[YOUR NAME]`,
      letterContent: `Dear Credit Bureau,

I am writing to dispute an incorrect balance on my Chase credit card. The current balance is reported as $8,450, but my actual balance is $4,225.

Account Name: Chase Card Services
Account Number: XXXX-XXXX-XXXX-5678
Reason for Dispute: Incorrect Balance

Please investigate this matter as required by the FCRA and update the information accordingly.

Sincerely,
[YOUR NAME]`,
      accountName: 'Chase Card Services',
      accountNumber: 'XXXX-XXXX-XXXX-5678',
      errorType: 'Incorrect Balance'
    },
    {
      id: 3,
      title: 'Outdated Address Information Dispute',
      recipient: 'Equifax',
      createdAt: 'May 5, 2023',
      status: 'in-progress',
      bureaus: ['Equifax'],
      laws: ['FCRA § 605'],
      content: `Dear Equifax,

I am writing to request that you update the address information on my credit report. My current report shows an old address that I haven't lived at for over 3 years.

Please update this information as required by the FCRA.

Sincerely,
[YOUR NAME]`,
      letterContent: `Dear Equifax,

I am writing to request that you update the address information on my credit report. My current report shows an old address that I haven't lived at for over 3 years.

Please update this information as required by the FCRA.

Sincerely,
[YOUR NAME]`,
      errorType: 'Outdated Personal Information'
    }
  ];
};
