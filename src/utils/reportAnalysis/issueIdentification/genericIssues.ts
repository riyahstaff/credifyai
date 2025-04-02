
import { IdentifiedIssue } from '@/utils/creditReport/types';

/**
 * Provides fallback generic issues when no specific issues are found in a credit report
 */
export function addFallbackGenericIssues(): IdentifiedIssue[] {
  return [
    {
      type: 'Personal Info',
      title: 'Verify Personal Information',
      description: 'Review your personal information for accuracy. Incorrect personal details can affect your credit history.',
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: []
    },
    {
      type: 'Accounts',
      title: 'Check Account Balances',
      description: 'Verify that all account balances are accurate and reflect your current financial situation.',
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: []
    },
    {
      type: 'Inquiries',
      title: 'Review Recent Inquiries',
      description: 'Examine recent inquiries to ensure they were authorized by you. Unauthorized inquiries may indicate identity theft.',
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: []
    },
    {
      type: 'Public Records',
      title: 'Check Public Records',
      description: 'Review any public records for accuracy. Incorrect public records can significantly impact your credit score.',
      impact: "High Impact",
      impactColor: 'text-red-500',
      laws: []
    },
    {
      type: 'Credit Mix',
      title: 'Evaluate Credit Mix',
      description: 'Assess your credit mix for a healthy balance of different credit types to improve your credit score.',
      impact: "Medium Impact",
      impactColor: 'text-amber-500',
      laws: []
    }
  ];
}
