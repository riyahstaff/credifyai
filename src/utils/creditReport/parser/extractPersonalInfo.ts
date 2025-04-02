
/**
 * Credit Report Parser - Enhanced Personal Information Extractor
 * Specialized in extracting consumer data from credit reports with improved pattern matching
 */

export interface PersonalInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  ssn?: string;
  dob?: string;
}

export const extractPersonalInfo = (content: string): PersonalInfo => {
  console.log("Extracting personal information from report content length:", content.length);
  
  // Initialize with empty values (no defaults)
  const personalInfo: PersonalInfo = {
    name: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  };
  
  if (!content || content.length < 100) {
    console.warn("Content too short for personal info extraction");
    return personalInfo;
  }
  
  // Normalize line breaks and spaces for consistent processing
  const normalized = content.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  
  try {
    // Extract name using multiple pattern recognition strategies
    console.log("Attempting to extract consumer name");
    
    // First try to find typical "Consumer" or "Name" labels
    const nameLabels = [
      /(?:CONSUMER\s+NAME|NAME|REPORT\s+FOR)(?:[^a-zA-Z]{1,5})([A-Za-z\s.'-]{3,40})\b/i,
      /(?:^|\n|\s{2,})(?:Consumer:?|Name:?|Prepared For:?)\s+([A-Za-z\s.'-]{3,40})\b/i,
      /Your\s+(?:TransUnion|Experian|Equifax)\s+[^\n]{0,20}(?:\n|\s{2,})([A-Za-z\s.'-]{3,40})\b/i,
      /Personal\s+Information[\s\n]+([A-Za-z\s.'-]{3,40})\b/i,
      /PERSONAL\s+PROFILE[\s\n]+([A-Za-z\s.'-]{3,40})\b/i,
      /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?=\s+(?:Report|Credit|SSN|\d{3}-\d{2}))/
    ];
    
    // Try each name pattern until we find a match
    for (const pattern of nameLabels) {
      const match = normalized.match(pattern);
      if (match && match[1]) {
        const candidateName = match[1].trim();
        
        // Skip obvious false positives
        if (!candidateName.includes('.com') && 
            !candidateName.includes('LLC') && 
            !candidateName.toLowerCase().includes('www') &&
            !candidateName.toLowerCase().includes('report') &&
            candidateName.length > 3) {
          personalInfo.name = candidateName;
          console.log("Extracted name:", personalInfo.name);
          break;
        }
      }
    }
    
    // If no name found with labels, try to find name patterns
    if (!personalInfo.name) {
      // Look for typical name formats (First Last)
      const namePatterns = [
        /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?=\n|\s{2,})/,
        /(?:^|\n)([A-Z][a-z]+ [A-Z]\.? [A-Z][a-z]+)(?=\n|\s{2,})/
      ];
      
      for (const pattern of namePatterns) {
        const match = normalized.match(pattern);
        if (match && match[1]) {
          const candidateName = match[1].trim();
          if (candidateName.length > 5 && /[A-Za-z]\s+[A-Za-z]/.test(candidateName)) {
            personalInfo.name = candidateName;
            console.log("Extracted name from pattern:", personalInfo.name);
            break;
          }
        }
      }
    }
    
    // Extract address with multiple patterns and strategies
    console.log("Attempting to extract address");
    
    // Street address patterns
    const addressPatterns = [
      /(?:Address|Street|Residence)(?:[^a-zA-Z]{1,5})([0-9][A-Za-z0-9\s.#,-]{5,60})\b/i,
      /(?:^|\n|\s{2,})(?:Address:?|Street:?|Current Address:?)\s+([0-9][A-Za-z0-9\s.#,-]{5,60})\b/i,
      /(?:^|\n)(\d+\s+[A-Za-z0-9\s.#,-]{5,60})(?=\n|,|\s{2,})/,
      /\b(\d+(?:\s+[A-Za-z]+){1,4}(?:\s+(?:ST|AVE|RD|DR|LN|BLVD|PKWY|CIR|CT|WAY|PL|TER|STREET|AVENUE|ROAD|DRIVE|LANE)\.?))\b/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1]) {
        const candidateAddress = match[1].trim();
        // Require addresses to start with a number and be long enough
        if (/^\d+/.test(candidateAddress) && candidateAddress.length > 5) {
          personalInfo.address = candidateAddress;
          console.log("Extracted address:", personalInfo.address);
          break;
        }
      }
    }
    
    // Extract city, state, zip together or separately
    console.log("Attempting to extract city/state/zip");
    
    // Try to extract the full "City, State ZIP" pattern first
    const cityStateZipPatterns = [
      /(?:^|\n|\s{2,})([A-Za-z\s.'-]{2,25}),?\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b/i,
      /(?:City|Location)(?:[^a-zA-Z]{1,5})([A-Za-z\s.'-]{2,25}),?\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b/i,
      /(?:^|\n)([A-Za-z\s.'-]{2,25}),?\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\b/
    ];
    
    for (const pattern of cityStateZipPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[2] && match[3]) {
        personalInfo.city = match[1].trim();
        personalInfo.state = match[2].trim();
        personalInfo.zip = match[3].trim();
        console.log("Extracted city/state/zip:", personalInfo.city, personalInfo.state, personalInfo.zip);
        break;
      }
    }
    
    // If not found together, try individual components
    if (!personalInfo.city || !personalInfo.state || !personalInfo.zip) {
      // City patterns
      if (!personalInfo.city) {
        const cityPatterns = [
          /City(?:[^a-zA-Z]{1,5})([A-Za-z\s.'-]{2,25})\b/i,
          /(?:^|\n|\s{2,})City:?\s+([A-Za-z\s.'-]{2,25})\b/i
        ];
        
        for (const pattern of cityPatterns) {
          const match = normalized.match(pattern);
          if (match && match[1]) {
            personalInfo.city = match[1].trim();
            console.log("Extracted city:", personalInfo.city);
            break;
          }
        }
      }
      
      // State patterns
      if (!personalInfo.state) {
        const statePatterns = [
          /State(?:[^a-zA-Z]{1,5})([A-Z]{2})\b/i,
          /(?:^|\n|\s{2,})State:?\s+([A-Z]{2})\b/i
        ];
        
        for (const pattern of statePatterns) {
          const match = normalized.match(pattern);
          if (match && match[1]) {
            personalInfo.state = match[1].trim();
            console.log("Extracted state:", personalInfo.state);
            break;
          }
        }
      }
      
      // ZIP patterns
      if (!personalInfo.zip) {
        const zipPatterns = [
          /(?:ZIP|Postal Code)(?:[^a-zA-Z]{1,5})(\d{5}(?:-\d{4})?)\b/i,
          /(?:^|\n|\s{2,})(?:ZIP|Postal Code):?\s+(\d{5}(?:-\d{4})?)\b/i,
          /\b(\d{5}(?:-\d{4})?)\b/
        ];
        
        for (const pattern of zipPatterns) {
          const match = normalized.match(pattern);
          if (match && match[1]) {
            personalInfo.zip = match[1].trim();
            console.log("Extracted zip:", personalInfo.zip);
            break;
          }
        }
      }
    }
    
    // Extract SSN (last 4 digits or masked format)
    console.log("Attempting to extract SSN");
    
    const ssnPatterns = [
      /SSN(?:[^a-zA-Z]{1,5})(?:xxx-xx-|XXX-XX-|●+\s*-?\s*●+\s*-?\s*|[*]+\s*-?\s*[*]+\s*-?\s*)(\d{4})\b/i,
      /Social Security(?:[^a-zA-Z]{1,5})(?:xxx-xx-|XXX-XX-|●+\s*-?\s*●+\s*-?\s*|[*]+\s*-?\s*[*]+\s*-?\s*)(\d{4})\b/i,
      /(?:^|\n|\s{2,})SSN:?\s+(?:xxx-xx-|XXX-XX-|●+\s*-?\s*●+\s*-?\s*|[*]+\s*-?\s*[*]+\s*-?\s*)(\d{4})\b/i,
      /SSN(?:[^a-zA-Z]{1,5})([*\d]+-[*\d]+-\d{4})\b/i
    ];
    
    for (const pattern of ssnPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1]) {
        // If we have a complete (even if masked) SSN, use it
        if (match[1].includes('-')) {
          personalInfo.ssn = match[1].trim();
        } else {
          personalInfo.ssn = `XXX-XX-${match[1].trim()}`;
        }
        console.log("Extracted SSN (masked):", personalInfo.ssn);
        break;
      }
    }
    
    // Extract date of birth
    console.log("Attempting to extract date of birth");
    
    const dobPatterns = [
      /(?:Date of Birth|DOB|Birth Date)(?:[^a-zA-Z]{1,5})(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})\b/i,
      /(?:^|\n|\s{2,})(?:Date of Birth|DOB|Birth Date):?\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})\b/i
    ];
    
    for (const pattern of dobPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1]) {
        personalInfo.dob = match[1].trim();
        console.log("Extracted DOB:", personalInfo.dob);
        break;
      }
    }
    
    // Extract phone number
    console.log("Attempting to extract phone number");
    
    const phonePatterns = [
      /(?:Phone|Telephone|Mobile)(?:[^a-zA-Z]{1,5})(\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4})\b/i,
      /(?:^|\n|\s{2,})(?:Phone|Telephone|Mobile):?\s+(\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4})\b/i
    ];
    
    for (const pattern of phonePatterns) {
      const match = normalized.match(pattern);
      if (match && match[1]) {
        personalInfo.phone = match[1].trim();
        console.log("Extracted phone:", personalInfo.phone);
        break;
      }
    }
    
    // Save to localStorage ONLY if we extracted real data
    if (personalInfo.name && personalInfo.name.length > 3 && !personalInfo.name.includes('.gov')) {
      localStorage.setItem('userName', personalInfo.name);
      console.log("Saved real name to localStorage:", personalInfo.name);
    }
    
    if (personalInfo.address && personalInfo.address.length > 5) {
      localStorage.setItem('userAddress', personalInfo.address);
      console.log("Saved real address to localStorage:", personalInfo.address);
    }
    
    if (personalInfo.city && personalInfo.city.length > 2) {
      localStorage.setItem('userCity', personalInfo.city);
      console.log("Saved real city to localStorage:", personalInfo.city);
    }
    
    if (personalInfo.state && personalInfo.state.length === 2) {
      localStorage.setItem('userState', personalInfo.state);
      console.log("Saved real state to localStorage:", personalInfo.state);
    }
    
    if (personalInfo.zip && personalInfo.zip.length >= 5) {
      localStorage.setItem('userZip', personalInfo.zip);
      console.log("Saved real zip to localStorage:", personalInfo.zip);
    }
    
    // Validate extracted data to avoid "finance.gov" type errors
    if (personalInfo.name && (
        personalInfo.name.includes('.gov') || 
        personalInfo.name.includes('.com') || 
        personalInfo.name.includes('LLC') ||
        personalInfo.name.toLowerCase().includes('apache') ||
        personalInfo.name.toLowerCase().includes('version')
    )) {
      console.warn("Invalid name detected, clearing:", personalInfo.name);
      personalInfo.name = '';
      localStorage.removeItem('userName');
    }
    
    // Final log of extraction results
    const fieldsFound = Object.keys(personalInfo)
      .filter(key => personalInfo[key as keyof PersonalInfo])
      .length;
      
    console.log("Personal info extraction complete:", fieldsFound, "fields found");
    console.log("Extracted info:", {
      name: personalInfo.name || '(not found)',
      address: personalInfo.address || '(not found)',
      city: personalInfo.city || '(not found)',
      state: personalInfo.state || '(not found)',
      zip: personalInfo.zip || '(not found)'
    });
    
    return personalInfo;
  } catch (error) {
    console.error("Error extracting personal information:", error);
    return personalInfo;
  }
};
