### STORY-1: Fix TypeScript errors in core

#### What and why

A developer opening `@react-native-ama/core` in their editor currently sees 26 TypeScript diagnostics across the package — in a build script, hook tests, a check test, a component test, and a utility test. This story clears all of them so the package type-checks cleanly, matching the rest of the monorepo.

#### Done when

- [ ] Type-checking the project reports zero errors for every file listed under Implementation Reference → Files
- [ ] `@react-native-ama/core`'s test suite still passes with no behavioural changes

#### Not this story

- Type errors in any other package (`animations`, `bottom-sheet`, `forms`, `lists`, `playground`) — each has its own story
- Changing runtime behaviour to satisfy the type checker — if a diagnostic turns out to reveal a genuine bug rather than a stale or incorrect type, flag it instead of silently changing behaviour

#### Notes

`packages/core/src/hooks/useTimedAction.android.test.ts` and `useTimedAction.ios.test.ts` share the same `Cannot find name 'global'` diagnostic as `packages/forms/src/hooks/useFocus.test.ts` (story 2). Each package has its own independent tsconfig (per the "no dependency between packages" project convention), so fix each package's occurrence independently — there is no shared config file to edit once for both.

#### Implementation Reference

- **Files:**
  - `packages/core/scripts/create-config.ts` — `TS2307` cannot find module `fs`/`path`
  - `packages/core/src/hooks/useTimedAction.android.test.ts` — `TS2304` cannot find name `global`
  - `packages/core/src/hooks/useTimedAction.ios.test.ts` — `TS2304` cannot find name `global` (2 occurrences)
  - `packages/core/src/internals/checks/checkIsUppercase.test.ts` — `TS2322` a test-only rule string not assignable to `AmaRule`
  - `packages/core/src/internals/components/AMARuleError.test.tsx` — `TS6133` unused import, plus `TS2604`/`TS2786` JSX element type errors (17 diagnostics, one root cause: `AMARuleError`'s exported type doesn't satisfy the JSX component type used in the test)
  - `packages/core/src/internals/utils/interpolateAnimation.test.ts` — `TS2314` `Record` used without its 2 required type arguments (3 occurrences)
- **Command:** `yarn ts:check` at the repo root reproduces all diagnostics
- **Do not:** change `AMARuleError`'s production behaviour to fix its test's JSX typing — fix the type-level mismatch (e.g. the test's usage or the exported type), not the component's runtime logic

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
