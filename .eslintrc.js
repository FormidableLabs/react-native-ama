module.exports = {
  root: true,
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
  extends: ['@react-native'],
  plugins: ['jest', 'import'],
  ignorePatterns: [
    '**/**/metro.config.js',
    '**/dist/**/*',
    '**/website/**/*',
    '**/coverage/**/*',
    '**/__mocks__/**/*',
  ],
};
