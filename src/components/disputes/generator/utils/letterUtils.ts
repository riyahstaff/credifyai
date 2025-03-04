
import { DisputeData } from '../types';

export const processDisputeData = (disputeData: DisputeData, testMode: boolean = false) => {
  if (testMode) {
    // Create a properly typed copy with the test mode flag
    disputeData = { 
      ...disputeData, 
      testMode: true // Using a property that's allowed by [key: string]: any
    };
  }
  
  // Store the dispute data in session storage
  try {
    const existingLetterData = sessionStorage.getItem('pendingDisputeLetter');
    if (existingLetterData) {
      const parsedLetter = JSON.parse(existingLetterData);
      if (!parsedLetter.accounts) {
        parsedLetter.accounts = [];
      }
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(parsedLetter));
    }
  } catch (error) {
    console.error("Error updating letter data with accounts:", error);
  }
  
  return disputeData;
};
