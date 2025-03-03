
/**
 * Credit Report File Extractors
 * This module handles extracting text from various file formats
 */

/**
 * Extract text content from PDF file
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log(`Extracting text from file: ${file.name} (${file.type})`);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      if (!e.target?.result) {
        reject(new Error("Failed to read file content"));
        return;
      }
      
      try {
        let text = "";
        
        // For PDF files, we would ideally use a proper PDF parser library
        if (file.type === 'application/pdf') {
          console.log("Processing PDF file");
          // This is a simplified extraction that would be replaced with proper PDF parsing
          const content = e.target.result.toString();
          
          // Try to extract text content from the PDF binary data
          text = extractTextFromBinaryPDF(content);
          console.log("PDF content extracted, length:", text.length);
        } else {
          // For text files, we can just use the result directly
          console.log("Processing text file");
          text = e.target.result.toString();
        }
        
        console.log(`Extracted ${text.length} characters of text from the file`);
        
        // Log a sample of the text to help with debugging
        if (text.length > 0) {
          console.log("Sample of extracted text:", text.substring(0, 200) + "...");
        } else {
          console.log("No text was extracted from the file");
        }
        
        resolve(text);
      } catch (error) {
        console.error("Error processing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    if (file.type === 'application/pdf') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

/**
 * Improved extraction of text from PDF binary data
 * This is a more thorough approach to extract text from PDF content
 */
function extractTextFromBinaryPDF(binaryData: string): string {
  let extractedText = "";
  
  // More comprehensive text markers in PDF data
  const textMarkers = [
    { start: "BT", end: "ET" }, // Begin Text/End Text markers
    { start: "/Text", end: "EMC" }, // Text object markers
    { start: "(", end: ")" }, // Text inside parentheses
    { start: "<", end: ">" }, // Text inside angle brackets
    { start: "/Contents", end: "endstream" }, // Content streams
    { start: "/Title", end: "/", offset: 7 }, // Document title
    { start: "/Subject", end: "/", offset: 9 }, // Document subject
    { start: "/Keywords", end: "/", offset: 10 }, // Document keywords
    { start: "/Author", end: "/", offset: 8 } // Document author
  ];
  
  // First pass: Extract text using markers
  for (const marker of textMarkers) {
    let startPos = 0;
    while ((startPos = binaryData.indexOf(marker.start, startPos)) !== -1) {
      const contentStart = startPos + marker.start.length + (marker.offset || 0);
      const endPos = binaryData.indexOf(marker.end, contentStart);
      
      if (endPos !== -1) {
        const potentialText = binaryData.substring(contentStart, endPos);
        
        // Filter to only include printable ASCII characters and common separators
        const cleanText = potentialText.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
        
        if (cleanText.length > 3) { // Only add if it seems like actual text
          extractedText += cleanText + "\n";
        }
        
        startPos = endPos + marker.end.length;
      } else {
        break;
      }
    }
  }
  
  // Second pass: Look for sections with higher probability of being credit report content
  const creditReportKeywords = [
    "CREDIT REPORT", "PERSONAL INFORMATION", "ACCOUNT SUMMARY", 
    "ACCOUNTS", "INQUIRIES", "PUBLIC RECORDS", "EXPERIAN", "EQUIFAX", 
    "TRANSUNION", "FICO", "SCORE", "TRADE", "TRADELINE", "CREDIT CARD",
    "MORTGAGE", "AUTO LOAN", "PAYMENT HISTORY", "LATE PAYMENT", "BALANCE",
    "CREDIT LIMIT", "DISPUTE", "CREDITOR", "LOAN", "FINANCE"
  ];
  
  for (const keyword of creditReportKeywords) {
    let keywordPos = 0;
    while ((keywordPos = binaryData.indexOf(keyword, keywordPos)) !== -1) {
      // Extract a larger chunk of text around the keyword for more context
      const startPos = Math.max(0, keywordPos - 100);
      const endPos = Math.min(binaryData.length, keywordPos + keyword.length + 200);
      const chunk = binaryData.substring(startPos, endPos);
      
      // Filter to only include printable ASCII characters and common separators
      const cleanChunk = chunk.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
      
      if (cleanChunk.length > keyword.length) {
        extractedText += cleanChunk + "\n";
      }
      
      keywordPos += keyword.length;
    }
  }
  
  // Post-processing: Deduplicate lines, ensure proper spacing
  const lines = extractedText.split('\n');
  const uniqueLines = [...new Set(lines)].filter(line => line.trim().length > 0);
  
  return uniqueLines.join('\n');
}

// Helper function to convert extracted text to HTML format
export const extractAndFormatPDF = async (file: File): Promise<string> => {
  const extractedText = await extractTextFromPDF(file);
  const { convertReportToHtml } = await import('../creditReport/formatters/htmlFormatter');
  return convertReportToHtml(extractedText, true); // Pass true to indicate it's from PDF
};

