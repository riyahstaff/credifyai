
/**
 * Text-based Issue Identification
 * Functions for identifying issues from raw text in credit reports
 */

import { CreditReportData } from '@/utils/creditReportParser';

/**
 * Identify issues based on raw text analysis
 */
export const identifyTextIssues = (data: CreditReportData): Array<{
  type: string;
  title: string;
  description: string;
  impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
  impactColor: string;
  laws: string[];
}> => {
  const issues: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'High Impact' | 'Critical Impact' | 'Medium Impact';
    impactColor: string;
    laws: string[];
  }> = [];
  
  if (!data.rawText) return issues;
  
  // Look for inquiries in raw text
  if (data.rawText.toLowerCase().includes('inquiry') || data.rawText.toLowerCase().includes('inquiries')) {
    issues.push({
      type: 'inquiry',
      title: 'Credit Inquiries Detected',
      description: 'Your report contains credit inquiries. These may be affecting your score and should be reviewed for accuracy and authorization.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 604 (Permissible purposes of consumer reports)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  }
  
  // Look for late payments in raw text
  if (data.rawText.toLowerCase().includes('late') || 
      data.rawText.toLowerCase().includes('30 day') || 
      data.rawText.toLowerCase().includes('60 day') || 
      data.rawText.toLowerCase().includes('90 day') ||
      data.rawText.toLowerCase().includes('delinquent')) {
    issues.push({
      type: 'payment',
      title: 'Late Payment Records Detected',
      description: 'Your report appears to contain late payment information. These negative items have a significant impact on your score and should be verified for accuracy.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  }
  
  // Look for multiple addresses
  if ((data.rawText.toLowerCase().match(/address/g) || []).length > 1) {
    issues.push({
      type: 'address',
      title: 'Multiple Addresses Detected',
      description: 'Your report appears to list multiple addresses. Outdated or inaccurate address information should be removed to maintain accurate records.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
    });
  }
  
  // Look for potential name variations or misspellings
  if (data.rawText.toLowerCase().includes('also known as') || 
      data.rawText.toLowerCase().includes('aka') ||
      data.rawText.toLowerCase().includes('aliases')) {
    issues.push({
      type: 'name',
      title: 'Name Variations Detected',
      description: 'Your report appears to contain multiple name variations or possible spelling errors. These should be corrected to maintain accurate records.',
      impact: 'Medium Impact',
      impactColor: 'yellow',
      laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
    });
  }
  
  // Look for student loans
  if (data.rawText.toLowerCase().includes('student loan') || 
      data.rawText.toLowerCase().includes('dept of ed') || 
      data.rawText.toLowerCase().includes('department of education') ||
      data.rawText.toLowerCase().includes('navient') ||
      data.rawText.toLowerCase().includes('nelnet') ||
      data.rawText.toLowerCase().includes('great lakes') ||
      data.rawText.toLowerCase().includes('sallie mae')) {
    issues.push({
      type: 'student_loan',
      title: 'Student Loan Accounts Detected',
      description: 'Your report contains student loan accounts. Recent Department of Education changes may affect how these loans should be reported. These should be reviewed for compliance with current guidelines.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'Department of Education Guidelines']
    });
  }
  
  // Look for collections
  if (data.rawText.toLowerCase().includes('collection') || 
      data.rawText.toLowerCase().includes('collections')) {
    issues.push({
      type: 'collection',
      title: 'Collection Accounts Detected',
      description: 'Your report appears to contain collection accounts. These have a significant negative impact on your score and should be verified for accuracy and proper reporting.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  }
  
  return issues;
};
