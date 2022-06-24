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
so this other dependencies should be also be installed.

```bash npm2yarn
npm install --save-dev react-native-reanimated
npm install --save-dev react-native-gesture-handler

cd ios
pod install
```

### Config File

Create an empty json file called `ama.json`, if does not exists, in the root of your project. This is used to be able to override [the default rules](/introduction/config-file).

```json title="ama.json"
{
}
```
