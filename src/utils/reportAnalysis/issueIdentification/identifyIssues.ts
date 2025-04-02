
import { CreditReportData, CreditReportAccount, CreditReportInquiry, IdentifiedIssue } from '@/utils/creditReport/types';

/**
 * Identifies potential issues in a credit report
 * @param reportData The credit report data to analyze
 * @returns Array of identified issues
 */
export const identifyIssues = (reportData: CreditReportData): IdentifiedIssue[] => {
  const issues: IdentifiedIssue[] = [];
  
  try {
    // Skip analysis if we don't have accounts
    if (!reportData.accounts || reportData.accounts.length === 0) {
      console.warn("No accounts found in report, skipping issue identification");
      return [];
    }
    
    console.log(`Analyzing ${reportData.accounts.length} accounts for issues`);
    
    // Analyze negative accounts
    const negativeAccounts = reportData.accounts.filter(account => account.isNegative === true);
    if (negativeAccounts.length > 0) {
      console.log(`Found ${negativeAccounts.length} negative accounts`);
      
      // Add issues for each negative account
      negativeAccounts.forEach(account => {
        issues.push({
          type: "Negative Account",
          title: `Negative Account: ${account.accountName}`,
          description: `This account is reported as having negative status, which may be lowering your credit score.`,
          impact: "High Impact",
          impactColor: "text-red-500",
          laws: [],
          account: account
        });
      });
    }
    
    // Check for accounts with negative status descriptions
    reportData.accounts.forEach(account => {
      // Safe access to status with multiple fallbacks
      const statusText = account.latestStatus || account.status || account.paymentStatus || '';
      
      if (statusText && containsNegativeTerms(statusText)) {
        const creditorDisplay = account.creditorName || account.creditor || account.accountName;
        
        issues.push({
          type: "Account Status Issue",
          title: `Negative Status: ${account.accountName}`,
          description: `Account with ${creditorDisplay} shows a negative status of "${statusText}" which may be affecting your credit score.`,
          impact: "High Impact",
          impactColor: "text-red-500",
          laws: [],
          account: account
        });
      }
    });
    
    // Identify late payment issues
    reportData.accounts.forEach(account => {
      // Check paymentHistory safely
      const paymentHistory = account.paymentHistory || '';
      
      if (paymentHistory && 
          (paymentHistory.includes('30') || 
           paymentHistory.includes('60') || 
           paymentHistory.includes('90') || 
           paymentHistory.includes('120'))) {
        
        const creditorDisplay = account.creditorName || account.creditor || account.accountName;
        
        issues.push({
          type: "Late Payment",
          title: `Late Payment: ${account.accountName}`,
          description: `Your payment history with ${creditorDisplay} shows late payments which are negatively impacting your credit score.`,
          impact: "High Impact",
          impactColor: "text-red-500",
          laws: [],
          account: account
        });
      }
    });
    
    // Check for accounts with high credit utilization
    reportData.accounts.forEach(account => {
      if (account.creditLimit !== undefined) {
        let creditLimit: number = 0;
        
        // Parse credit limit safely
        if (typeof account.creditLimit === 'string') {
          creditLimit = parseFloat(account.creditLimit.replace(/[$,]/g, ''));
        } else if (typeof account.creditLimit === 'number') {
          creditLimit = account.creditLimit;
        }
          
        let balance = 0;
        // Parse balance safely
        if (typeof account.balance === 'string') {
          balance = parseFloat(account.balance.replace(/[$,]/g, ''));
        } else if (typeof account.balance === 'number') {
          balance = account.balance;
        }
        
        if (!isNaN(creditLimit) && creditLimit > 0 && !isNaN(balance)) {
          const utilization = (balance / creditLimit) * 100;
          
          if (utilization > 30) {
            const creditorDisplay = account.creditorName || account.creditor || account.accountName;
            
            issues.push({
              type: "High Utilization",
              title: `High Credit Utilization: ${account.accountName}`,
              description: `Your credit utilization on this account is ${Math.round(utilization)}%, which is above the recommended 30% threshold.`,
              impact: utilization > 70 ? "Critical Impact" : "Medium Impact",
              impactColor: utilization > 70 ? "text-red-600" : "text-amber-500",
              laws: [],
              account: account
            });
          }
        }
      }
    });
    
    // Check for excessive inquiries
    if (reportData.inquiries && reportData.inquiries.length > 3) {
      // Group inquiries by 12-month periods
      const inquiriesByYear = groupInquiriesByYear(reportData.inquiries);
      
      // Check each year group
      Object.entries(inquiriesByYear).forEach(([year, inquiries]) => {
        if (inquiries.length > 3) {
          issues.push({
            type: "Excessive Inquiries",
            title: "Too Many Recent Credit Inquiries",
            description: `Your report shows ${inquiries.length} credit inquiries in ${year}, which may be negatively impacting your score.`,
            impact: inquiries.length > 6 ? "High Impact" : "Medium Impact",
            impactColor: inquiries.length > 6 ? "text-red-500" : "text-amber-500",
            laws: []
          });
        }
      });
    }
    
    // Check for inquiries without corresponding accounts
    if (reportData.inquiries && reportData.inquiries.length > 0) {
      reportData.inquiries.forEach(inquiry => {
        // Get company name with fallback
        const inquiryCompanyName = inquiry.inquiryCompany || inquiry.inquiryBy || inquiry.creditor || "Unknown Company";
        
        // Check if this is a hard inquiry (assume it is if not specified)
        if (!inquiry.type || inquiry.type.toLowerCase().includes('hard')) {
          // Check if there's a corresponding new account
          const hasMatchingAccount = reportData.accounts.some(account => {
            // Compare by creditor name (loose matching)
            const accountCreditor = (account.creditor || account.accountName || '').toLowerCase();
            const inquiryCreditor = inquiryCompanyName.toLowerCase();
            
            // Check if the inquiry company appears in the account creditor name
            return accountCreditor.includes(inquiryCreditor) || 
                  inquiryCreditor.includes(accountCreditor);
          });
          
          if (!hasMatchingAccount) {
            issues.push({
              type: "Inquiry without Account",
              title: `Inquiry: ${inquiryCompanyName}`,
              description: `There is a credit inquiry from ${inquiryCompanyName} but no corresponding account was opened. This inquiry may be negatively affecting your score without any benefit.`,
              impact: "Medium Impact",
              impactColor: "text-amber-500",
              laws: []
            });
          }
        }
      });
    }
    
    // Check for name variations and inconsistencies
    if (reportData.accounts && reportData.accounts.length > 0) {
      const accountNames = new Set<string>();
      
      // Collect all unique account holder names
      reportData.accounts.forEach(account => {
        if (account.accountHolderName) {
          accountNames.add(account.accountHolderName.toLowerCase().trim());
        }
      });
      
      // If we have multiple names, flag as an issue
      if (accountNames.size > 1) {
        issues.push({
          type: "Name Variation",
          title: "Multiple Name Variations",
          description: `Your credit report contains ${accountNames.size} different name variations. This could lead to incomplete credit history or missed accounts.`,
          impact: "Medium Impact",
          impactColor: "text-amber-500",
          laws: []
        });
      }
    }
    
    // Check personal info for completeness
    if (reportData.personalInfo) {
      const personalInfo = reportData.personalInfo;
      const missingFields = [];
      
      if (!personalInfo.name) missingFields.push("name");
      if (!personalInfo.address) missingFields.push("address");
      if (!personalInfo.ssn) missingFields.push("SSN");
      if (!personalInfo.dob) missingFields.push("date of birth");
      
      if (missingFields.length > 0) {
        issues.push({
          type: "Incomplete Personal Info",
          title: "Missing Personal Information",
          description: `Your credit report is missing important personal information: ${missingFields.join(", ")}. This could affect the completeness of your credit history.`,
          impact: "Medium Impact",
          impactColor: "text-amber-500",
          laws: []
        });
      }
    }
    
    // Check for potential SSN inconsistencies
    if (reportData.accounts && reportData.accounts.length > 0) {
      const ssnVariations = new Set<string>();
      
      reportData.accounts.forEach(account => {
        if (account.ssn && account.ssn.length > 0) {
          ssnVariations.add(account.ssn);
        }
      });
      
      if (ssnVariations.size > 1) {
        issues.push({
          type: "SSN Variation",
          title: "Multiple SSN Variations",
          description: `Your credit report contains ${ssnVariations.size} different SSN variations, which could indicate identity theft or reporting errors.`,
          impact: "Critical Impact",
          impactColor: "text-red-600",
          laws: []
        });
      }
    }
    
    console.log(`Identified ${issues.length} issues in the credit report`);
    
  } catch (error) {
    console.error("Error identifying issues:", error);
  }
  
  return issues;
};

/**
 * Helper to check if a status text contains negative terms
 */
function containsNegativeTerms(text: string): boolean {
  const negativeTerms = [
    'late', 'delinquent', 'collection', 'charge off', 'charged off', 
    'default', 'past due', 'settlement', 'repossession', 'foreclosure',
    'bankruptcy', 'debt', '30', '60', '90', '120'
  ];
  
  const lowerText = text.toLowerCase();
  return negativeTerms.some(term => lowerText.includes(term));
}

/**
 * Group inquiries by year periods
 */
function groupInquiriesByYear(inquiries: CreditReportInquiry[]): Record<string, CreditReportInquiry[]> {
  const grouped: Record<string, CreditReportInquiry[]> = {};
  
  inquiries.forEach(inquiry => {
    try {
      // Try to parse the date
      const inquiryDate = new Date(inquiry.inquiryDate);
      const year = inquiryDate.getFullYear().toString();
      
      if (!grouped[year]) {
        grouped[year] = [];
      }
      
      grouped[year].push(inquiry);
    } catch (e) {
      console.warn("Could not parse inquiry date:", inquiry.inquiryDate);
    }
  });
  
  return grouped;
}
