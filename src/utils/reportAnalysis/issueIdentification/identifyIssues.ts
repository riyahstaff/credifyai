
import { CreditReportData, IdentifiedIssue } from '@/utils/creditReport/types';
import { analyzeReportForIssues } from '@/utils/creditReport/parser/analyzeReportIssues';

/**
 * Identify issues in a credit report
 */
export function identifyIssues(reportData: CreditReportData): IdentifiedIssue[] {
  console.log("Identifying issues in credit report");
  
  if (!reportData) {
    console.error("No report data provided to issue identifier");
    return [];
  }
  
  try {
    // Use our enhanced analyzer to find issues
    const issues = analyzeReportForIssues(reportData);
    
    // Convert Issue[] to IdentifiedIssue[] by ensuring all required fields are present
    const identifiedIssues: IdentifiedIssue[] = issues.map(issue => ({
      type: issue.type,
      title: issue.type.charAt(0).toUpperCase() + issue.type.slice(1).replace('_', ' '),
      description: issue.description,
      impact: issue.severity === 'high' ? 'High Impact' : 
             issue.severity === 'medium' ? 'Medium Impact' : 'Low Impact',
      impactColor: issue.severity === 'high' ? 'red' : 
                  issue.severity === 'medium' ? 'orange' : 'yellow',
      account: issue.accountName ? { 
        accountName: issue.accountName,
        accountNumber: issue.accountNumber
      } : undefined,
      laws: Array.isArray(issue.legalBasis) ? 
        (typeof issue.legalBasis[0] === 'string' ? issue.legalBasis as string[] : []) : 
        (typeof issue.legalBasis === 'string' ? [issue.legalBasis] : []),
      bureau: issue.bureau,
      severity: issue.severity
    }));
    
    console.log(`Found ${identifiedIssues.length} issues in credit report`);
    
    return identifiedIssues;
  } catch (error) {
    console.error("Error identifying issues:", error);
    return [];
  }
}
