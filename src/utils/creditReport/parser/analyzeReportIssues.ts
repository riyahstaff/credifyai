import { CreditReportData, Issue, PersonalInfo } from '@/utils/creditReport/types';

/**
 * Analyze credit report for specific disputable issues
 */
export function analyzeReportForIssues(reportData: CreditReportData): Issue[] {
  const issues: Issue[] = [];
  const bureau = reportData.primaryBureau || 'Unknown';
  
  // Check for personal information issues
  if (reportData.personalInfo) {
    analyzePersonalInfo(reportData.personalInfo, issues, bureau);
  }

  // Check for account issues
  if (reportData.accounts && reportData.accounts.length > 0) {
    analyzeAccounts(reportData.accounts, issues, bureau, reportData);
  }
  
  // Check for inquiries
  if (reportData.inquiries && reportData.inquiries.length > 0) {
    analyzeInquiries(reportData.inquiries, issues, bureau);
  }

  console.log(`Found ${issues.length} disputable issues in credit report`);
  
  return issues;
}

/**
 * Analyze personal information issues
 */
function analyzePersonalInfo(personalInfo: PersonalInfo, issues: Issue[], bureau: string) {
  // Issue #1: Multiple names
  if (personalInfo.name && personalInfo.name.includes(',')) {
    const names = personalInfo.name.split(',').map(n => n.trim()).filter(Boolean);
    if (names.length > 1) {
      issues.push({
        id: `personal_info_multiple_names_${Date.now()}`,
        type: 'personal_info',
        description: `Multiple names found on credit report: ${names.join(', ')}`,
        bureau,
        severity: 'medium',
        reason: 'Credit report contains multiple name variations that may be incorrect',
        legalBasis: '15 USC 1681c, 15 USC 1681g', // Use as string instead of array
      });
      
      console.log("Issue detected: Multiple names");
    }
  }
  
  // Issue #2: Multiple addresses
  if (personalInfo.address && personalInfo.address.includes(',')) {
    const addresses = personalInfo.address.split(',').map(a => a.trim()).filter(Boolean);
    if (addresses.length > 1) {
      issues.push({
        id: `personal_info_multiple_addresses_${Date.now()}`,
        type: 'personal_info',
        description: `Multiple addresses found on credit report: ${addresses.join('; ')}`,
        bureau,
        severity: 'medium',
        reason: 'Credit report contains outdated or incorrect addresses',
        legalBasis: '15 USC 1681c, 15 USC 1681g', // Use as string instead of array
      });
      
      console.log("Issue detected: Multiple addresses");
    }
  }
  
  // Issue #3: Multiple employers
  if (personalInfo.employer && personalInfo.employer.includes(',')) {
    const employers = personalInfo.employer.split(',').map(e => e.trim()).filter(Boolean);
    if (employers.length > 1) {
      issues.push({
        id: `personal_info_multiple_employers_${Date.now()}`,
        type: 'personal_info',
        description: `Multiple employers found on credit report: ${employers.join(', ')}`,
        bureau,
        severity: 'medium',
        reason: 'Credit report contains outdated or incorrect employment information',
        legalBasis: '15 USC 1681c, 15 USC 1681g', // Use as string instead of array
      });
      
      console.log("Issue detected: Multiple employers");
    }
  }
  
  // Issue #4: SSN discrepancies
  if (personalInfo.ssn) {
    // Check for multiple SSNs or invalid format
    if (personalInfo.ssn.includes(',') || 
       (personalInfo.ssn.replace(/[^0-9]/g, '').length !== 9 && personalInfo.ssn.length > 4)) {
      issues.push({
        id: `personal_info_ssn_issue_${Date.now()}`,
        type: 'personal_info',
        description: 'Social Security Number discrepancy found on credit report',
        bureau,
        severity: 'high',
        reason: 'Credit report contains incorrect or multiple Social Security Numbers',
        legalBasis: '15 USC 1681c, 15 USC 1681g, 18 USC 1028a', // Use as string instead of array
      });
      
      console.log("Issue detected: SSN discrepancy");
    }
  }
}

/**
 * Analyze account issues
 */
function analyzeAccounts(accounts, issues, bureau, reportData) {
  // Find potential duplicate student loans
  const studentLoans = accounts.filter(account => {
    const name = (account.accountName || '').toLowerCase();
    return name.includes('loan') || 
           name.includes('dept of ed') || 
           name.includes('navient') || 
           name.includes('sallie') ||
           name.includes('student');
  });
  
  // Check for duplicate student loans (Issue #6)
  checkDuplicateStudentLoans(studentLoans, issues, bureau);
  
  // Check for bankruptcy issues (Issue #7)
  const bankruptcyAccounts = accounts.filter(account => {
    const name = (account.accountName || '').toLowerCase();
    const status = (account.status || '').toLowerCase();
    return name.includes('bankrupt') || status.includes('bankrupt');
  });
  
  if (bankruptcyAccounts.length > 0) {
    checkBankruptcyIssues(bankruptcyAccounts, issues, bureau);
  }
  
  // Check for negative accounts with inaccuracies (Issue #5)
  accounts.forEach(account => {
    checkAccountInaccuracies(account, issues, bureau, reportData);
  });
}

/**
 * Check for duplicate student loans
 */
function checkDuplicateStudentLoans(studentLoans, issues, bureau) {
  // Group by balance to find potential duplicates
  const loansByBalance = {};
  
  studentLoans.forEach(loan => {
    const balance = parseFloat(loan.balance || loan.currentBalance || '0');
    if (!isNaN(balance) && balance > 0) {
      // Round to nearest dollar to allow for minor differences
      const roundedBalance = Math.round(balance);
      
      if (!loansByBalance[roundedBalance]) {
        loansByBalance[roundedBalance] = [];
      }
      
      loansByBalance[roundedBalance].push(loan);
    }
  });
  
  // Check for balances with multiple loans
  Object.entries(loansByBalance).forEach(([balance, loans]) => {
    if (Array.isArray(loans) && loans.length > 1) {
      // These could be duplicates
      const loanNames = loans.map(l => l.accountName).join(', ');
      
      issues.push({
        id: `duplicate_student_loans_${balance}_${Date.now()}`,
        type: 'student_loan',
        description: `Potential duplicate student loans with similar balances: ${loanNames}`,
        bureau,
        severity: 'high',
        accountName: loans[0].accountName,
        accountNumber: loans[0].accountNumber,
        reason: 'Multiple student loans with identical balances may indicate duplicate reporting',
        legalBasis: '15 USC 1681e(b), 15 USC 1681i', // Use as string instead of array
      });
      
      console.log("Issue detected: Duplicate student loans");
    }
  });
}

/**
 * Check for bankruptcy issues
 */
function checkBankruptcyIssues(bankruptcyAccounts, issues, bureau) {
  bankruptcyAccounts.forEach(account => {
    // Check if bankruptcy is outdated (over 7-10 years)
    const bankruptcyDate = account.openDate || account.dateReported || '';
    if (bankruptcyDate) {
      const bankruptcyYear = new Date(bankruptcyDate).getFullYear();
      const currentYear = new Date().getFullYear();
      
      if ((currentYear - bankruptcyYear) > 7) {
        issues.push({
          id: `bankruptcy_outdated_${account.accountNumber}_${Date.now()}`,
          type: 'bankruptcy',
          description: `Potentially outdated bankruptcy from ${bankruptcyYear} still showing on report`,
          bureau,
          severity: 'high',
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          reason: 'Bankruptcy information may be beyond the legal reporting period',
          legalBasis: '15 USC 1681c, 15 USC 1681i', // Use as string instead of array
        });
        
        console.log("Issue detected: Outdated bankruptcy");
      }
    }
  });
}

/**
 * Check for account inaccuracies
 */
function checkAccountInaccuracies(account, issues, bureau, reportData) {
  // Check for late payments
  if (account.paymentStatus?.toLowerCase().includes('late') || 
      (account.remarks && account.remarks.some(r => r.toLowerCase().includes('late')))) {
    
    issues.push({
      id: `late_payment_${account.accountNumber}_${Date.now()}`,
      type: 'late_payment',
      description: `Late payment reported on account: ${account.accountName}`,
      bureau,
      severity: 'high',
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      reason: 'Late payment may be reported inaccurately',
      legalBasis: '15 USC 1681s-2(a)(3), 15 USC 1681e(b)', // Use as string instead of array
    });
    
    console.log("Issue detected: Late payment");
  }
  
  // Check for collection accounts
  if (account.accountType?.toLowerCase().includes('collection') || 
      account.accountName?.toLowerCase().includes('collection')) {
    
    issues.push({
      id: `collection_${account.accountNumber}_${Date.now()}`,
      type: 'collection',
      description: `Collection account reported: ${account.accountName}`,
      bureau,
      severity: 'high',
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      reason: 'Collection account may be unverifiable or inaccurate',
      legalBasis: '15 USC 1692c, 15 USC 1681s-2(a)(3), 15 USC 1681e(b)', // Use as string instead of array
    });
    
    console.log("Issue detected: Collection account");
  }
  
  // Check for missing or inconsistent dates
  if (!account.openDate || !account.lastReportedDate) {
    issues.push({
      id: `missing_dates_${account.accountNumber}_${Date.now()}`,
      type: 'inaccuracy',
      description: `Missing critical dates on account: ${account.accountName}`,
      bureau,
      severity: 'medium',
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      reason: 'Account is missing required date information',
      legalBasis: '15 USC 1681e(b), 15 USC 1681i', // Use as string instead of array
    });
    
    console.log("Issue detected: Missing dates");
  }
}

/**
 * Analyze inquiries
 */
function analyzeInquiries(inquiries, issues, bureau) {
  // Issue #8: Old inquiries
  inquiries.forEach(inquiry => {
    if (inquiry.inquiryDate) {
      const inquiryDate = new Date(inquiry.inquiryDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (inquiryDate < oneYearAgo) {
        issues.push({
          id: `old_inquiry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: 'inquiry',
          description: `Outdated inquiry from ${inquiry.inquiryBy || inquiry.creditor || 'unknown creditor'} on ${inquiry.inquiryDate}`,
          bureau,
          severity: 'medium',
          reason: 'Inquiry is over 1 year old and may need to be removed',
          legalBasis: '15 USC 1681b(a)(2), 15 USC 1681m', // Use as string instead of array
        });
        
        console.log("Issue detected: Old inquiry");
      }
    }
  });
}
