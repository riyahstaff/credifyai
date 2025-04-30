
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
  isLocalFallback?: boolean; // Flag to indicate if this is a locally generated response
}

/**
 * Base fetch function with error handling and timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = API_TIMEOUT): Promise<Response> {
  console.log(`Fetching ${url} with timeout ${timeoutMs}ms`);
  
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
  try {
    // For preview/development environments or if we can't connect to the external API,
    // return mock responses or generate them locally
    if (window.location.host.includes('lovableproject.com') || 
        window.location.host.includes('lovable.app') ||
        !navigator.onLine) {
      console.log(`Mock API ${method} ${endpoint} in preview environment or offline mode`);
      return getMockResponse<T>(endpoint, method);
    }
    
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
    
    const response = await fetchWithTimeout(url, options, 8000); // Reduced timeout to 8 seconds
    
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
    
    // Special handling for network errors - return mock data with a flag
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log(`Network error detected, using local fallback for ${endpoint}`);
      const mockResponse = await getMockResponse<T>(endpoint, method);
      mockResponse.isLocalFallback = true;
      return mockResponse;
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

/**
 * Helper function for mock responses in preview/development
 */
function getMockResponse<T>(endpoint: string, method: string): Promise<ApiResponse<T>> {
  return new Promise(resolve => {
    // Simulated delay for API calls
    const delay = Math.random() * 1000 + 500;
    
    console.log(`Returning mock response for ${method} ${endpoint} after ${delay}ms delay`);
    
    setTimeout(() => {
      // Mock responses based on endpoint
      if (endpoint === ENDPOINTS.ANALYZE_REPORT && method === 'POST') {
        resolve({
          success: true,
          data: {
            id: 'mock_report_' + Date.now(),
            status: 'completed',
            issues: [
              { id: 1, type: 'late_payment', description: 'Late payment on mortgage account', severity: 'high' },
              { id: 2, type: 'collection_account', description: 'Collection account from unknown creditor', severity: 'medium' }
            ],
            accounts: [
              { id: 'acc1', name: 'Bank of America', accountNumber: '****1234', type: 'credit_card', balance: 1500 },
              { id: 'acc2', name: 'Wells Fargo', accountNumber: '****5678', type: 'mortgage', balance: 250000 }
            ],
            summary: {
              totalAccounts: 2,
              totalIssues: 2,
              score: 680
            }
          } as unknown as T,
          isLocalFallback: true
        });
        return;
      }
      
      if (endpoint === ENDPOINTS.GENERATE_LETTER && method === 'POST') {
        resolve({
          success: true,
          data: `
Dear Credit Bureau,

I am writing to dispute the following information in my credit report:

1. Late payment on mortgage account
2. Collection account from unknown creditor

These items are inaccurate because I have always made timely payments on my accounts. Please investigate these matters and correct my credit report accordingly.

Sincerely,
[Your Name]
      `.trim() as unknown as T,
          isLocalFallback: true
        });
        return;
      }
      
      if (endpoint === ENDPOINTS.TEMPLATES) {
        resolve({
          success: true,
          data: [
            { id: 1, name: 'Standard Dispute Letter', type: 'dispute_standard' },
            { id: 2, name: 'Late Payment Dispute', type: 'dispute_late_payment' },
            { id: 3, name: 'Debt Validation Letter', type: 'debt_validation' }
          ] as unknown as T,
          isLocalFallback: true
        });
        return;
      }
      
      resolve({
        success: false,
        error: 'Mock endpoint not implemented',
        isLocalFallback: true
      });
    }, delay);
  });
}

// Export functions
export const analyzeReport = async (file: File): Promise<ApiResponse<any>> => {
  console.log(`Analyzing report: ${file.name} (${file.type}), size: ${file.size} bytes`);
  
  const formData = new FormData();
  formData.append('file', file);
  
  return callApi(ENDPOINTS.ANALYZE_REPORT, 'POST', formData);
};

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
  console.log(`Generating dispute letter for user: ${userInfo.name}`);
  return callApi<string>(ENDPOINTS.GENERATE_LETTER, 'POST', {
    analysisData,
    userInfo
  });
};

export const getLetterTemplates = async (): Promise<ApiResponse<any[]>> => {
  return callApi<any[]>(ENDPOINTS.TEMPLATES);
};

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
