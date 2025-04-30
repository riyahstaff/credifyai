
import { CreditReportData, CreditReportAccount, CreditReportInquiry, IdentifiedIssue, FCRA_LAWS } from '@/utils/creditReport/types';

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
    
    // Issue #1, #2, #3, #4: Check personal information inconsistencies
    if (reportData.personalInfo) {
      checkPersonalInfoIssues(reportData, issues);
    }
    
    // Issue #5: Check negative accounts for inaccuracies
    checkNegativeAccountIssues(reportData.accounts, issues);
    
    // Issue #6: Check duplicate student loans
    checkDuplicateStudentLoans(reportData.accounts, issues);
    
    // Issue #7: Check for bankruptcy issues
    checkBankruptcyIssues(reportData.accounts, issues);
    
    // Issue #8: Check for outdated inquiries
    if (reportData.inquiries && reportData.inquiries.length > 0) {
      checkOutdatedInquiries(reportData.inquiries, issues);
    }
    
    // Additional checks from existing code
    // Check for accounts with high credit utilization
    checkHighUtilization(reportData.accounts, issues);
    
    // Check for excessive inquiries
    if (reportData.inquiries && reportData.inquiries.length > 3) {
      checkExcessiveInquiries(reportData.inquiries, issues);
    }
    
    console.log(`Identified ${issues.length} issues in the credit report`);
    
  } catch (error) {
    console.error("Error identifying issues:", error);
  }
  
  return issues;
};

/**
 * Check for personal information inconsistencies
 */
function checkPersonalInfoIssues(reportData: CreditReportData, issues: IdentifiedIssue[]): void {
  const personalInfo = reportData.personalInfo;
  
  // Issue #1: Check for multiple names
  if (personalInfo.name && personalInfo.name.includes(',') || 
      (reportData.rawText && reportData.rawText.match(/also known as|a\.k\.a\.|aka/i))) {
    issues.push({
      type: "Personal Information",
      title: "Multiple Names Reported",
      description: "Your credit report shows multiple name variations, which could lead to mixed files or identity issues.",
      impact: "Medium Impact",
      impactColor: "text-amber-500",
      laws: FCRA_LAWS.personalInfo,
      legalReferences: ["15 USC 1681e(b)", "15 USC 1681i(a)(1)"]
    });
  }
  
  // Issue #2: Check for multiple addresses
  // Extract addresses from raw text if available
  const addressCount = reportData.rawText ? 
    (reportData.rawText.match(/address(?:es)?:?.*?(?:\n|$)/gi)?.length || 0) : 0;
  
  if (addressCount > 1 || (reportData.rawText && reportData.rawText.match(/previous address|former address|also reported at/i))) {
    issues.push({
      type: "Personal Information",
      title: "Multiple Addresses Reported",
      description: "Your credit report shows multiple addresses. Only your current address should be listed.",
      impact: "Medium Impact",
      impactColor: "text-amber-500",
      laws: FCRA_LAWS.personalInfo,
      legalReferences: ["15 USC 1681c", "15 USC 1681i(a)(1)"]
    });
  }
  
  // Issue #3: Check for multiple employers
  const employerCount = reportData.rawText ?
    (reportData.rawText.match(/employer(?:s)?:?.*?(?:\n|$)/gi)?.length || 0) : 0;
    
  if (employerCount > 1 || (personalInfo.employer && personalInfo.employer.includes(','))) {
    issues.push({
      type: "Personal Information",
      title: "Multiple Employers Reported",
      description: "Your credit report shows multiple employers. Only your current employer should be listed.",
      impact: "Medium Impact",
      impactColor: "text-amber-500",
      laws: FCRA_LAWS.personalInfo,
      legalReferences: ["15 USC 1681c", "15 USC 1681i(a)(1)"]
    });
  }
  
  // Issue #4: Check for SSN inconsistencies
  if (personalInfo.ssn && 
      (personalInfo.ssn.includes(',') || 
       (reportData.rawText && reportData.rawText.match(/(?:different|multiple|incorrect)\s+(?:ssn|social security)/i)))) {
    issues.push({
      type: "Personal Information",
      title: "SSN Inconsistencies",
      description: "Your credit report shows potential inconsistencies with your Social Security Number, which could indicate identity theft or errors.",
      impact: "Critical Impact",
      impactColor: "text-red-600",
      laws: FCRA_LAWS.personalInfo,
      legalReferences: ["15 USC 1681c", "15 USC 1681i(a)(1)", "18 USC 1028a"]
    });
  }
}

/**
 * Check negative accounts for various inaccuracies
 */
function checkNegativeAccountIssues(accounts: CreditReportAccount[], issues: IdentifiedIssue[]): void {
  accounts.forEach(account => {
    const isNegative = account.isNegative === true || 
                      (account.status && containsNegativeTerms(account.status)) ||
                      (account.paymentStatus && containsNegativeTerms(account.paymentStatus));
                      
    if (isNegative) {
      // Check for various inaccuracies in negative accounts
      const inaccuracies = [];
      
      // Check for missing dates
      if (!account.dateOpened && !account.openDate) {
        inaccuracies.push("Missing open date");
      }
      
      if (!account.dateReported && !account.lastReportedDate) {
        inaccuracies.push("Missing last reported date");
      }
      
      // Check for late payments
      if (account.paymentHistory && 
          (account.paymentHistory.includes('30') || 
           account.paymentHistory.includes('60') || 
           account.paymentHistory.includes('90'))) {
        inaccuracies.push("Late payments reported");
      }
      
      if (inaccuracies.length > 0) {
        issues.push({
          type: "Account Inaccuracy",
          title: `Inaccuracies: ${account.accountName}`,
          description: `This negative account has the following inaccuracies: ${inaccuracies.join(", ")}. These inaccuracies violate the FCRA requirement for accurate reporting.`,
          impact: "High Impact",
          impactColor: "text-red-500",
          account,
          laws: FCRA_LAWS.inaccuracies,
          legalReferences: ["15 USC 1681e(b)", "15 USC 1681i(a)(1)"]
        });
      }
    }
  });
}

/**
 * Check for duplicate student loans
 */
function checkDuplicateStudentLoans(accounts: CreditReportAccount[], issues: IdentifiedIssue[]): void {
  // Group student loan accounts by balance amount
  const studentLoans = accounts.filter(account => {
    const name = (account.accountName || '').toLowerCase();
    return name.includes('student') || 
           name.includes('edu') || 
           name.includes('loan') || 
           name.includes('lend') ||
           name.includes('navient') ||
           name.includes('sallie');
  });
  
  if (studentLoans.length > 1) {
    // Group loans by balance amount to find duplicates
    const loansByBalance: Record<string, CreditReportAccount[]> = {};
    
    studentLoans.forEach(loan => {
      // Normalize balance for comparison
      let balance = '';
      if (typeof loan.balance === 'number') {
        balance = loan.balance.toString();
      } else if (typeof loan.balance === 'string') {
        balance = loan.balance.replace(/[$,]/g, '');
      } else if (typeof loan.currentBalance === 'number') {
        balance = loan.currentBalance.toString();
      } else if (typeof loan.currentBalance === 'string') {
        balance = loan.currentBalance.replace(/[$,]/g, '');
      }
      
      if (balance) {
        if (!loansByBalance[balance]) {
          loansByBalance[balance] = [];
        }
        loansByBalance[balance].push(loan);
      }
    });
    
    // Check for duplicates with the same balance
    Object.entries(loansByBalance).forEach(([balance, loans]) => {
      if (loans.length > 1) {
        const account = loans[0]; // Use the first loan as the reference
        issues.push({
          type: "Duplicate Student Loan",
          title: `Duplicate Student Loans: ${account.accountName}`,
          description: `Multiple student loans with identical balance of $${balance} may indicate duplicate reporting. When loans are sold or transferred, only the current servicer should report.`,
          impact: "High Impact",
          impactColor: "text-red-500",
          account,
          laws: FCRA_LAWS.studentLoans,
          legalReferences: ["15 USC 1681s-2(a)(1)", "15 USC 1681e(b)"]
        });
      }
    });
  }
}

/**
 * Check for bankruptcy issues
 */
function checkBankruptcyIssues(accounts: CreditReportAccount[], issues: IdentifiedIssue[]): void {
  // Check for bankruptcy mentions in account details
  const bankruptcyAccounts = accounts.filter(account => {
    const name = (account.accountName || '').toLowerCase();
    const status = (account.status || account.paymentStatus || '').toLowerCase();
    const remarks = account.remarks ? account.remarks.join(' ').toLowerCase() : '';
    
    return name.includes('bankruptcy') || 
           status.includes('bankruptcy') || 
           remarks.includes('bankruptcy') || 
           remarks.includes('chapter 7') || 
           remarks.includes('chapter 13');
  });
  
  if (bankruptcyAccounts.length > 0) {
    const account = bankruptcyAccounts[0];
    
    // Check if bankruptcy is potentially outdated (Chapter 7 stays for 10 years, Chapter 13 for 7 years)
    const dateString = account.dateOpened || account.openDate || account.dateReported || account.lastReportedDate;
    let isOutdated = false;
    
    if (dateString) {
      try {
        const reportDate = new Date(dateString);
        const today = new Date();
        const yearsAgo = (today.getFullYear() - reportDate.getFullYear());
        
        // Check if bankruptcy might be outdated
        // For Chapter 13, check if > 7 years
        // For Chapter 7, check if > 10 years
        if ((account.remarks && account.remarks.join(' ').toLowerCase().includes('chapter 13') && yearsAgo > 7) ||
            (account.remarks && account.remarks.join(' ').toLowerCase().includes('chapter 7') && yearsAgo > 10) ||
            (yearsAgo > 10)) { // Default to 10 years if chapter not specified
          isOutdated = true;
        }
      } catch (e) {
        console.error("Error parsing bankruptcy date:", e);
      }
    }
    
    issues.push({
      type: "Bankruptcy Reporting",
      title: `Bankruptcy: ${account.accountName}`,
      description: isOutdated ? 
        "This bankruptcy may be outdated and should be removed from your credit report per the FCRA time limits." :
        "This bankruptcy record requires verification as bankruptcy reporting is subject to strict legal requirements.",
      impact: "High Impact",
      impactColor: "text-red-500",
      account,
      laws: FCRA_LAWS.bankruptcy,
      legalReferences: ["15 USC 1681c(a)(1)", "15 USC 1681i(a)(1)"]
    });
  }
}

/**
 * Check for outdated inquiries
 */
function checkOutdatedInquiries(inquiries: CreditReportInquiry[], issues: IdentifiedIssue[]): void {
  const outdatedInquiries = inquiries.filter(inquiry => {
    if (!inquiry.inquiryDate) return false;
    
    try {
      const inquiryDate = new Date(inquiry.inquiryDate);
      const today = new Date();
      const monthsAgo = (today.getFullYear() - inquiryDate.getFullYear()) * 12 + 
                       (today.getMonth() - inquiryDate.getMonth());
      
      // Check if inquiry is older than 24 months (2 years)
      return monthsAgo >= 24;
    } catch (e) {
      console.error("Error parsing inquiry date:", e);
      return false;
    }
  });
  
  if (outdatedInquiries.length > 0) {
    issues.push({
      type: "Outdated Inquiries",
      title: "Outdated Inquiries",
      description: `Your credit report contains ${outdatedInquiries.length} inquiries that are over 2 years old and should be removed per the FCRA guidelines.`,
      impact: "Medium Impact",
      impactColor: "text-amber-500",
      laws: FCRA_LAWS.inquiries,
      legalReferences: ["15 USC 1681b", "15 USC 1681c"]
    });
  }
}

/**
 * Check for high utilization accounts
 */
function checkHighUtilization(accounts: CreditReportAccount[], issues: IdentifiedIssue[]): void {
  accounts.forEach(account => {
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
            laws: ["Metro 2® Compliance Guidelines", "15 USC 1681e(b)"],
            account
          });
        }
      }
    }
  });
}

/**
 * Check for excessive inquiries
 */
function checkExcessiveInquiries(inquiries: CreditReportInquiry[], issues: IdentifiedIssue[]): void {
  // Group inquiries by year periods
  const grouped = groupInquiriesByYear(inquiries);
  
  // Check each year group
  Object.entries(grouped).forEach(([year, yearInquiries]) => {
    if (yearInquiries.length > 3) {
      issues.push({
        type: "Excessive Inquiries",
        title: "Too Many Recent Credit Inquiries",
        description: `Your report shows ${yearInquiries.length} credit inquiries in ${year}, which may be negatively impacting your score.`,
        impact: yearInquiries.length > 6 ? "High Impact" : "Medium Impact",
        impactColor: yearInquiries.length > 6 ? "text-red-500" : "text-amber-500",
        laws: FCRA_LAWS.inquiries,
        legalReferences: ["15 USC 1681b(a)(2)", "15 USC 1681m"]
      });
    }
  });
}

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
