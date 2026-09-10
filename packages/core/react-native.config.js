module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath: 'import expo.modules.ama.ReactNativeAmaPackage;',
        packageInstance: 'new ReactNativeAmaPackage()',
      },
    },
  },
};
