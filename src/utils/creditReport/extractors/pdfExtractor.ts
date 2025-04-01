
/**
 * Credit Report PDF Extractor Module
 * This module handles text extraction from PDF files using various methods
 */

export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log(`Extracting text from ${file.name} (${file.type})`);
  
  try {
    // Check if it's a PDF by MIME type or extension
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    if (!isPdf) {
      // For non-PDF files, just read as text
      console.log("Extracting as text file (not PDF)");
      const text = await file.text();
      console.log(`Extracted ${text.length} characters from text file`);
      return text;
    }
    
    // For PDF files, we try multiple extraction methods
    console.log("Extracting as PDF file");
    
    // First try with advanced extraction methods
    try {
      const pdfJs = await importPdfJs();
      if (pdfJs) {
        const text = await extractUsingPdfJs(file, pdfJs);
        if (text && text.length > 200) {
          console.log(`Successfully extracted ${text.length} characters using PDF.js`);
          return text;
        }
      }
    } catch (pdfJsError) {
      console.warn("PDF.js extraction failed:", pdfJsError);
    }
    
    // Fallback to basic extraction
    console.log("Falling back to basic text extraction");
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await basicPdfTextExtraction(arrayBuffer);
      if (text && text.length > 100) {
        console.log(`Extracted ${text.length} characters using basic method`);
        return text;
      }
    } catch (basicError) {
      console.warn("Basic PDF extraction failed:", basicError);
    }
    
    // Last resort: try to read as plain text
    console.log("All PDF extraction methods failed, trying as plain text");
    const textContent = await file.text();
    console.log(`Read ${textContent.length} characters as plain text`);
    return textContent;
    
  } catch (error) {
    console.error("Error in PDF text extraction:", error);
    throw new Error(`Failed to extract text from file: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Dynamically import PDF.js
const importPdfJs = async () => {
  try {
    // This simulates dynamically importing PDF.js
    // In a real implementation, this would use a proper PDF.js library
    return {
      getDocument: async (data: ArrayBuffer) => {
        return {
          promise: Promise.resolve({
            numPages: 1,
            getPage: async (pageNum: number) => {
              return {
                getTextContent: async () => {
                  return { items: [] };
                }
              };
            }
          })
        };
      }
    };
  } catch (error) {
    console.error("Failed to import PDF.js:", error);
    return null;
  }
};

// Extract text using PDF.js (simulated)
const extractUsingPdfJs = async (file: File, pdfJs: any): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfJs.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    
    // Simulate extracting from a single page PDF
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    
    if (content.items && content.items.length > 0) {
      // In a real implementation, we would process the text items from PDF.js
      fullText = "Simulated PDF.js extraction (would have real content)";
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting text using PDF.js:", error);
    return "";
  }
};

// Basic PDF text extraction using pattern matching (simplified version)
const basicPdfTextExtraction = async (buffer: ArrayBuffer): Promise<string> => {
  const bytes = new Uint8Array(buffer);
  let textContent = "";
  
  // Convert to string for easier processing
  const content = Array.from(bytes).map(b => String.fromCharCode(b)).join('');
  
  // Find blocks of text by looking for common patterns in PDF text objects
  const patterns = [
    /BT\s*\/(.*?)\s+(\d+)\s+Tf\s*(.*?)ET/g,
    /\(([^)]{3,})\)/g,
    /<([0-9A-Fa-f]{4,})>/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // Extract the likely text content from the match
      const extracted = match[1] || match[0];
      
      // Skip binary data and short strings
      if (extracted.length > 3 && /[a-zA-Z0-9\s.,;:]{3,}/.test(extracted)) {
        textContent += extracted + "\n";
      }
    }
  }
  
  // Look for common credit report keywords to extract meaningful context
  const keywords = [
    "CREDIT REPORT", "PERSONAL INFORMATION", "ACCOUNTS", "ACCOUNT HISTORY", 
    "INQUIRIES", "PUBLIC RECORDS", "EXPERIAN", "EQUIFAX", "TRANSUNION",
    "PAYMENT HISTORY", "BALANCE", "CREDIT LIMIT", "LATE PAYMENT"
  ];
  
  for (const keyword of keywords) {
    const index = content.indexOf(keyword);
    if (index !== -1) {
      // Extract a chunk of text around the keyword
      const start = Math.max(0, index - 100);
      const end = Math.min(content.length, index + keyword.length + 200);
      textContent += content.substring(start, end) + "\n";
    }
  }
  
  return textContent;
};
