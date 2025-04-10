/**
 * Credit Report PDF Extractor Module
 * Specialized in extracting text from PDF files with enhanced detection for credit reports
 */

// Function to yield control back to the browser to prevent unresponsive dialogs
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log(`Starting enhanced PDF extraction for ${file.name} (${file.type})`);
  
  try {
    // We need to use a third-party PDF parsing library since we're getting raw binary data
    // First attempt: Try to use PDF.js to extract the text if available
    if (window.pdfjsLib) {
      console.log("Using PDF.js for extraction");
      return await extractWithPDFJS(file);
    }
    
    // Yield to prevent unresponsiveness
    await yieldToMain();
    
    // Second attempt: Use the browser's PDF capabilities if available
    const arrayBuffer = await file.arrayBuffer();
    
    // Create a blob URL and an iframe to load the PDF
    const blobUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }));
    
    try {
      // Try to use a more advanced extraction technique
      console.log("Attempting browser-based PDF text extraction");
      const text = await extractTextWithBrowser(blobUrl);
      
      if (text && text.length > 200) {
        console.log(`Successfully extracted ${text.length} characters of text using browser method`);
        return text;
      }
    } catch (e) {
      console.warn("Browser-based extraction failed:", e);
    } finally {
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    }
    
    // Yield to prevent unresponsiveness
    await yieldToMain();
    
    // Last resort: Convert the binary PDF data to text and look for patterns
    console.log("Falling back to binary pattern extraction");
    const decoder = new TextDecoder('utf-8');
    let textContent = decoder.decode(arrayBuffer);
    
    // Remove binary data and extract readable text
    textContent = await cleanPDFText(textContent);
    
    // Look for credit report specific sections
    const extractedSections = await extractCreditReportSections(textContent);
    
    if (extractedSections && extractedSections.length > 100) {
      console.log(`Extracted ${extractedSections.length} characters from structured sections`);
      return extractedSections;
    }
    
    console.log("Could not extract structured text, returning cleaned text");
    return textContent;
    
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Extract text using PDF.js if available
const extractWithPDFJS = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Process pages in chunks to prevent long-running script warnings
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
      
      // Yield to main thread every 3 pages
      if (i % 3 === 0 && i < pdf.numPages) {
        await yieldToMain();
      }
    }
    
    console.log(`Extracted ${fullText.length} characters using PDF.js`);
    return fullText;
  } catch (e) {
    console.warn("PDF.js extraction failed:", e);
    throw e;
  }
};

// Extract text using browser capabilities
const extractTextWithBrowser = (pdfUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    let timeout = setTimeout(() => {
      document.body.removeChild(iframe);
      reject(new Error("PDF extraction timed out"));
    }, 5000);
    
    iframe.onload = () => {
      try {
        clearTimeout(timeout);
        
        // Try to access the PDF document
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDocument) {
          throw new Error("Could not access iframe document");
        }
        
        // Get the text content
        let text = iframeDocument.body.textContent || '';
        
        // Clean up
        document.body.removeChild(iframe);
        
        if (text.length > 200) {
          resolve(text);
        } else {
          reject(new Error("Extracted text is too short"));
        }
      } catch (e) {
        document.body.removeChild(iframe);
        reject(e);
      }
    };
    
    iframe.src = pdfUrl;
  });
};

// Clean PDF text by removing binary data and non-text content
const cleanPDFText = async (rawText: string): Promise<string> => {
  // Process text in chunks to prevent long-running script warnings
  await yieldToMain();
  
  // Remove PDF binary headers and content
  let text = rawText.replace(/%PDF-[\d.]+[\s\S]*?stream/gi, '')
                   .replace(/endstream[\s\S]*?endobj/gi, '')
                   .replace(/<<[\s\S]*?>>/gi, '');
  
  await yieldToMain();
  
  // Replace escaped characters
  text = text.replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');
  
  await yieldToMain();
  
  // Keep only printable ASCII characters - process in chunks
  let cleaned = '';
  const chunkSize = 10000; // Process 10K characters at a time
  
  for (let chunk = 0; chunk < rawText.length; chunk += chunkSize) {
    const endIndex = Math.min(chunk + chunkSize, rawText.length);
    const textChunk = rawText.substring(chunk, endIndex);
    
    for (let i = 0; i < textChunk.length; i++) {
      const code = textChunk.charCodeAt(i);
      if ((code >= 32 && code <= 126) || code === 9 || code === 10 || code === 13) {
        cleaned += textChunk.charAt(i);
      }
    }
    
    // Yield to main thread after each chunk
    if (chunk + chunkSize < rawText.length) {
      await yieldToMain();
    }
  }
  
  // Remove PDF operators
  cleaned = cleaned.replace(/\/(Font|F|Helvetica|Arial|Pages|Page|Encoding)[\s\d]+/g, ' ');
  
  return cleaned;
};

// Extract important credit report sections using known keywords
const extractCreditReportSections = async (text: string): Promise<string> => {
  const sections = [];
  
  // Common credit report sections
  const sectionKeywords = [
    'Personal Information', 'Consumer Information', 'Credit Summary',
    'Account Information', 'Account History', 'Public Records',
    'Credit Inquiries', 'Collections', 'Negative Items',
    'Payment History', 'Credit Score', 'FICO', 'TransUnion', 
    'Equifax', 'Experian', 'Tradeline', 'Dispute'
  ];
  
  const lowerText = text.toLowerCase();
  
  // Find paragraphs containing relevant information - process in chunks
  for (let i = 0; i < sectionKeywords.length; i++) {
    const keyword = sectionKeywords[i];
    const lowerKeyword = keyword.toLowerCase();
    const keywordIndex = lowerText.indexOf(lowerKeyword);
    
    if (keywordIndex !== -1) {
      // Extract a window of text (1000 chars) around the keyword
      const start = Math.max(0, keywordIndex - 100);
      const end = Math.min(text.length, keywordIndex + 900);
      const sectionText = text.substring(start, end);
      
      // Only add if this section contains readable text (not just binary data)
      if (/[a-z]{3,}/i.test(sectionText)) {
        sections.push(`--- ${keyword.toUpperCase()} SECTION ---\n${sectionText}\n`);
      }
    }
    
    // Yield every 5 keywords
    if (i % 5 === 0 && i > 0) {
      await yieldToMain();
    }
  }
  
  // Look for account numbers and card numbers (masked with X's)
  const accountPattern = /(?:account|acct)[^\d]*?(?:number|#|no)?[^\d]*?(\d[\dX]+\d)/gi;
  let match;
  let matchCount = 0;
  
  while ((match = accountPattern.exec(text)) !== null) {
    if (match[1] && match[1].length > 4) {
      const start = Math.max(0, match.index - 50);
      const end = Math.min(text.length, match.index + 150);
      const context = text.substring(start, end);
      
      sections.push(`--- ACCOUNT DETAIL ---\n${context}\n`);
    }
    
    // Yield every 5 matches to prevent browser hanging
    matchCount++;
    if (matchCount % 5 === 0) {
      await yieldToMain();
    }
  }
  
  return sections.join('\n');
};
