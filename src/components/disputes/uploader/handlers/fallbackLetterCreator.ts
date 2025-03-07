
/**
 * Create a fallback dispute letter when no issues can be processed
 */
export const createFallbackLetter = (reportData?: any) => {
  // Include accounts from the report if available
  const accounts = reportData?.accounts || [];
  
  // Get user information from localStorage
  const userName = localStorage.getItem('userName') || localStorage.getItem('name') || "[YOUR NAME]";
  const userAddress = localStorage.getItem('userAddress') || "[YOUR ADDRESS]";
  const userCity = localStorage.getItem('userCity') || "[CITY]";
  const userState = localStorage.getItem('userState') || "[STATE]";
  const userZip = localStorage.getItem('userZip') || "[ZIP]";
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format account information
  let accountsSection = '';
  if (accounts && accounts.length > 0) {
    // Filter out any accounts with "Multiple Accounts" or empty name
    const validAccounts = accounts.filter((acc: any) => 
      acc.accountName && 
      !acc.accountName.toLowerCase().includes('multiple accounts') &&
      acc.accountName.trim() !== ''
    );
    
    // If no valid accounts found, create generic placeholders
    const accountsToUse = validAccounts.length > 0 ? validAccounts : 
      [{ accountName: 'CREDIT ACCOUNT 1', accountNumber: '1234' },
       { accountName: 'CREDIT ACCOUNT 2', accountNumber: '5678' }];
    
    accountsSection = accountsToUse.map((account: any, index: number) => {
      const accountName = account.accountName || `CREDIT ACCOUNT ${index + 1}`;
      const accountNumber = account.accountNumber || '';
      const maskedNumber = accountNumber ? 
        'xxxxxxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 
        `xxxxxxxx${1000 + index}`; // Generate a unique placeholder number
      
      return `
Alleging Creditor#${index + 1} and Account #${index + 1} as is reported on my credit report:
${accountName.toUpperCase()}
ACCOUNT- ${maskedNumber}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant`;
    }).join('\n');
  }
  
  return {
    bureau: "Experian",
    accountName: accounts && accounts.length > 0 && accounts[0].accountName 
      ? accounts[0].accountName 
      : "All Credit Accounts",
    accountNumber: accounts && accounts.length > 0 && accounts[0].accountNumber 
      ? accounts[0].accountNumber 
      : "",
    errorType: "General Dispute",
    explanation: "I am disputing all information in my credit report that may be inaccurate or incomplete under my rights provided by the Fair Credit Reporting Act.",
    accounts: accounts,
    letterContent: `
${userName}
${userAddress}
${userCity}, ${userState} ${userZip}
${currentDate}

Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.

Experian
P.O. Box 4500
Allen, TX 75013

To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:
${accountsSection}

I am writing to dispute inaccurate information in my credit report. I have the right under the Fair Credit Reporting Act (FCRA), Section 611, to dispute incomplete or inaccurate information.

After reviewing my credit report, I have identified multiple items that I believe are inaccurate and request that they be verified and corrected.

I request that all items in my credit report be verified for accuracy. If any information cannot be fully verified, it must be removed from my credit report as required by the FCRA.

Please investigate these matters and correct my credit report accordingly.

Sincerely,

${userName}
    `,
    timestamp: new Date().toISOString(),
    status: 'ready' // Status is "ready"
  };
};
