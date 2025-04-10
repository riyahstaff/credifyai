
/**
 * External Backend Service
 * This service handles API calls to the external credit report analyzer backend
 */
import { EXTERNAL_BACKEND_URL, EXTERNAL_BACKEND_TOKEN, API_TIMEOUT, DEBUG_API_CALLS, ENDPOINTS } from '@/config/externalBackend';

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Base fetch function with error handling and timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = API_TIMEOUT): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
    ) as Promise<Response>
  ]);
}

/**
 * Make an API call to the external backend
 */
async function callApi<T>(
  endpoint: string, 
  method: string = 'GET', 
  body?: FormData | object
): Promise<ApiResponse<T>> {
  const url = `${EXTERNAL_BACKEND_URL}${endpoint}`;
  
  const headers: Record<string, string> = {};
  
  if (EXTERNAL_BACKEND_TOKEN) {
    headers['Authorization'] = `Bearer ${EXTERNAL_BACKEND_TOKEN}`;
  }
  
  if (!(body instanceof FormData) && body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const options: RequestInit = {
    method,
    headers,
    body: body instanceof FormData 
      ? body 
      : body ? JSON.stringify(body) : undefined,
  };
  
  if (DEBUG_API_CALLS) {
    console.log(`API ${method} ${endpoint}`, body ? { body } : '');
  }
  
  try {
    const response = await fetchWithTimeout(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (DEBUG_API_CALLS) {
      console.log(`API ${method} ${endpoint} response:`, data);
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`API error for ${method} ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Analyzes a credit report file
 * @param file The credit report file to analyze
 * @returns Analysis results
 */
export const analyzeReport = async (file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return callApi(ENDPOINTS.ANALYZE_REPORT, 'POST', formData);
};

/**
 * Generates a dispute letter based on analysis results
 * @param analysisData Analysis data from the analyzeReport function
 * @param userInfo User information for the letter
 * @returns Generated letter
 */
export const generateDisputeLetter = async (
  analysisData: any,
  userInfo: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }
): Promise<ApiResponse<string>> => {
  return callApi<string>(ENDPOINTS.GENERATE_LETTER, 'POST', {
    analysisData,
    userInfo
  });
};

/**
 * Fetches all available letter templates from the backend
 * @returns List of available letter templates
 */
export const getLetterTemplates = async (): Promise<ApiResponse<any[]>> => {
  return callApi<any[]>(ENDPOINTS.TEMPLATES);
};

/**
 * Sends a dispute letter to a credit bureau
 * @param letter The letter content
 * @param bureau The credit bureau to send to
 * @param contactInfo Contact information for the credit bureau
 * @returns Status of the sending operation
 */
export const sendDisputeLetter = async (
  letter: string,
  bureau: string,
  contactInfo: Record<string, string>
): Promise<ApiResponse<any>> => {
  return callApi(ENDPOINTS.SEND_LETTER, 'POST', {
    letter,
    bureau,
    contactInfo
  });
};
