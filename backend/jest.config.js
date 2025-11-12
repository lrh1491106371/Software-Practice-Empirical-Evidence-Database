module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/tests/**/*.spec.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  testPathIgnorePatterns: ['/node_modules/'],
};