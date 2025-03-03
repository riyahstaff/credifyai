
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import AnalysisError from '../AnalysisError';

// Extend expect for TypeScript
import { expect } from 'vitest';

describe('AnalysisError', () => {
  const mockOnReset = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when error is null', () => {
    const { container } = render(<AnalysisError error={null} onReset={mockOnReset} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays the error message when error exists', () => {
    const errorMessage = 'Test error message';
    render(<AnalysisError error={errorMessage} onReset={mockOnReset} />);
    
    expect(screen.getByText('Error analyzing report:')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onReset when Try Again button is clicked', () => {
    render(<AnalysisError error="Some error" onReset={mockOnReset} />);
    
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
