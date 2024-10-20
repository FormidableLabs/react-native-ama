// eslint-disable-next-line
module.exports = {
  presets: [ 
    'module:metro-react-native-babel-preset', 
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react',
    'module:@react-native/babel-preset'
  ],
  plugins: [
    [
      'module-resolver',
      {
          alias: {
              '@': './src',
              'assets': './assets',
          }
      },
  ],
    'react-native-reanimated/plugin', // reanimated plugin must be listed last
  ],
  // plugins: [
  //   [
  //     'module-resolver',
  //     {
  //       root: './',
  //       extensions: [
  //         '.ios.ts',
  //         '.android.ts',
  //         '.ts',
  //         '.ios.tsx',
  //         '.android.tsx',
  //         '.tsx',
  //         '.jsx',
  //         '.js',
  //         '.json',
  //         'jpg',
  //         'jpeg',
  //       ],
  //       alias: {
  //         '@react-native-ama/core/src': `${__dirname}/packages/core/src`,
  //         '@react-native-ama/core': `${__dirname}/packages/core/src`,
  //         '@react-native-ama/internal/src': `${__dirname}/packages/internal/src`,
  //         '@react-native-ama/internal': `${__dirname}/packages/internal/src`,
  //         '@react-native-ama/animations/src': `${__dirname}/packages/animations/src`,
  //         '@react-native-ama/animations': `${__dirname}/packages/animations/src`,
  //         '@react-native-ama/extras/src': `${__dirname}/packages/extras/src`,
  //         '@react-native-ama/extras': `${__dirname}/packages/extras/src`,
  //         '@react-native-ama/lists/src': `${__dirname}/packages/lists/src`,
  //         '@react-native-ama/lists': `${__dirname}/packages/lists/src`,
  //         '@react-native-ama/react-native/src': `${__dirname}/packages/react-native/src`,
  //         '@react-native-ama/react-native': `${__dirname}/packages/react-native/src`,
  //         '@react-native-ama/internal/src': `${__dirname}/packages/internal/src`,
  //         '@react-native-ama/internal': `${__dirname}/packages/internal/src`,
  //       },
  //     },
  //   ],
  // ],
};
