
/**
 * Credit Report PDF Extractor Module
 * Specialized in extracting text from PDF files with enhanced detection for credit reports
 * Optimized for performance with large files
 */

// Function to yield control back to the browser to prevent unresponsive dialogs
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export const extractTextFromPDF = async (file: File): Promise<string> => {
  console.log(`Starting advanced PDF extraction for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use advanced binary pattern extraction with enhanced credit report detection
    console.log("Using advanced binary pattern extraction");
    let textContent = await extractCreditReportText(arrayBuffer);
    
    if (textContent && textContent.length > 500) {
      console.log(`Successfully extracted ${textContent.length} characters with credit report patterns`);
      return textContent;
    }
    
    // Fallback to basic text extraction
    console.log("Falling back to basic text extraction");
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let rawText = decoder.decode(arrayBuffer);
    
    // Clean and extract meaningful content
    textContent = await cleanAndExtractCreditReportData(rawText);
    
    if (textContent.length > 100) {
      console.log(`Extracted ${textContent.length} characters from fallback method`);
      return textContent;
    }
    
    throw new Error("Unable to extract meaningful text from PDF");
    
  } catch (error) {
    console.error("PDF extraction failed:", error);
    throw new Error(`PDF text extraction failed: ${error.message}`);
  }
};

// Extract text using PDF.js if available
const extractWithPDFJS = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Process pages in chunks to prevent long-running script warnings
    // Set a reasonable page limit to prevent excessive processing
    const maxPages = Math.min(pdf.numPages, 100);
    
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
      
      // Yield to main thread every 2 pages
      if (i % 2 === 0 && i < maxPages) {
        await yieldToMain();
      }
      
      // If we already have substantial text, we can stop early to improve performance
      if (fullText.length > 50000 && i > 10) {
        console.log(`Stopping PDF extraction early - already have ${fullText.length} characters after ${i} pages`);
        break;
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

// Advanced credit report text extraction using binary patterns
const extractCreditReportText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const uint8Array = new Uint8Array(arrayBuffer);
  let extractedText = '';
  
  // Search for text streams in PDF
  const textStreamPattern = /BT\s+([^ET]+)\s+ET/g;
  const tjPattern = /\[(.*?)\]\s*TJ/g;
  const showTextPattern = /\((.*?)\)\s*Tj/g;
  
  // Convert buffer to string for pattern matching
  const decoder = new TextDecoder('latin1');
  const binaryText = decoder.decode(uint8Array);
  
  // Extract from text streams
  let match;
  while ((match = textStreamPattern.exec(binaryText)) !== null) {
    const streamContent = match[1];
    
    // Extract text from TJ operators (text arrays)
    let tjMatch;
    while ((tjMatch = tjPattern.exec(streamContent)) !== null) {
      const textArray = tjMatch[1];
      // Parse individual strings from the array
      const strings = textArray.match(/\((.*?)\)/g);
      if (strings) {
        strings.forEach(str => {
          const cleanStr = str.replace(/[()]/g, '').trim();
          if (cleanStr.length > 0) {
            extractedText += cleanStr + ' ';
          }
        });
      }
    }
    
    // Extract from Tj operators (simple text)
    let tjSimpleMatch;
    while ((tjSimpleMatch = showTextPattern.exec(streamContent)) !== null) {
      const text = tjSimpleMatch[1].trim();
      if (text.length > 0) {
        extractedText += text + ' ';
      }
    }
  }
  
  // Also extract readable ASCII text directly from binary
  const asciiText = await extractReadableText(uint8Array);
  extractedText += ' ' + asciiText;
  
  // Clean up the extracted text
  extractedText = await cleanAndStructureCreditReportText(extractedText);
  
  return extractedText;
};

// Extract readable ASCII text from binary data
const extractReadableText = async (data: Uint8Array): Promise<string> => {
  let text = '';
  let currentWord = '';
  
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    
    // Check if character is printable ASCII
    if (char >= 32 && char <= 126) {
      currentWord += String.fromCharCode(char);
    } else if (char === 10 || char === 13) { // Newline
      if (currentWord.trim().length > 0) {
        text += currentWord + '\n';
        currentWord = '';
      }
    } else {
      // End of word
      if (currentWord.trim().length > 2) { // Only add words with 3+ characters
        text += currentWord + ' ';
      }
      currentWord = '';
    }
    
    // Yield control periodically
    if (i % 10000 === 0) {
      await yieldToMain();
    }
  }
  
  // Add final word
  if (currentWord.trim().length > 2) {
    text += currentWord;
  }
  
  return text;
};

// Clean and structure credit report text for better parsing
const cleanAndStructureCreditReportText = async (rawText: string): Promise<string> => {
  let text = rawText;
  
  // Remove duplicate spaces and normalize
  text = text.replace(/\s+/g, ' ').trim();
  
  // Add line breaks before important sections
  const sectionMarkers = [
    'PERSONAL INFORMATION', 'CONSUMER INFORMATION', 'ACCOUNT INFORMATION',
    'CREDIT INQUIRIES', 'PUBLIC RECORDS', 'COLLECTIONS', 'TRADELINES',
    'PAYMENT HISTORY', 'ACCOUNT HISTORY', 'NEGATIVE ITEMS'
  ];
  
  sectionMarkers.forEach(marker => {
    const regex = new RegExp(`(${marker})`, 'gi');
    text = text.replace(regex, '\n\n$1\n');
  });
  
  // Clean up account entries - add structure
  text = text.replace(/(\b(?:ACCOUNT|ACCT|CREDITOR|FURNISHER)[\s:]+[A-Z0-9\s&\.,'"\-]+)/gi, '\n\nACCOUNT: $1');
  
  // Structure payment information
  text = text.replace(/(\b(?:PAYMENT\s+HISTORY|LATE\s+PAYMENT|PAST\s+DUE|DELINQUENT))/gi, '\nPAYMENT_INFO: $1');
  
  // Structure inquiry information
  text = text.replace(/(\b(?:INQUIRY|INQUIRIES)[\s:]+[A-Z0-9\s&\.,'"\-]+)/gi, '\nINQUIRY: $1');
  
  return text;
};

// Enhanced cleaning for extracted text
const cleanAndExtractCreditReportData = async (rawText: string): Promise<string> => {
  // Remove PDF metadata and binary markers
  let text = rawText.replace(/%PDF-[\d.]+/g, '')
                   .replace(/%%EOF/g, '')
                   .replace(/stream[\s\S]*?endstream/g, '')
                   .replace(/obj[\s\S]*?endobj/g, '');
  
  // Extract readable content using credit report patterns
  const creditReportPatterns = [
    // Personal information
    /(?:name|consumer|personal\s+information)[\s:]+([^\n]{10,100})/gi,
    // Account information
    /(?:account|creditor|furnisher)[\s:]+([^\n]{5,80})/gi,
    // Payment information
    /(?:payment|late|past\s+due|delinquent|current)[\s:]+([^\n]{5,50})/gi,
    // Balance information
    /(?:balance|amount|limit)[\s:]+\$?[\d,\.]+/gi,
    // Date information
    /(?:date|opened|closed|reported)[\s:]+[\d\/\-]{6,12}/gi
  ];
  
  let extractedContent = '';
  
  creditReportPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[0] && match[0].length > 10) {
        extractedContent += match[0] + '\n';
      }
    }
  });
  
  // If pattern extraction didn't work well, fall back to cleaning raw text
  if (extractedContent.length < 200) {
    text = text.replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only printable ASCII
               .replace(/\s+/g, ' ')
               .trim();
    
    // Look for credit report keywords and extract surrounding context
    const keywords = ['EXPERIAN', 'EQUIFAX', 'TRANSUNION', 'CREDIT', 'ACCOUNT', 'PAYMENT', 'INQUIRY'];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`.{0,200}${keyword}.{0,200}`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        extractedContent += matches.join('\n') + '\n';
      }
    });
  }
  
  return extractedContent || text;
};
