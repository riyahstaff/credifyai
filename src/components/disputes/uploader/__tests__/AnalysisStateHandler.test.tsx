
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AnalysisStateHandler from '../AnalysisStateHandler';

// Mock the required components
jest.mock('../AnalyzingReport', () => ({
  __esModule: true,
  default: ({ onAnalysisComplete }) => (
    <div data-testid="analyzing-report">
      <button onClick={onAnalysisComplete}>Complete Analysis</button>
    </div>
  ),
}));

jest.mock('../ReportAnalysisResults', () => ({
  __esModule: true,
  default: ({ onResetUpload, onGenerateDispute }) => (
    <div data-testid="report-analysis-results">
      <button onClick={onResetUpload}>Reset</button>
      <button onClick={() => onGenerateDispute()}>Generate Dispute</button>
    </div>
  ),
}));

jest.mock('../UploadConfirmation', () => ({
  __esModule: true,
  default: ({ onRemoveFile, onStartAnalysis }) => (
    <div data-testid="upload-confirmation">
      <button onClick={onRemoveFile}>Remove File</button>
      <button onClick={onStartAnalysis}>Start Analysis</button>
    </div>
  ),
}));

describe('AnalysisStateHandler', () => {
  const mockProps = {
    fileUploaded: true,
    analyzing: false,
    analyzed: false,
    fileName: 'test.pdf',
    fileSize: '1.2 MB',
    reportData: null,
    uploadedFile: null,
    issues: [],
    letterGenerated: false,
    analysisError: null,
    onResetUpload: jest.fn(),
    onStartAnalysis: jest.fn(),
    onGenerateDispute: jest.fn(),
    onAnalysisComplete: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when fileUploaded is false', () => {
    const { container } = render(
      <BrowserRouter>
        <AnalysisStateHandler {...mockProps} fileUploaded={false} />
      </BrowserRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders UploadConfirmation when file is uploaded but not analyzed', () => {
    render(
      <BrowserRouter>
        <AnalysisStateHandler {...mockProps} />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('upload-confirmation')).toBeInTheDocument();
    
    const startButton = screen.getByText('Start Analysis');
    fireEvent.click(startButton);
    expect(mockProps.onStartAnalysis).toHaveBeenCalledTimes(1);
  });

  it('renders AnalyzingReport when analyzing is true', () => {
    render(
      <BrowserRouter>
        <AnalysisStateHandler {...mockProps} analyzing={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('analyzing-report')).toBeInTheDocument();
    
    const completeButton = screen.getByText('Complete Analysis');
    fireEvent.click(completeButton);
    expect(mockProps.onAnalysisComplete).toHaveBeenCalledTimes(1);
  });

  it('renders ReportAnalysisResults when analyzed is true', () => {
    render(
      <BrowserRouter>
        <AnalysisStateHandler {...mockProps} analyzed={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('report-analysis-results')).toBeInTheDocument();
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(mockProps.onResetUpload).toHaveBeenCalledTimes(1);
  });

  it('shows generated letter message when letterGenerated is true', () => {
    render(
      <BrowserRouter>
        <AnalysisStateHandler {...mockProps} analyzed={true} letterGenerated={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Dispute Letter Generated')).toBeInTheDocument();
    expect(screen.getByText('View Generated Letter')).toBeInTheDocument();
  });
});
