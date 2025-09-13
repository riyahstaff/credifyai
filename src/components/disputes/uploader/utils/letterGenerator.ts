
import { CreditReportAccount, CreditReportData, IdentifiedIssue } from "@/utils/creditReport/types";
import { generateComprehensiveDisputeLetter } from "@/utils/creditReport/disputeLetters/comprehensiveLetterGenerator";
import { getApplicableLaws } from "@/utils/creditReport/fcraCompliance/fcraLaws";
import { createFallbackLetter } from "../handlers/fallbackLetterCreator";

/**
 * Generates dispute letters based on identified issues in a credit report
 */
export const generateDisputeLetters = async (
  issues: IdentifiedIssue[],
  reportData: CreditReportData
): Promise<any[]> => {
  console.log(`Generating dispute letters for ${issues.length} issues with report data`);

  try {
    // Get user information from localStorage
    const userInfo = getUserInfoFromStorage();
    console.log("User info retrieved:", userInfo.name);
    
    // Group issues by type and bureau for letter generation
    const issueGroups = groupIssuesByTypeAndBureau(issues, reportData);
    console.log("Grouped issues for letter generation:", issueGroups);
    
    const generatedLetters = [];
    
    // Generate comprehensive letters for each issue group
    for (const group of issueGroups) {
      try {
        console.log(`Generating comprehensive letter for ${group.type} issues (${group.issues.length} issues) for ${group.bureau}`);
        
        // Use the comprehensive letter generator
        const comprehensiveLetter = generateComprehensiveDisputeLetter(
          {
            type: group.type,
            description: group.description,
            bureau: group.bureau,
            severity: 'high' as 'high' | 'medium' | 'low'
          },
          group.primaryAccount,
          userInfo,
          group.bureau
        );
        
        generatedLetters.push(comprehensiveLetter);
        console.log(`Successfully generated comprehensive ${group.type} letter`);
      } catch (error) {
        console.error(`Error generating comprehensive letter for ${group.type}:`, error);
      }
    }
    
    if (generatedLetters.length > 0) {
      console.log(`Successfully generated ${generatedLetters.length} comprehensive dispute letters`);
      return generatedLetters;
    } else {
      console.warn("No comprehensive letters were generated, creating enhanced fallback letters");
      return generateEnhancedFallbackLetters(reportData);
    }
  } catch (error) {
    console.error("Error in comprehensive letter generation:", error);
    return generateEnhancedFallbackLetters(reportData);
  }
};

/**
 * Get user information from storage
 */
function getUserInfoFromStorage(): { name: string; address?: string; city?: string; state?: string; zip?: string; } {
  try {
    console.log("Getting user info from storage");
    
    // Get user info from report data FIRST - this is the most reliable source
    const reportData = sessionStorage.getItem('creditReportData');
    if (reportData) {
      try {
        const parsedReport = JSON.parse(reportData);
        if (parsedReport.personalInfo) {
          const pi = parsedReport.personalInfo;
          console.log("Using personal info from report data:", pi);
          
          // Only return if we have a valid name (not empty or placeholder)
          if (pi.name && pi.name.trim() && !pi.name.includes('[') && !pi.name.includes('YOUR')) {
            return {
              name: pi.name,
              address: pi.address || '',
              city: pi.city || '',
              state: pi.state || '',
              zip: pi.zip || ''
            };
          }
        }
      } catch (e) {
        console.error("Error parsing report data:", e);
      }
    }
    
    // Fallback to other storage options
    let userName = localStorage.getItem('userName') || 
                  sessionStorage.getItem('userName') ||
                  JSON.parse(localStorage.getItem('userProfile') || '{}')?.full_name ||
                  '';
                  
    console.log("User name retrieved for letter:", userName);
    
    if (!userName) {
      // Try to get the profile from session storage as a last resort
      try {
        const profile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        if (profile && profile.full_name) {
          userName = profile.full_name;
          console.log("Retrieved user name from session profile:", userName);
        }
      } catch (e) {
        console.error("Error parsing user profile from session:", e);
      }
    }
    
    // Get address info
    const address = localStorage.getItem('userAddress') || sessionStorage.getItem('userAddress');
    const city = localStorage.getItem('userCity') || sessionStorage.getItem('userCity');
    const state = localStorage.getItem('userState') || sessionStorage.getItem('userState');
    const zip = localStorage.getItem('userZip') || sessionStorage.getItem('userZip');
    
    return {
      name: userName || '',
      address,
      city,
      state,
      zip
    };
  } catch (error) {
    console.error("Error getting user info from storage:", error);
    return { name: '' };
  }
}

/**
 * Group issues by type and bureau for comprehensive letter generation
 */
function groupIssuesByTypeAndBureau(issues: IdentifiedIssue[], reportData: CreditReportData) {
  const groups: Array<{
    type: string;
    bureau: string;
    issues: IdentifiedIssue[];
    accounts: CreditReportAccount[];
    primaryAccount: CreditReportAccount;
    description: string;
  }> = [];

  // Define common issue types with their descriptions
  const issueTypeDescriptions: Record<string, string> = {
    'late_payment': 'Inaccurate late payment reporting',
    'collection': 'Unverified collection account',
    'inquiry': 'Unauthorized credit inquiry',
    'balance_error': 'Incorrect balance reporting',
    'account_status': 'Inaccurate account status',
    'personal_info': 'Incorrect personal information',
    'charge_off': 'Inaccurate charge-off status',
    'identity_theft': 'Fraudulent account or identity theft',
    'duplicate_account': 'Duplicate account reporting'
  };

  // Group issues by type
  const typeGroups = issues.reduce((acc, issue) => {
    const key = issue.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, IdentifiedIssue[]>);

  // Create letter groups for each issue type
  Object.entries(typeGroups).forEach(([type, typeIssues]) => {
    const bureau = typeIssues[0]?.bureau || reportData.primaryBureau || 'Experian';
    const accounts = typeIssues.map(issue => issue.account).filter(Boolean) as CreditReportAccount[];
    
    // Use the first account as primary, or get from report data
    const primaryAccount = accounts[0] || (reportData.accounts && reportData.accounts.length > 0 ? reportData.accounts[0] : {
      accountName: 'Credit Report Account',
      accountNumber: '',
      creditor: '',
      balance: '',
      status: ''
    });

    groups.push({
      type,
      bureau,
      issues: typeIssues,
      accounts,
      primaryAccount,
      description: issueTypeDescriptions[type] || 'Credit report inaccuracy'
    });
  });

  return groups;
}

/**
 * Generate enhanced fallback letters when no issues are detected
 */
function generateEnhancedFallbackLetters(reportData: CreditReportData): any[] {
  const userInfo = getUserInfoFromStorage();
  const letters = [];

  // Generate multiple types of dispute letters based on common issues
  const commonIssueTypes = [
    { type: 'late_payment', description: 'Inaccurate payment history' },
    { type: 'inquiry', description: 'Unauthorized credit inquiries' },
    { type: 'personal_info', description: 'Incorrect personal information' },
    { type: 'account_status', description: 'Inaccurate account status reporting' }
  ];

  for (const issueType of commonIssueTypes) {
    try {
      const primaryAccount = reportData.accounts && reportData.accounts.length > 0 ? 
        reportData.accounts[0] : {
          accountName: 'Credit Report Account',
          accountNumber: '',
          creditor: '',
          balance: '',
          status: ''
        };

      const letter = generateComprehensiveDisputeLetter(
        {
          type: issueType.type,
          description: issueType.description,
          bureau: reportData.primaryBureau || 'Experian',
          severity: 'high' as 'high' | 'medium' | 'low'
        },
        primaryAccount,
        userInfo,
        reportData.primaryBureau || 'Experian'
      );

      letters.push(letter);
    } catch (error) {
      console.error(`Error generating fallback letter for ${issueType.type}:`, error);
    }
  }

  return letters.length > 0 ? letters : [createFallbackLetter(reportData)];
}

/**
 * Create a generic dispute letter when no specific issues are found
 * This enhanced version extracts more details from the report data
 */
export async function createGenericLetterWithDetails(reportData: CreditReportData): Promise<any> {
  return generateEnhancedFallbackLetters(reportData)[0];
}
