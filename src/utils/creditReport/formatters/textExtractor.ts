
/**
 * Text Extractor
 * Extracts plain text from HTML content
 */

/**
 * Extract text from HTML content (for when we need to revert back to plain text)
 */
export const extractTextFromHtml = (html: string): string => {
  // Simple HTML stripping for basic cases
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n'); // Reduce excessive line breaks
};
