
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
    userName = pi.name || localStorage.getItem('userName') || "";
    userAddress = pi.address || localStorage.getItem('userAddress') || "";
    userCity = pi.city || localStorage.getItem('userCity') || "";
    userState = pi.state || localStorage.getItem('userState') || "";
    userZip = pi.zip || localStorage.getItem('userZip') || "";
  } else {
    // Fall back to localStorage
    userName = localStorage.getItem('userName') || "";
    userAddress = localStorage.getItem('userAddress') || "";
    userCity = localStorage.getItem('userCity') || "";
    userState = localStorage.getItem('userState') || "";
    userZip = localStorage.getItem('userZip') || "";
  }
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get bureau from report data - NO DEFAULT VALUE
  const bureau = reportData?.primaryBureau || "";
  
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
      const accountName = account.accountName || '';
      const accountNumber = account.accountNumber || '';
      const maskedNumber = accountNumber ? 
        'xxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 
        ''; // Don't generate a placeholder
      
      return `
Alleging Creditor#${index + 1} and Account #${index + 1} as is reported on my credit report:
${accountName.toUpperCase()}
${accountNumber ? `ACCOUNT- ${maskedNumber}` : ''}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant`;
    }).join('\n');
  }
  
  // If we don't have any accounts section but have raw text, create a general dispute
  // based on the actual raw text content
  if (accountsSection === '' && reportData?.rawText) {
    accountsSection = `
I am disputing all information in my credit report that may be inaccurate, incomplete, or unverifiable.
Notation: Per FCRA Section 611, all information that cannot be verified must be promptly removed from my credit report.`;
  }
  
  // Set appropriate bureau address based on detected bureau - ONLY if we have a bureau
  let bureauAddress = "";
  if (bureau === "TransUnion") {
    bureauAddress = "TransUnion\nP.O. Box 2000\nChester, PA 19016";
  } else if (bureau === "Equifax") {
    bureauAddress = "Equifax\nP.O. Box 740256\nAtlanta, GA 30374";
  } else if (bureau === "Experian") {
    bureauAddress = "Experian\nP.O. Box 4500\nAllen, TX 75013";
  }
  
  // If we don't have a valid bureau, we can't generate a letter
  if (!bureau) {
    console.error("No bureau detected in report data - cannot generate letter");
  }
  
  return {
    bureau: bureau,
    accountName: accounts && accounts.length > 0 && accounts[0].accountName ? accounts[0].accountName : "",
    accountNumber: accounts && accounts.length > 0 && accounts[0].accountNumber ? accounts[0].accountNumber : "",
    errorType: "Credit Report Dispute",
    explanation: "I am disputing information in my credit report that may be inaccurate or incomplete under my rights provided by the Fair Credit Reporting Act.",
    accounts: accounts,
    letterContent: `
${userName ? userName : ""}
${userAddress ? userAddress : ""}
${userCity && userState && userZip ? `${userCity}, ${userState} ${userZip}` : ""}
${currentDate}

${bureauAddress ? "Re: My certified letter in notice of an official consumer declaration of complaint for your thus far NOT proven true, NOT proven correct, NOT proven complete, NOT proven timely, or NOT proven compliant mis-information, to include likely the deficient of proven metro 2 compliant data field formatted reporting as MANDATED! I am enacting my consumer and or civil rights to compel you here and now to absolutely and permanently remove any and all aspects of untrue, inaccurate, not complete, not timely, not proven mine, not proven my responsibility, and or not proven adequately and entirely compliant allegations of credit information.\n\n" + bureauAddress : ""}

${bureauAddress ? "\nTo Whom It May Concern:\n\nI received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.\n\nHere as follows are items in potential error requiring immediate annulment of the retainment and or reporting:" : ""}
${accountsSection}

${bureauAddress ? "I am writing to dispute inaccurate information in my credit report. I have the right under the Fair Credit Reporting Act (FCRA), Section 611, to dispute incomplete or inaccurate information.\n\nAfter reviewing my credit report, I have identified multiple items that I believe are inaccurate and request that they be verified and corrected.\n\nI request that all items in my credit report be verified for accuracy. If any information cannot be fully verified, it must be removed from my credit report as required by the FCRA.\n\nPlease investigate these matters and correct my credit report accordingly.\n\nSincerely,\n\n" + (userName || "") : ""}
    `,
    timestamp: new Date().toISOString(),
    status: 'ready' // Status is "ready"
  };
};
