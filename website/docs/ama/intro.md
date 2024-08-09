---
slug: /
title: React Native AMA
sidebar_position: 0
displayed_sidebar: docs
---

# Accessibility as a First-Class Citizen with React Native AMA

A.M.A. stands for **A**ccessible **M**obile **A**pp and is a React native library that offers the best accessibility tooling experience and guides to guide you through accessibility best practices while you code your app.

That's why we created A.M.A., a set of [components](https://formidable.com/open-source/react-native-ama/components/) and
[hooks](https://formidable.com/open-source/react-native-ama/components/) designed to enforce minimum accessibility requirements.
This is combined with extensive [guidelines](https://formidable.com/open-source/react-native-ama/guidelines/) to help you understand how accessibility should work when manually testing your app.

:::info

The library does not perform any accessibility checks on the production build!

:::

## Run time dev tooling

Adopting an "accessibility-first" approach is the best way to ensure that digital experiences are inclusive for everyone. By prioritizing accessibility in the early stages of code development, you avoid needing time-consuming and expensive retroactive fixes.

React Native provides the necessary tools to create accessible apps[^1]. However, it leaves the developer on their own to determine what and when to use them. AMA solves this issue[^1] by conducting accessibility checks during your app's runtime [^1].

### Example of a failed accessibility check

If AMA detects an accessibility issue:

- Highlight the offending component
- Show a banner to inform that something went wrong
- Provide a guideline link to the issue

![Example of a failed accessibility check by AMA](https://github.com/FormidableLabs/react-native-ama/blob/main/website/docs/ama/ama-demo.png?raw=true)
_Example of a failed accessibility check by AMA_

<br />

![Additional information and guideline link provided by AMA](https://github.com/FormidableLabs/react-native-ama/blob/main/website/docs/ama-console-error.png?raw=true)
_Additional information and guideline link provided by AMA_

[^1]: The accessibility support in React Native is [not fully complete](https://github.com/facebook/react-native/projects/15).
[^1]: AMA can help catch common accessibility issues, but a full manual test is still necessary.
[^1]: Runtime checks are performed **ONLY** in the dev build when **DEV** is true. In production mode, the checking code is stripped away.
