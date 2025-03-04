/**
 * Bureau utility functions for dispute letter generation
 */

/**
 * Determine which bureau to send the dispute to based on the issue
 */
export function determineBureau(issue: any): string {
  // If the issue specifies a bureau, use that
  if (issue.bureau) {
    return issue.bureau;
  }
  
  // If the account specifies a bureau, use that
  if (issue.account?.bureau) {
    return issue.account.bureau;
  }
  
  // Otherwise try to determine from the issue description
  const description = (issue.description || '').toLowerCase();
  if (description.includes('equifax')) {
    return 'Equifax';
  } else if (description.includes('experian')) {
    return 'Experian';
  } else if (description.includes('transunion')) {
    return 'TransUnion';
  }
  
  // Default to Experian if we can't determine
  return 'Experian';
}

/**
 * Get bureau address from bureau name
 */
export function getBureauAddress(bureau: string): string {
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  // Normalize bureau name to match our address keys
  const bureauKey = bureau.toLowerCase().replace(/\s+/g, '');
  
  // Choose the correct address or use a placeholder
  return bureauAddresses[bureauKey as keyof typeof bureauAddresses] || 
    `${bureau}\n[BUREAU ADDRESS]`;
}
