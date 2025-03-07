
/**
 * Account Name Cleaner
 * Functions for cleaning and formatting account names
 */

/**
 * Clean account name for display
 */
export const cleanAccountName = (name: string): string => {
  // Exit early if name is empty or a placeholder like "Multiple Accounts"
  if (!name || name.toLowerCase().includes('multiple accounts')) {
    return "";
  }

  // Remove PDF artifacts and common garbage patterns
  let cleaned = name.replace(/^\d+\s+\d+\s+/, ''); // Remove patterns like "142 0 "
  cleaned = cleaned.replace(/GM\s+/, ''); // Remove "GM " prefix
  cleaned = cleaned.replace(/^obj\s+/, ''); // Remove "obj " prefix
  cleaned = cleaned.replace(/endobj.*$/, ''); // Remove "endobj" and anything after
  cleaned = cleaned.replace(/endstream.*$/, ''); // Remove "endstream" and anything after
  cleaned = cleaned.replace(/Length\s+\d+/, ''); // Remove "Length ##" pattern
  cleaned = cleaned.replace(/Typ\s+\w+/, ''); // Remove "Typ X" pattern
  
  // Remove any purely numeric sections at the beginning
  cleaned = cleaned.replace(/^[\d\s]+/, '');
  
  // If the name has a mix of garbage and real text, try to extract real words
  // Most real creditor names have 2+ capital letters in a row
  const matches = cleaned.match(/[A-Z]{2,}[A-Za-z\s&.',()-]+/);
  if (matches && matches[0].length > 3) {
    return matches[0].trim();
  }
  
  // For common credit accounts, try to extract known creditor names
  const commonCreditors = [
    "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE", "AUTO", "FINANCE", "LOAN", "MORTGAGE", "SANTANDER",
    "FIRST PREMIER", "USAA", "PNC", "BARCLAYS", "JPMCB", "LENDING CLUB", "PROSPER",
    "NAVY FEDERAL", "US BANK", "FIFTH THIRD", "ALLY", "TOYOTA", "HONDA", "NISSAN",
    "FORD", "GM", "CHRYSLER", "MERCEDES", "BMW", "LEXUS", "HYUNDAI", "KIA"
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
  
  // If we've reached here, try to capitalize words consistently
  if (cleaned.length > 0) {
    return cleaned.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  return cleaned.trim();
};
