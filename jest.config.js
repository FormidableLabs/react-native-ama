// eslint-disable-next-line
module.exports = {
  preset: "react-native",
  verbose: true,
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
  setupFilesAfterEnv: [
    "./jest.setup.js"
  ],
  testMatch: ["**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-native-reanimated|@react-native|@react-native-community|@react-navigation|ky)',
    "node_modules/(?!(@react-native|react-native|react-native-reanimated)/)"
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Ensure Babel is used for transforming JS files
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
  // moduleNameMapper: {
  //   '^@react-native-ama/core$': '<rootDir>/packages/core/src',
  // },
  //moduleDirectories: ['node_modules', 'packages'], // Added for module resolution
  // moduleNameMapper: {
  //   '^@react-native-ama/internal$': '<rootDir>/packages/core/src', // Adjust as necessary
  //   '^@react-native-ama/core$': '<rootDir>/packages/core/src',
  // },
  testTimeout: 10000,
  projects: [
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "animations",
      testMatch: ["<rootDir>/packages/animations/src/**/*.test.ts",
        "<rootDir>/packages/animations/src/**/*.test.tsx"
      ],
    },
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "core",
      testMatch: ["<rootDir>/packages/core/src/**/*.test.ts",
          "<rootDir>/packages/core/src/**/*.test.tsx"
      ],
    },
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "internal",
      testMatch: ["<rootDir>/packages/internal/src/**/*.test.ts",
          "<rootDir>/packages/internal/src/**/*.test.tsx"
      ],
    },
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "extras",
      testMatch: ["<rootDir>/packages/extras/src/**/*.test.ts",
          "<rootDir>/packages/extras/src/**/*.test.tsx"
      ],
    },
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "lists",
      testMatch: ["<rootDir>/packages/lists/src/**/*.test.ts",
          "<rootDir>/packages/lists/src/**/*.test.tsx"
      ],
    },
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/"],
      preset: "react-native",
      displayName: "forms",
      testMatch: ["<rootDir>/packages/forms/src/**/*.test.ts",
          "<rootDir>/packages/forms/src/**/*.test.tsx"
      ],
    }
  ],
}