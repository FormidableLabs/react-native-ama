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

When you install the `@react-native-ama/core` package, the ama.rules.json file should be generated automatically. In cases it doesn't generate automatically, run the following from the root of your project:

```bash
# Create ama.rules.json with an empty JSON object if it doesn't exist
echo "{}" >> ama.rules.json

# Navigate to the internal directory
cd node_modules/@react-native-ama/internal

# Create symlinks in src and dist directories
ln -s ../../../ama.rules.json src/ama.rules.json
ln -s ../../../ama.rules.json dist/ama.rules.json

# Go back to the root directory
cd -
```

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
