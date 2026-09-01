### STORY-5: Fix TypeScript errors in playground

#### What and why

A developer opening the playground app currently sees 5 TypeScript diagnostics across 5 files. This story clears all of them so the playground type-checks cleanly.

#### Done when

- [ ] Type-checking the project reports zero errors for every file listed under Implementation Reference → Files
- [ ] The playground still runs with no behavioural changes

#### Not this story

- Type errors in any package — each has its own story
- Changing runtime behaviour to satisfy the type checker — if a diagnostic turns out to reveal a genuine bug rather than a stale or incorrect type, flag it instead of silently changing behaviour

#### Implementation Reference

- **Files:**
  - `playground/src/components/Header.tsx` — `TS2322` `autofocus` prop passed to `Text` isn't in its prop type
  - `playground/src/components/TipComponent.tsx` — `TS2686` `React` used as a UMD global instead of an import
  - `playground/src/screens/AmaLists.screen.tsx` — `TS6133` unused import `ScrollView`
  - `playground/src/screens/Pressable.screen.tsx` — `TS2322` empty string `""` not assignable to `Role | undefined`
  - `playground/src/screens/UseAMAContext.screen.tsx` — `TS6133` unused import `SafeAreaView`
- **Command:** `yarn ts:check` at the repo root reproduces all diagnostics

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
