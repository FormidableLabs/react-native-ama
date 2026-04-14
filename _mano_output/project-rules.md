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

### 16. Unit tests are required for exported hooks/components and core rule evaluators
What: New public hooks/components and runtime check functions must include nearby tests.

Why: This matches the current baseline and protects the API surface during v2 migration.

Example:
```text
hooks/useFormSubmit.ts
hooks/useFormSubmit.test.tsx
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

### 19. Align versions to 2.0.0 when touching package manifests
What: Any package.json touched for active development should be brought to the v2 alignment plan unless blocked by release sequencing.

Why: Current mixed versions are transitional; gradual alignment reduces one-shot migration risk.

Example:
```text
when editing package metadata, prefer:
version: 2.0.0
peerDependencies: @react-native-ama/core ~2.0.0
```

## Not yet

- Full monorepo-wide codegen or schema-driven API contracts: premature for the current package model and would add maintenance overhead before v2 stabilization.
- Mandatory cross-package end-to-end test harness: useful later, but current package-local tests already match today’s architecture and release flow.
