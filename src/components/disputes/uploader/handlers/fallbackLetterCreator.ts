
/**
 * Create a letter with real report data when automatic letter creation fails
 * NO MOCK DATA - only uses information extracted from the actual report
 */
export const createFallbackLetter = (reportData?: any) => {
  if (!reportData) {
    console.error("Cannot create letter: No report data provided");
    throw new Error("Cannot create letter without credit report data");
  }
  
  // Use actual accounts from the report - REQUIRED
  const accounts = reportData?.accounts || [];
  if (accounts.length === 0) {
    console.error("Cannot create letter: No accounts found in report data");
    throw new Error("Cannot create letter with no accounts in credit report");
  }
  
  // Get user information from report data ONLY
  let userName = "";
  let userAddress = "";
  let userCity = "";
  let userState = "";
  let userZip = "";
  
  // Strictly use report data for personal info, no fallbacks
  if (reportData.personalInfo) {
    const pi = reportData.personalInfo;
    userName = pi.name || "";
    userAddress = pi.address || "";
    userCity = pi.city || "";
    userState = pi.state || "";
    userZip = pi.zip || "";
    
    console.log("Using personal info from report:", {
      name: userName,
      address: userAddress,
      city: userCity,
      state: userState,
      zip: userZip
    });
  }
  
  // Use the formatted current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // ONLY use bureau from report data - NO DEFAULT VALUE
  const bureau = reportData?.primaryBureau || "";
  if (!bureau) {
    console.error("Cannot create letter: No bureau detected in report data");
    throw new Error("Cannot create letter without credit bureau identification");
  }
  
  console.log("Using bureau from report:", bureau);
  
  // Set appropriate bureau address based on detected bureau
  let bureauAddress = "";
  if (bureau === "TransUnion") {
    bureauAddress = "TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016";
  } else if (bureau === "Equifax") {
    bureauAddress = "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374";
  } else if (bureau === "Experian") {
    bureauAddress = "Experian\nP.O. Box 4500\nAllen, TX 75013";
  }
  
  // Format account information from actual report data
  let accountsSection = '';
  if (accounts && accounts.length > 0) {
    // Filter out any accounts with empty names
    const validAccounts = accounts.filter((acc: any) => 
      acc.accountName && 
      acc.accountName.trim() !== ''
    );
    
    if (validAccounts.length === 0) {
      console.error("No valid accounts found in report data");
      throw new Error("Cannot create letter with no valid accounts in credit report");
    }
    
    accountsSection = validAccounts.map((account: any, index: number) => {
      const accountName = account.accountName || '';
      const accountNumber = account.accountNumber || '';
      // Only mask if we have a real account number
      const maskedNumber = accountNumber ? 
        (accountNumber.length > 4 ? 
          'xxxx' + accountNumber.substring(Math.max(0, accountNumber.length - 4)) : 
          accountNumber) : 
        ''; 
      
      // Include account date and balance information if available
      const dateOpened = account.dateOpened || account.openDate || '';
      const balance = account.currentBalance || account.balance || '';
      const status = account.paymentStatus || account.status || '';
      
      // Create detailed account section with all available information
      return `
Disputed Account #${index + 1}:
${accountName.toUpperCase()}
${accountNumber ? `ACCOUNT NUMBER: ${maskedNumber}` : ''}
${dateOpened ? `DATE OPENED: ${dateOpened}` : ''}
${balance ? `BALANCE: $${balance}` : ''}
${status ? `STATUS: ${status}` : ''}

Dispute Reason: Per FCRA Section 611, I am disputing this account as it contains inaccurate information that cannot be verified. The information must be fully accurate, correct, complete, and verifiable.`;
    }).join('\n\n');
  }
  
  // Include inquiries section if available
  let inquiriesSection = '';
  if (reportData.inquiries && reportData.inquiries.length > 0) {
    inquiriesSection = '\n\nDisputed Inquiries:\n';
    
    inquiriesSection += reportData.inquiries.map((inquiry: any, index: number) => {
      const inquiryName = inquiry.inquiryBy || inquiry.creditor || 'Unknown Inquiry';
      const inquiryDate = inquiry.inquiryDate || '';
      
      return `
Inquiry #${index + 1}: ${inquiryName.toUpperCase()}
${inquiryDate ? `DATE: ${inquiryDate}` : ''}
Dispute Reason: I do not recognize this inquiry and/or did not authorize it. Per FCRA Section 604, all inquiries must be authorized by the consumer.`;
    }).join('\n');
  }
  
  // Create the full letter content using ONLY real data from the report
  const letterContent = `
${userName ? userName : ""}
${userAddress ? userAddress : ""}
${userCity && userState && userZip ? `${userCity}, ${userState} ${userZip}` : ""}
${currentDate}

${bureauAddress}

RE: Dispute of Inaccurate Credit Information
${reportData.personalInfo && reportData.personalInfo.ssn ? `SSN: ${reportData.personalInfo.ssn}` : ""}

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), Section 611 [15 USC § 1681i], to dispute inaccurate and incomplete information in my credit report. After reviewing my credit report from ${bureau}, I have identified the following items that require investigation and correction:

${accountsSection}
${inquiriesSection}

Under the FCRA, you are required to conduct a reasonable investigation into these disputed items and remove or correct any information that cannot be fully verified. If the information cannot be verified as accurate, complete, and timely, it must be removed from my credit report.

Please send me written confirmation of your findings once your investigation is complete. If you have any questions or need additional information, please contact me at the address listed above.

Thank you for your prompt attention to this matter.

Sincerely,

${userName ? userName : ""}`;
    
  return {
    bureau: bureau,
    accountName: accounts && accounts.length > 0 ? accounts[0].accountName : "",
    accountNumber: accounts && accounts.length > 0 && accounts[0].accountNumber ? accounts[0].accountNumber : "",
    errorType: "Credit Report Dispute",
    explanation: "I am disputing information in my credit report that may be inaccurate or incomplete under my rights provided by the Fair Credit Reporting Act.",
    accounts: accounts,
    letterContent: letterContent,
    timestamp: new Date().toISOString(),
    status: 'ready'
  };
};
