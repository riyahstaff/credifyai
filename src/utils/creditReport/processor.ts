
import { parseReportContent } from './parser/parseReportContent';
import { extractTextFromPDF } from './extractors/pdfExtractor';
import { CreditReportData } from './types';

/**
 * Process a credit report file (PDF or text) and extract structured data
 */
export const processCreditReport = async (file: File): Promise<CreditReportData> => {
  try {
    console.log(`Processing credit report file: ${file.name} (${file.type})`);
    
    // Determine if the file is a PDF
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    // Extract text content from the file
    let textContent = '';
    if (isPdf) {
      console.log('Extracting text from PDF file...');
      textContent = await extractTextFromPDF(file);
    } else {
      console.log('Reading text file content...');
      textContent = await file.text();
    }
    
    if (!textContent || textContent.trim().length === 0) {
      throw new Error('No text content could be extracted from the file');
    }
    
    console.log(`Extracted ${textContent.length} characters from the file`);
    
    // Parse the text content into structured data
    console.log('Parsing credit report content...');
    const reportData = parseReportContent(textContent, isPdf);
    
    console.log(`Parsed credit report with ${reportData.accounts.length} accounts`);
    
    return reportData;
  } catch (error) {
    console.error('Error processing credit report:', error);
    throw new Error(`Failed to process credit report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
