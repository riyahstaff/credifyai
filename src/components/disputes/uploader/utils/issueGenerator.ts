
import { CreditReportData } from '@/utils/creditReportParser';
import { IssueItem } from '../types/analysisTypes';

/**
 * Get mandatory issues that should always be presented to the user
 */
export const getMandatoryIssues = (): IssueItem[] => {
  return [
    {
      type: 'fcra',
      title: 'FCRA Verification Rights',
      description: 'Under the Fair Credit Reporting Act (FCRA), you have the right to dispute any information in your credit report, even if it appears accurate.',
      impact: 'High Impact' as const,
      impactColor: 'orange',
      laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
    },
    {
      type: 'late_payment',
      title: 'Late Payment Disputes',
      description: 'Late payments must be reported with 100% accuracy. Any discrepancy in dates, amounts, or frequency allows for successful disputes.',
      impact: 'Critical Impact' as const,
      impactColor: 'red',
      laws: ['FCRA § 611', 'FCRA § 623']
    },
    {
      type: 'inquiry',
      title: 'Unauthorized Hard Inquiries',
      description: 'Inquiries on your credit report may have been made without proper authorization, which violates the FCRA and can be disputed.',
      impact: 'High Impact' as const,
      impactColor: 'orange',
      laws: ['FCRA § 604', 'FCRA § 611']
    }
  ];
};

/**
 * Ensure a minimum number of issues to present to the user
 */
export const ensureMinimumIssues = (detectedIssues: IssueItem[], minimumCount = 3): IssueItem[] => {
  if (detectedIssues.length >= minimumCount) {
    return detectedIssues;
  }
  
  const existingIssues = [...detectedIssues];
  const mandatoryIssues = getMandatoryIssues();
  
  const combinedIssues = [...existingIssues];
  
  for (const issue of mandatoryIssues) {
    if (!combinedIssues.some(i => i.title === issue.title)) {
      combinedIssues.push(issue);
      if (combinedIssues.length >= minimumCount) {
        break;
      }
    }
  }
  
  return combinedIssues;
};
