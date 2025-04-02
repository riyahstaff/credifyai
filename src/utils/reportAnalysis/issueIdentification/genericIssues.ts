
import { IdentifiedIssue } from '@/utils/creditReport/types';

/**
 * Add fallback generic issues when no specific issues are found
 * These are used as a last resort to ensure the user has something to dispute
 */
export const addFallbackGenericIssues = (): IdentifiedIssue[] => {
  return [
    {
      type: "Inaccurate Information",
      title: "Possible Inaccurate Account Information",
      description: "Your credit report may contain accounts with incorrect information. This could include inaccurate payment history, balance amounts, or account status.",
      impact: "High Impact",
      impactColor: "text-red-500",
      laws: []
    },
    {
      type: "Unauthorized Inquiry",
      title: "Potential Unauthorized Credit Inquiries",
      description: "Your report shows credit inquiries that may not have been authorized by you. Unauthorized inquiries can negatively impact your credit score.",
      impact: "Medium Impact",
      impactColor: "text-amber-500",
      laws: []
    },
    {
      type: "Identity Verification",
      title: "Personal Information Verification Needed",
      description: "Some personal information in your credit report may need verification to ensure accuracy and protect against identity theft.",
      impact: "Medium Impact",
      impactColor: "text-amber-500",
      laws: []
    },
    {
      type: "Collection Account",
      title: "Collection Account Dispute",
      description: "Your report may contain collection accounts that could be disputed. Collection accounts can significantly impact your credit score.",
      impact: "Critical Impact",
      impactColor: "text-red-600",
      laws: []
    },
    {
      type: "Late Payment",
      title: "Late Payment Reporting",
      description: "Your credit report shows late payments that may be inaccurately reported or outdated. Late payments can significantly impact your credit score.",
      impact: "High Impact",
      impactColor: "text-red-500",
      laws: []
    }
  ];
};
