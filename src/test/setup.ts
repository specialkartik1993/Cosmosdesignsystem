import '@testing-library/jest-dom/vitest';

// ----------------------------------------------------------------
// Global test setup for Cosmos Design System
// ----------------------------------------------------------------

// Polyfill window.matchMedia for components that use useIsMobile / media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill ResizeObserver (used by Radix primitives)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock as any;

// Suppress React act() warnings in tests where they are expected
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('act(')) return;
  originalError(...args);
};
