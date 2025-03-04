/**
 * Bureau utility functions for dispute letter generation
 */

/**
 * Determine which bureau to send the dispute to based on the issue
 */
export function determineBureau(issue: any): string {
  console.log("Determining bureau for issue:", issue);
  
  // If the issue specifies a bureau, use that
  if (issue.bureau && typeof issue.bureau === 'string') {
    return issue.bureau;
  }
  
  // If the account specifies a bureau, use that
  if (issue.account?.bureau && typeof issue.account.bureau === 'string') {
    return issue.account.bureau;
  }
  
  // Otherwise try to determine from the issue description
  if (issue.description && typeof issue.description === 'string') {
    const description = issue.description.toLowerCase();
    if (description.includes('equifax')) {
      return 'Equifax';
    } else if (description.includes('experian')) {
      return 'Experian';
    } else if (description.includes('transunion')) {
      return 'TransUnion';
    }
  }
  
  // Default to Experian if we can't determine
  console.log("Could not determine bureau, defaulting to Experian");
  return 'Experian';
}

/**
 * Get bureau address from bureau name
 */
export function getBureauAddress(bureau: string): string {
  // Normalize bureau name to match our address keys
  const normalizedBureau = bureau ? bureau.toLowerCase().replace(/\s+/g, '') : '';
  
  const bureauAddresses = {
    'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
    'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
    'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
  };
  
  // Choose the correct address or use a placeholder
  const address = bureauAddresses[normalizedBureau as keyof typeof bureauAddresses];
  
  if (address) {
    return address;
  }
  
  // If no address found, but we have a bureau name, create a placeholder with the bureau name
  if (bureau && bureau.trim().length > 0) {
    return `${bureau}\n[BUREAU ADDRESS]`;
  }
  
  // Complete fallback
  return "Credit Bureau\n[BUREAU ADDRESS]";
}
