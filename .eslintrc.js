module.exports = {
  root: true,
  extends: ['@react-native'],
  plugins: ['jest', 'import'],
  env: {
    browser: true,
    'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/rules-of-hooks': 'off',
  },
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  ignorePatterns: [
    '**/**/metro.config.js',
    '**/dist/**/*',
    '**/website/**/*',
    '**/coverage/**/*',
    '**/__mocks__/**/*',
  ],
};
