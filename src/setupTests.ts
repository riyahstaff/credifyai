
import '@testing-library/jest-dom';

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
  }
}
