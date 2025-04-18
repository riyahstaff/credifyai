
import { CreditReportData, UserInfo } from '@/utils/creditReport/types';
import { UserInfo as LetterUserInfo } from '@/utils/creditReport/types/letterTypes';
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
      
      if (!accountToDispute) {
        console.warn(`Account "${accountName}" not found in credit report accounts`);
      } else {
        console.log(`Found account to dispute:`, accountToDispute.accountName);
      }
    }
    
    // Get primary bureau from credit report
    const bureau = creditReportData.primaryBureau || 
                  (creditReportData.bureaus?.experian ? 'experian' : 
                   creditReportData.bureaus?.equifax ? 'equifax' : 
                   creditReportData.bureaus?.transunion ? 'transunion' : 'experian');
    
    console.log(`Using bureau: ${bureau} for letter generation`);
    
    // Prepare user info in the format required by generateEnhancedDisputeLetter
    const letterUserInfo: LetterUserInfo = {
      name: userInfo?.name || getUserNameFromStorage() || '[YOUR NAME]',
      address: userInfo?.address || getUserAddressFromStorage(),
      city: userInfo?.city || getUserCityFromStorage(),
      state: userInfo?.state || getUserStateFromStorage(),
      zip: userInfo?.zip || getUserZipFromStorage()
    };
    
    // Use enhanced dispute letter generator
    const letterContent = await generateEnhancedDisputeLetter(
      'General Dispute',
      {
        accountName: accountToDispute?.accountName || 'Multiple Accounts',
        accountNumber: accountToDispute?.accountNumber,
        errorDescription: 'This information appears to be inaccurate on my credit report.',
        bureau
      },
      letterUserInfo,
      creditReportData
    );
    
    console.log("Generated letter content length:", letterContent?.length || 0);
    return letterContent || "Error generating dispute letter.";
  } catch (error) {
    console.error("Error generating automatic dispute letter:", error);
    return "Error generating dispute letter. Please try again.";
  }
}

// Helper functions to get user info from storage
function getUserNameFromStorage(): string | undefined {
  return localStorage.getItem('userName') || 
         sessionStorage.getItem('userName') || 
         JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name;
}

function getUserAddressFromStorage(): string | undefined {
  return localStorage.getItem('userAddress') || sessionStorage.getItem('userAddress');
}

function getUserCityFromStorage(): string | undefined {
  return localStorage.getItem('userCity') || sessionStorage.getItem('userCity');
}

function getUserStateFromStorage(): string | undefined {
  return localStorage.getItem('userState') || sessionStorage.getItem('userState');
}

function getUserZipFromStorage(): string | undefined {
  return localStorage.getItem('userZip') || sessionStorage.getItem('userZip');
}
