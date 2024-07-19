---
slug: /
title: The Forms package
sidebar_position: 1
---

# Intro

The `@react-native-ama/forms` package offers essential hooks and components needed to create accessible forms.

## Installation

Install the `@react-native-ama/forms` package with your favourite package manager:

```bash npm2yarn
npm install @react-native-ama/forms
```

## Usage

Each form needs to be wrapped by the [Form](/forms/form) provider.

```jsx
<Form onSubmit={handleSubmit} ref={ref}>
    {...}
</Form>
```
