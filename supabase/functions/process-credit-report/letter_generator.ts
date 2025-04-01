
// Letter generation utility

import { CreditReportIssue, IssueType } from "./issue_detector.ts";

interface LetterTemplate {
  id: string;
  name: string;
  issue_type: string;
  content: string;
}

interface UserData {
  full_name?: string;
  email?: string;
  [key: string]: any;
}

interface GeneratedLetter {
  issue_type: IssueType;
  content: string;
  bureau: string;
  account_number?: string;
  creditor_name?: string;
}

/**
 * Generate dispute letters for credit report issues
 * @param issues Detected issues in the credit report
 * @param userData User data for letter personalization
 * @param reportText Original credit report text
 * @param templates Available letter templates
 * @returns Array of generated dispute letters
 */
export function generate_letters(
  issues: CreditReportIssue[],
  userData: UserData,
  reportText: string,
  templates: LetterTemplate[]
): GeneratedLetter[] {
  console.log(`Generating letters for ${issues.length} issues`);
  
  const letters: GeneratedLetter[] = [];
  
  // Extract personal information from the credit report
  const personalInfo = extract_personal_info(reportText);
  
  // Generate a letter for each issue
  for (const issue of issues) {
    // Find the template for this issue type
    const template = templates.find(t => t.issue_type === issue.type);
    
    if (!template) {
      console.warn(`No template found for issue type: ${issue.type}`);
      continue;
    }
    
    // Format the disputed accounts section
    let disputedAccountsText = "";
    for (const account of issue.accounts) {
      disputedAccountsText += `- **Creditor:** ${account.accountName}\n`;
      if (account.accountNumber) {
        disputedAccountsText += `- **Account #:** ${account.accountNumber}\n`;
      }
      
      // For late payments, try to extract dates
      if (issue.type === 'late_payment') {
        const dates = extract_late_payment_dates(reportText, account.accountName);
        if (dates && dates.length > 0) {
          disputedAccountsText += `- **Alleged Late Payments:** ${dates.join(', ')}\n`;
        } else {
          disputedAccountsText += `- **Alleged Late Payments:** [See credit report for dates]\n`;
        }
      }
      
      disputedAccountsText += "\n";
    }
    
    // Create a credit report number
    const creditReportNumber = 'CR' + Math.floor(Math.random() * 10000000);
    
    // Format date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    // Get the bureau address
    const bureauAddress = get_bureau_address(issue.bureau);
    
    // Prepare replacement data
    const replacements: Record<string, string> = {
      '{{CREDIT_REPORT_NUMBER}}': creditReportNumber,
      '{{CURRENT_DATE}}': formattedDate,
      '{{USER_NAME}}': userData.full_name || personalInfo.name || '[YOUR NAME]',
      '{{USER_ADDRESS}}': personalInfo.address || '[YOUR ADDRESS]',
      '{{USER_CITY}}': personalInfo.city || '[CITY]',
      '{{USER_STATE}}': personalInfo.state || '[STATE]',
      '{{USER_ZIP}}': personalInfo.zip || '[ZIP]',
      '{{BUREAU}}': issue.bureau,
      '{{BUREAU_ADDRESS}}': bureauAddress,
      '{{DISPUTED_ACCOUNTS}}': disputedAccountsText,
    };
    
    // Apply the replacements to the template
    let letterContent = template.content;
    for (const [key, value] of Object.entries(replacements)) {
      letterContent = letterContent.replace(new RegExp(key, 'g'), value);
    }
    
    // Create the letter object
    const letter: GeneratedLetter = {
      issue_type: issue.type,
      content: letterContent,
      bureau: issue.bureau,
    };
    
    // Add account information if available
    if (issue.accounts && issue.accounts.length > 0) {
      const firstAccount = issue.accounts[0];
      letter.creditor_name = firstAccount.accountName;
      letter.account_number = firstAccount.accountNumber;
    }
    
    letters.push(letter);
  }
  
  console.log(`Generated ${letters.length} dispute letters`);
  
  return letters;
}

/**
 * Extract personal information from credit report text
 */
function extract_personal_info(content: string): {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
} {
  // Initialize personal info object
  const personalInfo: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  } = {};
  
  // Look for name in the report
  const namePatterns = [
    /Name:?\s*([^\n\r]+)/i,
    /(?:Consumer|Customer|Client)(?:\s+Name)?:?\s*([^\n\r]+)/i,
    /Personal\s+Information[\s\S]{0,50}(?:Name|Consumer):?\s*([^\n\r]+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.name = match[1].trim();
      break;
    }
  }
  
  // Look for address in the report
  const addressPatterns = [
    /(?:Address|Street|Location|Residence):?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i,
    /Personal\s+Information[\s\S]{0,100}(?:Address|Street):?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i,
    /Current\s+Address:?\s*([^\n\r]+(?:\r?\n[^\n\r]+){0,2})/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = content.match(pattern);
    if (match && match[1]?.trim()) {
      personalInfo.address = match[1].trim().replace(/\r?\n/g, ' ');
      
      // Try to extract city, state, zip from address
      const cityStateZipPatterns = [
        /([A-Za-z\s.-]+),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/,  // City, ST 12345
        /([A-Za-z\s.-]+)\s+([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/    // City ST 12345
      ];
      
      for (const pattern of cityStateZipPatterns) {
        const addressParts = personalInfo.address.match(pattern);
        if (addressParts && addressParts.length >= 4) {
          personalInfo.city = addressParts[1].trim();
          personalInfo.state = addressParts[2];
          personalInfo.zip = addressParts[3];
          // Remove city, state, zip from address field
          personalInfo.address = personalInfo.address.replace(pattern, '').trim();
          break;
        }
      }
      
      break;
    }
  }
  
  // Store user information in localStorage for future use
  if (typeof localStorage !== 'undefined') {
    if (personalInfo.name) localStorage.setItem('userName', personalInfo.name);
    if (personalInfo.address) localStorage.setItem('userAddress', personalInfo.address);
    if (personalInfo.city) localStorage.setItem('userCity', personalInfo.city);
    if (personalInfo.state) localStorage.setItem('userState', personalInfo.state);
    if (personalInfo.zip) localStorage.setItem('userZip', personalInfo.zip);
  }
  
  return personalInfo;
}

/**
 * Extract late payment dates from credit report text
 */
function extract_late_payment_dates(content: string, accountName: string): string[] {
  // Find the section related to this account
  const accountIndex = content.indexOf(accountName);
  if (accountIndex === -1) return [];
  
  // Extract 500 characters after the account name as the relevant section
  const sectionEnd = Math.min(accountIndex + 500, content.length);
  const accountSection = content.substring(accountIndex, sectionEnd);
  
  // Look for late payment dates
  const datePatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:late|past due|delinquent)/gi,
    /late\s*(?:payment|pay)?(?:\s*(?:of|on|date))?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:30|60|90|120|150|180)\s*days/gi,
    /(\d{1,2}[-\/]\d{4})\s*(?:30|60|90|120|150|180)/gi,
    /(\w{3,9}[\s,-]\d{4})\s*(?:30|60|90|120|150|180)/gi, // Match month/year formats like Jan 2020
  ];
  
  const dates: string[] = [];
  
  for (const pattern of datePatterns) {
    let match;
    while ((match = pattern.exec(accountSection)) !== null) {
      if (match[1]) {
        dates.push(match[1]);
      }
    }
  }
  
  return [...new Set(dates)]; // Remove duplicates
}

/**
 * Get the address for a credit bureau
 */
function get_bureau_address(bureau: string): string {
  const bureauAddresses: Record<string, string> = {
    'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016',
    'All Bureaus': '[BUREAU ADDRESS]',
  };
  
  return bureauAddresses[bureau] || '[BUREAU ADDRESS]';
}
