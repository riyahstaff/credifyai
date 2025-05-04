
import { CreditReportAccount, CreditReportData } from '../types';

/**
 * Generate a dispute letter specifically for discrepancies in account information
 * @param account The account with discrepancies
 * @param discrepancies Array of discrepancy descriptions
 * @param userInfo User's personal information
 * @param reportData Full credit report data
 * @returns Generated dispute letter
 */
export async function generateDisputeLetterForDiscrepancy(
  account: CreditReportAccount,
  discrepancies: string[],
  userInfo: { 
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  reportData?: CreditReportData
): Promise<string> {
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Determine bureau from account or report
  let bureau = account.bureau;
  if (!bureau && reportData) {
    bureau = reportData.primaryBureau || reportData.bureau;
  }
  if (!bureau && reportData?.bureaus) {
    if (reportData.bureaus.experian) bureau = 'Experian';
    else if (reportData.bureaus.equifax) bureau = 'Equifax';
    else if (reportData.bureaus.transunion) bureau = 'TransUnion';
  }
  
  // Get bureau info
  const bureauInfo = getBureauInfo(bureau || 'Unknown');
  
  // Format discrepancies
  const discrepancyList = discrepancies.map((item, index) => 
    `${index + 1}. ${item}`
  ).join('\n');
  
  // Create letter
  const letter = `${userInfo.name || '[YOUR NAME]'}
${userInfo.address || '[YOUR ADDRESS]'}
${userInfo.city || '[CITY]'}, ${userInfo.state || '[STATE]'} ${userInfo.zip || '[ZIP]'}

${currentDate}

${bureauInfo.name}
${bureauInfo.address}

RE: Dispute of Account Discrepancies

To Whom It May Concern:

I am writing to dispute information in my credit report regarding the following account:

Account Name: ${account.accountName}
${account.accountNumber ? `Account Number: ${account.accountNumber}` : ''}
${account.openDate ? `Date Opened: ${account.openDate}` : ''}
${account.status ? `Current Status: ${account.status}` : ''}

After reviewing my credit report, I have identified the following discrepancies with this account:

${discrepancyList}

These discrepancies constitute inaccurate reporting under the Fair Credit Reporting Act (FCRA), section 15 USC 1681e(b), which requires you to follow "reasonable procedures to assure maximum possible accuracy" of the information in consumer reports.

Please investigate these discrepancies and update my credit report with the accurate information. If you cannot verify the correct information, please remove this account from my credit report.

I understand that according to the FCRA, you are required to respond to my dispute within 30 days of receipt. Please send me the results of your investigation when complete.

Thank you for your attention to this matter.

Sincerely,

${userInfo.name || '[YOUR NAME]'}

Enclosures:
- Copy of ID
- Copy of credit report with disputed items highlighted
`;

  return letter;
}

/**
 * Get the bureau-specific information for a letter
 */
function getBureauInfo(bureauName: string): { name: string, address: string } {
  const bureau = bureauName.toLowerCase();
  
  if (bureau.includes('experian')) {
    return {
      name: 'Experian',
      address: 'P.O. Box 4500\nAllen, TX 75013'
    };
  } else if (bureau.includes('equifax')) {
    return {
      name: 'Equifax Information Services LLC',
      address: 'P.O. Box 740256\nAtlanta, GA 30374'
    };
  } else if (bureau.includes('transunion') || bureau.includes('trans union')) {
    return {
      name: 'TransUnion LLC',
      address: 'Consumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
  }
  
  // Default fallback
  return {
    name: 'Credit Bureau',
    address: 'P.O. Box 4500\nAllen, TX 75013'
  };
}
