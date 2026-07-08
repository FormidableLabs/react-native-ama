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
- `@react-native-ama/forms`: to create accessible forms
- `@react-native-ama/lists`: to create accessible lists
- `@react-native-ama/bottom-sheet`: accessible bottom sheet component

## Setup

The `core` package, is the minimum installable setup for **AMA** to function. This package contains the **AMA** context provider and consumer as well various other hooks and utilities for focusing, WCAG checks, accessibility tree management, etc.

Start off by installing `core` and then any other packages you wish to make use of for building an accessible mobile app.

```bash npm2yarn
npm install  @react-native-ama/core
```

### Usage

Wrap your app with the [AMAProvider](/core/components/AMAProvider) component to start accessibility checks.

```jsx {1-4,8-9}
import { AMAProvider } from '@react-native-ama/core';

const App = () => {
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
  );
};
```

#### Toggle Accessibility Checks

You can toggle the accessibility checks on and off via the [DevMenu](https://reactnative.dev/docs/debugging)

![AMA Dev Menu](/img/dev-menu.png)

### Config File

When you install the `@react-native-ama/core` package, `the ama.config.json` file should be generated automatically in the root of your project. This file can be used to customize AMA Log Levels and Exceptions. If you are running a monorepo setup this file won't automatically generate and you will have two options customize AMA's config.

See more on configuring **AMA** rules and severity [here](./config-file.md).

