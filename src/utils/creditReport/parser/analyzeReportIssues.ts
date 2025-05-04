
import { CreditReportData, Issue } from '@/utils/creditReport/types';

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
      
      // Analyze each account
      reportData.accounts.forEach(account => {
        // Check for late payments
        if (account.paymentStatus && 
            (account.paymentStatus.toLowerCase().includes('late') || 
             account.paymentStatus.toLowerCase().includes('past due'))) {
          issues.push({
            id: `late-payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'late_payment',
            description: `Late payment reported on account: ${account.accountName}`,
            severity: 'high',
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681e(b)", "15 USC 1681i"]
          });
        }
        
        // Check for collection accounts
        if (account.accountType?.toLowerCase().includes('collection') ||
            account.accountName?.toLowerCase().includes('collection')) {
          issues.push({
            id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'collection_account',
            description: `Collection account reported: ${account.accountName}`,
            severity: 'high',
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681e(b)", "15 USC 1681i"]
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
                legalBasis: ["15 USC 1681e(b)"]
              });
            }
          }
        }
      });
    } else {
      console.warn("No accounts found in credit report data");
    }
    
    // Check for inquiries
    if (reportData.inquiries && reportData.inquiries.length > 0) {
      console.log(`Analyzing ${reportData.inquiries.length} inquiries`);
      
      reportData.inquiries.forEach(inquiry => {
        // Focus on recent inquiries (last 90 days)
        const inquiryDate = inquiry.date ? new Date(inquiry.date) : null;
        const now = new Date();
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        if (inquiryDate && inquiryDate > ninetyDaysAgo) {
          issues.push({
            id: `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'inquiry',
            description: `Recent credit inquiry from: ${inquiry.name}`,
            severity: 'low',
            accountName: inquiry.name,
            bureau: reportData.primaryBureau || "Unknown",
            legalBasis: ["15 USC 1681b"]
          });
        }
      });
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
          legalBasis: ["15 USC 1681e(b)", "15 USC 1681i"]
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
