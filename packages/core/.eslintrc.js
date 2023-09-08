module.exports = {
  root: true,
  env: {
    browser: true,
    'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
  },
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  extends: ['@react-native-community'],
  plugins: ['jest', 'import'],
  ignorePatterns: [
    'metro.config.js',
    'dist/**/*',
    'website/**/*',
    'coverage/**/*',
    '__mocks__/**/*',
  ],
};
