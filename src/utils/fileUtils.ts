
/**
 * Format a file size from bytes to a human-readable format
 */
export const formatFileSize = (size: number): string => {
  if (size < 1024) return size + ' B';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  else return (size / (1024 * 1024)).toFixed(1) + ' MB';
};
