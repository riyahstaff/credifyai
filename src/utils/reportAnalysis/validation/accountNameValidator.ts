
/**
 * Account Name Validator
 * Functions for validating credit account names
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
