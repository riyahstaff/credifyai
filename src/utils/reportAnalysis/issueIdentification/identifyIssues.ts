
import { CreditReportData, CreditReportAccount } from '@/utils/creditReport/types';

// FCRA Laws reference for different dispute types
const FCRA_LAWS = {
  latePayments: ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)'],
  collections: ['15 USC 1692c', '15 USC 1681s-2(a)(3)'],
  inaccuracies: ['15 USC 1681e(b)', '15 USC 1681i'],
  inquiries: ['15 USC 1681b(a)(2)', '15 USC 1681m'],
  personalInfo: ['15 USC 1681c', '15 USC 1681g'],
  metro2: ['Metro 2® Compliance Guidelines'],
  consumerRights: ['12 CFR 1026.13', '18 USC 1028a']
};

interface IdentifiedIssue {
  type: string;
  title: string;
  description: string;
  impact: "High Impact" | "Critical Impact" | "Medium Impact";
  impactColor: string;
  account?: CreditReportAccount;
  laws: string[];
}

/**
 * Identify issues in a credit report for dispute generation
 */
export const identifyIssues = (reportData: CreditReportData): IdentifiedIssue[] => {
  if (!reportData) {
    console.error("No report data provided to identifyIssues");
    return [];
  }

  const issues: IdentifiedIssue[] = [];
  
  // Issue #1: Multiple names in personal information
  if (reportData.personalInfo?.name) {
    const nameText = reportData.rawText?.toLowerCase() || '';
    const nameVariants = extractNameVariants(nameText, reportData.personalInfo.name);
    
    if (nameVariants.length > 1) {
      issues.push({
        type: 'Personal Info',
        title: 'Multiple Names Listed',
        description: `Your credit report contains multiple variations of your name: ${nameVariants.join(', ')}. This may indicate errors in reporting.`,
        impact: "Medium Impact",
        impactColor: 'text-amber-500',
        laws: FCRA_LAWS.personalInfo
      });
    }
  }
  
  // Issue #2: Multiple addresses in personal information
  if (reportData.personalInfo?.address) {
    const addressText = reportData.rawText?.toLowerCase() || '';
    const addressVariants = extractAddressVariants(addressText);
    
    if (addressVariants.length > 1) {
      issues.push({
        type: 'Personal Info',
        title: 'Multiple Addresses Listed',
        description: `Your credit report shows multiple addresses. Addresses other than your current one should be removed.`,
        impact: "Medium Impact",
        impactColor: 'text-amber-500',
        laws: FCRA_LAWS.personalInfo
      });
    }
  }
  
  // Issue #3: Multiple employers listed
  const employerVariants = extractEmployerVariants(reportData.rawText || '');
  if (employerVariants.length > 1) {
    issues.push({
      type: 'Personal Info',
      title: 'Multiple Employers Listed',
      description: `Your credit report lists multiple employers: ${employerVariants.join(', ')}. Outdated employer information should be removed.`,
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: FCRA_LAWS.personalInfo
    });
  }
  
  // Issue #4: Social Security Number issues
  if (reportData.personalInfo?.ssn) {
    const ssnText = reportData.rawText?.toLowerCase() || '';
    const ssnVariants = extractSSNVariants(ssnText);
    
    if (ssnVariants.length > 1) {
      issues.push({
        type: 'Personal Info',
        title: 'Multiple SSNs Listed',
        description: `Your credit report contains multiple Social Security Numbers. This is a serious error that requires immediate correction.`,
        impact: "Critical Impact",
        impactColor: 'text-red-600',
        laws: [...FCRA_LAWS.personalInfo, '18 USC 1028a']
      });
    }
  }
  
  // Issue #5: Check each negative account for inaccuracies
  reportData.accounts.forEach(account => {
    if (account.isNegative) {
      // Check for missing dates
      if (!account.dateOpened && !account.openDate) {
        issues.push({
          type: 'Account Error',
          title: `Missing Open Date: ${account.accountName}`,
          description: `This account is missing the date it was opened, which violates credit reporting requirements.`,
          impact: "High Impact",
          impactColor: 'text-red-500',
          account: account,
          laws: FCRA_LAWS.inaccuracies
        });
      }
      
      // Check for late payments
      if (account.paymentStatus && /late|past due|delinquent/i.test(account.paymentStatus)) {
        issues.push({
          type: 'Late Payment',
          title: `Late Payment Reporting: ${account.accountName}`,
          description: `This account shows late payments that may be inaccurate and should be verified.`,
          impact: "High Impact",
          impactColor: 'text-red-500',
          account: account,
          laws: FCRA_LAWS.latePayments
        });
      }
    }
  });
  
  // Issue #6: Check for duplicate student loans
  const studentLoanMap = new Map<string, CreditReportAccount[]>();
  reportData.accounts.forEach(account => {
    if (/student|loan|education|dept\.? of ed/i.test(account.accountName || '')) {
      const balance = account.balance?.toString() || account.currentBalance?.toString() || '';
      if (balance) {
        if (!studentLoanMap.has(balance)) {
          studentLoanMap.set(balance, []);
        }
        studentLoanMap.get(balance)?.push(account);
      }
    }
  });
  
  // Check for duplicate loan amounts
  studentLoanMap.forEach((accounts, balance) => {
    if (accounts.length > 1) {
      accounts.forEach(account => {
        issues.push({
          type: 'Duplicate Account',
          title: `Possible Duplicate Student Loan: ${account.accountName}`,
          description: `This student loan appears to be a duplicate with the same balance as another loan. This may indicate the loan was sold and is being reported multiple times.`,
          impact: "High Impact",
          impactColor: 'text-red-500',
          account: account,
          laws: FCRA_LAWS.inaccuracies
        });
      });
    }
  });
  
  // Issue #7: Bankruptcy reporting
  const hasBankruptcy = reportData.publicRecords.some(record => 
    /bankruptcy|chapter 7|chapter 13/i.test(record.type || '')
  );
  
  if (hasBankruptcy) {
    issues.push({
      type: 'Public Record',
      title: 'Bankruptcy Reporting',
      description: 'Your credit report shows bankruptcy records. Check if they should still be reported based on applicable laws and timelines.',
      impact: "Critical Impact",
      impactColor: 'text-red-600',
      laws: ['15 USC 1681c', '15 USC 1681i']
    });
  }
  
  // Issue #8: Old inquiries over 2 years old
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  reportData.inquiries.forEach(inquiry => {
    if (inquiry.inquiryDate) {
      const inquiryDate = new Date(inquiry.inquiryDate);
      if (inquiryDate < twoYearsAgo) {
        issues.push({
          type: 'Inquiry',
          title: `Outdated Inquiry: ${inquiry.inquiryBy}`,
          description: `This inquiry from ${inquiry.inquiryDate} is over two years old and should no longer appear on your credit report.`,
          impact: "Medium Impact",
          impactColor: 'text-amber-500',
          laws: FCRA_LAWS.inquiries
        });
      }
    }
  });

  return issues;
};

// Helper function to extract name variants from credit report text
function extractNameVariants(text: string, primaryName: string): string[] {
  const nameVariants = new Set<string>();
  
  // Add the primary name
  nameVariants.add(primaryName);
  
  // Look for name patterns in the text
  const nameSection = text.match(/name\s*:([^\n]+)|name\s+variation|name\s+alias|also known as|aka/i);
  
  if (nameSection) {
    const nameSectionText = nameSection[0];
    const possibleNames = nameSectionText.split(/[,;:|]/);
    
    possibleNames.forEach(name => {
      const cleanName = name.replace(/name\s*:|also known as|aka/ig, '').trim();
      if (cleanName.length > 3 && cleanName !== primaryName) {
        nameVariants.add(cleanName);
      }
    });
  }
  
  return Array.from(nameVariants);
}

// Helper function to extract address variants
function extractAddressVariants(text: string): string[] {
  const addressVariants = new Set<string>();
  
  // Find address sections
  const addressMatches = text.match(/address\s*:([^\n]+)|current address|previous address|former address/gi);
  
  if (addressMatches) {
    addressMatches.forEach(addressMatch => {
      const addresses = addressMatch.split(/[,;:|]/);
      
      addresses.forEach(address => {
        const cleanAddress = address.replace(/address\s*:|current|previous|former/ig, '').trim();
        if (cleanAddress.length > 5 && /\d/.test(cleanAddress)) {
          addressVariants.add(cleanAddress);
        }
      });
    });
  }
  
  return Array.from(addressVariants);
}

// Helper function to extract employer variants
function extractEmployerVariants(text: string): string[] {
  const employerVariants = new Set<string>();
  
  // Find employer sections
  const employerMatches = text.match(/employer\s*:([^\n]+)|employment|employed by|employed at|works? at|works? for/gi);
  
  if (employerMatches) {
    employerMatches.forEach(employerMatch => {
      const employers = employerMatch.split(/[,;:|]/);
      
      employers.forEach(employer => {
        const cleanEmployer = employer.replace(/employer\s*:|employment|employed by|employed at|works? at|works? for/ig, '').trim();
        if (cleanEmployer.length > 3) {
          employerVariants.add(cleanEmployer);
        }
      });
    });
  }
  
  return Array.from(employerVariants);
}

// Helper function to extract SSN variants
function extractSSNVariants(text: string): string[] {
  const ssnVariants = new Set<string>();
  
  // Find SSN patterns (xxx-xx-xxxx or partial matches)
  const ssnMatches = text.match(/ssn\s*:([^\n]+)|social security number|xxx-xx-\d{4}|\d{3}-\d{2}-\d{4}|\d{9}/gi);
  
  if (ssnMatches) {
    ssnMatches.forEach(ssnMatch => {
      const ssns = ssnMatch.split(/[,;:|]/);
      
      ssns.forEach(ssn => {
        const cleanSSN = ssn.replace(/ssn\s*:|social security number/ig, '').trim();
        if (/xxx-xx-\d{4}|\d{3}-\d{2}-\d{4}|\d{9}/.test(cleanSSN)) {
          ssnVariants.add(cleanSSN);
        }
      });
    });
  }
  
  return Array.from(ssnVariants);
}
