// eslint-disable-next-line
module.exports = {
  preset: "react-native",
  verbose: true,
  setupFilesAfterEnv: [
    "./jest.setup.js"
  ],
  testMatch: ["**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation|ky)',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Ensure Babel is used for transforming JS files
    // "^.+\\.ts?$": "ts-jest",
    // "^.+\\.tsx?$": "ts-jest",
    // "^.+\\.js$": "./node_modules/react-native/jest/preprocessor.js"
  },
  // transformOptions: {
  //   babelConfig: require('./babel.base.js'),
  // },
  // babelConfig: {
  //   presets: ['@babel/preset-env', '@babel/preset-flow'],
  // },
  // globals: {
  //   'babel-jest': {
  //     config: require('./babel.base.js'), // Use babel.base.js for configuration
  //   },
  // },
  // moduleNameMapper: {
  //   '^@babel/runtime': '<rootDir>/node_modules/@babel/runtime',
  // },
  projects: [
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "animations",
      testMatch: ["<rootDir>/packages/animations/src/**/*.test.ts"],
    }
  ],
}