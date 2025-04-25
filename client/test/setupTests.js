// Jest setup file for NFT Generator tests

// Add Jest extended matchers
require('@testing-library/jest-dom');

// Mock global window object if not present
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock localStorage
if (!global.localStorage) {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

// Mock console.error to avoid noise in test output
// Comment out if you need to debug specific errors
const originalError = console.error;
console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning: ReactDOM.render is no longer supported in React 18./i.test(args[0])
  ) {
    return;
  }
  originalError(...args);
};

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
  })
); 