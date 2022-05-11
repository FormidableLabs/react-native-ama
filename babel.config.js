module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: './',
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
          'jpg',
          'jpeg',
        ],
        alias: {
          '~components': './lib/global',
          '~hooks': './lib/hooks',
          '~internal': './lib/internal',
        },
      },
    ],
  ],
};
