
import { CreditReportData, UserInfo } from '@/utils/creditReport/types';
import { generateEnhancedDisputeLetter } from '@/utils/creditReport/disputeLetters';

/**
 * Generates an automatic dispute letter based on credit report data
 * @param creditReportData The credit report data
 * @param accountName Optional account name to focus the dispute on
 * @param userInfo User information
 */
export async function generateAutomaticDisputeLetter(
  creditReportData: CreditReportData,
  accountName?: string,
  userInfo?: UserInfo
): Promise<string> {
  try {
    console.log("Generating automatic dispute letter with:", {
      creditReportData: {
        accounts: creditReportData.accounts?.length || 0,
        bureaus: creditReportData.bureaus,
        inquiries: creditReportData.inquiries?.length || 0
      },
      accountName,
      userInfo: userInfo?.name || 'Not provided'
    });
    
    // Find the account to dispute if specified
    let accountToDispute = undefined;
    
    if (accountName && creditReportData.accounts) {
      accountToDispute = creditReportData.accounts.find(
        account => account.accountName === accountName
      );
    }
    
    // Get primary bureau from credit report
    const bureau = creditReportData.primaryBureau || 
                  (creditReportData.bureaus?.experian ? 'experian' : 
                   creditReportData.bureaus?.equifax ? 'equifax' : 
                   creditReportData.bureaus?.transunion ? 'transunion' : 'experian');
    
    // Use enhanced dispute letter generator
    const letterContent = await generateEnhancedDisputeLetter(
      'General Dispute',
      {
        accountName: accountToDispute?.accountName || 'Multiple Accounts',
        accountNumber: accountToDispute?.accountNumber,
        errorDescription: 'This information appears to be inaccurate on my credit report.',
        bureau
      },
      {
        name: userInfo?.name || '[YOUR NAME]',
        address: userInfo?.address,
        city: userInfo?.city,
        state: userInfo?.state,
        zip: userInfo?.zip
      }
    );
    
    console.log("Generated letter content length:", letterContent?.length || 0);
    return letterContent || "Error generating dispute letter.";
  } catch (error) {
    console.error("Error generating automatic dispute letter:", error);
    return "Error generating dispute letter. Please try again.";
  }
}
