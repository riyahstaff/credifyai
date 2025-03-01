
/**
 * Credit Report Parser - Account Extractor - Section Processor
 * Extracts accounts from defined sections of text
 */
import { CreditReportAccount } from '../../types';
import { extractAccountDetails } from './extractAccountDetails';

/**
 * Extract accounts from a section of text
 */
export const extractAccountsFromSection = (
  section: string, 
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
): CreditReportAccount[] => {
  const accounts: CreditReportAccount[] = [];
  
  // Split the section into potential account blocks
  const accountBlocks = section.split(/\n\s*\n/);
  
  for (const block of accountBlocks) {
    // Skip very short blocks that are unlikely to contain account information
    if (block.length < 50) continue;
    
    const account = extractAccountDetails(block, bureaus);
    
    // Check if we have enough information to consider this a valid account
    if (account.accountName !== "Unknown Account" && 
        (account.accountNumber || account.accountType || account.currentBalance || account.paymentStatus)) {
      accounts.push(account);
    }
  }
  
  return accounts;
};
