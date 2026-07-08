---
sidebar_position: 5
displayed_sidebar: docs
pagination_next: 'migration-internal'
---

# Migration — @react-native-ama/react-native

The `@react-native-ama/react-native` package has been removed in v2. This package provided accessibility-first replacements for React Native components. In v2, this functionality has been distributed across other packages or the components use native React Native equivalents directly.

## Migration Guide

### Text

**Before (v1):**
```tsx
import { Text } from '@react-native-ama/react-native';

export const MyComponent = () => {
  return <Text>Hello World</Text>;
};
```

**After (v2):**
Use React Native's `Text` component directly:

```tsx
import { Text } from 'react-native';

export const MyComponent = () => {
  return <Text>Hello World</Text>;
};
```

### Pressable

**Before (v1):**
```tsx
import { Pressable } from '@react-native-ama/react-native';

export const MyButton = () => {
  return (
    <Pressable onPress={() => {}}>
      <Text>Press me</Text>
    </Pressable>
  );
};
```

**After (v2):**
Use React Native's `Pressable` component directly:

```tsx
import { Pressable, Text } from 'react-native';

export const MyButton = () => {
  return (
    <Pressable onPress={() => {}}>
      <Text>Press me</Text>
    </Pressable>
  );
};
```

### ExpandablePressable

**Deprecated.** This component has been removed. Use React Native's `Pressable` with custom expand/collapse logic, or implement the expand/collapse behavior using `@react-native-ama/animations` and `useAnimation` hook for accessible motion support.

### StaticFlatList

**Deprecated.** This component has been removed. Use `FlatList` from React Native directly, or use `StaticFlatList` from `@react-native-ama/lists` for enhanced accessibility features around static (non-paginated) lists.

## Summary

- **Text** and **Pressable**: Use React Native's native components directly
- **ExpandablePressable**: Implement custom expand/collapse with `Pressable` + `@react-native-ama/animations`
- **StaticFlatList**: Use `@react-native-ama/lists` for accessible list support
