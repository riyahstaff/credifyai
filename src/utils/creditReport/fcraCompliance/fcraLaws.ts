/**
 * Comprehensive FCRA Laws and Regulations for Credit Repair
 */

export interface FCRALaw {
  section: string;
  title: string;
  description: string;
  citation: string;
  applicableIssues: string[];
  language: string;
}

export const FCRA_LAWS_COMPREHENSIVE: Record<string, FCRALaw> = {
  // Core Dispute Rights
  '1681i': {
    section: '15 USC §1681i',
    title: 'Procedure in case of disputed accuracy',
    description: 'Consumer right to dispute inaccurate information',
    citation: '15 USC §1681i(a)(1)(A)',
    applicableIssues: ['all'],
    language: 'Under 15 USC §1681i(a)(1)(A), upon notice of a dispute, you must conduct a reasonable reinvestigation to determine whether the disputed information is inaccurate.'
  },
  '1681e': {
    section: '15 USC §1681e(b)',
    title: 'Maximum possible accuracy requirement',
    description: 'Requires maximum possible accuracy of reported information',
    citation: '15 USC §1681e(b)',
    applicableIssues: ['inaccuracies', 'late_payment', 'balance_error', 'account_status'],
    language: 'Under 15 USC §1681e(b), you are required to follow reasonable procedures to assure maximum possible accuracy of the information concerning the individual about whom the report relates.'
  },
  '1681s2a': {
    section: '15 USC §1681s-2(a)',
    title: 'Furnisher accuracy requirements',
    description: 'Furnishers must provide accurate information',
    citation: '15 USC §1681s-2(a)(1)(A)',
    applicableIssues: ['late_payment', 'balance_error', 'account_status', 'charge_off'],
    language: 'Under 15 USC §1681s-2(a)(1)(A), furnishers are prohibited from furnishing information they know or have reasonable cause to believe is inaccurate.'
  },
  '1681s2b': {
    section: '15 USC §1681s-2(b)',
    title: 'Furnisher investigation duties',
    description: 'Furnisher obligations upon notice of dispute',
    citation: '15 USC §1681s-2(b)(1)(A)',
    applicableIssues: ['all'],
    language: 'Under 15 USC §1681s-2(b)(1)(A), upon notification of a dispute, the furnisher must conduct an investigation with respect to the disputed information.'
  },
  '1681c': {
    section: '15 USC §1681c',
    title: 'Requirements relating to information contained in consumer reports',
    description: 'Time limits for reporting negative information',
    citation: '15 USC §1681c(a)(1)',
    applicableIssues: ['late_payment', 'charge_off', 'collection', 'bankruptcy'],
    language: 'Under 15 USC §1681c(a)(1), most negative information cannot be reported for more than 7 years from the date of first delinquency.'
  },
  '1681b': {
    section: '15 USC §1681b',
    title: 'Permissible purposes of consumer reports',
    description: 'Requires permissible purpose for credit inquiries',
    citation: '15 USC §1681b(a)(3)(A)',
    applicableIssues: ['inquiry', 'unauthorized_inquiry'],
    language: 'Under 15 USC §1681b(a)(3)(A), consumer reports may only be furnished for transactions initiated by the consumer or for reviewing or collecting an account of the consumer.'
  },
  '1681g': {
    section: '15 USC §1681g',
    title: 'Disclosures to consumers',
    description: 'Right to know what is in your file',
    citation: '15 USC §1681g(a)(1)',
    applicableIssues: ['personal_info', 'all'],
    language: 'Under 15 USC §1681g(a)(1), every consumer reporting agency shall, upon request and proper identification, clearly and accurately disclose to the consumer all information in the consumer\'s file at the time of the request.'
  },
  '1681j': {
    section: '15 USC §1681j',
    title: 'Charges for certain disclosures',
    description: 'Limitations on charges for disclosures',
    citation: '15 USC §1681j(a)(1)(A)',
    applicableIssues: ['all'],
    language: 'Under 15 USC §1681j(a)(1)(A), you may not charge for disclosures required under this Act in certain circumstances.'
  },
  '1681m': {
    section: '15 USC §1681m',
    title: 'Requirements on users of consumer reports',
    description: 'Notice requirements for adverse actions',
    citation: '15 USC §1681m(a)',
    applicableIssues: ['inquiry', 'adverse_action'],
    language: 'Under 15 USC §1681m(a), whenever credit is denied based on information in a consumer report, the user must provide notice to the consumer.'
  },
  '1681n': {
    section: '15 USC §1681n',
    title: 'Civil liability for willful noncompliance',
    description: 'Penalties for willful violations',
    citation: '15 USC §1681n(a)',
    applicableIssues: ['all'],
    language: 'Under 15 USC §1681n(a), willful noncompliance with FCRA requirements may result in actual damages, punitive damages, and attorney fees.'
  },
  '1681o': {
    section: '15 USC §1681o',
    title: 'Civil liability for negligent noncompliance',
    description: 'Penalties for negligent violations',
    citation: '15 USC §1681o(a)',
    applicableIssues: ['all'],
    language: 'Under 15 USC §1681o(a), negligent noncompliance with FCRA requirements may result in actual damages and attorney fees.'
  }
};

export const FDCPA_LAWS: Record<string, FCRALaw> = {
  '1692c': {
    section: '15 USC §1692c',
    title: 'Ceasing collection activity',
    description: 'Debt collector communication restrictions',
    citation: '15 USC §1692c(b)',
    applicableIssues: ['collection'],
    language: 'Under 15 USC §1692c(b), if a consumer notifies a debt collector in writing that they refuse to pay or wish the collector to cease communication, the collector must stop all collection activities.'
  },
  '1692e': {
    section: '15 USC §1692e',
    title: 'False or misleading representations',
    description: 'Prohibits false or misleading collection practices',
    citation: '15 USC §1692e(2)(A)',
    applicableIssues: ['collection'],
    language: 'Under 15 USC §1692e(2)(A), debt collectors are prohibited from making false representations about the character, amount, or legal status of any debt.'
  },
  '1692f': {
    section: '15 USC §1692f',
    title: 'Unfair practices',
    description: 'Prohibits unfair debt collection practices',
    citation: '15 USC §1692f(1)',
    applicableIssues: ['collection'],
    language: 'Under 15 USC §1692f(1), debt collectors may not collect any amount unless it is expressly authorized by the agreement creating the debt or permitted by law.'
  },
  '1692g': {
    section: '15 USC §1692g',
    title: 'Validation of debts',
    description: 'Debt validation requirements',
    citation: '15 USC §1692g(a)(1)',
    applicableIssues: ['collection'],
    language: 'Under 15 USC §1692g(a)(1), debt collectors must provide debt validation information including the amount of the debt and the name of the creditor.'
  }
};

export const CFPB_REGULATIONS: Record<string, FCRALaw> = {
  '1026': {
    section: '12 CFR 1026',
    title: 'Truth in Lending (Regulation Z)',
    description: 'Credit disclosure requirements',
    citation: '12 CFR 1026.13',
    applicableIssues: ['billing_error', 'credit_terms'],
    language: 'Under 12 CFR 1026.13, creditors must follow specific procedures for billing error resolution and credit account disputes.'
  },
  '1024': {
    section: '12 CFR 1024',
    title: 'Real Estate Settlement Procedures Act',
    description: 'Mortgage servicing requirements',
    citation: '12 CFR 1024.35',
    applicableIssues: ['mortgage_error'],
    language: 'Under 12 CFR 1024.35, mortgage servicers must follow specific procedures for error resolution and information requests.'
  }
};

/**
 * Get applicable FCRA laws for a specific issue type
 */
export function getApplicableLaws(issueType: string): FCRALaw[] {
  const laws: FCRALaw[] = [];
  
  // Add relevant FCRA laws
  Object.values(FCRA_LAWS_COMPREHENSIVE).forEach(law => {
    if (law.applicableIssues.includes('all') || law.applicableIssues.includes(issueType)) {
      laws.push(law);
    }
  });
  
  // Add FDCPA laws for collection issues
  if (issueType.includes('collection')) {
    Object.values(FDCPA_LAWS).forEach(law => {
      if (law.applicableIssues.includes(issueType) || law.applicableIssues.includes('collection')) {
        laws.push(law);
      }
    });
  }
  
  return laws;
}

/**
 * Generate legal language for dispute letter
 */
export function generateLegalLanguage(issueType: string, accountName: string): string {
  const laws = getApplicableLaws(issueType);
  
  if (laws.length === 0) {
    return `Under the Fair Credit Reporting Act (FCRA), you are required to conduct a reasonable investigation into this dispute and either verify the accuracy of the reported information or delete it from my credit report.`;
  }
  
  const legalStatements = laws.map(law => law.language).join('\n\n');
  
  return `${legalStatements}\n\nTherefore, I demand that you immediately investigate this matter and either verify the complete accuracy of the reported information or delete it entirely from my credit report pursuant to your obligations under federal law.`;
}