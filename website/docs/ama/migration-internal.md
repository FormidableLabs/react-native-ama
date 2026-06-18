---
sidebar_position: 6
displayed_sidebar: docs
pagination_prev: 'migration-react-native'
---

# Migration — @react-native-ama/internal

The `@react-native-ama/internal` package has been removed in v2. Its code has been inlined into the active AMA packages (`core`, `animations`, and `forms`). This page shows where each symbol moved.

## Logger Utilities

**Before (v1):**
```tsx
import logger from '@react-native-ama/internal/dist/utils/logger';

logger.warn('Something went wrong');
```

**After (v2):**
Logger utilities are internal to `@react-native-ama/core` and not exported for external use. If you need debug logging, use React Native's `console` methods directly.

## Config File Management

**Before (v1):**
In monorepo setups, developers symlinked or copied from `node_modules/@react-native-ama/internal/ama.config.json`.

**After (v2):**
The `ama.config.json` file is now:
- Located in `node_modules/@react-native-ama/core/ama.config.json` for the default config
- Placed in your project root for custom overrides (created automatically by the installation script in `@react-native-ama/core`)

In monorepo setups, create or copy your custom `ama.config.json` to the project root. No symlink to an `internal` package is needed.

## Animation Helpers

**Before (v1):**
Animation helpers may have been in `@react-native-ama/internal`.

**After (v2):**
Animation utilities are now part of `@react-native-ama/animations`. Use the exported hooks and utilities from that package directly:

```tsx
import { useAnimation, useAnimationDuration } from '@react-native-ama/animations';
```

## Form Utilities

**Before (v1):**
Form utilities may have been in `@react-native-ama/internal`.

**After (v2):**
Form utilities are now part of `@react-native-ama/forms`. Use the exported components and hooks from that package:

```tsx
import { Form, TextInput, useForm } from '@react-native-ama/forms';
```

## Summary

- **Logger**: Internal to core; use `console` for debugging
- **Config file**: Now in `node_modules/@react-native-ama/core/ama.config.json`; override by creating `ama.config.json` in your project root
- **Animation helpers**: Use `@react-native-ama/animations`
- **Form utilities**: Use `@react-native-ama/forms`

If you were directly importing symbols from `@react-native-ama/internal`, migrate to the appropriate active package listed above.
