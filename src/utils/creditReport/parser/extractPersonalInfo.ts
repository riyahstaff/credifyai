
/**
 * Credit Report Parser - Personal Information Extractor
 * This module extracts personal information from credit reports
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
  
  // Normalize line breaks and spaces
  const normalized = content.replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  
  try {
    // Extract name using various patterns
    const namePatterns = [
      /name:?\s*([A-Za-z\s.'-]{3,30})/i,
      /CONSUMER(?:\s+NAME)?:?\s*([A-Za-z\s.'-]{3,30})/i,
      /(?:PERSONAL|CONSUMER) INFORMATION[^\n]{0,50}(?:name|consumer)(?:[^\n]{0,10})?:?\s*([A-Za-z\s.'-]{3,30})/i,
      /report for:?\s*([A-Za-z\s.'-]{3,30})/i,
      /prepared for:?\s*([A-Za-z\s.'-]{3,30})/i
    ];
    
    for (const pattern of namePatterns) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        personalInfo.name = match[1].trim();
        console.log("Found name:", personalInfo.name);
        break;
      }
    }
    
    // Extract address
    const addressPatterns = [
      /(?:address|street|residence|current address)[^\n]{0,20}:?\s*([A-Za-z0-9\s.#,-]{5,50})/i,
      /(?:PERSONAL|CONSUMER) INFORMATION[^\n]{0,100}(?:address|street|residence)[^\n]{0,20}:?\s*([A-Za-z0-9\s.#,-]{5,50})/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[1].trim().length > 5) {
        personalInfo.address = match[1].trim();
        console.log("Found address:", personalInfo.address);
        break;
      }
    }
    
    // Extract city, state, zip
    const cityStateZipPatterns = [
      /(?:city|address|location)(?:[^\n]{0,30})?(?:\n|,|\s{2,})?\s*([A-Za-z\s.'-]{2,25})\s*,?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/i,
      /([A-Za-z\s.'-]{2,25})\s*,?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/i
    ];
    
    for (const pattern of cityStateZipPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[2] && match[3]) {
        personalInfo.city = match[1].trim();
        personalInfo.state = match[2].trim();
        personalInfo.zip = match[3].trim();
        console.log("Found city/state/zip:", personalInfo.city, personalInfo.state, personalInfo.zip);
        break;
      }
    }
    
    // Extract phone
    const phonePattern = /(?:phone|telephone|mobile|contact)[^\n]{0,20}:?\s*(\(?\d{3}\)?[-.)\s]?\d{3}[-.)\s]?\d{4})/i;
    const phoneMatch = normalized.match(phonePattern);
    if (phoneMatch && phoneMatch[1]) {
      personalInfo.phone = phoneMatch[1].trim();
      console.log("Found phone:", personalInfo.phone);
    }
    
    // Extract SSN (partial for security)
    const ssnPattern = /(?:ssn|social security)[^\n]{0,30}(?:number)?:?\s*(?:\d{3}-\d{2}-(\d{4})|\*{3}-\*{2}-(\d{4}))/i;
    const ssnMatch = normalized.match(ssnPattern);
    if (ssnMatch && (ssnMatch[1] || ssnMatch[2])) {
      const lastFour = ssnMatch[1] || ssnMatch[2];
      personalInfo.ssn = `xxx-xx-${lastFour}`;
      console.log("Found SSN (last 4)");
    }
    
    // Extract date of birth
    const dobPattern = /(?:dob|date of birth|birth date)[^\n]{0,20}:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i;
    const dobMatch = normalized.match(dobPattern);
    if (dobMatch && dobMatch[1]) {
      personalInfo.dob = dobMatch[1].trim();
      console.log("Found DOB:", personalInfo.dob);
    }
    
    // Save to localStorage for the letter generation
    if (personalInfo.name) localStorage.setItem('userName', personalInfo.name);
    if (personalInfo.address) localStorage.setItem('userAddress', personalInfo.address);
    if (personalInfo.city) localStorage.setItem('userCity', personalInfo.city);
    if (personalInfo.state) localStorage.setItem('userState', personalInfo.state);
    if (personalInfo.zip) localStorage.setItem('userZip', personalInfo.zip);
    
    // Log extraction results
    console.log("Personal info extraction complete:", Object.keys(personalInfo)
      .filter(key => personalInfo[key as keyof PersonalInfo])
      .length, "fields found");
      
    return personalInfo;
  } catch (error) {
    console.error("Error extracting personal information:", error);
    // Return whatever we have so far
    return personalInfo;
  }
};
