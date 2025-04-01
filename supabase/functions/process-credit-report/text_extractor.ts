
// Text extraction utility for credit report files

/**
 * Extract text from a file (PDF, HTML, or text)
 * @param file The file to extract text from
 * @param filename The name of the file (used to determine file type)
 * @returns The extracted text
 */
export async function extract_text(file: Blob, filename: string): Promise<string> {
  console.log(`Extracting text from file: ${filename}`);
  
  // Determine file type based on extension
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    return extract_pdf_text(file);
  } else if (extension === 'html' || extension === 'htm') {
    return extract_html_text(file);
  } else {
    // Assume it's a text file
    return await file.text();
  }
}

/**
 * Extract text from a PDF file
 * Note: In a real implementation, you would use a PDF parsing library
 * For Deno, options might be limited, so this is a placeholder
 */
async function extract_pdf_text(file: Blob): Promise<string> {
  // This is a simplified version
  // In a real implementation, you would use a PDF parsing library
  console.log("Extracting text from PDF");
  
  // For now, we'll just convert the PDF to text using a basic approach
  const text = await file.text();
  
  // Look for text content in PDF format
  const textMarkers = [
    { start: "BT", end: "ET" }, // Begin Text/End Text markers
    { start: "/Text", end: "EMC" }, // Text object markers
    { start: "(", end: ")" }, // Text inside parentheses
    { start: "<", end: ">" }, // Text inside angle brackets
    { start: "/Contents", end: "endstream" }, // Content streams
  ];
  
  let extractedText = "";
  
  // First pass: Extract text using markers
  for (const marker of textMarkers) {
    let startPos = 0;
    while ((startPos = text.indexOf(marker.start, startPos)) !== -1) {
      const contentStart = startPos + marker.start.length;
      const endPos = text.indexOf(marker.end, contentStart);
      
      if (endPos !== -1) {
        const potentialText = text.substring(contentStart, endPos);
        
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
  
  // If we couldn't extract any text using the markers, just return the raw text
  return extractedText || text;
}

/**
 * Extract text from an HTML file
 */
async function extract_html_text(file: Blob): Promise<string> {
  console.log("Extracting text from HTML");
  
  const html = await file.text();
  
  // Simple regex-based HTML tag removal
  // In a real implementation, you would use an HTML parsing library
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags and their contents
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags and their contents
    .replace(/<[^>]+>/g, ' ') // Remove all HTML tags
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
    .trim();
}
