
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { handleAnalysisComplete } from '../AnalysisProcessor';
import { processCreditReport } from '@/utils/creditReportParser';
import { identifyIssues, enhanceReportData } from '@/utils/reportAnalysis';
import { generateEnhancedDisputeLetter } from '@/lib/supabase/letterGenerator';

// Mock dependencies
vi.mock('@/utils/creditReportParser', () => ({
  processCreditReport: vi.fn(),
}));

vi.mock('@/utils/reportAnalysis', () => ({
  identifyIssues: vi.fn(),
  enhanceReportData: vi.fn(),
}));

vi.mock('@/lib/supabase/letterGenerator', () => ({
  generateEnhancedDisputeLetter: vi.fn(),
}));

describe('handleAnalysisComplete', () => {
  // Setup mock functions and props
  const mockSetReportData = vi.fn();
  const mockSetIssues = vi.fn();
  const mockSetLetterGenerated = vi.fn();
  const mockSetAnalysisError = vi.fn();
  const mockSetAnalyzing = vi.fn();
  const mockSetAnalyzed = vi.fn();
  
  const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
  
  // Create properly structured toast mock
  const mockToast = {
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  };

  const mockProps = {
    uploadedFile: mockFile,
    setReportData: mockSetReportData,
    setIssues: mockSetIssues,
    setLetterGenerated: mockSetLetterGenerated,
    setAnalysisError: mockSetAnalysisError,
    setAnalyzing: mockSetAnalyzing,
    setAnalyzed: mockSetAnalyzed,
    toast: mockToast,
  };

  // Mock sessionStorage
  const mockSessionStorage = (() => {
    let store = {};
    return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  // Mock localStorage
  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockSessionStorage.clear();
    mockLocalStorage.clear();
  });

  it('handles error when no file is provided', async () => {
    await handleAnalysisComplete({
      ...mockProps,
      uploadedFile: null,
    });
    
    expect(mockSetAnalyzing).toHaveBeenCalledWith(false);
    expect(mockSetAnalysisError).toHaveBeenCalledWith("No file was available for analysis");
    expect(processCreditReport).not.toHaveBeenCalled();
    expect(mockSetAnalyzed).toHaveBeenCalledWith(true);
  });

  it('processes credit report and identifies issues', async () => {
    const mockReportData = { 
      accounts: [],
      bureaus: {
        experian: true,
        equifax: false,
        transunion: false
      }
    };
    
    const mockEnhancedData = { 
      accounts: [], 
      personalInfo: { name: 'Test User' },
      bureaus: {
        experian: true,
        equifax: false,
        transunion: false
      }
    };
    
    const mockIssues = [{ 
      type: 'error', 
      title: 'Test Issue',
      description: 'Description',
      impact: 'High Impact' as const,
      impactColor: 'red',
      laws: []
    }];
    
    // Setup mock implementations
    vi.mocked(processCreditReport).mockResolvedValue(mockReportData);
    vi.mocked(enhanceReportData).mockReturnValue(mockEnhancedData);
    vi.mocked(identifyIssues).mockReturnValue(mockIssues);
    
    await handleAnalysisComplete(mockProps);
    
    // Verify process flow
    expect(processCreditReport).toHaveBeenCalledWith(mockFile);
    expect(enhanceReportData).toHaveBeenCalledWith(mockReportData);
    expect(identifyIssues).toHaveBeenCalledWith(mockEnhancedData);
    
    // Verify state updates
    expect(mockSetReportData).toHaveBeenCalledWith(mockEnhancedData);
    expect(mockSetIssues).toHaveBeenCalledWith(mockIssues);
    expect(mockSetAnalyzing).toHaveBeenCalledWith(false);
    expect(mockSetAnalyzed).toHaveBeenCalledWith(true);
    
    // Verify session storage
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'creditReportData', 
      JSON.stringify(mockEnhancedData)
    );
  });

  it('handles errors during report processing', async () => {
    const testError = new Error('Test error message');
    vi.mocked(processCreditReport).mockRejectedValue(testError);
    
    await handleAnalysisComplete(mockProps);
    
    expect(mockSetAnalysisError).toHaveBeenCalledWith('Test error message');
    expect(mockSetAnalyzing).toHaveBeenCalledWith(false);
    expect(mockSetAnalyzed).toHaveBeenCalledWith(true);
    expect(mockToast.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: "Analysis failed",
      variant: "destructive"
    }));
  });
});
