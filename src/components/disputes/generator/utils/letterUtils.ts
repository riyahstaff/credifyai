
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
  
  // Get legal references relevant to this dispute
  const legalRefs = getLegalReferencesForDispute(disputeData.errorType, disputeData.explanation);
  disputeData.legalReferences = legalRefs;
  
  // Get user info from credit report data if available
  const reportDataJSON = sessionStorage.getItem('creditReportData');
  let reportData = null;
  
  if (reportDataJSON) {
    try {
      reportData = JSON.parse(reportDataJSON);
      console.log("Found stored credit report data with primaryBureau:", reportData.primaryBureau);
      
      // Use the primary bureau from the report if available and no bureau specified
      if (reportData.primaryBureau && (!disputeData.bureau || disputeData.bureau === "TransUnion")) {
        disputeData.bureau = reportData.primaryBureau;
        console.log("Using primary bureau from report:", disputeData.bureau);
      }
    } catch (error) {
      console.error("Error parsing stored report data:", error);
    }
  }
  
  // Add more precise details to the dispute data
  let userName = '';
  let userAddress = '';
  let userCity = '';
  let userState = '';
  let userZip = '';
  
  // First try to use personal info from the credit report
  if (reportData && reportData.personalInfo) {
    const pi = reportData.personalInfo;
    userName = pi.name || localStorage.getItem('userName') || "";
    userAddress = pi.address || localStorage.getItem('userAddress') || "";
    userCity = pi.city || localStorage.getItem('userCity') || "";
    userState = pi.state || localStorage.getItem('userState') || "";
    userZip = pi.zip || localStorage.getItem('userZip') || "";
    
    console.log("Using personal info from credit report:", {
      name: userName,
      address: userAddress,
      city: userCity,
      state: userState,
      zip: userZip
    });
  } else {
    // Fall back to localStorage if no report data
    userName = localStorage.getItem('userName') || "";
    userAddress = localStorage.getItem('userAddress') || "";
    userCity = localStorage.getItem('userCity') || "";
    userState = localStorage.getItem('userState') || "";
    userZip = localStorage.getItem('userZip') || "";
  }
  
  // Add user information - only if we have real data
  disputeData.userInfo = {
    name: userName || "[YOUR NAME]",
    address: userAddress || "[YOUR ADDRESS]",
    city: userCity || "[CITY]",
    state: userState || "[STATE]",
    zip: userZip || "[ZIP]"
  };
  
  // Add report data to dispute data for enhanced letter generation
  disputeData.reportData = reportData;
  
  // Generate letter content if not already present
  if (!disputeData.letterContent) {
    try {
      console.log("Generating enhanced dispute letter content for bureau:", disputeData.bureau);
      
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
          bureau: disputeData.bureau,
          relevantReportText: reportData?.rawText?.substring(0, 10000) // Add more report text
        },
        disputeData.userInfo,
        reportData
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
