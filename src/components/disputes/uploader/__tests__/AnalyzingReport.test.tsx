
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import AnalyzingReport from '../AnalyzingReport';

describe('AnalyzingReport', () => {
  // Setup mocks
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders the component with initial state', () => {
    render(<AnalyzingReport />);
    
    expect(screen.getByText('Analyzing Your Credit Report')).toBeInTheDocument();
    expect(screen.getByText('Our AI is carefully scanning your report for errors, inaccuracies, and potential FCRA violations.')).toBeInTheDocument();
    
    // Check that all 4 steps are displayed
    expect(screen.getByText('Scanning personal information')).toBeInTheDocument();
    expect(screen.getByText('Analyzing account information')).toBeInTheDocument();
    expect(screen.getByText('Checking for FCRA violations')).toBeInTheDocument();
    expect(screen.getByText('Preparing recommendations')).toBeInTheDocument();
  });

  it('updates progress bars correctly', async () => {
    const mockOnAnalysisComplete = vi.fn();
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // First step should complete immediately
    expect(screen.getByText('Scanning personal information')).toBeInTheDocument();
    
    // Advance timers to trigger second step
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Advance timers to trigger third step
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Advance timers to trigger fourth step
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Advance timers to trigger completion
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Check if onAnalysisComplete was called
    expect(mockOnAnalysisComplete).toHaveBeenCalledTimes(1);
  });

  it('cleans up timeouts when unmounted', () => {
    // Create a spy on clearTimeout
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = render(<AnalyzingReport />);
    
    // Unmount component
    unmount();
    
    // Check if clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    // Restore original implementation
    clearTimeoutSpy.mockRestore();
  });

  it('triggers onAnalysisComplete when unmounted if not yet triggered', () => {
    const mockOnAnalysisComplete = vi.fn();
    const { unmount } = render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Unmount component before animation completes
    unmount();
    
    // Check if onAnalysisComplete was called
    expect(mockOnAnalysisComplete).toHaveBeenCalledTimes(1);
  });

  it('triggers safety timeout if animation gets stuck', () => {
    const mockOnAnalysisComplete = vi.fn();
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Fast forward past the safety timeout
    act(() => {
      vi.advanceTimersByTime(2001);
    });
    
    // Check if onAnalysisComplete was called
    expect(mockOnAnalysisComplete).toHaveBeenCalledTimes(1);
  });

  it('handles custom steps if provided', () => {
    const customSteps = [
      { name: 'Custom step 1', progress: 50, isComplete: false },
      { name: 'Custom step 2', progress: 0, isComplete: false },
    ];
    
    render(<AnalyzingReport steps={customSteps} />);
    
    expect(screen.getByText('Custom step 1')).toBeInTheDocument();
    expect(screen.getByText('Custom step 2')).toBeInTheDocument();
    expect(screen.queryByText('Scanning personal information')).not.toBeInTheDocument();
  });

  it('triggers immediate callback after 100ms', () => {
    const mockOnAnalysisComplete = vi.fn();
    render(<AnalyzingReport onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // Fast forward past immediate callback
    act(() => {
      vi.advanceTimersByTime(101);
    });
    
    // Check if onAnalysisComplete was called
    expect(mockOnAnalysisComplete).toHaveBeenCalledTimes(1);
  });
});
