# Tech Spec — react-native-ama

## Current Technical Summary

| | |
|---|---|
| Runtime / framework | React Native 0.79.1 + Expo ~53.0.0 |
| Language | TypeScript ^5.1.3 (JS), Swift (iOS native), Kotlin (Android native) |
| Data / storage | `ama.config.json` at project root; read at runtime via `require()` |
| Main interfaces | `onAmaNodes` event (form/node checks), `onUIInteraction` event (UI snapshot diff), `trackError(rule, ref?)` context method (JS-side error reporting) |
| Testing | Jest + @testing-library/react-native; per-package `yarn test`; root `yarn test` chains in dependency order |
| Key constraints | iOS and Android only; Expo Module API bridging; v2.0 removes `@react-native-ama/internal` and retires `react-native-delete-me`; React Native's LogBox/YellowBox cannot be reliably excluded from checks (no stable marker exists) — documented as a known limitation, not a code fix |

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
@react-native-ama/core
        ├── @react-native-ama/animations    peer: react-native-reanimated >=2
        ├── @react-native-ama/lists         peer: expo >=47 (optional)
        ├── @react-native-ama/forms         depends on core
        └── @react-native-ama/bottom-sheet  peer: core ~2.0.0, reanimated >=2, gesture-handler >=2
```

**Consumer-facing packages:** `core`, `animations`, `lists`, `forms`, `bottom-sheet`.  
**Removed at v2.0:** `@react-native-ama/internal` (inlined into consuming packages) and `@react-native-ama/react-native` (`react-native-delete-me`).

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
core → animations → forms → lists
```
`bottom-sheet` builds independently (no internal dependency at v2).

## Platform constraints

- iOS and Android only. No web target.
- Expo compatibility required — `lists` accepts Expo as an optional peer (>=47).
- `bottom-sheet` requires React Native >=0.62.0.
- iOS native layer uses CocoaPods (`react-native-ama.podspec`).
- No reliable "what currently has accessibility focus" signal exists on either platform outside an active screen reader session. iOS's `UIAccessibility.elementFocusedNotification` only fires while VoiceOver is running; Android's `TYPE_VIEW_ACCESSIBILITY_FOCUSED` accessibility-event delegate only fires while TalkBack (or another accessibility service) is running. A sighted developer manually testing with the screen reader off gets no signal at all. Any check depending on real-time focus state is unverifiable in the common manual-testing case and is not viable as an AMA runtime check.

## Runtime config

`ama.config.json` at project root controls accessibility rule enforcement at runtime.

**v2.0 structure:**

```jsonc
{
  "rules": {},                        // per-rule severity overrides (AmaRuleAction)
  "accessibilityLabelExceptions": [], // labels exempt from validation
  "uppercaseMinLength": 5,            // minimum char count before uppercase rule applies
  "longNumberMinLength": 12,          // minimum consecutive-digit run length before LONG_NUMBER_NOT_FORMATTED applies
  "highlight": {
    "mode": "border",                 // HighlightMode: "border" | "background" | "both"
    "borderWidth": 2,                 // highlight border width (dp)
    "gap": 8                          // minimum gap between highlighted elements (dp)
  },
  "checks": {
    "ui": true,                       // enable UI interaction checks
    "forms": true,                    // enable form/node checks
    "grouping": true,                 // enable grouping checks
    "delay": 300                      // ms delay before re-checking after interaction
  }
}
```

All keys are optional; any omitted key falls back to the value in the package's default `ama.config.json`. Config is loaded at runtime via `require()` merged with `Object.assign` against the package default. No build step required for config changes.

Breaking changes for the old two-key format (`rules` + `accessibilityLabelExceptions` only) are accepted at v2.0 — no migration shim is provided. The flat `highlight` string from v1.x becomes `highlight.mode` in v2.0.

TypeScript type: `AmaProjectConfig` in `packages/core/src/internals/config.ts`.

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
| `returnType` | `number` | No | Return key type for inputs. `0` = default/unset on both platforms. iOS source: `UIReturnKeyType.rawValue`. Android source: `imeOptions and EditorInfo.IME_MASK_ACTION`. Both map `0` to "no explicit return type set". |
| `hasOnSubmitEditing` | `boolean` | Yes | Whether submit handler exists. |
| `isAccessible` | `boolean` | No | Text accessibility visibility/status indicator. |

**Android `returnType` contract:** Kotlin reads `(view as EditText).imeOptions and EditorInfo.IME_MASK_ACTION` and sends the raw masked value as `returnType` in `NodePayload`. `IME_ACTION_UNSPECIFIED (0)` on Android is semantically equivalent to `UIReturnKeyType.default (0)` on iOS — both mean "no explicit return type set". The JS rule `INPUT_INVALID_RETURN_KEY` fires on `returnType === 0` for non-last inputs and requires no JS-side change once Kotlin sends the field.

Contract requirement: any field addition, rename, removal, or semantic change must be updated together in iOS emitters, Android emitters, and `packages/core/src/ReactNativeAma.types.ts`.

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

Contract requirement (already stated for `onAmaNodes`, applies equally here): any field addition, rename, removal, or semantic change to `AmaUiSnapshot` must be updated together in iOS emitters, Android emitters, and `packages/core/src/ReactNativeAma.types.ts`.

## `@react-native-ama/internal` removal

The package is a published npm package (v1.2.1), not a local workspace. Active packages that import from it:

| Importer | Symbols used | Migration target |
|----------|--------------|-----------------|
| `@react-native-ama/core` | `PickAccessibleProps` (type) | inline to `core` |
| `@react-native-ama/core` (test only) | `SHELL_COLORS` | inline to test file |
| `@react-native-ama/animations` | `MotionAnimationKey` (type), `MOTION_ANIMATIONS`, `interpolateAnimationStates` | inline to `animations` |
| `@react-native-ama/forms` (test only) | `ERROR_STYLE` | inline to test file |

`react-native-delete-me` also imports from `@react-native-ama/internal` but is retired at v2.0 — no migration needed for that package.

After inlining: remove `@react-native-ama/internal` from every consuming `package.json`. A full build verify is required after deletion to catch any hidden re-export or barrel-import dependency not visible in package manifests.

## Root-level test execution

Root `yarn test` chains each sub-package's own `yarn test` in dependency order:

```
core → animations → forms → lists
```

Implementation: root `package.json` `test` script uses `yarn workspace` commands chained with `&&`. Packages without a `test` script are skipped. Each package owns its own Jest config — root script is an orchestrator only.

`bottom-sheet` has no tests in the active graph; excluded from the chain. Adding a `test` script to any package is sufficient to include it — no root script change required.

## JS-side error reporting — `trackError`

`trackError` is a dev-only method on the AMA context that allows JS-side checks (which cannot be moved to native) to feed errors into the same pipeline as native-detected issues.

### Context contract

`AMADevContextValue` gains a revised `trackError` signature:

```
trackError(rule: AmaRule, ref?: React.RefObject<any>): void
```

The old `trackError(id: string)` and `removeError(id: string)` signatures on `AMADevContextValue` are replaced. `removeError` is removed entirely — JS-side errors do not need a removal path in this phase.

`trackError` is a no-op in production (`__DEV__` guard).

### Consumption contract (any package)

`@react-native-ama/core` is an optional peer dependency of every other package in the monorepo. Any package may access `trackError` via `useAMAContext` from `@react-native-ama/core` — the import (or the context read) is wrapped in a try/catch, or the hook result is checked for presence, before calling `trackError`, so the consuming package does not crash when core is absent. If core is absent, `console.error` is the fallback for that check. This is a standing contract, not a per-package exception: any current or future package that adds a JS-side check follows it. `forms` and `lists` both implement it today.

### Implementation home

`trackError` is implemented inside `useAMADev` in `@react-native-ama/core` and returned alongside `issues`. `AMAProvider` wires it into the dev context value. This keeps `getRuleAction` and `highlightComponent` internal to `core` — no new exports required.

### Field highlighting

`trackError` calls `highlightComponent(viewId, color, 1)` using the same path as native errors. `viewId` is resolved from `ref.current?._nativeTag`. If `_nativeTag` is unavailable (ref not yet mounted, or platform does not expose it), highlighting proceeds without field targeting — the error is still logged and the overlay entry is still added with `viewId: -1`.

### `checkFocusTrap` in `@react-native-ama/forms`

`checkFocusTrap` is a standalone async utility in `forms` that:
- waits 100 ms after the focus advance
- checks whether the field ref still holds focus via `isFocused(ref.current)`
- if a trap is detected: calls `trackError('NO_KEYBOARD_TRAP', ref)` when core is available, otherwise `console.error` with the rule message
- returns nothing (no `LogParams`, no return value consumed by caller)

`isFocused` is inlined into `forms` (it was part of the removed `@react-native-ama/internal`).

`checkFocusTrap` is called inside `focusNextFormField` in `packages/forms/src/hooks/useFormField.ts`, guarded by `__DEV__ && currentField?.hasFocusCallback`.

## React Native LogBox is not excluded from checks

Investigated whether AMA's native node collectors can reliably detect and skip React Native's own LogBox/YellowBox overlay, since LogBox's UI is not built to AMA's accessibility standards and no app developer can fix it from their own code.

**Decision: not implemented as a code-level exclusion.** Both native collectors scan the whole app window unconditionally — `NodesGrabber.swift`'s `getNodesToCheck(on:)` walks from `UIApplication.shared.currentKeyWindow`; the Android equivalent walks from `activity.window.decorView.rootView`. Neither has an existing scoping hook. LogBox's own rendered views (`LogBoxNotificationContainer`, `LogBoxInspectorContainer`, and their children) carry no `testID`, `nativeID`, or other identifying marker at any layer — they render as plain `View`/`SafeAreaView`, indistinguishable from app content at the native view level. The only structural signal is that LogBox mounts as the last sibling inside React Native's internal `AppContainer` component, gated by an `internal_excludeLogBox` prop — an RN-internal implementation detail, not a stable public contract to build a check-exclusion on.

**Rejected alternative 1 — scope the scan to `AMAProvider`'s subtree:** would exclude LogBox as a side effect, since `AMAProvider` wraps only the developer's app content and LogBox mounts as an `AppContainer`-level sibling above it. Rejected — it changes the scan boundary for every check, not just LogBox, and would regress checking of legitimate content rendered outside `AMAProvider` via a portal-style mechanism (e.g. RN's `Modal`, which `@react-native-ama/bottom-sheet` uses directly).

**Rejected alternative 2 — allow-list ancestry check (`AMAProvider` subtree OR a `Modal`-typed native ancestor):** more promising in principle, since RN's `Modal` is backed by a real distinguishing native class (`RCTModalHostView` on iOS) rather than plain `View`s like LogBox — a legitimate signal, not a fragile one. Rejected anyway: `react-native-screens`, which React Navigation's native-stack uses for `presentation: 'modal'` screens, hosts modal content through its own `RNSScreen`/`RNSScreenView` native classes, not `RCTModalHostView` (confirmed against `react-native-screens`' iOS source). An `RCTModalHostView`-only ancestry check would silently stop checking native-stack modal screens for a large share of real consumers — a worse failure mode than today's over-reporting, since it fails silently with no signal to the developer. Any allow-list approach has the same shape of risk: it is only as complete as the native container types it knows about, and portal/navigation libraries not yet accounted for become silent blind spots.

**Resulting scope:** the README documents that LogBox may surface accessibility findings AMA cannot resolve for consumers, and recommends dismissing or ignoring them — this ships as documentation, not a code change.

⚠️ Note: this decision depends on the current React Native LogBox implementation having no identifying marker. If a future React Native version adds a stable `testID`/`nativeID` to LogBox's rendered views, this exclusion becomes feasible as a code fix and this section should be revisited.

## Long numeric string check

Flags text/label content containing a long run of consecutive digits with no separators (e.g. an unformatted card or account number), since screen readers read a solid digit run as one large number instead of digit-by-digit.

### Detection

Runs entirely JS-side against data AMA already collects — no native changes needed. Source: each `AmaNode`'s `content` and `ariaLabel` fields (already sent in the existing `onAmaNodes` payload).

Rule: find the longest run of consecutive digit characters (`0-9`, no separators) in `content`/`ariaLabel`. If that run's length is `>= longNumberMinLength` (config, default `12`), flag `LONG_NUMBER_NOT_FORMATTED`.

**Why "consecutive digits, no separators" instead of classifying phone vs. card numbers:** a real phone-vs-card classifier would need locale-aware number-format knowledge AMA doesn't have and would still guess wrong across regions. Formatted phone numbers (`(415) 555-2671`, `+44 20 7123 4567`) already break the digit run with separators and don't trigger the check; unformatted long numbers (`4111111111111111`) do, regardless of what they represent. This is a deliberate simplification, not an oversight.

**Default threshold rationale:** `12` sits above standard 10-digit US phone numbers and most short account numbers, comfortably below 15–16 digit card numbers. It will still catch some 12–15 digit international phone numbers written without separators, and may miss some shorter (8–11 digit) unformatted account numbers — the config exists precisely so consumers can retune it against their own content. ⚠️ Note: this default is a judgement call, not a measured value; revisit if it produces frequent false positives/negatives in practice.

### Implementation home

New file `packages/core/src/internals/checks/checkLongNumber.ts`, following the existing pattern of `checkIsUppercase.ts` / `checkContrast.ts`. Wired into the same per-node check pipeline (`performChecks`) in `useAMADev.ts` as the other text-content checks. Severity: `warn` by default (heuristic, not a certainty), overridable per-rule via the existing `rules` config key — no new severity-override mechanism needed.

## Key technical decisions

- **No bundler** — packages ship source + `dist/` compiled by tsc. Consumers compile through Metro.
- **Peer dependencies, not bundled** — reanimated, gesture-handler, and expo are peers so consumers control versions.
- **Expo Module API** — chosen over bare TurboModules for Expo compatibility and simpler native bridging.
- **Changesets** — selected over manual versioning for independent per-package release control.
- **v2.0 cleanup** — removes `@react-native-ama/internal` (inlined per-package) and retires `@react-native-ama/react-native`; all active packages align to `~2.0.0`.
- **`returnType` cross-platform normalization** — both platforms use `0` for "no explicit return type set" (`UIReturnKeyType.default` on iOS, `IME_ACTION_UNSPECIFIED` on Android). JS rule `INPUT_INVALID_RETURN_KEY` fires on `returnType === 0` for non-last inputs on both platforms without platform branching.
- **LogBox is not excluded from checks in code** — no stable marker exists to identify it natively; documented as a known limitation in the README instead. See "React Native LogBox is not excluded from checks" above.
- **Config v2.0 is breaking** — `highlight` becomes a nested object (`{ mode, borderWidth, gap }`); `log` is removed as a standalone key (runtime logging is out of scope for v2.0 config); `uppercaseMinLength` stays flat; `checks.*` groups feature gates and `delay`. Old two-key configs (`rules` + `accessibilityLabelExceptions`) still load correctly via `Object.assign`, but no shim is provided for consumers who relied on type-checking the old shape.
- **Long number check is a "consecutive digits, no separators" heuristic, not a phone/card classifier** — deliberately simple; naturally skips formatted phone numbers, catches unformatted long numbers, configurable via `longNumberMinLength` (default `12`). See "Long numeric string check" above.
