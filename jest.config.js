module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  globalSetup: undefined,
  testTimeout: 30000,
  forceExit: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/app.ts'],
}