
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AnalyzingReport from '../AnalyzingReport';
import '@testing-library/jest-dom';

// Mock the onAnalysisComplete callback
const mockOnAnalysisComplete = vi.fn();

describe('AnalyzingReport Component', () => {
  beforeEach(() => {
    mockOnAnalysisComplete.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial state correctly', () => {
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    expect(screen.getByText('Analyzing Your Credit Report')).toBeInTheDocument();
    expect(screen.getByText('Scanning document')).toBeInTheDocument();
    expect(screen.getByText('0% complete')).toBeInTheDocument();
  });

  it('updates progress and stages as time passes', () => {
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Initial state
    expect(screen.getByText('Scanning document')).toBeInTheDocument();
    
    // After some progress - stage 1
    act(() => {
      vi.advanceTimersByTime(3000); // Advance by 3 seconds (30 progress increments)
    });
    
    expect(screen.getByText('Extracting account information')).toBeInTheDocument();
    
    // After more progress - stage 2
    act(() => {
      vi.advanceTimersByTime(3000); // Advance by 3 more seconds
    });
    
    expect(screen.getByText('Analyzing for discrepancies')).toBeInTheDocument();
    
    // After more progress - stage 3
    act(() => {
      vi.advanceTimersByTime(2500); // Advance to reach the next stage
    });
    
    expect(screen.getByText('Preparing dispute recommendations')).toBeInTheDocument();
    
    // Complete the process
    act(() => {
      vi.advanceTimersByTime(2000); // Finish the analysis
    });
    
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
    expect(screen.getByText('Ready to view results')).toBeInTheDocument();
    expect(screen.getByText('100% complete')).toBeInTheDocument();
  });

  it('calls onAnalysisComplete when analysis finishes', () => {
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Fast-forward to 100% completion
    act(() => {
      vi.advanceTimersByTime(10000); // This should be enough to complete the analysis
    });
    
    // Small delay for the callback
    act(() => {
      vi.advanceTimersByTime(600);
    });
    
    expect(mockOnAnalysisComplete).toHaveBeenCalledTimes(1);
  });

  it('handles multiple stages correctly', () => {
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Start: Scanning document
    expect(screen.getByText('Scanning document')).toBeInTheDocument();
    
    // Stage 1: Extracting account information
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Extracting account information')).toBeInTheDocument();
    
    // Stage 2: Analyzing for discrepancies
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('Analyzing for discrepancies')).toBeInTheDocument();
    
    // Stage 3: Preparing dispute recommendations
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(screen.getByText('Preparing dispute recommendations')).toBeInTheDocument();
  });

  // This test needs to be adjusted as we no longer use steps prop
  it('renders the final completed state correctly', () => {
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Fast-forward to 100% completion
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
    expect(screen.getByText('Ready to view results')).toBeInTheDocument();
    expect(screen.getByText('100% complete')).toBeInTheDocument();
  });
});
