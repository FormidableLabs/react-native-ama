<a href="https://commerce.nearform.com/open-source/" target="_blank">
  <img alt="React Native AMA" src="https://oss.nearform.com/api/banner.svg?text=react+native+ama" />
</a>

# Accessibility as a First-Class Citizen with React Native AMA

[![github][github-image]][github-url] [![npm][npm-image]][npm-url] [![docs][docs-image]][docs-url] [![Maintenance Status][maintenance-image]](#maintenance-status)

A.M.A. stands for **A**ccessible **M**obile **A**pp and is react native library that aim offers the best accessibility tooling experience and guides to guide you through accessibility best practices while you code your app.
That's why we created A.M.A., a set of components and hooks designed to enforce minimum accessibility requirements.
This is combined with extensive [guidelines](https://commerce.nearform.com/open-source/react-native-ama/guidelines/) to help you understand how accessibility should work when manually testing your app. Finally we have provided a [checklist](https://commerce.nearform.com/open-source/react-native-ama/checklist/) which condenses these guidelines, explaining their intended functionality against specific features or components.

While in development AMA also provides run time accessibility checks against components

#### Example of AMA checks performed in development:

<img alt="Example of runtime failure detected by AMA" src="https://github.com/FormidableLabs/react-native-ama/blob/main/website/docs/ama/ama-demo.png?raw=true" height=700 />

> [!NOTE]  
> This is an example of a runtime failure detected by AMA with additional information and links to guidelines provided in the console.

**Example of additional console info**:
<img alt="Example of console warning by AMA" src="https://github.com/FormidableLabs/react-native-ama/blob/main/website/docs/ama-console-error.png?raw=true" width=550 />

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

**2. Wrap App in `<AMAProvider>`**

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

## 📃 [Documentation](https://commerce.nearform.com/open-source/react-native-ama)

The documentation contains everything you need to know about `@react-native-ama/...`. It contains several sections in order of importance when you first get started:

- **[Getting started](https://commerce.nearform.com/open-source/react-native-ama/)** — contains the "Getting Started" guide.
- **[Packages](https://commerce.nearform.com/open-source/react-native-ama/core/packages/)** — documentation for each package under React Native AMA
- **[Guidelines](https://commerce.nearform.com/open-source/react-native-ama/guidelines/)** — guidelines enforced by AMA components
- **[Checklist](https://commerce.nearform.com/open-source/react-native-ama/checklist/)** — guidelines enforced by AMA components

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
