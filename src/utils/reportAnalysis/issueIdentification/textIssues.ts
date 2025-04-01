
/**
 * Text-based Issue Identification
 * Functions for identifying issues from raw text in credit reports
 */

import { CreditReportData } from '@/utils/creditReport/types';

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
  
  // ALWAYS add a general FCRA dispute option regardless of content
  issues.push({
    type: 'general',
    title: 'General FCRA Verification Request',
    description: 'Under FCRA §611, you have the right to request verification of all information in your credit report, regardless of whether errors are immediately visible.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 611 (Procedure in case of disputed accuracy)']
  });
  
  // ALWAYS add an account verification dispute option
  issues.push({
    type: 'account_verification',
    title: 'Account Information Verification',
    description: 'Credit reporting agencies must verify all account information is accurate and complete. Request verification of payment history, balances, and account status.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
  });
  
  // Look for inquiries in raw text - more aggressively now
  if (data.rawText.toLowerCase().includes('inquiry') || 
      data.rawText.toLowerCase().includes('inquiries') ||
      data.rawText.toLowerCase().includes('credit check') ||
      data.rawText.toLowerCase().includes('pull') ||
      data.rawText.toLowerCase().includes('request')) {
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
      data.rawText.toLowerCase().includes('delinquent') ||
      data.rawText.toLowerCase().includes('past due') ||
      data.rawText.toLowerCase().includes('overdue')) {
    issues.push({
      type: 'payment',
      title: 'Late Payment Records Detected',
      description: 'Your report appears to contain Late Payment Information. These negative items have a significant impact on your score and should be verified for accuracy.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  }
  
  // Look for multiple addresses - always add this as an issue
  issues.push({
    type: 'address',
    title: 'Personal Information Verification',
    description: 'Your report contains personal information that should be verified for accuracy, including addresses, employment, and personal identifiers.',
    impact: 'Medium Impact',
    impactColor: 'yellow',
    laws: ['FCRA § 605 (Requirements relating to information contained in consumer reports)']
  });
  
  // Look for potential name variations or misspellings - more aggressively
  if (data.rawText.toLowerCase().includes('also known as') || 
      data.rawText.toLowerCase().includes('aka') ||
      data.rawText.toLowerCase().includes('aliases') ||
      data.personalInfo) {  // If we have any personal info at all
    issues.push({
      type: 'name',
      title: 'Name Variations Review',
      description: 'Your report may contain name Variations or Possible spelling Errors. These should be corrected to maintain accurate Records.',
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
  
  // Look for collections - more aggressively
  if (data.rawText.toLowerCase().includes('collection') || 
      data.rawText.toLowerCase().includes('collections') ||
      data.rawText.toLowerCase().includes('charged off') ||
      data.rawText.toLowerCase().includes('charge-off') ||
      data.rawText.toLowerCase().includes('debt') ||
      data.rawText.toLowerCase().includes('recover')) {
    issues.push({
      type: 'collection',
      title: 'Collection Accounts Detected',
      description: 'Your report appears to contain collection accounts. These have a significant negative impact on your score and should be verified for accuracy and proper reporting.',
      impact: 'Critical Impact',
      impactColor: 'red',
      laws: ['FCRA § 623 (Responsibilities of furnishers of information)', 'FCRA § 611 (Procedure in case of disputed accuracy)']
    });
  }
  
  // Add credit utilization issue - always a concern
  issues.push({
    type: 'utilization',
    title: 'Credit Utilization Review',
    description: 'Your credit utilization ratio should be verified for accuracy. Incorrect balances or credit limits can negatively impact your score.',
    impact: 'High Impact',
    impactColor: 'orange',
    laws: ['FCRA § 623 (Responsibilities of furnishers of information)']
  });
  
  // Look for medical collections or bills
  if (data.rawText.toLowerCase().includes('medical') || 
      data.rawText.toLowerCase().includes('hospital') ||
      data.rawText.toLowerCase().includes('healthcare') ||
      data.rawText.toLowerCase().includes('clinic') ||
      data.rawText.toLowerCase().includes('physician') ||
      data.rawText.toLowerCase().includes('doctor')) {
    issues.push({
      type: 'medical',
      title: 'Medical Collections Review',
      description: 'Your report may contain medical collections or bills. These have special treatment under recent credit scoring models and reporting regulations, and should be carefully reviewed.',
      impact: 'High Impact',
      impactColor: 'orange',
      laws: ['FCRA § 623', 'FCRA § 604c (Medical information disclosure restrictions)']
    });
  }
  
  return issues;
};
