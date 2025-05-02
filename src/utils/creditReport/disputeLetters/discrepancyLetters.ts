
import { generateEnhancedDisputeLetter } from './letterGenerator';

/**
 * Generates a letter for credit report discrepancies
 */
export async function generateDisputeLetterForDiscrepancy(
  discrepancyType: string,
  accountDetails: any,
  userInfo: any,
  creditReportData?: any
): Promise<string> {
  console.log("Generating letter for discrepancy:", discrepancyType);
  
  // Forward to the main letter generation function
  return generateEnhancedDisputeLetter(
    discrepancyType,
    {
      accountName: accountDetails.accountName || 'Account in Question',
      accountNumber: accountDetails.accountNumber || '',
      errorDescription: accountDetails.errorDescription || `This ${discrepancyType} appears to be inaccurate.`,
      bureau: accountDetails.bureau || 'Credit Bureau'
    },
    userInfo,
    creditReportData
  );
}
