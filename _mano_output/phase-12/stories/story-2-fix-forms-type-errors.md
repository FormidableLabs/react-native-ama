### STORY-2: Fix TypeScript errors in forms

#### What and why

A developer opening `@react-native-ama/forms` currently sees 5 TypeScript diagnostics across two test files. This story clears all of them so the package type-checks cleanly.

#### Done when

- [ ] Type-checking the project reports zero errors for every file listed under Implementation Reference → Files
- [ ] `@react-native-ama/forms`'s test suite still passes with no behavioural changes

#### Not this story

- Type errors in any other package — each has its own story
- Changing runtime behaviour to satisfy the type checker — if a diagnostic turns out to reveal a genuine bug rather than a stale or incorrect type, flag it instead of silently changing behaviour

#### Notes

`packages/forms/src/hooks/useFocus.test.ts`'s `Cannot find name 'global'` diagnostic is the same shape as two occurrences in `core`'s story (story 1). Fix independently — `forms` has its own tsconfig.

#### Implementation Reference

- **Files:**
  - `packages/forms/src/hooks/useFocus.test.ts` — `TS2304` cannot find name `global`
  - `packages/forms/src/hooks/useFormField.test.tsx` — `TS2769`/`TS2345` `jest.spyOn` overload mismatch on `checkFocusTrap` (2 call sites, 4 diagnostics)
- **Command:** `yarn ts:check` at the repo root reproduces all diagnostics

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
