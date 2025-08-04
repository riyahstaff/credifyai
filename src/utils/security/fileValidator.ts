// Enhanced file validation with security checks
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

// Known dangerous file signatures (magic numbers)
const DANGEROUS_SIGNATURES = [
  // Executable files
  [0x4D, 0x5A], // PE/EXE files
  [0x7F, 0x45, 0x4C, 0x46], // ELF files
  [0xCF, 0xFA, 0xED, 0xFE], // Mach-O binary
  [0xFE, 0xED, 0xFA, 0xCF], // Mach-O binary (reverse)
  
  // Scripts
  [0x23, 0x21], // Shebang (#!)
  
  // Archives that could contain malware
  [0x50, 0x4B, 0x03, 0x04], // ZIP (potential)
  [0x52, 0x61, 0x72, 0x21], // RAR
];

// Allowed MIME types for credit reports
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/csv',
  'text/html',
  'application/html'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.txt',
  '.csv',
  '.html',
  '.htm'
];

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Read the first few bytes of a file to check its signature
 */
async function getFileSignature(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      resolve(bytes.slice(0, 10)); // Read first 10 bytes
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file.slice(0, 10));
  });
}

/**
 * Check if file signature matches any dangerous patterns
 */
function isDangerousSignature(signature: Uint8Array): boolean {
  return DANGEROUS_SIGNATURES.some(dangerous => {
    if (signature.length < dangerous.length) return false;
    return dangerous.every((byte, index) => signature[index] === byte);
  });
}

/**
 * Validate file extension
 */
function isValidExtension(fileName: string): boolean {
  const extension = fileName.toLowerCase().match(/\.[^.]+$/)?.[0];
  return extension ? ALLOWED_EXTENSIONS.includes(extension) : false;
}

/**
 * Validate MIME type
 */
function isValidMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase());
}

/**
 * Check for suspicious file name patterns
 */
function hasSuspiciousName(fileName: string): boolean {
  const suspicious = [
    /\.exe\./i,
    /\.scr\./i,
    /\.bat\./i,
    /\.cmd\./i,
    /\.com\./i,
    /\.pif\./i,
    /\.vbs\./i,
    /\.js\./i,
    /\.\w+\.exe$/i,
    /\.\w+\.scr$/i
  ];
  
  return suspicious.some(pattern => pattern.test(fileName));
}

/**
 * Comprehensive file validation for security
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  const warnings: string[] = [];
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }
  
  // Check for empty files
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    };
  }
  
  // Validate file extension
  if (!isValidExtension(file.name)) {
    return {
      isValid: false,
      error: 'File type not allowed. Please upload PDF, TXT, CSV, or HTML files only.'
    };
  }
  
  // Validate MIME type
  if (!isValidMimeType(file.type)) {
    warnings.push('File MIME type could not be verified. Proceeding with caution.');
  }
  
  // Check for suspicious file names
  if (hasSuspiciousName(file.name)) {
    return {
      isValid: false,
      error: 'File name contains suspicious patterns'
    };
  }
  
  try {
    // Check file signature for dangerous content
    const signature = await getFileSignature(file);
    
    if (isDangerousSignature(signature)) {
      return {
        isValid: false,
        error: 'File contains potentially dangerous content'
      };
    }
    
    // PDF signature validation
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
      if (signature.length >= 4 && !pdfSignature.every((byte, index) => signature[index] === byte)) {
        warnings.push('File extension is PDF but content signature does not match');
      }
    }
    
  } catch (error) {
    warnings.push('Could not verify file signature');
  }
  
  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}