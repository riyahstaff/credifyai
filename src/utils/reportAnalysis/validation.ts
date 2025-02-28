
/**
 * Validation Module
 * Functions for validating and cleaning account data
 */

/**
 * Helper function to check if an account name is valid
 */
export const isValidAccountName = (name: string): boolean => {
  if (!name) return false;
  
  // Look for common PDF artifacts and garbage strings
  if (name.includes('endstream') || 
      name.includes('endobj') || 
      name.includes('FIRST') ||
      name.includes('Length') || 
      name.includes('Typ') ||
      name.match(/^[0-9]+\s*0\s*/) || // Pattern like "142 0" often in PDF data
      name.includes('GM') || // Common artifact in parsed PDFs
      name.includes('obj') ||
      name.match(/[{}\\<>]/g) // Special characters common in PDF artifacts
  ) {
    return false;
  }
  
  // Real account names typically have mostly alphanumeric characters
  // Count special characters (excluding spaces)
  const specialCharCount = (name.match(/[^a-zA-Z0-9\s]/g) || []).length;
  
  // If more than 15% of characters are special characters, it's likely not a valid name
  if (specialCharCount > name.length * 0.15) {
    return false;
  }
  
  // Real account names usually have uppercase letters
  const uppercaseCount = (name.match(/[A-Z]/g) || []).length;
  
  // Legitimate creditor names usually have capital letters
  if (name.length > 5 && uppercaseCount === 0) {
    return false;
  }
  
  // Check for known creditor names
  const commonCreditors = [
    "CARMAX", "CAPITAL ONE", "CHASE", "BANK OF AMERICA", "WELLS FARGO", 
    "DISCOVER", "AMERICAN EXPRESS", "AMEX", "CITI", "CITIBANK", "TD BANK",
    "SYNCHRONY", "CREDIT ONE"
  ];
  
  for (const creditor of commonCreditors) {
    if (name.includes(creditor)) {
      return true;
    }
  }
  
  // Most legitimate account names will be at least 3 characters
  return name.length >= 3 && uppercaseCount > 0;
};

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
