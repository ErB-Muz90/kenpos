export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  // Ensure each test file runs in isolation
  resetModules: true,
};
