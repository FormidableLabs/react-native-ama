---
slug: /
title: The core package
sidebar_position: 1
---

# Intro

The core package `react-native-ama` offers essential hooks and components needed to create an app with accessibility in mind.

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

```jsx {1-4,8-9}
import { AMAProvider } from 'react-native-ama';

const App = () => {
  return (
    <AMAProvider>
      <YourApp />
    </AMAProvider>
  );
};
```
