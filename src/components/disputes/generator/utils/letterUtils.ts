
import { DisputeData } from '../types';
import { getLegalReferencesForDispute } from '@/utils/creditReport/legalReferences';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

export const processDisputeData = async (disputeData: DisputeData, testMode: boolean = false) => {
  console.log("Processing dispute data for letter generation:", {
    accountName: disputeData.accountName,
    bureau: disputeData.bureau,
    errorType: disputeData.errorType,
    hasActualAccount: !!disputeData.actualAccountInfo
  });
  
  if (testMode) {
    // Add a test mode flag as an additional property
    disputeData = { 
      ...disputeData, 
      testMode: true // Using the [key: string]: any from the interface
    };
  }
  
  // Get legal references relevant to this dispute
  const legalRefs = getLegalReferencesForDispute(disputeData.errorType, disputeData.explanation);
  disputeData.legalReferences = legalRefs;
  
  // Add more precise details to the dispute data
  const userName = localStorage.getItem('userName') || localStorage.getItem('name') || "[YOUR NAME]";
  const userAddress = localStorage.getItem('userAddress') || "[YOUR ADDRESS]";
  const userCity = localStorage.getItem('userCity') || "[CITY]";
  const userState = localStorage.getItem('userState') || "[STATE]";
  const userZip = localStorage.getItem('userZip') || "[ZIP]";
  
  // Add user information
  disputeData.userInfo = {
    name: userName,
    address: userAddress,
    city: userCity,
    state: userState,
    zip: userZip
  };
  
  // Generate letter content if not already present
  if (!disputeData.letterContent) {
    try {
      console.log("Generating enhanced dispute letter content");
      
      // Format the account name and number consistently
      const accountName = disputeData.actualAccountInfo?.name || disputeData.accountName || "Unknown Account";
      const formattedAccountName = accountName.toUpperCase();
      
      let accountNumber = disputeData.actualAccountInfo?.number || disputeData.accountNumber || "1000";
      if (accountNumber.length > 4 && !accountNumber.includes('xx-xxxx-')) {
        accountNumber = `xx-xxxx-${accountNumber.slice(-4)}`;
      } else if (!accountNumber.includes('xx-xxxx-')) {
        accountNumber = `xx-xxxx-${accountNumber}`;
      }
      
      const letterContent = await generateEnhancedDisputeLetter(
        disputeData.errorType,
        {
          accountName: formattedAccountName,
          accountNumber: accountNumber,
          errorDescription: disputeData.explanation,
          bureau: disputeData.bureau
        },
        disputeData.userInfo,
        disputeData.reportData
      );
      
      if (letterContent && letterContent.length > 100) {
        disputeData.letterContent = letterContent;
        console.log("Successfully generated dispute letter content, length:", letterContent.length);
      } else {
        console.warn("Generated letter content is too short or invalid:", letterContent);
      }
    } catch (error) {
      console.error("Error generating letter content:", error);
    }
  }
  
  // Store the dispute data in session storage
  try {
    // First check if there's an existing letter
    const existingLetterData = sessionStorage.getItem('pendingDisputeLetter');
    if (existingLetterData) {
      // Update existing letter
      const parsedLetter = JSON.parse(existingLetterData);
      const updatedLetter = {
        ...parsedLetter,
        ...disputeData,
        bureaus: [disputeData.bureau],
        title: `${disputeData.errorType} (${disputeData.accountName})`,
        status: 'ready',
        createdAt: new Date().toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }),
      };
      
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(updatedLetter));
      console.log("Updated existing letter in session storage");
    } else {
      // Create new letter
      const newLetter = {
        id: Date.now(),
        title: `${disputeData.errorType} (${disputeData.accountName})`,
        recipient: disputeData.bureau,
        createdAt: new Date().toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }),
        status: 'ready',
        bureaus: [disputeData.bureau],
        content: disputeData.letterContent,
        letterContent: disputeData.letterContent,
        ...disputeData
      };
      
      sessionStorage.setItem('pendingDisputeLetter', JSON.stringify(newLetter));
      console.log("Created new letter in session storage");
      
      // Also add to generatedDisputeLetters array
      const existingLetters = sessionStorage.getItem('generatedDisputeLetters');
      let lettersArray = [];
      
      if (existingLetters) {
        try {
          lettersArray = JSON.parse(existingLetters);
          if (!Array.isArray(lettersArray)) {
            lettersArray = [];
          }
        } catch (error) {
          console.error("Error parsing existing letters:", error);
          lettersArray = [];
        }
      }
      
      lettersArray.unshift(newLetter); // Add to beginning of array
      sessionStorage.setItem('generatedDisputeLetters', JSON.stringify(lettersArray));
      // Set timestamp to track when letters were generated
      sessionStorage.setItem('disputeLettersTimestamp', Date.now().toString());
      console.log("Added letter to generatedDisputeLetters array");
    }
  } catch (error) {
    console.error("Error updating letter data:", error);
  }
  
  return disputeData;
};
