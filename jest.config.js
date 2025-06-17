const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // path ke root Next.js project
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Alias Next.js agar Jest bisa resolve import @/
    '^@/(.*)$': '<rootDir>/$1',

    // Ignore CSS and friends
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};

module.exports = createJestConfig(customJestConfig);
