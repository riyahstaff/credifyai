import { supabase } from '@/lib/supabase/client';
import { CreditReportData } from './types';

// Define Issue type since it's used in the code but not in our types
interface Issue {
  id: string;
  type: string;
  description: string;
  bureau?: string;
  accountName?: string;
  accountNumber?: string;
  date?: string;
  reason?: string;
  legalBasis?: any[];
  severity?: string;
  details?: any;
}

/**
 * Class for handling credit report storage in Supabase
 */
export class CreditReportStorage {
  /**
   * Store a credit report in Supabase
   * @param creditReportData The parsed credit report data
   * @param userId The ID of the user who uploaded the report
   * @param issues The detected issues in the credit report
   * @returns The ID of the stored credit report
   */
  public async storeCreditReport(
    creditReportData: CreditReportData,
    userId: string,
    issues: Issue[]
  ): Promise<string | null> {
    try {
      // Create a record for the credit report
      const { data, error } = await supabase
        .from('credit_reports')
        .insert({
          user_id: userId,
          bureau: creditReportData.primaryBureau,
          report_number: creditReportData.reportNumber,
          personal_info: creditReportData.personalInfo,
          accounts_count: creditReportData.accounts.length,
          inquiries_count: creditReportData.inquiries.length,
          issues_count: issues.length,
          issues_summary: issues.map(issue => issue.type),
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error storing credit report:', error);
        return null;
      }
      
      const reportId = data.id;
      
      // Store the accounts
      await this.storeAccounts(creditReportData.accounts, reportId);
      
      // Store the inquiries
      await this.storeInquiries(creditReportData.inquiries, reportId);
      
      // Store the issues
      await this.storeIssues(issues, reportId, userId);
      
      return reportId;
    } catch (error) {
      console.error('Error storing credit report:', error);
      return null;
    }
  }
  
  /**
   * Store account information in Supabase
   * @param accounts The accounts from the credit report
   * @param reportId The ID of the credit report
   */
  private async storeAccounts(
    accounts: CreditReportData['accounts'],
    reportId: string
  ): Promise<void> {
    try {
      if (accounts.length === 0) {
        return;
      }
      
      // Format accounts for Supabase
      const formattedAccounts = accounts.map(account => ({
        credit_report_id: reportId,
        account_name: account.accountName,
        account_number: account.accountNumber,
        account_type: account.accountType,
        balance: account.balance,
        credit_limit: account.creditLimit,
        high_balance: account.highBalance,
        open_date: account.openDate,
        status: account.status,
        payment_status: account.paymentStatus,
        last_payment_date: account.lastPaymentDate,
        past_due_amount: account.pastDueAmount,
        payment_history: account.paymentHistory,
        remarks: account.remarks,
        bureau: account.bureau,
        created_at: new Date().toISOString()
      }));
      
      // Insert accounts in batches to avoid request size limits
      const batchSize = 50;
      for (let i = 0; i < formattedAccounts.length; i += batchSize) {
        const batch = formattedAccounts.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('credit_report_accounts')
          .insert(batch);
        
        if (error) {
          console.error('Error storing accounts batch:', error);
        }
      }
    } catch (error) {
      console.error('Error storing accounts:', error);
    }
  }
  
  /**
   * Store inquiry information in Supabase
   * @param inquiries The inquiries from the credit report
   * @param reportId The ID of the credit report
   */
  private async storeInquiries(
    inquiries: CreditReportData['inquiries'],
    reportId: string
  ): Promise<void> {
    try {
      if (inquiries.length === 0) {
        return;
      }
      
      // Format inquiries for Supabase
      const formattedInquiries = inquiries.map(inquiry => ({
        credit_report_id: reportId,
        inquiry_name: inquiry.inquiryName,
        inquiry_date: inquiry.inquiryDate,
        inquiry_type: inquiry.inquiryType,
        bureau: inquiry.bureau,
        created_at: new Date().toISOString()
      }));
      
      // Insert inquiries
      const { error } = await supabase
        .from('credit_report_inquiries')
        .insert(formattedInquiries);
      
      if (error) {
        console.error('Error storing inquiries:', error);
      }
    } catch (error) {
      console.error('Error storing inquiries:', error);
    }
  }
  
  /**
   * Store issue information in Supabase
   * @param issues The detected issues in the credit report
   * @param reportId The ID of the credit report
   * @param userId The ID of the user who uploaded the report
   */
  private async storeIssues(
    issues: Issue[],
    reportId: string,
    userId: string
  ): Promise<void> {
    try {
      if (issues.length === 0) {
        return;
      }
      
      // Format issues for Supabase
      const formattedIssues = issues.map(issue => ({
        credit_report_id: reportId,
        user_id: userId,
        issue_type: issue.type,
        description: issue.description,
        bureau: issue.bureau,
        account_name: issue.accountName,
        account_number: issue.accountNumber,
        date: issue.date,
        reason: issue.reason,
        legal_basis: issue.legalBasis,
        severity: issue.severity,
        details: issue.details,
        status: 'detected', // Initial status
        created_at: new Date().toISOString()
      }));
      
      // Insert issues in batches to avoid request size limits
      const batchSize = 50;
      for (let i = 0; i < formattedIssues.length; i += batchSize) {
        const batch = formattedIssues.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('credit_report_issues')
          .insert(batch);
        
        if (error) {
          console.error('Error storing issues batch:', error);
        }
      }
    } catch (error) {
      console.error('Error storing issues:', error);
    }
  }
  
  /**
   * Retrieve a credit report from Supabase
   * @param reportId The ID of the credit report to retrieve
   * @returns The credit report data
   */
  public async getCreditReport(reportId: string): Promise<{
    reportData: any;
    accounts: any[];
    inquiries: any[];
    issues: any[];
  } | null> {
    try {
      // Get the credit report
      const { data: reportData, error: reportError } = await supabase
        .from('credit_reports')
        .select('*')
        .eq('id', reportId)
        .single();
      
      if (reportError) {
        console.error('Error retrieving credit report:', reportError);
        return null;
      }
      
      // Get the accounts
      const { data: accounts, error: accountsError } = await supabase
        .from('credit_report_accounts')
        .select('*')
        .eq('credit_report_id', reportId);
      
      if (accountsError) {
        console.error('Error retrieving accounts:', accountsError);
        return null;
      }
      
      // Get the inquiries
      const { data: inquiries, error: inquiriesError } = await supabase
        .from('credit_report_inquiries')
        .select('*')
        .eq('credit_report_id', reportId);
      
      if (inquiriesError) {
        console.error('Error retrieving inquiries:', inquiriesError);
        return null;
      }
      
      // Get the issues
      const { data: issues, error: issuesError } = await supabase
        .from('credit_report_issues')
        .select('*')
        .eq('credit_report_id', reportId);
      
      if (issuesError) {
        console.error('Error retrieving issues:', issuesError);
        return null;
      }
      
      return {
        reportData,
        accounts: accounts || [],
        inquiries: inquiries || [],
        issues: issues || []
      };
    } catch (error) {
      console.error('Error retrieving credit report:', error);
      return null;
    }
  }
  
  /**
   * Get all credit reports for a user
   * @param userId The ID of the user
   * @returns Array of credit reports
   */
  public async getUserCreditReports(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('credit_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error retrieving user credit reports:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error retrieving user credit reports:', error);
      return [];
    }
  }
  
  /**
   * Update the status of an issue
   * @param issueId The ID of the issue to update
   * @param status The new status
   * @returns Whether the update was successful
   */
  public async updateIssueStatus(issueId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('credit_report_issues')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', issueId);
      
      if (error) {
        console.error('Error updating issue status:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating issue status:', error);
      return false;
    }
  }
  
  /**
   * Delete a credit report and all associated data
   * @param reportId The ID of the credit report to delete
   * @returns Whether the deletion was successful
   */
  public async deleteCreditReport(reportId: string): Promise<boolean> {
    try {
      // Delete associated issues
      const { error: issuesError } = await supabase
        .from('credit_report_issues')
        .delete()
        .eq('credit_report_id', reportId);
      
      if (issuesError) {
        console.error('Error deleting issues:', issuesError);
      }
      
      // Delete associated accounts
      const { error: accountsError } = await supabase
        .from('credit_report_accounts')
        .delete()
        .eq('credit_report_id', reportId);
      
      if (accountsError) {
        console.error('Error deleting accounts:', accountsError);
      }
      
      // Delete associated inquiries
      const { error: inquiriesError } = await supabase
        .from('credit_report_inquiries')
        .delete()
        .eq('credit_report_id', reportId);
      
      if (inquiriesError) {
        console.error('Error deleting inquiries:', inquiriesError);
      }
      
      // Delete the credit report
      const { error: reportError } = await supabase
        .from('credit_reports')
        .delete()
        .eq('id', reportId);
      
      if (reportError) {
        console.error('Error deleting credit report:', reportError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting credit report:', error);
      return false;
    }
  }
}

// Export singleton instance
export const creditReportStorage = new CreditReportStorage();
