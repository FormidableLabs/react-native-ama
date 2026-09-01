### STORY-3: Remove @react-native-ama/internal

#### What and why
Every active package in the repo depends on a published `@react-native-ama/internal` npm package that must be removed before v2.0 ships. After this story, no active package imports from `@react-native-ama/internal` — all symbols have moved inline — and the full build completes without it.

#### Done when
- [ ] No file under `packages/core/`, `packages/animations/`, or `packages/forms/` contains an import from `@react-native-ama/internal`.
- [ ] The full package build (`yarn build` at repo root) completes without errors after the removal.
- [ ] All existing tests still pass after the migration.
- [ ] `@react-native-ama/internal` no longer appears as a dependency in `packages/core/package.json`, `packages/animations/package.json`, or `packages/forms/package.json`.

#### Not this story
- `packages/react-native-delete-me/` imports from `@react-native-ama/internal` — those are not migrated here because that package is retired at v2.0.
- No deletion of the published npm package itself (not in this repo's control).
- No docs updates.

#### Notes
The phase brief acknowledges a risk: hidden cross-package dependencies (re-exports, barrel imports) may not be visible in `package.json`. A full build verify after deletion is the primary safety net. If the build reveals unexpected consumers, extend this story — do not patch around them.

#### Implementation Reference
- **Files (core):** `packages/core/src/components/AutofocusContainer.tsx` — inline `PickAccessibleProps` type locally; `packages/core/src/hooks/useFocus.test.ts` — inline `SHELL_COLORS` constant locally in the test file
- **Files (animations):** `packages/animations/src/utils/isMotionAnimation.ts`, `packages/animations/src/hooks/useReanimatedTiming.ts`, `packages/animations/src/hooks/useAnimation.ts`, `packages/animations/src/hooks/useReanimatedAnimationBuilder.ts` — inline `MotionAnimationKey` type, `MOTION_ANIMATIONS` constant, and `interpolateAnimationStates` function into `packages/animations/src/`
- **Files (forms):** `packages/forms/src/components/TextInput.test.tsx` — inline `ERROR_STYLE` constant locally in the test file; `packages/forms/src/hooks/useFormField.test.tsx` — replace `jest.requireActual('@react-native-ama/internal')` and `jest.mock('@react-native-ama/internal', ...)` with local equivalents
- **Boundaries:** `MOTION_ANIMATIONS` and `interpolateAnimationStates` are used across multiple animation files — move them to a shared location within `packages/animations/src/` (e.g. a new `utils/` file); do not duplicate them per-file
- **Do not:** do not touch any file under `packages/react-native-delete-me/`; do not attempt to remove the npm package from the registry; do not remove `@react-native-ama/internal` from `packages/lists/package.json` without first confirming lists has no imports (search before editing)

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
