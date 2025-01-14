---
sidebar_position: 1
displayed_sidebar: docs
pagination_next: 'config-file'
pagination_prev: 'index'
---

# Getting Started

**AMA** is made of the following packages:

- `@react-native-ama/core`: the core components and hooks, providers and consumers used by AMA packages
- `@react-native-ama/animations`: to create accessible animations with support for user motion preferences
- `@react-native-ama/react-native`: for accessibility-first replacement for core React Native components
- `@react-native-ama/forms`: to create accessible forms
- `@react-native-ama/lists`: to create accessible lists
- `@react-native-ama/extras`: extra compound components and hooks beyond the scope of the base React Native components for building accessible react native apps

## Setup

The `core` package, is the minimum installable setup for **AMA** to function. This package contains the **AMA** context provider and consumer as well various other hooks and utilities for focusing, WCAG checks, accessibility tree management, etc.

Start off by installing `core` and then any other packages you wish to make use of for building an accessible mobile app.

```bash npm2yarn
npm install  @react-native-ama/core
```

### Config File

When you install the `@react-native-ama/core` package, `the ama.rules.json` file should be generated automatically in the root of your project. This file can be used to customize AMA Log Levels and Exceptions. If you are running a monorepo setup this file won't automatically generate and you will have two options customize AMA's config.

See more on configuring **AMA** rules and severity [here](./config-file.md).

### Jest

When running a test, if jest fails with the following error:

> Cannot find module './../../ama.rules.json' from 'node_modules/@react-native-ama/internal/dist/utils/logger.js'

Add the following mock to your jest setup file which can be configured via the `.jest.config.js` or `.jest.config.ts` file (see [setupFilesAfterEnv](https://jestjs.io/docs/configuration#setupfilesafterenv-array)):

```js title="setup-jest.js"
jest.mock('@react-native-ama/internal/dist/utils/logger.js', () => {
  return {
    getContrastCheckerMaxDepth: () => 5,
    shouldIgnoreContrastCheckForDisabledElement: () => true,
  };
});
```
