> [!NOTE]  
> This branch represents the last saved state of the previous version of the library before the project was broken out into a monorepo and split into multiple package. The new version of the library is being developed in the `main` branch.

[![React Native AMA — Formidable, We build the modern web](https://raw.githubusercontent.com/FormidableLabs/react-native-ama/main/react-native-ama-Hero.png)](https://formidable.com/open-source/)

# Accessibility as a First-Class Citizen with React Native AMA

[![github][github-image]][github-url] [![npm][npm-image]][npm-url] [![docs][docs-image]][docs-url] [![Maintenance Status][maintenance-image]](#maintenance-status)

A.M.A. stands for **A**ccessible **M**obile **A**pp and is react native library that aim offers the best accessibility tooling experience and guides to guide you through accessibility best practices while you code your app.
That's why we created A.M.A., a set of [components](https://formidable.com/open-source/react-native-ama/components/),
[hooks](https://formidable.com/open-source/react-native-ama/components/) designed to enforce minimum accessibility requirements.
This is combined with extensive [guidelines](https://formidable.com/open-source/react-native-ama/guidelines/) to help you how accessibility should work when manually testing your app.

![Example of runtime failure detected by AMA](https://github.com/FormidableLabs/react-native-ama/blob/main/docs/ama-demo.png?raw=true)

This is an example of a runtime failure detected by AMA.

## Installation

```sh
yarn add -D react-native-ama
# or
npm install -D react-native-ama
```

## 📃 [Documentation](https://formidable.com/open-source/react-native-ama/)

The documentation contains everything you need to know about `react-native-ama` and contains several sections in order of importance when you first get started:

- **[Getting started](https://formidable.com/open-source/react-native-ama/)** — contains the "Getting Started" guide.
- **[Components](https://formidable.com/open-source/react-native-ama/components)** — overview of all the components available `react-native-ama`.
- **[Hooks](https://formidable.com/open-source/react-native-ama/hooks/useAMAContext)** — overview of all the hooks available
- **[Guidelines](https://formidable.com/open-source/react-native-ama/guidelines)** — guidelines enforced by AMA components

_You can find the raw markdown files inside this repository's `docs` folder._

## 🤝 Contributing

Please see our [Contributing](./CONTRIBUTING.md) guide.

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue work on this project for the foreseeable future. Bug reports, feature requests and pull requests are welcome.

[github-image]: https://github.com/FormidableLabs/react-native-ama/workflows/Run%20Tests/badge.svg
[github-url]: https://github.com/FormidableLabs/react-native-ama/actions
[npm-image]: https://img.shields.io/npm/v/react-native-ama
[npm-url]: https://www.npmjs.com/package/react-native-ama
[docs-image]: https://img.shields.io/badge/docs-visit%20site-blue
[docs-url]: https://formidable.com/open-source/react-native-ama/
[maintenance-image]: https://img.shields.io/badge/maintenance-active-green.svg?color=brightgreen&style=flat
