
/**
 * External Backend Configuration
 */

// The base URL for the external backend API
export const EXTERNAL_BACKEND_URL = import.meta.env.VITE_EXTERNAL_BACKEND_URL || 'https://api.creditreportanalyzer.com';

// Authentication token for the API (if required)
export const EXTERNAL_BACKEND_TOKEN = import.meta.env.VITE_EXTERNAL_BACKEND_TOKEN || '';

// API version
export const API_VERSION = 'v1';

// Set this to true to enable debug logs for API calls
export const DEBUG_API_CALLS = import.meta.env.DEV;

// Timeouts for API calls (in milliseconds)
export const API_TIMEOUT = 30000; // 30 seconds

// Endpoints
export const ENDPOINTS = {
  ANALYZE_REPORT: '/analyze-report',
  GENERATE_LETTER: '/generate-letter',
  TEMPLATES: '/templates',
  SEND_LETTER: '/send-letter'
};
