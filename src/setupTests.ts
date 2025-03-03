
import '@testing-library/jest-dom';
import { vi, expect } from 'vitest';

// No need to set expect globally as Vitest already does this
// Instead, we'll just make sure it's imported

// Add TypeScript support for jest-dom matchers
declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toBeVisible(): void;
      toHaveTextContent(text: string): void;
      toContainElement(element: HTMLElement): void;
      toHaveAttribute(attr: string, value?: string): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeChecked(): void;
      toHaveClass(className: string): void;
      toHaveStyle(style: Record<string, any>): void;
      toHaveValue(value: string | string[] | number): void;
      toBeEmpty(): void;
      toBeEmptyDOMElement(): void;
      toHaveFocus(): void;
    }

    interface AsymmetricMatchersContaining {
      toBeInTheDocument(): void;
      toBeVisible(): void;
      toHaveTextContent(text: string): void;
      toContainElement(element: HTMLElement): void;
      toHaveAttribute(attr: string, value?: string): void;
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeChecked(): void;
      toHaveClass(className: string): void;
      toHaveStyle(style: Record<string, any>): void;
      toHaveValue(value: string | string[] | number): void;
      toBeEmpty(): void;
      toBeEmptyDOMElement(): void;
      toHaveFocus(): void;
    }
  }
}

// Setup any global mocks if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Add a no-op export to ensure this file is treated as a module
export {};
