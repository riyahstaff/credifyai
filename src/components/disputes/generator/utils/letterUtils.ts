
import { DisputeData } from '../types';

export const processDisputeData = (disputeData: DisputeData, testMode: boolean = false) => {
  if (testMode) {
    // Add a test mode flag as an additional property
    disputeData = { 
      ...disputeData, 
      testMode: true // Using the [key: string]: any from the interface
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
