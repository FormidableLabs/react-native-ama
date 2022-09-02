---
sidebar_position: 1
slug: /
---

# Getting started

AMA stands for **A**ccessible **M**obile **A**pp and contains a set of accessible components and hooks to simplify the building of accessible apps.

## Installation

Install _react-native-ama_ using either `yarn` or `npm`:

```bash npm2yarn
npm install --save-dev react-native-ama
```


### Dependencies

Some component relies on [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) and/or [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler),
so these other dependencies should also be installed.

```bash npm2yarn
npm install --save-dev react-native-reanimated
npm install --save-dev react-native-gesture-handler

cd ios
pod install
```

### Config File

The installation command should have automatically generated the `ama.rules.json` file. If not:

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
