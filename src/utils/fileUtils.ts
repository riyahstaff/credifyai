
/**
 * Format a file size from bytes to a human-readable format
 */
export const formatFileSize = (size: number): string => {
  if (size < 1024) return size + ' B';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  else return (size / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Check if a file is a PDF
 */
export const isPDF = (file: File): boolean => {
  return file.type === 'application/pdf';
};

/**
 * Extract text content from a file (text or PDF)
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    if (isPDF(file)) {
      // Use our improved PDF extractor
      const { extractTextFromPDF } = await import('./creditReport/extractors');
      return await extractTextFromPDF(file);
    } else {
      // Assume it's a text file
      return await file.text();
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract and format HTML from a file (text or PDF)
 */
export const extractAndFormatHtml = async (file: File): Promise<string> => {
  try {
    if (isPDF(file)) {
      // Use our dedicated PDF-to-HTML converter
      const { extractAndFormatPDF } = await import('./creditReport/extractors');
      return await extractAndFormatPDF(file);
    } else {
      // For text files, first get the text then convert to HTML
      const text = await file.text();
      const { convertReportToHtml } = await import('./creditReport/formatters/htmlFormatter');
      return convertReportToHtml(text, false);
    }
  } catch (error) {
    console.error("Error extracting and formatting HTML:", error);
    throw new Error(`Failed to convert to HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate a unique filename with timestamp
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = new Date().getTime();
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  return `${baseName}_${timestamp}.${extension}`;
};

/**
 * Get file extension from a filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Validate if a file is of allowed type
 */
export const isAllowedFileType = (file: File, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension) || allowedTypes.includes(file.type);
};

/**
 * Format a date from string to a standardized format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

