<a href="https://commerce.nearform.com/open-source/" target="_blank">
  <img alt="React Native AMA" src="https://oss.nearform.com/api/banner.svg?text=react+native+ama" />
</a>

# Accessibility as a First-Class Citizen with React Native AMA

[![github][github-image]][github-url] [![npm][npm-image]][npm-url] [![docs][docs-image]][docs-url] [![Maintenance Status][maintenance-image]](#maintenance-status)

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

## Getting started

AMA is made of the following packages:

- `@react-native-ama/core`: the core components and hooks, providers and consumers used by AMA packages
- `@react-native-ama/animations`: to create accessible animations
- `@react-native-ama/react-native`: for accessibility-first React Native replacement components
- `@react-native-ama/forms`: to create accessible forms
- `@react-native-ama/lists`: to create accessible lists
- `@react-native-ama/extras`: extra compound components and hooks beyond the scope of the base React Native components for building accessible react native apps

The `core` package, is the minimum installable setup for AMA to function. This package contains the AMA context provider and consumer as well various other hooks and utilities for focusing, WCAG checks, accessibility tree management, etc.

Start off by installing `core` and wrapping your app in the `<AMAProvider>`. Then add any other AMA packages you wish to make use of for building an accessible mobile app.

**1. Install the `core` package**:

```sh
yarn add @react-native-ama/core
```

#### or

```sh
npm install @react-native-ama/core
```

**2. Wrap the App in `<AMAProvider>`**

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

### Playground

You can use the playground app within this repository to see how AMA checks work in practice.
The playground can also be used to learn how to fix accessibility issues in your app.


## 📃 [Documentation](https://commerce.nearform.com/open-source/react-native-ama)

The documentation contains everything you need to know about `@react-native-ama/...`. It contains several sections in order of importance when you first get started:

- **[Getting started](https://commerce.nearform.com/open-source/react-native-ama/)** — contains the "Getting Started" guide.
- **[Packages](https://commerce.nearform.com/open-source/react-native-ama/core/packages/)** — documentation for each package under React Native AMA
- **[Guidelines](https://commerce.nearform.com/open-source/react-native-ama/guidelines/)** — mobile accessibility guidelines enforced by AMA
- **[Checklist](https://commerce.nearform.com/open-source/react-native-ama/checklist/)** — condensed guidelines enforced by AMA

_You can find the raw markdown files inside this repository's `docs` folders._

## 🤝 Contributing

Please see our [Contributing](./CONTRIBUTING.md) guide.

## Maintenance Status

**Active:** NearForm (Previously Formidable) is actively working on this project, and we expect to continue work on this project for the foreseeable future. Bug reports, feature requests and pull requests are welcome.

[github-image]: https://github.com/FormidableLabs/react-native-ama/workflows/Run%20Tests/badge.svg
[github-url]: https://github.com/FormidableLabs/react-native-ama/actions
[npm-image]: https://img.shields.io/npm/v/@react-native-ama/core
[npm-url]: https://www.npmjs.com/package/@react-native-ama/core
[docs-image]: https://img.shields.io/badge/docs-visit%20site-blue
[docs-url]: https://commerce.nearform.com/open-source/react-native-ama/
[maintenance-image]: https://img.shields.io/badge/maintenance-active-green.svg?color=brightgreen&style=flat
