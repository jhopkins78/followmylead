/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/preset/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  testTimeout: 30000
};
