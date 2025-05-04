
/**
 * Credit Report Parser - Inquiry Extractor
 * This module handles extracting inquiry information from credit reports
 */

import { CreditReportInquiry } from '../types';

/**
 * Extract inquiry information from credit report content
 */
export const extractInquiries = (
  content: string,
  bureaus: { experian?: boolean; equifax?: boolean; transunion?: boolean; }
): CreditReportInquiry[] => {
  const inquirySectionPatterns = [
    /(?:Inquiries|Credit\s+Inquiries|Requests\s+for\s+Your\s+Credit\s+History)[\s\S]*?((?:Date|Creditor|Subscriber|Company)[^\n]*(?:[\s\S]*?)(?=\s*(?:Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i,
    /(?:INQUIRIES|CREDIT\s+INQUIRIES|Companies\s+who\s+requested\s+your\s+credit\s+information)[\s\S]*?((?:[\d\/]+|[A-Z]{3}\s+\d{1,2})[^\n]*(?:[\s\S]*?)(?=\s*(?:Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i,
    /(?:Regular\s+Inquiries|Hard\s+Inquiries|Inquiries\s+Shared\s+With\s+Others|Inquiries\s+That\s+May\s+Impact\s+Your\s+Credit\s+Rating)[\s\S]*?((?:[\d\/]+|[A-Z]{3}\s+\d{1,2})[^\n]*(?:[\s\S]*?)(?=\s*(?:Account\s+Review|Promotional\s+Inquiries|Inquiries\s+Not\s+Shared|Public\s+Records|Additional\s+Information|Summary|Disclaimers|End\s+of\s+Report|\Z)))/i
  ];
  
  const inquiries: CreditReportInquiry[] = [];
  
  // First try to find the inquiry section
  let inquirySection = '';
  
  for (const pattern of inquirySectionPatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      inquirySection = match[1];
      console.log("Found inquiry section with length:", inquirySection.length);
      break;
    }
  }
  
  // If we found an inquiry section, extract individual inquiries
  if (inquirySection) {
    // Different formats for inquiry matching
    const inquiryBlockPatterns = [
      // Standard format: MM/DD/YYYY CREDITOR NAME
      /(?:(\d{1,2}\/\d{1,2}\/\d{2,4})|(\w{3}\s+\d{1,2},\s+\d{4}))\s+([^\n\r]+)/g,
      
      // TransUnion format: CREDITOR NAME MM/DD/YYYY
      /(?:^|\n|\s{2,})([A-Za-z0-9\s&.',]+)(?:\s{2,}|\t)(\d{1,2}\/\d{1,2}\/\d{2,4})/gm,
      
      // Table format with date in one column, creditor in another
      /(?:^|\n)(?:\s*)(\d{1,2}\/\d{1,2}\/\d{2,4})(?:\s{2,}|\t)([^\n\r]+)(?=\s*$|\s*\n)/gm
    ];
    
    for (const pattern of inquiryBlockPatterns) {
      let inquiryMatch;
      // Use exec instead of matchAll due to compatibility
      pattern.lastIndex = 0; // Reset regex index
      
      while ((inquiryMatch = pattern.exec(inquirySection)) !== null) {
        // Format depends on which pattern matched
        let inquiryDate = '';
        let creditor = '';
        
        if (pattern.source.includes('CREDITOR NAME MM/DD/YYYY')) {
          // TransUnion format: CREDITOR NAME MM/DD/YYYY
          creditor = inquiryMatch[1]?.trim();
          inquiryDate = inquiryMatch[2];
        } else if (pattern.source.includes('date in one column')) {
          // Table format
          inquiryDate = inquiryMatch[1];
          creditor = inquiryMatch[2]?.trim();
        } else {
          // Standard format: MM/DD/YYYY CREDITOR NAME
          inquiryDate = inquiryMatch[1] || inquiryMatch[2];
          creditor = inquiryMatch[3]?.trim();
        }
        
        if (inquiryDate && creditor) {
          // Skip empty or invalid creditor names
          if (creditor === 'N/A' || creditor === '-' || creditor.length < 2) {
            continue;
          }
          
          // Determine which bureau this inquiry is from
          let bureau = "Unknown";
          if (inquirySection.toLowerCase().includes('experian')) {
            bureau = 'Experian';
          } else if (inquirySection.toLowerCase().includes('equifax')) {
            bureau = 'Equifax';
          } else if (inquirySection.toLowerCase().includes('transunion') || 
                     inquirySection.toLowerCase().includes('trans union')) {
            bureau = 'TransUnion';
          } else if (bureaus.experian && !bureaus.equifax && !bureaus.transunion) {
            bureau = 'Experian';
          } else if (!bureaus.experian && bureaus.equifax && !bureaus.transunion) {
            bureau = 'Equifax';
          } else if (!bureaus.experian && !bureaus.equifax && bureaus.transunion) {
            bureau = 'TransUnion';
          }
          
          inquiries.push({
            inquiryDate,
            creditor,
            bureau,
            inquiryCompany: creditor, // Adding inquiryCompany for compatibility
            date: inquiryDate, // Adding date for compatibility with different formats
            name: creditor // Adding name for compatibility
          });
          
          console.log(`Found inquiry: ${creditor} on ${inquiryDate} (${bureau})`);
        }
      }
    }
  }
  
  // If we found inquiries, log and return them
  if (inquiries.length > 0) {
    console.log(`Extracted ${inquiries.length} inquiries from credit report`);
  } else {
    console.log("No inquiries found in credit report");
  }
  
  return inquiries;
};
