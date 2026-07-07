module.exports = {
  extends: ['../.eslintrc.js'],
  parserOptions: {
    project: null,
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'web-build/',
    '.yarn/',
    'android/',
    'ios/',
  ],
  rules: {
    'react-native/no-inline-styles': 'off',
  },
};
