
/**
 * Credit Report Constants
 * Contains static values used throughout the credit report module
 */

// FCRA laws by issue type
export const FCRA_LAWS = {
  latePayments: ['15 USC 1681s-2(a)(3)', '15 USC 1681e(b)'],
  collections: ['15 USC 1692c', '15 USC 1681s-2(a)(3)'],
  inaccuracies: ['15 USC 1681e(b)', '15 USC 1681i'],
  inquiries: ['15 USC 1681b(a)(2)', '15 USC 1681m'],
  personalInfo: ['15 USC 1681c', '15 USC 1681g'],
  studentLoans: ['15 USC 1681e(b)', '15 USC 1681i'],
  bankruptcy: ['15 USC 1681c', '15 USC 1681i', '15 USC 1681e(b)'],
  consumerRights: ['15 USC 1681g', '15 USC 1681h', '15 USC 1681i'],
  fraudAlerts: ['15 USC 1681c-1', '15 USC 1681c-2'],
  creditCardLiability: ['12 CFR 1026.13'],
  identityTheft: ['18 USC 1028a']
};

// Specific law descriptions for reference
export const LAW_DESCRIPTIONS = {
  '15 USC 1681e(b)': 'Requires credit reporting agencies to follow reasonable procedures to assure maximum possible accuracy.',
  '15 USC 1681i': 'Requires proper investigation of disputed information.',
  '15 USC 1681s-2(a)(3)': 'Prohibits furnishers from continuing to report information that is disputed and discovered to be inaccurate.',
  '15 USC 1681c': 'Governs the reporting of obsolete information.',
  '15 USC 1681g': 'Requires disclosure of all information in consumer file upon request.',
  '15 USC 1681m': 'Requires users of consumer reports for adverse actions to provide notice.',
  '15 USC 1692c': 'Regulates communication in connection with debt collection.',
  '15 USC 1681b(a)(2)': 'Limits permissible purposes for accessing credit reports.',
  '12 CFR 1026.13': 'Regulates billing error resolution procedures.',
  '18 USC 1028a': 'Criminalizes identity theft.'
};

// Bureau address mapping (for dispute letters)
export const BUREAU_ADDRESSES = {
  'Experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
  'Equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
  'TransUnion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
};
