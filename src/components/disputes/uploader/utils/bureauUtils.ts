
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
  
  // Check issue title for bureau names
  if (issue.title && typeof issue.title === 'string') {
    const title = issue.title.toLowerCase();
    if (title.includes('equifax')) {
      return 'Equifax';
    } else if (title.includes('experian')) {
      return 'Experian';
    } else if (title.includes('transunion')) {
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

/**
 * Verify if a letter has been properly stored in session storage
 */
export function verifyLetterStorage(): boolean {
  try {
    const pendingLetter = sessionStorage.getItem('pendingDisputeLetter');
    const generatedLetters = sessionStorage.getItem('generatedDisputeLetters');
    const autoGenerated = sessionStorage.getItem('autoGeneratedLetter');
    
    console.log("Verifying letter storage:");
    console.log("- pendingDisputeLetter exists:", !!pendingLetter);
    console.log("- generatedDisputeLetters exists:", !!generatedLetters);
    console.log("- autoGeneratedLetter flag:", autoGenerated);
    
    // Always set autoGeneratedLetter flag to true if we have any letters
    if ((pendingLetter || generatedLetters) && autoGenerated !== 'true') {
      console.log("Setting autoGeneratedLetter flag to true");
      sessionStorage.setItem('autoGeneratedLetter', 'true');
      sessionStorage.setItem('forceLettersReload', 'true');
    }
    
    return !!(pendingLetter || generatedLetters);
  } catch (error) {
    console.error("Error verifying letter storage:", error);
    return false;
  }
}

/**
 * Force redirect to dispute letters page
 */
export function forceNavigateToLetters(navigate: any): void {
  try {
    // Make sure we have the needed flags
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    sessionStorage.setItem('forceLettersReload', 'true');
    
    console.log("Force navigating to dispute letters page");
    
    // Use setTimeout to allow storage operations to complete
    setTimeout(() => {
      navigate('/dispute-letters');
    }, 1000); // Increased timeout to ensure storage operations complete
  } catch (error) {
    console.error("Error during navigation:", error);
    
    // Try direct navigation as a fallback
    window.location.href = '/dispute-letters';
  }
}

/**
 * Store letter data in session storage
 */
export function storeLetterInStorage(disputeData: any): boolean {
  try {
    // Check if we should store as a single letter or as part of a collection
    const existingLetters = sessionStorage.getItem('generatedDisputeLetters');
    
    if (existingLetters) {
      try {
        // Parse existing letters and add the new one
        const letters = JSON.parse(existingLetters);
        if (Array.isArray(letters)) {
          letters.push(disputeData);
          sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(letters));
          console.log("Added letter to existing collection");
        } else {
          // If parsing succeeded but it's not an array, start a new array
          sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([disputeData]));
          console.log("Created new letter collection");
        }
      } catch (error) {
        // If parsing failed, start a new array
        console.error("Error parsing existing letters:", error);
        sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([disputeData]));
        console.log("Created new letter collection after parsing error");
      }
    } else {
      // No existing collection, create a new one
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify([disputeData]));
      console.log("Created new letter collection");
    }
    
    // Also store as pendingDisputeLetter for backward compatibility
    sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(disputeData));
    sessionStorage.setItem('autoGeneratedLetter', 'true');
    console.log("Stored letter in session storage successfully");
    
    return true;
  } catch (error) {
    console.error("Error storing letter in session storage:", error);
    return false;
  }
}
