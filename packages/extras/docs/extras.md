---
slug: /
title: The extras package
sidebar_position: 1
---

# Intro

The `@react-native-ama/extras` package offers extra accessible hooks and components which are often used when building react-native apps, such as BottomSheets and Carousels.

## Installation

Install the `@react-native-ama/extras` package with your favourite package manager:

```bash npm2yarn
npm install @react-native-ama/extras
```

### Dependencies

Some components rely on [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) and/or [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler),
so these dependencies are required for the extras package to function and should also be installed.

```bash npm2yarn
npm install react-native-reanimated
```

Follow the specific installation instructions for React Native Reanimated [here](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation).

```bash npm2yarn
npm install react-native-gesture-handler
```

Follow the specific installation instructions for React Native Gesture Handler [here](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation), specifically wrapping the entry point of the app in a `GestureHandlerRootView`.
