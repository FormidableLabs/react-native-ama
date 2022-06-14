module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'babel-plugin-transform-strip-block',
      {
        requireDirective: true,
        identifiers: [{ start: 'block:start', end: 'block:end' }],
      },
    ],
  ],
};
