
/**
 * Credit Report PDF Extractor Module
 * Specialized in extracting text from PDF files with enhanced detection for credit reports
 */

export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log(`Extracting text from ${file.name} (${file.type})`);
  
  try {
    // Verify if file is a PDF by MIME type or extension
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    if (!isPdf) {
      console.log("Extracting as text file (not PDF)");
      const text = await file.text();
      console.log(`Extracted ${text.length} characters from text file`);
      return text;
    }
    
    // For PDF files, we use multiple extraction methods for better results
    console.log("Extracting as PDF file");
    
    // First attempt: Use FileReader to read as text
    try {
      const fileText = await readFileAsText(file);
      if (fileText && fileText.length > 500) {
        console.log(`PDF basic text extraction successful: ${fileText.length} characters`);
        // Display a sample for debugging
        console.log("Text sample:", fileText.substring(0, 300));
        return fileText;
      }
    } catch (e) {
      console.warn("Basic text extraction failed:", e);
    }
    
    // Second attempt: Use arrayBuffer for binary processing
    try {
      const arrayBuffer = await file.arrayBuffer();
      const binaryStr = new TextDecoder().decode(new Uint8Array(arrayBuffer));
      
      // Look for text patterns in the binary data
      const extractedText = extractTextFromBinary(binaryStr);
      
      if (extractedText && extractedText.length > 500) {
        console.log(`Binary extraction successful: ${extractedText.length} characters`);
        console.log("Text sample:", extractedText.substring(0, 300));
        return extractedText;
      }
    } catch (e) {
      console.warn("Binary extraction failed:", e);
    }
    
    // Last resort - try content sniffing
    console.log("Attempting content sniffing from PDF");
    const textContent = await sniffPdfContent(file);
    console.log(`Content sniffing result: ${textContent.length} characters`);
    console.log("Text sample:", textContent.substring(0, 300));
    
    return textContent;
  } catch (error) {
    console.error("Error in PDF text extraction:", error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Enhanced FileReader promise wrapper
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          resolve(e.target.result.toString());
        } else {
          reject(new Error("Failed to read file content"));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (e) => {
      reject(new Error(`Error reading file: ${e}`));
    };
    
    reader.readAsText(file);
  });
};

// Extract text from binary data
const extractTextFromBinary = (binaryStr: string): string => {
  let extractedText = "";
  
  // Pattern for finding text blocks in PDF binary data
  const textPatterns = [
    /BT\s*\/(.*?)\s+Tf\s*(.*?)ET/g,
    /\((.*?)\)/g,
    /<([0-9A-Fa-f]{4,})>/g,
    /\/(.*?)\s+\d+\s+Tf/g
  ];
  
  // Extract text using patterns
  textPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(binaryStr)) !== null) {
      if (match[1] && match[1].length > 3) {
        // Filter out binary garbage
        if (/[a-zA-Z0-9\s.,;:]{3,}/.test(match[1])) {
          extractedText += match[1] + "\n";
        }
      }
    }
  });
  
  // Credit report specific content extraction
  const creditReportKeywords = [
    "credit report", "personal information", "consumer", "account", "payment history", 
    "inquiry", "public record", "experian", "equifax", "transunion", "fico", "score",
    "date opened", "balance", "credit limit", "payment status"
  ];
  
  creditReportKeywords.forEach(keyword => {
    const keywordRegex = new RegExp(`[^\\n]{0,50}${keyword}[^\\n]{0,50}`, 'gi');
    let keywordMatch;
    while ((keywordMatch = keywordRegex.exec(binaryStr)) !== null) {
      if (keywordMatch[0]) {
        extractedText += keywordMatch[0] + "\n";
      }
    }
  });
  
  return extractedText;
};

// Last resort: Content sniffing by slicing the file
const sniffPdfContent = async (file: File): Promise<string> => {
  try {
    // Read as ArrayBuffer to access binary data
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Convert to string for easier processing
    let content = '';
    for (let i = 0; i < bytes.length; i++) {
      // Only include printable ASCII characters and common whitespace
      if ((bytes[i] >= 32 && bytes[i] <= 126) || [9, 10, 13].includes(bytes[i])) {
        content += String.fromCharCode(bytes[i]);
      }
    }
    
    // Clean up the content
    content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Look for sections that might contain readable text (consecutive alphabetic characters)
    let extractedText = '';
    const sections = content.match(/[a-zA-Z\s.,;:]{10,}/g) || [];
    
    sections.forEach(section => {
      if (section.length > 10) {
        extractedText += section + '\n';
      }
    });
    
    // Add additional targeted extraction for common credit report fields
    const nameMatch = content.match(/name\s*[:\.\s]+\s*([a-zA-Z\s.-]{3,40})/i);
    if (nameMatch && nameMatch[1]) {
      extractedText += `CONSUMER NAME: ${nameMatch[1]}\n`;
    }
    
    const addressMatch = content.match(/address\s*[:\.\s]+\s*([a-zA-Z0-9\s.,#-]{5,60})/i);
    if (addressMatch && addressMatch[1]) {
      extractedText += `ADDRESS: ${addressMatch[1]}\n`;
    }
    
    const ssnMatch = content.match(/ssn\s*[:\.\s]+\s*([\d-*]{4,11})/i);
    if (ssnMatch && ssnMatch[1]) {
      extractedText += `SSN: ${ssnMatch[1]}\n`;
    }
    
    return extractedText;
  } catch (error) {
    console.error("Error in PDF content sniffing:", error);
    return "";
  }
};

