
/**
 * Credit Report Parser - Account Extractor - Main Function
 * Handles extracting account information from credit reports
 */
import { CreditReportAccount } from '../../types';
import { extractAccountsFromSection } from './extractAccountsFromSection';
import { extractFallbackAccounts } from './extractFallbackAccounts';

/**
 * Extract account information from credit report content
 */
export const extractAccounts = (content: string, bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }) => {
  const accounts: CreditReportAccount[] = [];
  
  // Look for sections that might contain account information
  const accountSectionPatterns = [
    /(?:Accounts|Trade(?:lines)?|Credit\s+Accounts)(?:(?:\s+Information)|(?:\s+History)|(?:\s+Summary))?[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i,
    /(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts)[\s\S]*?((?:Account|Creditor|Subscriber|Company|Bank)[^\n]*(?:[\s\S]*?)(?=\s*(?:Revolving\s+Accounts|Installment\s+Accounts|Mortgage\s+Accounts|Open\s+Accounts|Closed\s+Accounts|Collection\s+Accounts|Inquiries|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  let accountSections: string[] = [];
  
  for (const pattern of accountSectionPatterns) {
    // Make sure to use a global flag for matchAll
    const matches = content.match(pattern);
    if (matches && matches[1]) {
      accountSections.push(matches[1]);
    }
  }
  
  // If we didn't find any account sections using the patterns, try looking for account-specific keywords
  if (accountSections.length === 0) {
    const accountKeywords = [
      "Account Number", "Date Opened", "Payment Status", "Account Status",
      "High Credit", "Credit Limit", "Balance", "Monthly Payment", "Past Due",
      "Payment History", "Date of Last Payment", "Current Status"
    ];
    
    const potentialAccountSections = content.split(/\n\s*\n/);
    for (const section of potentialAccountSections) {
      if (section.length > 100 && accountKeywords.some(keyword => section.includes(keyword))) {
        accountSections.push(section);
      }
    }
  }
  
  console.log(`Found ${accountSections.length} potential account sections`);
  
  // Process each account section to extract account information
  for (const section of accountSections) {
    const extractedAccounts = extractAccountsFromSection(section, bureaus);
    accounts.push(...extractedAccounts);
  }
  
  // If we didn't find any accounts using our detailed extraction, try a very basic approach
  if (accounts.length === 0) {
    const fallbackAccounts = extractFallbackAccounts(content, bureaus);
    accounts.push(...fallbackAccounts);
  }
  
  return accounts;
};
