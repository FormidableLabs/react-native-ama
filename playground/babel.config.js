const path = require('path');

module.exports = function (api) {
  api.cache(true);

  const expoDirectory = path.dirname(require.resolve('expo/package.json'));

  return {
    presets: [require.resolve('babel-preset-expo', { paths: [expoDirectory] })],
  };
};
