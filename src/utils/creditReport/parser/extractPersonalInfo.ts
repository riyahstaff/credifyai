
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
    // Extract name using various patterns - significantly expanded patterns
    const namePatterns = [
      /name:?\s*([A-Za-z\s.'-]{3,30})/i,
      /CONSUMER(?:\s+NAME)?:?\s*([A-Za-z\s.'-]{3,30})/i,
      /(?:PERSONAL|CONSUMER) INFORMATION[^\n]{0,50}(?:name|consumer)(?:[^\n]{0,10})?:?\s*([A-Za-z\s.'-]{3,30})/i,
      /report for:?\s*([A-Za-z\s.'-]{3,30})/i,
      /prepared for:?\s*([A-Za-z\s.'-]{3,30})/i,
      /consumer:?\s*([A-Za-z\s.'-]{3,30})/i,
      /applicant:?\s*([A-Za-z\s.'-]{3,30})/i,
      /(?:^|\n)([A-Z][A-Za-z\s.'-]{2,20}\s+[A-Z][A-Za-z\s.'-]{2,20})(?:\n|$)/,
      /(?:^|\n)([A-Z][A-Za-z\s.'-]{2,25})(?:\n|$)/,
      /PERSONAL INFORMATION\s*\n+\s*([\w\s.'-]{3,30})/i, // Look for name after "PERSONAL INFORMATION"
      /CREDIT REPORT\s+(?:FOR|OF)?\s+([\w\s.'-]{3,30})/i
    ];
    
    for (const pattern of namePatterns) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        personalInfo.name = match[1].trim();
        console.log("Found name:", personalInfo.name);
        break;
      }
    }
    
    // Extract address - enhanced patterns
    const addressPatterns = [
      /(?:address|street|residence|current address)[^\n]{0,20}:?\s*([A-Za-z0-9\s.#,-]{5,60})/i,
      /(?:PERSONAL|CONSUMER) INFORMATION[^\n]{0,100}(?:address|street|residence)[^\n]{0,20}:?\s*([A-Za-z0-9\s.#,-]{5,60})/i,
      /(?:^|\n)(\d+\s+[A-Za-z0-9\s.#,-]{5,50})(?:\n|$)/,
      /ADDRESS(?:[^\n]{0,20})?:?\s*([A-Za-z0-9\s.#,-]{5,60})/i,
      /STREET(?:[^\n]{0,20})?:?\s*([A-Za-z0-9\s.#,-]{5,60})/i,
      /RESIDENCE(?:[^\n]{0,20})?:?\s*([A-Za-z0-9\s.#,-]{5,60})/i,
      /\b(\d+(?:\s*[A-Za-z]+){1,4}(?:\s*\w+\.?){0,2}(?:\s+[A-Za-z]+){0,2})\b/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[1].trim().length > 5) {
        personalInfo.address = match[1].trim();
        console.log("Found address:", personalInfo.address);
        break;
      }
    }
    
    // Extract city, state, zip - enhanced patterns
    const cityStateZipPatterns = [
      /(?:city|address|location)(?:[^\n]{0,30})?(?:\n|,|\s{2,})?\s*([A-Za-z\s.'-]{2,25})\s*,?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/i,
      /([A-Za-z\s.'-]{2,25})\s*,?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)/i,
      /CITY(?:[^\n]{0,20})?:?\s*([A-Za-z\s.'-]{2,25})/i,
      /STATE(?:[^\n]{0,20})?:?\s*([A-Z]{2})/i,
      /ZIP(?:[^\n]{0,20})?:?\s*(\d{5}(?:-\d{4})?)/i
    ];
    
    // Try city, state, zip as a group first
    for (const pattern of cityStateZipPatterns.slice(0, 2)) {
      const match = normalized.match(pattern);
      if (match && match[1] && match[2] && match[3]) {
        personalInfo.city = match[1].trim();
        personalInfo.state = match[2].trim();
        personalInfo.zip = match[3].trim();
        console.log("Found city/state/zip:", personalInfo.city, personalInfo.state, personalInfo.zip);
        break;
      }
    }
    
    // If we didn't find them as a group, try individual patterns
    if (!personalInfo.city) {
      const cityMatch = normalized.match(cityStateZipPatterns[2]);
      if (cityMatch && cityMatch[1]) {
        personalInfo.city = cityMatch[1].trim();
        console.log("Found city:", personalInfo.city);
      }
    }
    
    if (!personalInfo.state) {
      const stateMatch = normalized.match(cityStateZipPatterns[3]);
      if (stateMatch && stateMatch[1]) {
        personalInfo.state = stateMatch[1].trim();
        console.log("Found state:", personalInfo.state);
      }
    }
    
    if (!personalInfo.zip) {
      const zipMatch = normalized.match(cityStateZipPatterns[4]);
      if (zipMatch && zipMatch[1]) {
        personalInfo.zip = zipMatch[1].trim();
        console.log("Found zip:", personalInfo.zip);
      }
    }
    
    // Extract phone - enhanced patterns
    const phonePatterns = [
      /(?:phone|telephone|mobile|contact|cell)[^\n]{0,20}:?\s*(\(?\d{3}\)?[-.)\s]?\d{3}[-.)\s]?\d{4})/i,
      /(?:^|\n)(\(?\d{3}\)?[-.)\s]?\d{3}[-.)\s]?\d{4})(?:\n|$)/
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = normalized.match(pattern);
      if (phoneMatch && phoneMatch[1]) {
        personalInfo.phone = phoneMatch[1].trim();
        console.log("Found phone:", personalInfo.phone);
        break;
      }
    }
    
    // Extract SSN (partial for security) - enhanced patterns
    const ssnPatterns = [
      /(?:ssn|social security)[^\n]{0,30}(?:number)?:?\s*(?:\d{3}-\d{2}-(\d{4})|\*{3}-\*{2}-(\d{4}))/i,
      /(?:^|\n)(?:\d{3}-\d{2}-(\d{4})|\*{3}-\*{2}-(\d{4}))(?:\n|$)/,
      /SSN(?:[^\n]{0,20})?:?\s*(?:\d{3}-\d{2}-(\d{4})|\*{3}-\*{2}-(\d{4}))/i
    ];
    
    for (const pattern of ssnPatterns) {
      const ssnMatch = normalized.match(pattern);
      if (ssnMatch && (ssnMatch[1] || ssnMatch[2])) {
        const lastFour = ssnMatch[1] || ssnMatch[2];
        personalInfo.ssn = `xxx-xx-${lastFour}`;
        console.log("Found SSN (last 4)");
        break;
      }
    }
    
    // Extract date of birth - enhanced patterns
    const dobPatterns = [
      /(?:dob|date of birth|birth date)[^\n]{0,20}:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i,
      /(?:^|\n)(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})(?:\n|$)/,
      /BIRTH(?:[^\n]{0,20})?:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i
    ];
    
    for (const pattern of dobPatterns) {
      const dobMatch = normalized.match(pattern);
      if (dobMatch && dobMatch[1]) {
        personalInfo.dob = dobMatch[1].trim();
        console.log("Found DOB:", personalInfo.dob);
        break;
      }
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
