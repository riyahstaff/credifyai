
/**
 * Account Name Cleaner
 * Functions for cleaning and formatting account names
 */

/**
 * Clean account name for display
 */
export const cleanAccountName = (name: string): string => {
  // Remove PDF artifacts if they exist
  let cleaned = name.replace(/^\d+\s+\d+\s+/, ''); // Remove patterns like "142 0 "
  cleaned = cleaned.replace(/GM\s+/, ''); // Remove "GM " prefix
  
  // If the name has a mix of garbage and real text, try to extract real words
  // Most real creditor names have 2+ capital letters in a row
  const matches = cleaned.match(/[A-Z]{2,}[A-Za-z\s]+/);
  if (matches && matches[0].length > 5) {
    return matches[0].trim();
  }
  
  // For common credit accounts, try to extract known creditor names
  const commonCreditors = [
    "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE"
  ];
  
  for (const creditor of commonCreditors) {
    if (cleaned.toUpperCase().includes(creditor)) {
      // Extract the portion containing the creditor name and some surrounding context
      const index = cleaned.toUpperCase().indexOf(creditor);
      const start = Math.max(0, index - 5);
      const end = Math.min(cleaned.length, index + creditor.length + 10);
      return cleaned.substring(start, end).trim();
    }
  }
  
  return cleaned.trim();
};
