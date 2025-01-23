---
slug: /
title: The Core Package
sidebar_position: 1
---

# Intro

The core package `@react-native-ama/core` offers essential hooks and components needed to create an app with accessibility in mind.

:::important

The core package is a dependency for all other AMA packages and is needed to be installed in your project before using any other AMA packages.

:::

## Installation

Install the `@react-native-ama/core` package with your favourite package manager:

```bash npm2yarn
npm install  @react-native-ama/core
```

### Config File

When you install the `@react-native-ama/core` package, the `ama.rules.json` file should be generated automatically in your project's root folder. If it didn't generate automatically when you installed the package, you can create it manually with the default config:

```json title="ama.rules.json"
{
  rules: {},
  accessibilityLabelExceptions: [],
};
```

If you are running a monorepo setup your config file may not be configured correctly, be sure to check the [options for customizing AMA's config](/docs/config-file#monorepo-options).

For more detailed information about the config file, please refer to [this documentation](/docs/config-file).

## Usage

You must include the [AMAProvider](./AMAProvider.md) in your app, as some components and hooks require it.

```jsx {2-4,6,8-9}
import { AMAProvider } from '@react-native-ama/core';

export const App = () => {
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
  );
};
```
