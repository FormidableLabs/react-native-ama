module.exports = {
  root: true,
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: ['@react-native-community'],
  plugins: ['jest', 'import'],
  ignorePatterns: ['metro.config.js'],
};
