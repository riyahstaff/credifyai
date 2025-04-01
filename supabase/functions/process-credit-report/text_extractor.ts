
/**
 * Advanced text extractor for credit reports
 * Handles various file formats including PDF and text
 */

// Helper function to decode PDF text content
function decodePdfText(buffer: ArrayBuffer): string {
  // This is a simplified version - a real implementation would use a PDF parser library
  // In Edge Functions we have limited access to libraries, so this is a basic approximation
  
  const bytes = new Uint8Array(buffer);
  let textContent = "";
  
  // Look for text markers in PDF content
  const textMarkers = [
    { start: "BT", end: "ET" }, // Begin/End Text markers
    { start: "(", end: ")" },   // Text in parentheses
    { start: "<", end: ">" },   // Text in angle brackets
  ];
  
  // Convert the buffer to a string for searching
  const content = Array.from(bytes).map(b => String.fromCharCode(b)).join("");
  
  for (const marker of textMarkers) {
    let startPos = 0;
    while ((startPos = content.indexOf(marker.start, startPos)) !== -1) {
      const contentStart = startPos + marker.start.length;
      const endPos = content.indexOf(marker.end, contentStart);
      
      if (endPos !== -1) {
        const extractedText = content.substring(contentStart, endPos);
        // Only add if it seems like actual text (filter out binary data)
        if (/[a-zA-Z0-9\s]{3,}/.test(extractedText)) {
          textContent += extractedText + "\n";
        }
        startPos = endPos + marker.end.length;
      } else {
        break;
      }
    }
  }
  
  // If we couldn't extract text from markers, look for specific credit report keywords
  if (textContent.length < 100) {
    const keywords = ["CREDIT REPORT", "ACCOUNT SUMMARY", "PERSONAL INFORMATION", 
                     "EXPERIAN", "EQUIFAX", "TRANSUNION", "PAYMENT HISTORY",
                     "CREDIT CARD", "MORTGAGE", "AUTO LOAN"];
    
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        // Extract a chunk of text around the keyword
        const index = content.indexOf(keyword);
        const chunkStart = Math.max(0, index - 200);
        const chunkEnd = Math.min(content.length, index + 400);
        textContent += content.substring(chunkStart, chunkEnd) + "\n";
      }
    }
  }
  
  return textContent;
}

// Main text extraction function
export async function extract_text(file: Blob, filename: string): Promise<string> {
  console.log(`Extracting text from ${filename} (${file.type})`);
  
  try {
    // Check if it's a PDF file by filename or mime type
    const isPdf = filename.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    
    if (isPdf) {
      console.log("Processing PDF file");
      // Read the PDF file as array buffer
      const buffer = await file.arrayBuffer();
      const extractedText = decodePdfText(buffer);
      
      if (extractedText.length > 100) {
        console.log(`Extracted ${extractedText.length} characters from PDF`);
        return extractedText;
      } else {
        console.log("PDF extraction yielded limited text, falling back to text extraction");
        return await file.text();
      }
    } else {
      // For text files, just read as text
      console.log("Processing text file");
      const text = await file.text();
      console.log(`Extracted ${text.length} characters from text file`);
      return text;
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw new Error(`Failed to extract text from ${filename}: ${error.message}`);
  }
}
