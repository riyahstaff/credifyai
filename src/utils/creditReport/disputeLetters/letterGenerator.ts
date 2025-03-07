
/**
 * Dispute letter generator functions
 */
import { RecommendedDispute, UserInfo, LegalReference } from '../types';
import { getLegalReferencesForDispute } from '../legalReferences';
import { getSampleDisputeLanguage } from './sampleLanguage';
import { findSampleDispute } from './samples';

/**
 * Generate a dispute letter for a specific discrepancy
 */
export const generateDisputeLetterForDiscrepancy = async (
  discrepancy: RecommendedDispute, 
  userInfo: UserInfo,
  creditReportData?: any
): Promise<string> => {
  console.log("Generating dispute letter for:", discrepancy);

  // Get the bureau address
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  // Normalize bureau name to match our address keys
  const bureauKey = discrepancy.bureau.toLowerCase().replace(/\s+/g, '');
  
  // Choose the correct address or use a placeholder
  const bureauAddress = bureauAddresses[bureauKey as keyof typeof bureauAddresses] || 
                       `${discrepancy.bureau}\n[BUREAU ADDRESS]`;
  
  // Get the current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get legal references if available or fetch them
  const legalReferences = discrepancy.legalBasis || 
    getLegalReferencesForDispute(discrepancy.reason, discrepancy.description);
  
  // Generate the account number display - use last 4 digits if available
  const accountNumber = discrepancy.accountNumber || "Unknown";
  const maskedNumber = accountNumber && accountNumber.length > 4 ? 
    'xxxxxxxx' + accountNumber.substring(accountNumber.length - 4) : 
    accountNumber;

  // Extract accounts from the credit report data if available
  let accountsSectionContent = "";
  if (creditReportData && creditReportData.accounts && creditReportData.accounts.length > 0) {
    const validAccounts = creditReportData.accounts.filter((acc: any) => 
      acc.accountName && 
      !acc.accountName.toLowerCase().includes('multiple accounts')
    );
    
    accountsSectionContent = validAccounts.map((account: any, index: number) => {
      const accName = account.accountName || 'UNKNOWN CREDITOR';
      const accNumber = account.accountNumber || 'Unknown';
      const maskedNum = accNumber && accNumber.length > 4 ? 
        'xxxxxxxx' + accNumber.substring(accNumber.length - 4) : 
        'xxxxxxxx####';
      
      return `
Alleging Creditor#${index + 1} and Account #${index + 1} as is reported on my credit report:
${accName.toUpperCase()}
ACCOUNT- ${maskedNum}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant`;
    }).join('\n');
  } else if (discrepancy.accountName) {
    // If no accounts from report, at least include the disputed account
    // Skip if it contains "Multiple Accounts"
    if (!discrepancy.accountName.toLowerCase().includes('multiple accounts')) {
      accountsSectionContent = `
Alleging Creditor and Account as is reported on my credit report:
${discrepancy.accountName.toUpperCase()}
ACCOUNT- ${maskedNumber}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;
    }
  }

  // Try to use a credit report number from the report data, or generate a placeholder
  const creditReportNumber = creditReportData?.reportNumber || 
                            ('CR' + Math.floor(Math.random() * 10000000));

  // Try to find a relevant sample dispute letter to use as a template
  try {
    const sampleLetter = await findSampleDispute(discrepancy.reason, discrepancy.bureau);
    
    if (sampleLetter) {
      console.log("Found sample dispute letter for this type of dispute from Supabase");
      
      // Get actual user information from localStorage or input
      const userName = userInfo.name || localStorage.getItem('userName') || userInfo.fullName || localStorage.getItem('fullName') || localStorage.getItem('userFullName');
      const userAddress = userInfo.address || localStorage.getItem('userAddress');
      const userCity = userInfo.city || localStorage.getItem('userCity');
      const userState = userInfo.state || localStorage.getItem('userState');
      const userZip = userInfo.zip || localStorage.getItem('userZip');
      
      // Only replace placeholders if we have actual values
      let enhancedLetter = sampleLetter.content;
      
      if (userName) enhancedLetter = enhancedLetter.replace(/\[FULL_NAME\]|\[YOUR_NAME\]|\[NAME\]/g, userName);
      if (userAddress) enhancedLetter = enhancedLetter.replace(/\[ADDRESS\]|\[YOUR_ADDRESS\]/g, userAddress);
      if (userCity) enhancedLetter = enhancedLetter.replace(/\[CITY\]/g, userCity);
      if (userState) enhancedLetter = enhancedLetter.replace(/\[STATE\]/g, userState);
      if (userZip) enhancedLetter = enhancedLetter.replace(/\[ZIP\]/g, userZip);
      
      enhancedLetter = enhancedLetter
        .replace(/\[DATE\]|\[CURRENT_DATE\]/g, currentDate)
        .replace(/\[BUREAU\]/g, discrepancy.bureau)
        .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
        .replace(/\[ACCOUNT_NAME\]/g, discrepancy.accountName)
        .replace(/\[ACCOUNT_NUMBER\]/g, accountNumber)
        .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, discrepancy.reason)
        .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, discrepancy.description)
        .replace(/your credit report/gi, "my credit report")
        .replace(/Your credit report/gi, "My credit report");
      
      // Add the accounts section
      if (accountsSectionContent && !enhancedLetter.includes("Alleging Creditor")) {
        enhancedLetter = enhancedLetter.replace(
          /To Whom It May Concern:/,
          `To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:${accountsSectionContent}`
        );
      }
      
      // Move the Re: section to correct position
      if (enhancedLetter.includes("Re: My certified letter")) {
        // Remove existing Re: section
        enhancedLetter = enhancedLetter.replace(/Re: My certified letter.*?(?=\n\n)/s, '');
        
        // Add it back in the correct location, right after date and before bureau address
        enhancedLetter = enhancedLetter.replace(
          new RegExp(`${currentDate}\\s*\\n\\n${discrepancy.bureau}`),
          `${currentDate}

Re: Dispute of Inaccurate Credit Information - Account: ${discrepancy.accountName}

${discrepancy.bureau}`
        );
      }
      
      // Update enclosures section to only include ID and SSN card
      enhancedLetter = enhancedLetter.replace(
        /Enclosures:(\s|.)*$/m, 
        `Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`
      );
      
      // Remove the technical KEY explanation section if present
      enhancedLetter = enhancedLetter.replace(
        /Please utilize the following KEY to explain markings on the images of below-shown items being contested:.*?(?=\*{5,}|\n\n)/gs,
        ''
      );
      
      return enhancedLetter;
    }
  } catch (error) {
    console.error("Error finding sample dispute letter from Supabase:", error);
    // Continue with regular template if there's an error
  }
  
  // If no sample dispute language is available, try to get one
  let disputeExplanation = discrepancy.sampleDisputeLanguage || discrepancy.description;
  
  if (!discrepancy.sampleDisputeLanguage) {
    try {
      const sampleLanguage = await getSampleDisputeLanguage(discrepancy.reason, discrepancy.bureau);
      if (sampleLanguage && sampleLanguage.length > 10) {
        disputeExplanation = `${discrepancy.description}\n\n${sampleLanguage}`;
      }
    } catch (error) {
      console.error("Error getting sample dispute language:", error);
      // Continue with original explanation if there's an error
    }
  }
  
  // Get user information, try localStorage with multiple possible keys if not provided
  const userName = userInfo.name || localStorage.getItem('userName') || userInfo.fullName || 
                   localStorage.getItem('fullName') || localStorage.getItem('userFullName');
  const userAddress = userInfo.address || localStorage.getItem('userAddress');
  const userCity = userInfo.city || localStorage.getItem('userCity');
  const userState = userInfo.state || localStorage.getItem('userState');
  const userZip = userInfo.zip || localStorage.getItem('userZip');
  
  // Generate citations text from legal references
  const citationsText = legalReferences && legalReferences.length > 0 
    ? legalReferences.map(ref => `${ref.law} ${ref.section} - ${ref.title}: ${ref.text}`).join('\n\n') + '\n\n'
    : 'Under the Fair Credit Reporting Act § 611 (FCRA), ';
  
  // Generate an enhanced letter with more detailed legal language
  let letterContent = `
${userName || '[YOUR NAME]'}
${userAddress || '[YOUR ADDRESS]'}
${userCity || '[CITY]'}, ${userState || '[STATE]'} ${userZip || '[ZIP]'}
${currentDate}

Re: Dispute of Inaccurate Credit Information - Account: ${discrepancy.accountName}

${discrepancy.bureau}
${bureauAddress}

To Whom It May Concern:

I received a copy of my credit report (Credit Report #: ${creditReportNumber}) and found the following item(s) to be errors, or are deficient of proof of being accurate, correct, complete, and timely.

Here as follows are items in potential error requiring immediate correction or removal:${accountsSectionContent}

EXPLANATION OF INACCURACY:
${disputeExplanation}

LEGAL BASIS FOR DISPUTE:
${citationsText}you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

Under Section 611 of the FCRA, you must:
1. Conduct a thorough investigation of this disputed information within 30 days (45 days if I submit additional information)
2. Forward all relevant information to the furnisher of this information
3. Consider all information I have submitted
4. Provide me with the results of your investigation and a free copy of my credit report if changes are made
5. Remove the disputed item if it cannot be properly verified

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report.

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report.

Sincerely,

${userName || '[YOUR NAME]'}

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

  return letterContent;
};

/**
 * Generate a dispute letter for a specific discrepancy with advanced features
 */
export const generateAdvancedDisputeLetter = async (
  discrepancy: RecommendedDispute, 
  userInfo: UserInfo,
  creditReportData?: any
): Promise<string> => {
  console.log("Generating advanced dispute letter for:", discrepancy);

  // Get the bureau address
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  // Normalize bureau name to match our address keys
  const bureauKey = discrepancy.bureau.toLowerCase().replace(/\s+/g, '');
  
  // Choose the correct address or use a placeholder
  const bureauAddress = bureauAddresses[bureauKey as keyof typeof bureauAddresses] || 
                       `${discrepancy.bureau}\n[BUREAU ADDRESS]`;
  
  // Get the current date in a formatted string
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get legal references if available or fetch them
  const legalReferences = discrepancy.legalBasis || 
    getLegalReferencesForDispute(discrepancy.reason, discrepancy.description);
  
  // Generate the account number display - use last 4 digits if available
  const accountNumber = discrepancy.accountNumber || "Unknown";
  const maskedNumber = accountNumber && accountNumber.length > 4 ? 
    'xxxxxxxx' + accountNumber.substring(accountNumber.length - 4) : 
    accountNumber;

  // Extract accounts from the credit report data if available
  let accountsSectionContent = "";
  if (creditReportData && creditReportData.accounts && creditReportData.accounts.length > 0) {
    const validAccounts = creditReportData.accounts.filter((acc: any) => 
      acc.accountName && 
      !acc.accountName.toLowerCase().includes('multiple accounts')
    );
    
    accountsSectionContent = validAccounts.map((account: any, index: number) => {
      const accName = account.accountName || 'UNKNOWN CREDITOR';
      const accNumber = account.accountNumber || 'Unknown';
      const maskedNum = accNumber && accNumber.length > 4 ? 
        'xxxxxxxx' + accNumber.substring(accNumber.length - 4) : 
        'xxxxxxxx####';
      
      return `
Alleging Creditor#${index + 1} and Account #${index + 1} as is reported on my credit report:
${accName.toUpperCase()}
ACCOUNT- ${maskedNum}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant`;
    }).join('\n');
  } else if (discrepancy.accountName) {
    // If no accounts from report, at least include the disputed account
    // Skip if it contains "Multiple Accounts"
    if (!discrepancy.accountName.toLowerCase().includes('multiple accounts')) {
      accountsSectionContent = `
Alleging Creditor and Account as is reported on my credit report:
${discrepancy.accountName.toUpperCase()}
ACCOUNT- ${maskedNumber}
Notation: Per CRSA enacted, CDIA implemented laws, any and all reporting must be deleted if not Proven CERTIFIABLY fully true, correct, complete, timely, of known ownership and responsibility but also fully Metro 2 compliant
`;
    }
  }

  // Try to use a credit report number from the report data, or generate a placeholder
  const creditReportNumber = creditReportData?.reportNumber || 
                            ('CR' + Math.floor(Math.random() * 10000000));

  // Try to find a relevant sample dispute letter to use as a template
  try {
    const sampleLetter = await findSampleDispute(discrepancy.reason, discrepancy.bureau);
    
    if (sampleLetter) {
      console.log("Found sample dispute letter for this type of dispute from Supabase");
      
      // Get actual user information from localStorage or input
      const userName = userInfo.name || localStorage.getItem('userName') || userInfo.fullName || localStorage.getItem('fullName') || localStorage.getItem('userFullName');
      const userAddress = userInfo.address || localStorage.getItem('userAddress');
      const userCity = userInfo.city || localStorage.getItem('userCity');
      const userState = userInfo.state || localStorage.getItem('userState');
      const userZip = userInfo.zip || localStorage.getItem('userZip');
      
      // Only replace placeholders if we have actual values
      let enhancedLetter = sampleLetter.content;
      
      if (userName) enhancedLetter = enhancedLetter.replace(/\[FULL_NAME\]|\[YOUR_NAME\]|\[NAME\]/g, userName);
      if (userAddress) enhancedLetter = enhancedLetter.replace(/\[ADDRESS\]|\[YOUR_ADDRESS\]/g, userAddress);
      if (userCity) enhancedLetter = enhancedLetter.replace(/\[CITY\]/g, userCity);
      if (userState) enhancedLetter = enhancedLetter.replace(/\[STATE\]/g, userState);
      if (userZip) enhancedLetter = enhancedLetter.replace(/\[ZIP\]/g, userZip);
      
      enhancedLetter = enhancedLetter
        .replace(/\[DATE\]|\[CURRENT_DATE\]/g, currentDate)
        .replace(/\[BUREAU\]/g, discrepancy.bureau)
        .replace(/\[BUREAU_ADDRESS\]/g, bureauAddress)
        .replace(/\[ACCOUNT_NAME\]/g, discrepancy.accountName)
        .replace(/\[ACCOUNT_NUMBER\]/g, accountNumber)
        .replace(/\[DISPUTE_REASON\]|\[ERROR_TYPE\]/g, discrepancy.reason)
        .replace(/\[ERROR_DESCRIPTION\]|\[EXPLANATION\]/g, discrepancy.description)
        .replace(/your credit report/gi, "my credit report")
        .replace(/Your credit report/gi, "My credit report");
      
      // Add the accounts section
      if (accountsSectionContent && !enhancedLetter.includes("Alleging Creditor")) {
        enhancedLetter = enhancedLetter.replace(
          /To Whom It May Concern:/,
          `To Whom It May Concern:

I received a copy of my credit report and found the following item(s) to be errors, or are deficient of proof of not being untrue, incorrect, incomplete, untimely, not mine, not my responsibility, or else wise not compliant, to include to metro 2 reporting standards.

Here as follows are items in potential error requiring immediate annulment of the retainment and or reporting:${accountsSectionContent}`
        );
      }
      
      // Move the Re: section to correct position
      if (enhancedLetter.includes("Re: My certified letter")) {
        // Remove existing Re: section
        enhancedLetter = enhancedLetter.replace(/Re: My certified letter.*?(?=\n\n)/s, '');
        
        // Add it back in the correct location, right after date and before bureau address
        enhancedLetter = enhancedLetter.replace(
          new RegExp(`${currentDate}\\s*\\n\\n${discrepancy.bureau}`),
          `${currentDate}

Re: Dispute of Inaccurate Credit Information - Account: ${discrepancy.accountName}

${discrepancy.bureau}`
        );
      }
      
      // Update enclosures section to only include ID and SSN card
      enhancedLetter = enhancedLetter.replace(
        /Enclosures:(\s|.)*$/m, 
        `Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`
      );
      
      // Remove the technical KEY explanation section if present
      enhancedLetter = enhancedLetter.replace(
        /Please utilize the following KEY to explain markings on the images of below-shown items being contested:.*?(?=\*{5,}|\n\n)/gs,
        ''
      );
      
      return enhancedLetter;
    }
  } catch (error) {
    console.error("Error finding sample dispute letter from Supabase:", error);
    // Continue with regular template if there's an error
  }
  
  // If no sample dispute language is available, try to get one
  let disputeExplanation = discrepancy.sampleDisputeLanguage || discrepancy.description;
  
  if (!discrepancy.sampleDisputeLanguage) {
    try {
      const sampleLanguage = await getSampleDisputeLanguage(discrepancy.reason, discrepancy.bureau);
      if (sampleLanguage && sampleLanguage.length > 10) {
        disputeExplanation = `${discrepancy.description}\n\n${sampleLanguage}`;
      }
    } catch (error) {
      console.error("Error getting sample dispute language:", error);
      // Continue with original explanation if there's an error
    }
  }
  
  // Get user information, try localStorage with multiple possible keys if not provided
  const userName = userInfo.name || localStorage.getItem('userName') || userInfo.fullName || 
                   localStorage.getItem('fullName') || localStorage.getItem('userFullName');
  const userAddress = userInfo.address || localStorage.getItem('userAddress');
  const userCity = userInfo.city || localStorage.getItem('userCity');
  const userState = userInfo.state || localStorage.getItem('userState');
  const userZip = userInfo.zip || localStorage.getItem('userZip');
  
  // Generate citations text from legal references
  const citationsText = legalReferences && legalReferences.length > 0 
    ? legalReferences.map(ref => `${ref.law} ${ref.section} - ${ref.title}: ${ref.text}`).join('\n\n') + '\n\n'
    : 'Under the Fair Credit Reporting Act § 611 (FCRA), ';
  
  // Generate an enhanced letter with more detailed legal language
  let letterContent = `
${userName || '[YOUR NAME]'}
${userAddress || '[YOUR ADDRESS]'}
${userCity || '[CITY]'}, ${userState || '[STATE]'} ${userZip || '[ZIP]'}
${currentDate}

Re: Dispute of Inaccurate Credit Information - Account: ${discrepancy.accountName}

${discrepancy.bureau}
${bureauAddress}

To Whom It May Concern:

I received a copy of my credit report (Credit Report #: ${creditReportNumber}) and found the following item(s) to be errors, or are deficient of proof of being accurate, correct, complete, and timely.

Here as follows are items in potential error requiring immediate correction or removal:${accountsSectionContent}

EXPLANATION OF INACCURACY:
${disputeExplanation}

LEGAL BASIS FOR DISPUTE:
${citationsText}you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

Under Section 611 of the FCRA, you must:
1. Conduct a thorough investigation of this disputed information within 30 days (45 days if I submit additional information)
2. Forward all relevant information to the furnisher of this information
3. Consider all information I have submitted
4. Provide me with the results of your investigation and a free copy of my credit report if changes are made
5. Remove the disputed item if it cannot be properly verified

According to the Fair Credit Reporting Act, Section 609 (a)(1)(A), you are required by federal law to verify - through the physical verification of the original signed consumer contract - any and all accounts you post on a credit report.

Please notify me that the above items have been deleted pursuant to § 611 (a)(6) [15 USC § 1681j (a) (6)]. I am also requesting an updated copy of my credit report, which should be sent to the address listed below. According to the provisions of § 612 [15 USC § 1681j], there should be no charge for this report.

Sincerely,

${userName || '[YOUR NAME]'}

Enclosures:
- Copy of Driver's License
- Copy of Social Security Card
`;

  return letterContent;
};
