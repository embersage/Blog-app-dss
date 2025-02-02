export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/tests/**/*.test.ts'],
};
