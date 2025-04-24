/**
 * Mock data configuration
 * 
 * This file controls whether the app uses mock data or real API calls.
 * In production, set USE_MOCK_DATA to false.
 */

export const USE_MOCK_DATA = true;

// Artificial delay range for mock responses (in ms)
export const MOCK_DELAY_MIN = 200;
export const MOCK_DELAY_MAX = 500;

/**
 * Generate a random delay between min and max
 * Used to simulate network latency for a more realistic experience
 */
export const getRandomDelay = () => {
  return Math.floor(Math.random() * (MOCK_DELAY_MAX - MOCK_DELAY_MIN + 1)) + MOCK_DELAY_MIN;
}; 