
/**
 * Create a fallback dispute letter when no issues can be processed
 */
export const createFallbackLetter = (reportData?: any) => {
  // Include accounts from the report if available
  const accounts = reportData?.accounts || [];
  
  // Get user information from report data or localStorage
  let userName = "";
  let userAddress = "";
  let userCity = "";
  let userState = "";
  let userZip = "";
  
  // Try to get from report data first
  if (reportData && reportData.personalInfo) {
    const pi = reportData.personalInfo;
    userName = pi.name || localStorage.getItem('userName') || "[YOUR NAME]";
    userAddress = pi.address || localStorage.getItem('userAddress') || "[YOUR ADDRESS]";
    userCity = pi.city || localStorage.getItem('userCity') || "[CITY]";
    userState = pi.state || localStorage.getItem('userState') || "[STATE]";
    userZip = pi.zip || localStorage.getItem('userZip') || "[ZIP]";
  } else {
    // Fall back to localStorage
    userName = localStorage.getItem('userName') || "[YOUR NAME]";
    userAddress = localStorage.getItem('userAddress') || "[YOUR ADDRESS]";
    userCity = localStorage.getItem('userCity') || "[CITY]";
    userState = localStorage.getItem('userState') || "[STATE]";
    userZip = localStorage.getItem('userZip') || "[ZIP]";
  }
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get bureau from report data
  const bureau = reportData?.primaryBureau || "TransUnion";
  
  // Format account information from actual report data
  let accountsSection = '';
  if (accounts && accounts.length > 0) {
    // Filter out any accounts with "Multiple Accounts" or empty name
    const validAccounts = accounts.filter((acc: any) => 
      acc.accountName && 
      !acc.accountName.toLowerCase().includes('multiple accounts') &&
      acc.accountName.trim() !== ''
    );
    
    // If we have valid accounts, use them
    const accountsToUse = validAccounts.length > 0 ? validAccounts : [];
    
    accountsSection = accountsToUse.map((account: any, index: number) => {
      const accountName = account.accountName || `ACCOUNT ${index + 1}`;
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
  
  // If we don't have any accounts section but have raw text, create a general dispute
  if (accountsSection === '' && reportData?.rawText) {
    accountsSection = `
I am disputing all information in my credit report that may be inaccurate, incomplete, or unverifiable.
Notation: Per FCRA Section 611, all information that cannot be verified must be promptly removed from my credit report.`;
  }
  
  // Set appropriate bureau address based on detected bureau
  let bureauAddress = "";
  if (bureau === "TransUnion") {
    bureauAddress = "TransUnion\nP.O. Box 2000\nChester, PA 19016";
  } else if (bureau === "Equifax") {
    bureauAddress = "Equifax\nP.O. Box 740256\nAtlanta, GA 30374";
  } else if (bureau === "Experian") {
    bureauAddress = "Experian\nP.O. Box 4500\nAllen, TX 75013";
  }
  
  return {
    bureau: bureau,
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

${bureauAddress}

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
