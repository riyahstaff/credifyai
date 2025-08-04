
import { CreditReportData, Issue, LegalReference } from '@/utils/creditReport/types';

/**
 * Analyze a credit report for issues
 * This function scans the report data and identifies potential issues
 */
export function analyzeReportForIssues(reportData: CreditReportData): Issue[] {
  console.log("Analyzing credit report for issues");
  
  if (!reportData) {
    console.error("No report data provided to analyzer");
    return [];
  }
  
  const issues: Issue[] = [];
  
  try {
    // Check for accounts data
    if (reportData.accounts && reportData.accounts.length > 0) {
      console.log(`Analyzing ${reportData.accounts.length} accounts`);
      
      // Analyze each account for comprehensive issue detection
      reportData.accounts.forEach(account => {
        const status = (account.status || account.paymentStatus || '').toLowerCase();
        const accountName = account.accountName || 'Unknown Account';
        
        // Check for late payments
        if (status.includes('late') || status.includes('past due') || status.includes('delinq')) {
          issues.push({
            id: `late-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'late_payment',
            description: `Late payment reported on account: ${accountName}`,
            severity: 'high',
            accountName: accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681s-2(a)(3)", "15 USC 1681e(b)"] as unknown as LegalReference[]
          });
        }
        
        // Check for collection accounts
        if (account.accountType?.toLowerCase().includes('collection') ||
            accountName.toLowerCase().includes('collection') ||
            status.includes('collection')) {
          issues.push({
            id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'collection_account',
            description: `Collection account reported: ${accountName}`,
            severity: 'high',
            accountName: accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1692g", "15 USC 1681i"] as unknown as LegalReference[]
          });
        }
        
        // Check for charge-offs
        if (status.includes('charge') || status.includes('charged off') || status.includes('chargeoff')) {
          issues.push({
            id: `charge-off-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'charge_off',
            description: `Charge-off status reported on account: ${accountName}`,
            severity: 'high',
            accountName: accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681s-2(a)(3)", "15 USC 1681e(b)"] as unknown as LegalReference[]
          });
        }
        
        // Check for incorrect balances (zero balance but showing amount)
        if (account.currentBalance && parseFloat(account.currentBalance.toString()) > 0 && 
            (status.includes('paid') || status.includes('closed'))) {
          issues.push({
            id: `balance-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'balance_error',
            description: `Incorrect balance reported for paid account: ${accountName}`,
            severity: 'medium',
            accountName: accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681s-2(a)(1)", "15 USC 1681e(b)"] as unknown as LegalReference[]
          });
        }
        
        // Check for accounts that might not belong to the user (generic check)
        if (accountName.length < 3 || accountName.toLowerCase().includes('unknown')) {
          issues.push({
            id: `unknown-account-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'not_my_account',
            description: `Potentially unrecognized account: ${accountName}`,
            severity: 'medium',
            accountName: accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681i", "15 USC 1681e(b)"] as unknown as LegalReference[]
          });
        }
        
        // Check for high utilization
        if (account.creditLimit && account.currentBalance) {
          const limit = parseFloat(account.creditLimit.toString().replace(/[^0-9.]/g, ''));
          const balance = parseFloat(account.currentBalance.toString().replace(/[^0-9.]/g, ''));
          
          if (!isNaN(limit) && !isNaN(balance) && limit > 0) {
            const utilization = balance / limit;
            if (utilization > 0.7) {
              issues.push({
                id: `high-util-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'high_utilization',
                description: `High utilization (${Math.round(utilization * 100)}%) on account: ${account.accountName}`,
                severity: 'medium',
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                bureau: reportData.primaryBureau || "Unknown",
                legalBasis: ["15 USC 1681e(b)"] as unknown as LegalReference[]
              });
            }
          }
        }
      });
    } else {
      console.warn("No accounts found in credit report data");
    }
    
    // Check for inquiries (including potential unauthorized ones)
    if (reportData.inquiries && reportData.inquiries.length > 0) {
      console.log(`Analyzing ${reportData.inquiries.length} inquiries`);
      
      reportData.inquiries.forEach(inquiry => {
        const inquiryCompany = inquiry.creditor || inquiry.inquiryBy || inquiry.inquiryCompany || "Unknown Company";
        const inquiryDate = inquiry.inquiryDate ? new Date(inquiry.inquiryDate) : null;
        const now = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        
        // Focus on inquiries within the last 2 years (still affecting credit)
        if (!inquiryDate || inquiryDate > twoYearsAgo) {
          issues.push({
            id: `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'inquiry',
            description: `Credit inquiry by ${inquiryCompany}${inquiryDate ? ` on ${inquiryDate.toLocaleDateString()}` : ''}`,
            severity: 'low',
            accountName: inquiryCompany,
            bureau: reportData.primaryBureau || "Unknown",
            date: inquiryDate?.toISOString(),
            legalBasis: ["15 USC 1681b(a)(2)", "15 USC 1681m"] as unknown as LegalReference[]
          });
        }
      });
    }
    
    // Check for personal information errors
    if (reportData.personalInfo) {
      const personalInfo = reportData.personalInfo;
      const personalIssues = [];
      
      // Check for incomplete personal information
      if (!personalInfo.name || personalInfo.name.length < 2) {
        personalIssues.push("Missing or incomplete name");
      }
      if (!personalInfo.address) {
        personalIssues.push("Missing current address");
      }
      if (!personalInfo.ssn || personalInfo.ssn.length < 4) {
        personalIssues.push("Missing or incomplete SSN");
      }
      
      if (personalIssues.length > 0) {
        issues.push({
          id: `personal-info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'personal_info',
          description: `Personal information issues: ${personalIssues.join(', ')}`,
          severity: 'medium',
          bureau: reportData.primaryBureau || "Unknown",
          legalBasis: ["15 USC 1681i(a)(1)(A)", "15 USC 1681c"] as unknown as LegalReference[]
        });
      }
    }
    
    // Check for public records
    if (reportData.publicRecords && reportData.publicRecords.length > 0) {
      console.log(`Analyzing ${reportData.publicRecords.length} public records`);
      
      reportData.publicRecords.forEach(record => {
        issues.push({
          id: `public-record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'public_record',
          description: `Public record: ${record.type || 'Unknown type'}`,
          severity: 'high',
          accountName: record.name || 'Public Record',
          bureau: reportData.primaryBureau || "Unknown",
          legalBasis: ["15 USC 1681e(b)", "15 USC 1681i"] as unknown as LegalReference[]
        });
      });
    }
    
    // If we have raw text, try to find additional issues
    if (reportData.rawText && issues.length === 0) {
      // This is now handled by extractIssuesFromRawText in identifyIssues.ts
      console.log("No structured issues found, raw text analysis will be handled by identifyIssues");
    }
    
    return issues;
  } catch (error) {
    console.error("Error analyzing report for issues:", error);
    return [];
  }
}

