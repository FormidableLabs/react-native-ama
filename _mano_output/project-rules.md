# Project Rules — react-native-ama

## Workflow

### Story mode

<!-- Uncomment one to stop Marco asking every time: -->
<!-- story_mode: behaviour -->
story_mode: enriched

### Phase priorities

<!-- Uncomment and customise to ensure every phase includes certain types of work. -->
<!-- Skye will include at least one backlog item per listed type in her suggestion. -->
<!-- Valid types: bug, refinement, feature, tech-debt, test -->
<!-- phase_priorities: bug, tech-debt -->

## Scope

These rules are inferred from code in:
- packages/core
- packages/animations
- packages/forms
- packages/lists
- packages/bottom-sheet
- packages/core/ios
- packages/core/android
- playground

Excluded from rule inference:
- packages/react-native-delete-me (deferred for deletion)

## Folder structure

### 1. Keep package layout consistent
What: Every package must keep the same top-level source layout: src/components, src/hooks, src/utils, src/index.ts. Internal-only implementation details stay in src/internals.

Why: This is the existing monorepo pattern and keeps navigation predictable across packages.

Example:
```text
packages/<name>/src/
  components/
  hooks/
  utils/
  index.ts
```

### 2. Use platform file suffixes for platform-specific logic
What: Split platform-specific behavior using file suffixes (.ios, .android, .web) instead of embedding large Platform.OS branches in a shared file.

Why: Already used in core and easier to maintain than mixed platform branches.

Example:
```text
MyFeature.ts
MyFeature.ios.ts
MyFeature.android.ts
MyFeature.web.ts
```

## Naming

### 3. Component files are PascalCase and match exported symbol
What: A component filename must match the exported component name exactly.

Why: This is already consistent in all active packages and avoids import ambiguity.

Example:
```tsx
// components/BottomSheet.tsx
export const BottomSheet = React.forwardRef(...)
```

### 4. Hook files start with use and match exported hook
What: Hooks use camelCase with a use prefix in both filename and export.

Why: This pattern is consistent across core, forms, lists, animations, and bottom-sheet.

Example:
```ts
// hooks/useBottomSheetGestureHandler.ts
export const useBottomSheetGestureHandler = () => { ... }
```

### 5. Co-locate tests with source files
What: Test files live beside the implementation with .test.ts or .test.tsx suffix.

Why: Existing codebase convention across all active packages.

Example:
```text
components/Form.tsx
components/Form.test.tsx
```

## Components

### 6. Forward refs for focusable or imperative components
What: Components that expose focus behavior, modal controls, or imperative actions must use React.forwardRef.

Why: This is the established API pattern for Form, BottomSheet, AnimatedContainer, and core providers.

Example:
```tsx
export const Form = React.forwardRef<FormActions, FormProps>((props, ref) => { ... })
```

### 7. Public API only through src/index.ts
What: Consumers import from package root exports only. No deep imports into src or internals paths.

Why: Package exports are intentionally controlled through index and package.json exports.

Example:
```ts
// allowed
import { AMAProvider } from '@react-native-ama/core';

// disallowed
import { AMAProvider } from '@react-native-ama/core/src/components/AMAProvider';
```

### 8. Type public props and actions explicitly
What: Exported components and hooks define explicit prop/action types rather than implicit any-like surfaces.

Why: Strong typing is a core pattern across packages and needed for stable public APIs.

Example:
```ts
export type BottomSheetActions = {
  close: () => Promise<void>;
  isVisible: () => boolean;
};
```

## Patterns

### 9. Keep side effects in hooks or internals utilities
What: Cross-cutting runtime logic (checks, logging, event listeners, severity mapping) should be implemented in hooks or internals utils, not inline in presentational components.

Why: Existing implementation separates view rendering from runtime checking and orchestration.

Example:
```ts
// good
const { entering, exiting } = useReanimatedAnimationBuilder(...)
```

### 10. Export checker functions only behind __DEV__
What: Any checker/evaluator that is intended for AMA runtime inspection must be exported only when `__DEV__` is true.

Why: This prevents debug-only check logic from being accidentally included in staging/production behavior.

Example:
```ts
export const checkSomething = __DEV__
  ? (node: AmaNode) => {
      // checker logic
    }
  : undefined;
```

## Architecture (native bridge)

### 11. Keep iOS and Android module contracts symmetric
What: Native module names, event names, and major function contracts must stay aligned between Swift and Kotlin.

Why: The JS layer expects one cross-platform contract; drift causes platform-only failures.

Example:
```text
Name("ReactNativeAma")
Events("onAmaNodes", "onUIInteraction")
Function("start")
```

### 12. Native-to-JS node flow is a fixed contract
What: The node-processing pipeline must remain: Native collect nodes -> emit `onAmaNodes` -> `useAMADev` processes nodes (`checkNodes`).

Why: This path is the backbone of rule execution and highlighting; changing one side without the other breaks checks silently.

Example:
```text
Native (Swift/Kotlin) collect nodes
  -> Events("onAmaNodes")
  -> ReactNativeAmaModule.addListener("onAmaNodes", checkNodes)
  -> useAMADev performs checks/logging/highlight
```

### 13. AmaNode payload schema is the source of truth
What: The shape of each node emitted through `onAmaNodes` must adhere to the shared `AmaNode` contract in `packages/core/src/ReactNativeAma.types.ts`. Any payload field addition, rename, removal, or semantic change must be updated in native emitters and the TypeScript contract together.

Why: The native bridge can stay event-compatible while still drifting on field shape; that kind of mismatch breaks checks more subtly than an outright event failure.

Example:
```text
If iOS/Android start emitting image-specific node data:
- update Swift/Kotlin node builders
- update AmaNode in packages/core/src/ReactNativeAma.types.ts
- update JS checks/tests that consume the field
```

### 14. Keep monitoring code debug-only on native platforms
What: Accessibility monitor/highlight runtime is debug-only on both iOS and Android.

Why: Current architecture intentionally avoids shipping this monitoring machinery in release builds.

Example:
```text
iOS: #if DEBUG guards
Android: code under android/src/debug/java
```

### 15. Native diagnostics should use centralized logger wrappers
What: Swift and Kotlin code should log through package logger abstractions rather than ad-hoc print statements.

Why: Existing native code already centralizes logging format and tags.

Example:
```text
iOS: Logger.info/debug/error
Android: Logger.info/debug/error
```

## Testing approach

Accessibility level: WCAG 2.1 AA (enforced via runtime rules, not test assertions).
Testing posture: unit only.

### 16. Unit tests are required for exported hooks/components and core rule evaluators
What: New public hooks/components and runtime check functions must include unit tests co-located with the source file.

Why: This matches the current baseline and protects the API surface during v2 migration.

Example:
```text
hooks/useFormSubmit.ts
hooks/useFormSubmit.test.tsx
```

### 16a. Test structure — success path, edge cases, failure path
What: Each test file covers: the expected success path, at least one edge case (null/undefined ref, missing prop, boundary value) when the source branches on it, and the failure/error path when one exists. Use `it.each` for null/undefined variants and `describe` blocks for conditional branches.

Why: The existing suite consistently follows this structure (see `useFocus.test.ts`).

Example:
```typescript
describe('useFocus', () => {
  it.each([null, undefined])('does nothing if ref is %s', ref => { ... });
  it('calls setAccessibilityFocus on a valid ref', () => { ... });

  describe('Given the element has not been found', () => {
    it('does not call setAccessibilityFocus', () => { ... });
    it('warns in __DEV__ mode', () => { ... });
  });
});
```

### 16b. Mock React Native APIs at module level
What: Mock `react-native` and other external modules using `jest.mock(...)` at the bottom of the file, after all test definitions. Extract mock factory into a named function. Do not inline mock setup inside individual `it` blocks unless the mock must vary per test.

Why: Consistent placement makes mocks easy to locate and avoids hoisting surprises.

Example:
```typescript
// test definitions first, then at the bottom:
jest.mock('react-native', () => mockReactNative());

function mockReactNative() {
  return {
    findNodeHandle: jest.fn(),
    AccessibilityInfo: { setAccessibilityFocus: jest.fn() },
    Platform: {},
  };
}
```

### 16c. Coverage config is required for each package with tests
What: Any package that has tests must include `collectCoverageFrom: ["src/**/*.{ts,tsx}"]` in its Jest config. Coverage thresholds match those in `packages/core/package.json` unless a justified lower value is documented in that package's config.

Why: `core` and `forms` already enforce thresholds; `animations` and `lists` must match when tests are added.

Example:
```json
"jest": {
  "collectCoverageFrom": ["src/**/*.{ts,tsx}"],
  "coverageThreshold": {
    "global": { "statements": 90, "branches": 82, "functions": 83, "lines": 91 }
  }
}
```

### 17. Validate native/runtime behavior in playground for any native bridge or checker-flow change
What: Changes touching Swift/Kotlin node collection, event payloads (`onAmaNodes` / `onUIInteraction`), or `useAMADev` check flow must be manually verified in playground.

Why: Part of the native behavior was tuned by trial-and-error, so unit tests alone are not enough to guarantee real-device runtime behavior.

Example:
```text
Change: native node payload fields or event dispatch timing
Required: run playground and confirm issues/highlights are emitted as expected
```

## v2 migration guardrails

### 18. Do not introduce new dependencies on internal or deferred packages
What: No new package should depend on @react-native-ama/internal or packages/react-native-delete-me.

Why: Both are planned for removal in v2.0.0 and new coupling increases migration cost.

Example:
```text
disallowed dependency targets:
- @react-native-ama/internal (new references)
- @react-native-ama/react-native from react-native-delete-me
```

### 19. Align versions to 2.0.0-beta.1 when touching package manifests
What: All active packages (`core`, `animations`, `forms`, `lists`, `bottom-sheet`) target `2.0.0-beta.1`. Inter-package peer dependency ranges use `~2.0.0` so both beta and stable satisfy the range. `react-native-delete-me` is excluded.

Why: Coordinated versioning prevents inter-package peer dependency mismatches and makes the beta testable as a set.

Example:
```json
"version": "2.0.0-beta.1",
"peerDependencies": { "@react-native-ama/core": "~2.0.0" }
```

## Guideline documentation

### 20. AMA error code config notes — use the correct check gate

**What:** When documenting an AMA dev runtime error in a guideline page, the `:::note` must reference the specific config key that controls it — not a generic "the config file". Two independent gates exist in `ama.config.json`:

- **`checks.ui`** — gates the native tap-probe that detects UI state changes (`NO_ACCESSIBILITY_STATE_SET` only). Set `"ui": false` to disable.
- **`checks.forms`** — gates JS-side form field checks. Controls: `INPUT_HAS_FOCUSABLE_LABEL`, `INPUT_HAS_NO_VISIBLE_LABEL`, `INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK`, `INPUT_INVALID_RETURN_KEY`, `NO_FORM_ERROR`, `NO_KEYBOARD_TRAP`. Set `"forms": false` to disable.

Rules in `NON_OVERRIDABLE_RULES` cannot have their severity changed via `rules.*` config entries: `NO_ACCESSIBILITY_ROLE`, `NO_ACCESSIBILITY_LABEL`, `NO_KEYBOARD_TRAP`, `NO_UNDEFINED`, `INPUT_HAS_NO_VISIBLE_LABEL`, `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE`, `BOTTOM_SHEET_CLOSE_ACTION`, `INCOMPATIBLE_ACCESSIBILITY_STATE`, `INCOMPATIBLE_ACCESSIBILITY_ROLE`. For rules that are non-overridable AND not behind a check gate (e.g. `NO_ACCESSIBILITY_ROLE`), write: "This rule cannot be turned off!"

**Why:** `checks.ui` and `checks.forms` are independent; referencing the wrong one (or a generic "UI check") misleads developers about how to configure AMA.

**Pattern:**
```md
<!-- form rule -->
:::note
This rule can be disabled by turning off the forms check in the [ama.config.json](/docs/config-file#checks) file.
:::

<!-- UI state rule -->
:::note
This rule can be disabled by turning off the UI check in the [ama.config.json](/docs/config-file#checks) file.
:::

<!-- non-overridable, no check gate -->
:::note
This rule cannot be turned off!
:::
```

## Not yet

- Full monorepo-wide codegen or schema-driven API contracts: premature for the current package model and would add maintenance overhead before v2 stabilization.
- Mandatory cross-package end-to-end test harness: useful later, but current package-local tests already match today’s architecture and release flow.
