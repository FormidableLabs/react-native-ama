// eslint-disable-next-line
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // reanimated plugin must be listed last
    ],
  };
};
