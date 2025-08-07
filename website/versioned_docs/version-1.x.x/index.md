---
slug: /
id: index
title: Overview
sidebar_position: 0
displayed_sidebar: docs
pagination_next: 'getting-started'
---

# Accessibility as a First-Class Citizen With React Native AMA

## Overview

**A.M.A.** stands for **A**ccessible **M**obile **A**pp and is a React Native library that offers the best accessibility tooling experience as well as expert guides to support you with accessibility best practices while developing your app.

The library consists of

1. A set of components and hooks designed to enforce minimum accessibility requirements.
2. Extensive [guidelines](https://commerce.nearform.com/open-source/react-native-ama/guidelines/) to help you understand how accessibility should work when manually testing your app.
3. A [checklist](https://commerce.nearform.com/open-source/react-native-ama/checklist/) which condenses these guidelines, explaining their intended functionality against specific features or components.

**AMA** consists of a family of packages under the npm `@react-native-ama` namespace. These packages are designed to work together to build up an accessible mobile app, allowing developers to subscribe to the bits they need without installing the full set of packages from the start.

:::tip
All packages leverage the `@react-native-ama/core` package to provide accessible mobile app functionality. This package must be installed first before any others can work.
:::

## Runtime Dev Tooling (Accessibility Checks)

Adopting an "accessibility-first" approach is the best way to ensure that digital experiences are inclusive for everyone. By prioritizing accessibility in the early stages of code development, you avoid having to later apply retroactive fixes which can be very time-consuming, expensive and difficult.

React Native provides the necessary tools to create accessible apps [^1]. However, it leaves the developer on their own to determine what and when to use them. **AMA** solves this issue [^1] by conducting accessibility checks during your app's runtime [^1].

:::info

The library does not perform any accessibility checks on the production build!

:::

### Example of a Failed Accessibility Check

If **AMA** detects an accessibility issue it:

- Highlights the offending component
- Shows a banner to inform that something went wrong
- Provides a guideline link to the issue

<img alt="An example of a form field that displays several form fields, and a Last Name field emphasized in red. There is an error at the bottom that reads: 'AMA: One or more component didn't pass the accessibility check. Please check the console for more info...'" src="https://github.com/FormidableLabs/react-native-ama/blob/main/website/docs/ama/ama-demo.png?raw=true" height="900" />

_Example of a failed accessibility check by AMA_

<br />

![A screenshot of a console log which displays an error that indicates NO_KEYBOARD_TRAP - The component did not receive the focus, with a link to the user to navigate to a guide for further details to reference.](https://github.com/FormidableLabs/react-native-ama/blob/main/website/docs/ama-console-error.png?raw=true)
_Additional information and guideline link provided by AMA in the console_

[^1]: The accessibility support in React Native is [not fully complete](https://github.com/facebook/react-native/projects/15).
[^1]: AMA can help catch common accessibility issues, but a full manual test is still necessary.
[^1]: Runtime checks are performed **ONLY** in the dev build when **DEV** is true. In production mode, the checking code is stripped away.
