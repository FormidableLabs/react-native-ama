### STORY-2: Fix forms test suite failing to load

#### What and why

A contributor running the forms package's tests currently can't get any signal from `useFormField.test.tsx` — the whole suite fails to load, so none of its tests run, pass, or fail. This story restores it to the rest of the suite's baseline: loading and reporting real results.

#### Done when

- [ ] Running the forms package's full test suite: `useFormField.test.tsx` loads and its tests run, with no "Test suite failed to run" error
- [ ] The rest of the forms suite continues to pass with no behavioural changes

#### Not this story

- The `NO_ACCESSIBILITY_STATE_SET` regression in `core` — story 1
- Any LogBox-related work — story 3

#### Implementation Reference

- **Files:** `packages/forms/package.json` — `jest` config block
- **Root cause:** the suite fails with `SyntaxError: Unexpected token 'export'` from `expo/src/utils/getBundleUrl.native.ts`, resolved via `moduleDirectories`' `../../playground/node_modules` entry. The existing `transformIgnorePatterns` (`node_modules/(?!(react-native-reanimated|expo|@expo)/)`) already intends to transform `expo` packages — investigate why this specific module still isn't being transformed for the resolved playground path before changing the pattern.
- **Do not:** change `useFormField.ts` or `useFormField.test.tsx` themselves — this is a jest/tooling config fix only.

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
