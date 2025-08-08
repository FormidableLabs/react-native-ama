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

1. Runtime checks that help you catch common accessibility issues during development.
2. A set of popular components that are designed with accessibility in mind.
2. Extensive [guidelines](https://commerce.nearform.com/open-source/react-native-ama/guidelines/) to help you understand how accessibility should work when manually testing your app.
3. A [checklist](https://commerce.nearform.com/open-source/react-native-ama/checklist/) which condenses these guidelines, explaining their intended functionality against specific features or components.

**AMA** consists of a family of packages under the npm `@react-native-ama` namespace.
These packages are designed to work independently, allowing you to pick and choose the ones that suit your needs.
This modular approach enables developers to create a tailored experience for their applications without the overhead of unnecessary dependencies.

## Runtime Dev Tooling (Accessibility Checks)

Adopting an "accessibility-first" approach is the best way to ensure that digital experiences are inclusive for everyone. By prioritizing accessibility in the early stages of code development, you avoid having to later apply retroactive fixes which can be very time-consuming, expensive and difficult.

### How it works

When you wrap your application with the AMAProvider from the [@react-native-ama/core](/core/) package, AMA begins scanning your UI for accessibility (a11y) issues as the app is running.

If any issues are found at the end of a scan, AMA will:

- Highlight the offending component directly on the screen.
- Print a detailed report of the issue to the console.
- Display a summary of the total number of errors and warnings detected.

You can use the built-in developer UI to get more information about the issues affecting each component.
As you modify your code to fix them, AMA reacts to the changes and removes the issues from the report in real-time.

| Real Time scanning | AMA in-app info |
|---------|-------------|
| ![AMA flags multiple accessibility issues in real time, including missing roles and contrast failures, and visually marks each element with severity indicators to guide developers toward immediate fixes.](/img/ama-checks.png) | ![AMA’s real-time accessibility checker detecting a missing role on a pressable element, with detailed guidance, severity level, and direct links to related guidelines.](/img/ama-issue.png) |

_Example of a failed accessibility check performed by AMA_

Console output will look like this:

```
 ERROR  [React Native AMA]: NO_ACCESSIBILITY_ROLE
        Component: Missing role (#232)

        Accessibility roles help users understand how to interact with an element, indicating what action can be performed and what outcome to expect.

        Learn about: https://nearform.com/open-source/react-native-ama//guidelines/accessibility-role
```

<br />

:::info

Runtime checks are performed **ONLY** in the dev build when **DEV** is true. In production mode, the checking code is stripped away.

:::

:::warning

AMA can help catch common accessibility issues, but a full manual test is still necessary.

:::


