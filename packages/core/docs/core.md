---
slug: /
title: The core package
sidebar_position: 1
---

# Intro

The core package `react-native-ama` enriches React Native by adding custom hooks and extending its components to prioritize accessibility.
The core components in the package are designed to focus solely on accessibility checks without adding additional styling.

## Installation

Install the `react-native-ama` package with your favourite package manager:

```bash npm2yarn
npm install -D react-native-ama
```

### Config File

If you install the `react-native-ama` package, the ama.rules.json file should be generated automatically. In case it doesn't generate automatically:

```bash
echo "{}" >> ama.rules.json
cd node_modules/react-native-ama
ln -s ../../ama.rules.json .
```

For more detailed information about the config file, please refer to [this documentation](/config-file).

## Usage

You must include the [AMAProvider](../components/AMAProvider) in your app, as some components and hooks require it.

```jsx
import { AMAProvider } from 'react-native-ama';

// dimmed
const App = () => {
  // dimmed
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
    // dimmed
  );
  // dimmed
};
```
