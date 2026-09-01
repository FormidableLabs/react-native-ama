### STORY-1: Peer deps optional with safe defaults

#### What and why
A consumer installing only `@react-native-ama/animations` or `@react-native-ama/bottom-sheet` — without also installing `@react-native-ama/core` — gets a package that installs and renders without throwing. Today, sibling packages list `core` as a hard `dependencies` entry, which forces it to install (and silently fail at runtime if the context provider is missing). After this story, `core` and any other sibling deps move to `peerDependencies` with `optional: true`, and components that call `useAMAContext` fall back to safe defaults instead of throwing when the provider is absent.

#### Done when
- [ ] `@react-native-ama/animations` lists `@react-native-ama/core` under `peerDependencies` with `peerDependenciesMeta: { "@react-native-ama/core": { "optional": true } }` and removes it from `dependencies`
- [ ] `@react-native-ama/forms` lists `@react-native-ama/core` under `peerDependencies` with `optional: true` and removes it from `dependencies`
- [ ] `@react-native-ama/lists` lists `@react-native-ama/core` under `peerDependencies` with `optional: true` and removes it from `dependencies`
- [ ] `@react-native-ama/bottom-sheet` adds `optional: true` to its existing `@react-native-ama/core` peer entry in `peerDependenciesMeta`
- [ ] When `@react-native-ama/core` is absent (context provider not mounted), components in `animations` return `isReduceMotionEnabled: false` as default without throwing
- [ ] When `@react-native-ama/core` is absent, `bottom-sheet` renders and functions using its own `useReducedMotion` from `react-native-reanimated` without calling into core (it already does this via the `require` pattern — confirm and test the absent-core path)
- [ ] `yarn test` passes across all active packages after the change
- [ ] Test: a unit test in `animations` mocks `@react-native-ama/core` as absent and confirms hooks return safe defaults without throwing

#### Not this story
- Tree-shaking export restructuring (story-2)
- Removing `@react-native-ama/react-native` or `@react-native-ama/internal` references (story-4)
- Coverage thresholds (story-3)
- `forms` safe-default behaviour when core is absent — `forms` depends on core for form-state management; if this is more complex than a null-guard, defer to a follow-up story and add a note in that package's peerDependenciesMeta entry

#### Notes
`bottom-sheet` already uses a `require('@react-native-ama/core')` pattern with optional chaining (`AnimaCore?.useTimedAction()`), which is the intended safe-default approach. Validate this path works when `core` is absent before declaring done.

`animations` hooks call `useAMAContext()` directly — these need a try/catch or a context default value approach. The `AMAProvider` default context already sets `isReduceMotionEnabled: false`; the fix is ensuring `useAMAContext` returns that default rather than throwing when no provider is present.

Peer version range for `core`: use `~2.0.0` (per project rules rule 19).

#### Implementation Reference
- **Build:** Update `package.json` for `animations`, `forms`, `lists`, `bottom-sheet`; ensure `peerDependenciesMeta` has `optional: true` for `@react-native-ama/core` in each
- **Files:**
  - `packages/animations/package.json` — move `@react-native-ama/core` from `dependencies` to `peerDependencies`; add `peerDependenciesMeta`
  - `packages/forms/package.json` — move `@react-native-ama/core` from `dependencies` to `peerDependencies`; add `peerDependenciesMeta`
  - `packages/lists/package.json` — move `@react-native-ama/core` from `dependencies` to `peerDependencies`; add `peerDependenciesMeta`
  - `packages/bottom-sheet/package.json` — add `peerDependenciesMeta: { "@react-native-ama/core": { "optional": true } }`
  - `packages/animations/src/hooks/useAMAContext` callers — add safe fallback when context throws or provider absent
  - `packages/bottom-sheet/src/components/BottomSheet.tsx:33` — confirm `const AnimaCore = require('@react-native-ama/core')` + optional chaining is sufficient when core is absent
- **Peer version:** `"@react-native-ama/core": "~2.0.0"` for all packages (per project-rules rule 19)
- **Do not:** do not bundle `@react-native-ama/core` source inside any package; do not change the public API of any hook or component; do not add `@react-native-ama/core` back to `dependencies`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
