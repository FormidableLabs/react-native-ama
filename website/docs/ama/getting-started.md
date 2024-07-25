---
sidebar_position: 1
---

# Getting started

AMA is made of the following packages:

- `react-native-ama` the core components and hooks
- `react-native-ama/animations` to create accessible animations
- `react-native-ama/forms` to create accessible forms
- `react-native-ama/lists` to create accessible lists
- `react-native-ama/react-native` for accessibility-first React Native replacement components

### Config File

If you install the `react-native-ama` package, the ama.rules.json file should be generated automatically. In case it doesn't generate automatically:

```bash

echo "{}" >> ama.rules.json
cd node_modules/react-native-ama
ln -s ../../ama.rules.json .
```

### Jest

When running a test, if jest fails with the following error:

> Cannot find module './../../ama.rules.json' from 'node_modules/react-native-ama/dist/commonjs/internal/logger.js'

add those lines to the `.jest.config.js` file:

```js
jest.mock('react-native-ama/dist/commonjs/internal/logger.js', () => {
  return {
    getContrastCheckerMaxDepth: () => 5,
  };
});
```
