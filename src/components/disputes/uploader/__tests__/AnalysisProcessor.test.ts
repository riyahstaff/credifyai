
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { handleAnalysisComplete } from '../AnalysisProcessor';
import { enhanceReportData } from '@/utils/reportAnalysis';
import { identifyIssues } from '@/utils/reportAnalysis';
import { storeReportData } from '../utils/reportStorage';
import { generateDisputeLetters, storeGeneratedLetters } from '../utils/letterGenerator';
import { loadSampleDisputeLetters } from '@/utils/creditReport/disputeLetters/sampleLettersLoader';
import { loadSampleReports } from '@/utils/creditReport/sampleReports';
import { createMinimalReportData } from '@/utils/creditReport/helpers';

// Mock all dependencies
vi.mock('@/utils/creditReportParser', () => ({
  processCreditReport: vi.fn().mockImplementation(async () => createMinimalReportData())
}));

vi.mock('@/utils/reportAnalysis', () => ({
  enhanceReportData: vi.fn(data => data),
  identifyIssues: vi.fn().mockReturnValue([
    {
      type: 'test',
      title: 'Test Issue',
      description: 'Test description',
      impact: 'High Impact' as const,
      impactColor: 'red',
      laws: ['FCRA 611']
    }
  ])
}));

vi.mock('../utils/reportStorage', () => ({
  storeReportData: vi.fn()
}));

vi.mock('../utils/letterGenerator', () => ({
  generateDisputeLetters: vi.fn().mockResolvedValue([
    {
      bureau: 'Experian',
      accountName: 'Test Account',
      errorType: 'Test Error',
      letterContent: 'Test content'
    }
  ]),
  storeGeneratedLetters: vi.fn().mockReturnValue(true)
}));

vi.mock('@/utils/creditReport/disputeLetters/sampleLettersLoader', () => ({
  loadSampleDisputeLetters: vi.fn().mockResolvedValue([])
}));

vi.mock('@/utils/creditReport/sampleReports', () => ({
  loadSampleReports: vi.fn().mockResolvedValue([])
}));

// Create test setup
const createHandlerProps = () => {
  return {
    uploadedFile: new File(['test'], 'test.txt'),
    setReportData: vi.fn(),
    setIssues: vi.fn(),
    setLetterGenerated: vi.fn(),
    setAnalysisError: vi.fn(),
    setAnalyzing: vi.fn(),
    setAnalyzed: vi.fn(),
    toast: {
      toast: vi.fn()
    }
  };
};

// Tests
describe('AnalysisProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process a credit report and generate dispute letters', async () => {
    // Arrange
    const props = createHandlerProps();

    // Act
    await handleAnalysisComplete(props);

    // Assert
    expect(props.setAnalyzing).toHaveBeenCalledWith(true);
    expect(props.setAnalyzing).toHaveBeenCalledWith(false);
    expect(props.setAnalyzed).toHaveBeenCalledWith(true);
    expect(props.setLetterGenerated).toHaveBeenCalledWith(true);
    expect(loadSampleDisputeLetters).toHaveBeenCalled();
    expect(loadSampleReports).toHaveBeenCalled();
    expect(enhanceReportData).toHaveBeenCalled();
    expect(identifyIssues).toHaveBeenCalled();
    expect(storeReportData).toHaveBeenCalled();
    expect(generateDisputeLetters).toHaveBeenCalled();
    expect(storeGeneratedLetters).toHaveBeenCalled();
  });

  it('should handle errors during processing', async () => {
    // Arrange
    const props = createHandlerProps();
    vi.mocked(enhanceReportData).mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    // Act
    await handleAnalysisComplete(props);

    // Assert
    expect(props.setAnalysisError).toHaveBeenCalledWith('Test error');
    expect(props.setAnalyzing).toHaveBeenCalledWith(false);
    expect(props.setAnalyzed).toHaveBeenCalledWith(true);
    expect(props.toast.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Analysis failed',
      variant: 'destructive'
    }));
  });

  it('should handle missing file', async () => {
    // Arrange
    const props = createHandlerProps();
    props.uploadedFile = null;

    // Act
    await handleAnalysisComplete(props);

    // Assert
    expect(props.setAnalysisError).toHaveBeenCalledWith('No file was available for analysis');
    expect(props.setAnalyzing).toHaveBeenCalledWith(false);
    expect(props.setAnalyzed).toHaveBeenCalledWith(true);
  });

  it('should handle minimal data correctly', async () => {
    // Arrange
    const props = createHandlerProps();
    
    const minimalData = createMinimalReportData();
    
    // Add minimal required data
    minimalData.accounts = [
      {
        accountName: 'Test Account',
        bureau: 'Experian',
        isNegative: false
      }
    ];
    
    minimalData.inquiries = [];
    minimalData.publicRecords = [];
    
    vi.mocked(enhanceReportData).mockReturnValueOnce(minimalData);

    // Act
    await handleAnalysisComplete(props);

    // Assert
    expect(props.setReportData).toHaveBeenCalledWith(minimalData);
    expect(identifyIssues).toHaveBeenCalledWith(minimalData);
    expect(props.setAnalyzed).toHaveBeenCalledWith(true);
  });
});
