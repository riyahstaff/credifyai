
/**
 * Provides fallback generic issues when no specific issues are found
 * These are based on common credit report issues
 */
export const addFallbackGenericIssues = () => {
  return [
    {
      type: 'Personal Info',
      title: 'Verify Personal Information',
      description: 'Review your personal information for accuracy. Incorrect personal details can affect your credit report and score.',
      impact: "Medium Impact" as const,
      impactColor: 'text-amber-500',
      laws: ['15 USC 1681c', '15 USC 1681g']
    },
    {
      type: 'Account Status',
      title: 'Verify Account Statuses',
      description: 'Check all account statuses for accuracy. Accounts may be incorrectly reported as open, closed, or delinquent.',
      impact: "High Impact" as const,
      impactColor: 'text-red-500',
      laws: ['15 USC 1681e(b)', '15 USC 1681i']
    },
    {
      type: 'Inquiry',
      title: 'Review Credit Inquiries',
      description: 'Examine all credit inquiries to confirm you authorized them. Unauthorized inquiries may indicate identity theft or fraud.',
      impact: "Medium Impact" as const,
      impactColor: 'text-amber-500',
      laws: ['15 USC 1681b(a)(2)', '15 USC 1681m']
    },
    {
      type: 'Late Payment',
      title: 'Check Payment History',
      description: 'Verify your payment history for all accounts. Late payments could be reported in error.',
      impact: "High Impact" as const,
      impactColor: 'text-red-500',
      laws: ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)']
    },
    {
      type: 'Balance',
      title: 'Verify Account Balances',
      description: 'Check all account balances for accuracy. Incorrect balances can impact your credit utilization ratio.',
      impact: "Medium Impact" as const,
      impactColor: 'text-amber-500',
      laws: ['15 USC 1681e(b)', '15 USC 1681i']
    }
  ];
};
