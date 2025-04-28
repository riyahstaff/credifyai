
import { CreditReportData, UserInfo, CreditReportAccount } from '@/utils/creditReport/types';
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
    
    if (!creditReportData.accounts || creditReportData.accounts.length === 0) {
      console.error("No accounts found in credit report data");
      return "Error: No accounts found in credit report to dispute.";
    }
    
    // Find the specific account to dispute
    let accountToDispute: CreditReportAccount | undefined;
    
    if (accountName && creditReportData.accounts) {
      // Try to find the exact account by name
      accountToDispute = creditReportData.accounts.find(
        account => account.accountName === accountName
      );
      
      if (!accountToDispute) {
        // Try case-insensitive match
        accountToDispute = creditReportData.accounts.find(
          account => account.accountName.toLowerCase() === accountName.toLowerCase()
        );
      }
      
      if (!accountToDispute) {
        // Try fuzzy match (contains)
        accountToDispute = creditReportData.accounts.find(
          account => account.accountName.toLowerCase().includes(accountName.toLowerCase())
        );
      }
      
      if (!accountToDispute) {
        console.warn(`Account "${accountName}" not found in credit report accounts`);
        // Find a problematic account instead of using the first one
        accountToDispute = findProblematicAccount(creditReportData.accounts);
        console.log("Using problematic account instead:", accountToDispute?.accountName);
      } else {
        console.log(`Found account to dispute:`, accountToDispute.accountName);
      }
    } else if (creditReportData.accounts && creditReportData.accounts.length > 0) {
      // If no account specified, find one with issues
      accountToDispute = findProblematicAccount(creditReportData.accounts);
      console.log("No account specified, using account with issues:", accountToDispute?.accountName);
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
      address: userInfo?.address || getUserAddressFromStorage() || '',
      city: userInfo?.city || getUserCityFromStorage() || '',
      state: userInfo?.state || getUserStateFromStorage() || '',
      zip: userInfo?.zip || getUserZipFromStorage() || ''
    };
    
    // Analyze account to determine specific dispute reasons
    const { errorType, errorDescription } = analyzeAccountForDispute(accountToDispute);
    
    console.log(`Creating dispute letter for ${errorType}: ${errorDescription}`);
    
    // Use enhanced dispute letter generator
    const letterContent = await generateEnhancedDisputeLetter(
      errorType,
      {
        accountName: accountToDispute?.accountName || 'Account in question',
        accountNumber: accountToDispute?.accountNumber || '',
        errorDescription,
        bureau
      },
      letterUserInfo,
      creditReportData
    );
    
    console.log("Generated letter content length:", letterContent?.length || 0);
    
    // Store the auto-generated letter in session storage
    if (letterContent) {
      const letterObject = {
        id: Date.now(),
        title: `${errorType} - ${accountToDispute?.accountName || bureau.toUpperCase()}`,
        bureau: bureau,
        recipient: bureau,
        accountName: accountToDispute?.accountName || 'Account in question',
        accountNumber: accountToDispute?.accountNumber || '',
        content: letterContent,
        letterContent: letterContent,
        bureaus: [bureau],
        createdAt: new Date().toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }),
        status: "ready",
        errorType: errorType
      };
      
      // Store in all possible storage locations to ensure it's found
      sessionStorage.setItem('autoGeneratedLetter', JSON.stringify(letterObject));
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(letterObject));
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([letterObject]));
      sessionStorage.setItem('hasDisputeLetters', 'true');
      
      // Important - set navigation flag
      sessionStorage.setItem('shouldNavigateToLetters', 'true');
      
      // Dispatch custom event for navigation
      try {
        const event = new CustomEvent('navigateToLetters', { 
          detail: { navigateTo: 'letters' } 
        });
        window.dispatchEvent(event);
        console.log("Dispatched navigation event after letter generation");
      } catch (e) {
        console.error("Error dispatching navigation event:", e);
      }
    }
    
    return letterContent || "Error generating dispute letter.";
  } catch (error) {
    console.error("Error generating automatic dispute letter:", error);
    return "Error generating dispute letter. Please try again.";
  }
}

/**
 * Find an account with potential issues for disputing
 */
function findProblematicAccount(accounts: CreditReportAccount[]): CreditReportAccount {
  // First try to find accounts with negative statuses
  const negativeStatusAccount = accounts.find(account => {
    const status = (account.paymentStatus || account.status || '').toLowerCase();
    return status.includes('late') || 
           status.includes('past due') || 
           status.includes('delinq') || 
           status.includes('charge') || 
           status.includes('collection');
  });
  
  if (negativeStatusAccount) {
    return negativeStatusAccount;
  }
  
  // Next look for collection agencies or debt buyers
  const collectionAccount = accounts.find(account => {
    const name = (account.accountName || '').toLowerCase();
    return name.includes('collect') || 
           name.includes('recovery') || 
           name.includes('asset') || 
           name.includes('portfolio') ||
           name.includes('lvnv') ||
           name.includes('midland');
  });
  
  if (collectionAccount) {
    return collectionAccount;
  }
  
  // Next look for accounts with high balances
  const accountsWithBalance = accounts
    .filter(a => a.balance || a.currentBalance)
    .sort((a, b) => {
      const balA = parseFloat(String(a.balance || a.currentBalance || 0));
      const balB = parseFloat(String(b.balance || b.currentBalance || 0));
      return balB - balA; // Descending order
    });
    
  if (accountsWithBalance.length > 0) {
    return accountsWithBalance[0];
  }
  
  // Just return the first account if nothing else is found
  return accounts[0];
}

/**
 * Analyze an account to determine specific dispute reasons
 */
function analyzeAccountForDispute(account?: CreditReportAccount): { errorType: string; errorDescription: string } {
  if (!account) {
    return {
      errorType: "Account Information Error",
      errorDescription: "This account contains unverifiable information that requires investigation."
    };
  }
  
  const accountName = account.accountName?.toLowerCase() || '';
  const status = (account.paymentStatus || account.status || '').toLowerCase();
  
  // Check for collection accounts
  if (accountName.includes('collect') || 
      accountName.includes('recovery') || 
      accountName.includes('asset') || 
      status.includes('collection')) {
    
    return {
      errorType: "Collection Account Dispute",
      errorDescription: "I am disputing this collection account as it contains inaccurate information. " +
        "Under the Fair Credit Reporting Act (FCRA), I request validation that this debt belongs to me, " +
        "including proof of the original debt, a copy of the signed contract, and verification of your " +
        "legal right to collect this debt. Without complete verification, this account must be removed from my report."
    };
  }
  
  // Check for late payments
  if (status.includes('late') || 
      status.includes('past due') || 
      status.includes('delinq')) {
    
    return {
      errorType: "Late Payment Dispute",
      errorDescription: "I am disputing the late payment notation on this account as inaccurate. " +
        "Under FCRA Section 611, I maintain that my payment history has been reported incorrectly. " +
        "I have always made payments on time or this represents an isolated incident that does not " +
        "accurately reflect my payment history. Please verify this information with the creditor " +
        "and remove any inaccurate late payment remarks."
    };
  }
  
  // Check for charged off accounts
  if (status.includes('charge') || status.includes('charged off')) {
    return {
      errorType: "Charge-Off Dispute",
      errorDescription: "I am disputing this charge-off as it contains inaccurate information. " +
        "Under the Fair Credit Reporting Act, I request verification of the full account history, " +
        "including original creditor information, account opening date, and complete payment history. " +
        "Additionally, I dispute the balance reported as it may not reflect payments made or other adjustments."
    };
  }
  
  // Check for high balance accounts
  const balance = parseFloat(String(account.balance || account.currentBalance || 0));
  if (balance > 5000) {
    return {
      errorType: "Balance Dispute",
      errorDescription: "I am disputing the balance reported for this account as it is inaccurate. " +
        "The current balance shown does not reflect my actual financial obligation. " +
        "Under the FCRA, I request verification of the complete payment history and a detailed " +
        "accounting of how the current balance was calculated. This information may include " +
        "unauthorized fees or charges that should be removed."
    };
  }
  
  // Default dispute reason
  return {
    errorType: "Account Information Error",
    errorDescription: "The information reported for this account contains errors that must be investigated. " +
      "Under Section 611 of the Fair Credit Reporting Act, I request a complete verification of all account " +
      "details including account status, balance information, payment history, and account terms. " +
      "Any information that cannot be properly verified must be promptly corrected or deleted."
  };
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
