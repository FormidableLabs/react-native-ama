# Tech Spec — react-native-ama

## Tech stack

| Layer | Decision |
|-------|----------|
| Language | TypeScript ^5.1.3 |
| Framework | React Native 0.79.1 + Expo ~53.0.0 |
| Package manager | Yarn Berry 3.6.4 (workspaces) |
| Build | `tsc` per package via `expo-module-scripts`. Ships source + type declarations. No bundler. |
| Native modules | Expo Module API (`expo-module-scripts`). No bare TurboModule setup. |
| Docs site | Docusaurus ^3.4.0 + Tailwind ^3.4.4 |

## Libraries & dependencies

| Category | Decision | Version | Install |
|----------|----------|---------|---------|
| Animations | react-native-reanimated | ~3.17.4 | `yarn add react-native-reanimated` |
| Gestures | react-native-gesture-handler | ~2.24.0 | `yarn add react-native-gesture-handler` |
| Testing framework | Jest + @testing-library/react-native | ^29 / ^12.3.0 | (dev, root) |
| Test preset (forms) | jest-expo | ^49.0.0 | (dev, forms package) |
| Versioning | @changesets/cli | ^2.27.7 | (dev, root) |
| Changelog format | @svitejs/changesets-changelog-github-compact | ^1.1.0 | (dev, root) |
| Linting | ESLint + @react-native/eslint-config | ^8.19.0 | (dev, root) |
| Formatting | Prettier + @ianvs/prettier-plugin-sort-imports | 2.8.8 | (dev, root) |
| Git hooks | Husky | ^8.0.1 | (dev, root) |

## Package graph

```
@react-native-ama/internal  ← internal only, removed at v2.0
    └── @react-native-ama/core
            ├── @react-native-ama/animations    peer: react-native-reanimated >=2
            ├── @react-native-ama/react-native  (package folder: react-native-delete-me — retired at v2.0)
            ├── @react-native-ama/lists         peer: expo >=47 (optional)
            ├── @react-native-ama/forms         depends on core + react-native sub-package
            └── @react-native-ama/bottom-sheet  peer: core ~2.0.0, reanimated >=2, gesture-handler >=2
```

**Consumer-facing packages:** `core`, `animations`, `react-native` (until v2), `lists`, `forms`, `bottom-sheet`.  
**Not for consumers:** `@react-native-ama/internal` — shared internal utilities, not published as a standalone install.

## Versioning strategy

- All packages targeting **v2.0.0** simultaneously.
- `bottom-sheet` is already at 2.0.0; all others are at 1.2.0.
- When v2.0.0 ships: `@react-native-ama/internal` and `@react-native-ama/react-native` (`react-native-delete-me`) are removed entirely.
- Changesets manages per-package version bumps and changelogs. All packages publish with npm provenance.

## Build

Each package builds independently:
```
tsc -p tsconfig.build.json   # per package
```
Root build script chains in dependency order:
```
internal → core → animations → react-native → forms → lists
```
`bottom-sheet` builds independently (no internal dependency at v2).

## Platform constraints

- iOS and Android only. No web target.
- Expo compatibility required — `lists` accepts Expo as an optional peer (>=47).
- `bottom-sheet` requires React Native >=0.62.0.
- iOS native layer uses CocoaPods (`react-native-ama.podspec`).

## Runtime config

`ama.config.json` at project root controls accessibility rule enforcement at runtime:

| Key | Purpose |
|-----|---------|
| `rules` | Override per-rule severity (warn/error/off) |
| `highlight` | Visual debug mode (`border` or `none`) |
| `log` | When to log violations (`always`, `dev`, `never`) |
| `accessibilityLabelExceptions` | Labels exempt from validation rules |

## Native event payload contracts

Source of truth for event payload shapes: `packages/core/src/ReactNativeAma.types.ts`.

### Event: `onAmaNodes`

Payload type: `AmaNodes = Record<number, AmaNode>`.

`AmaNode` fields:

| Field | Type | Required | Notes |
|------|------|----------|-------|
| `type` | `'Pressable' \| 'Text' \| 'TextInput' \| 'Image'` | Yes | Node category used by checkers. |
| `viewId` | `number` | Yes | Native view identifier. |
| `bounds` | `[number, number, number, number]` | Yes | Tuple for node bounds. |
| `hitSlop` | `{ top: number; left: number; bottom: number; right: number }` | No | Press target expansion values. |
| `ariaLabel` | `string` | No | Accessibility label. |
| `ariaRole` | `string` | No | Accessibility role. |
| `traits` | `string[]` | No | Platform traits/flags. |
| `content` | `string` | No | Text content snapshot. |
| `fg` | `string` | No | Foreground color value. |
| `bg` | `string` | No | Background color value. |
| `fontSize` | `number` | No | Font size in pt. |
| `isBold` | `boolean` | No | Whether text is bold. |
| `isEnabled` | `boolean` | No | Enabled/disabled state. |
| `returnType` | `number` | No | Return key type for inputs. |
| `hasOnSubmitEditing` | `boolean` | Yes | Whether submit handler exists. |
| `isAccessible` | `boolean` | No | Text accessibility visibility/status indicator. |

### Event: `onUIInteraction`

Payload type: `AmaUiSnapshotsData`.

`AmaUiSnapshotsData` fields:

| Field | Type | Required | Notes |
|------|------|----------|-------|
| `rootTag` | `number` | Yes | Root surface identifier for snapshot pair. |
| `before` | `Record<number, AmaUiSnapshot>` | Yes | Snapshot map before interaction. |
| `after` | `Record<number, AmaUiSnapshot>` | Yes | Snapshot map immediately after interaction. |
| `afterSettled` | `Record<number, AmaUiSnapshot>` | No | Optional post-settle snapshot map. |
| `beforeModalVisible` | `boolean` | Yes | Modal visibility before interaction. |
| `afterModalVisible` | `boolean` | Yes | Modal visibility after interaction. |

`AmaUiSnapshot` fields used inside `before`/`after`/`afterSettled` maps:

| Field | Type | Required |
|------|------|----------|
| `fgColor` | `string` | No |
| `bgColor` | `string` | No |
| `x` | `number` | Yes |
| `y` | `number` | Yes |
| `width` | `number` | Yes |
| `height` | `number` | Yes |
| `parentId` | `number` | Yes |
| `isPressable` | `boolean` | Yes |
| `isChecked` | `boolean` | Yes |
| `isBusy` | `boolean` | Yes |
| `isSelected` | `boolean` | Yes |
| `isDisabled` | `boolean` | Yes |
| `isExpanded` | `boolean` | Yes |

Contract requirement: any field addition, rename, removal, or semantic change for these payloads must be updated together in iOS emitters, Android emitters, and `packages/core/src/ReactNativeAma.types.ts`.

## Key technical decisions

- **No bundler** — packages ship source + `dist/` compiled by tsc. Consumers compile through Metro.
- **Peer dependencies, not bundled** — reanimated, gesture-handler, and expo are peers so consumers control versions.
- **Expo Module API** — chosen over bare TurboModules for Expo compatibility and simpler native bridging.
- **Changesets** — selected over manual versioning for independent per-package release control.
- **v2.0 cleanup** — removes `@react-native-ama/internal` (internalize per-package) and retires `@react-native-ama/react-native`; `bottom-sheet` peer on `core` will align to `~2.0.0` across all packages.
