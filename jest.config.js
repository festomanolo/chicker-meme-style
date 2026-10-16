export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
      ]
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(lucide-react)/)',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/__tests__/setup.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/index.tsx',
    '!src/vite-env.d.ts',
  ],
};
