### STORY-3: Fix TypeScript error in animations

#### What and why

A developer opening `@react-native-ama/animations` currently sees one TypeScript diagnostic — an unused import in a test file. This story clears it so the package type-checks cleanly.

#### Done when

- [ ] Type-checking the project reports zero errors for `packages/animations/src/internals/useAMAContextSafe.test.ts`
- [ ] `@react-native-ama/animations`'s test suite still passes with no behavioural changes

#### Not this story

- Type errors in any other package — each has its own story

#### Implementation Reference

- **Files:** `packages/animations/src/internals/useAMAContextSafe.test.ts` — `TS6133` `'useAMAContextSafe' is declared but its value is never read`
- **Command:** `yarn ts:check` at the repo root reproduces the diagnostic

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
