### STORY-4: Fix TypeScript errors in bottom-sheet

#### What and why

A developer opening `@react-native-ama/bottom-sheet` currently sees 12 TypeScript diagnostics across two test files, both stemming from mocking `PanGesture` from `react-native-gesture-handler`. This story clears all of them so the package type-checks cleanly.

#### Done when

- [ ] Type-checking the project reports zero errors for every file listed under Implementation Reference → Files
- [ ] `@react-native-ama/bottom-sheet`'s test suite still passes with no behavioural changes

#### Not this story

- Type errors in any other package — each has its own story
- Changing runtime behaviour to satisfy the type checker — if a diagnostic turns out to reveal a genuine bug rather than a stale or incorrect type, flag it instead of silently changing behaviour

#### Implementation Reference

- **Files:**
  - `packages/bottom-sheet/src/components/BottomSheet.test.tsx` — `TS2740`/`TS2322` a `jest.fn()` mock not assignable to `PanGesture`'s type (2 diagnostics)
  - `packages/bottom-sheet/src/hooks/useBottomSheetGestureHandler.test.ts` — `TS2551` references to `_onStart`/`_onUpdate`/`_onEnd`, which don't exist on `PanGesture`'s current type (should likely be `onStart`/`onUpdate`/`onEnd` — 10 diagnostics)
- **Command:** `yarn ts:check` at the repo root reproduces all diagnostics

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
