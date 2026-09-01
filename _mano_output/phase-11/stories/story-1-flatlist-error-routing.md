### STORY-1: Route FlatList errors through trackError

#### What and why

A developer using `useDynamicList` currently only sees `FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE` / `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE` violations logged to the console, unlike every other AMA check, which now surfaces in the dev overlay via `trackError`. This story routes both checks through `trackError`, matching the pattern already established in `checkFocusTrap` / `useFormField`, so these two issues appear in the same overlay list as every other check instead of only in the terminal.

#### Done when

- [ ] When `@react-native-ama/core`'s `trackError` is available and `singularMessage` doesn't contain `%count%`, `trackError` is called with `'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE'` and `console.error` is not called for that check
- [ ] When `@react-native-ama/core`'s `trackError` is available and `pluralMessage` doesn't contain `%count%`, `trackError` is called with `'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE'` and `console.error` is not called for that check
- [ ] When both `singularMessage` and `pluralMessage` contain `%count%`, neither `trackError` nor `console.error` is called
- [ ] Test: when `trackError` is unavailable (core absent from the AMA context), each missing-`%count%` condition still falls back to `console.error`, matching current behaviour
- [ ] Test: the full `packages/lists` test suite passes

#### Not this story

- Any other hook or file that still uses `console.error` for AMA error codes
- Changes to when or why either error is raised, or to its severity/suppression
- Adding a `ref` argument to either `trackError` call — these two checks have no associated field ref
- Changing the message or shape of the `console.error` fallback call

#### Notes

- Acknowledged risk from the phase brief ("`trackError` call signature may differ from the current `console.error` call sites") is resolved directly here: call as `trackError(rule)` with no `ref` argument.
- The existing test file `useDynamicList.checks.test.ts` mocks a `useChecks`/`logResult` API that `useDynamicList.ts` never actually calls — 2 of its 3 tests already fail on `main`, independent of this story. Rewrite it to mock `useAMAContext` per the pattern in `packages/forms/src/utils/checkFocusTrap.test.ts` / `jest-mocks/ama-core.js` rather than patching the stale mock.
- Mirrors the `trackError` access pattern already implemented in `packages/forms/src/hooks/useFormField.ts` (lines 6-24) — same shape, new package.

#### Implementation Reference

- **Files:** `packages/lists/src/hooks/useDynamicList.ts` (source, the two `console.error` calls around lines 23-41); `packages/lists/src/hooks/useDynamicList.checks.test.ts` (test — rewrite)
- **Build:** add a module-level `trackError` accessor identical in shape to `packages/forms/src/hooks/useFormField.ts` lines 6-24 — `require("@react-native-ama/core").useAMAContext` inside a try/catch (core is an optional peer per `packages/lists/package.json`), then read `.trackError` off the context value inside a second try/catch, defaulting to `null`
- **Contract:** call as `trackError(rule)` with no second argument. Type `rule` locally as `"FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE" | "FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE"` — do not import `AmaRule` from `@react-native-ama/core`; it is not exported from the package's public `src/index.ts`
- **Do not:** change the existing `console.error('useDynamicFlatList', { rule, message, extra })` fallback call — keep its shape exactly as today for the branch where `trackError` is unavailable
- **Test:** rewrite `useDynamicList.checks.test.ts` to `jest.mock('@react-native-ama/core', ...)` returning `useAMAContext`, matching `packages/forms/src/utils/checkFocusTrap.test.ts`'s mocking approach; cover both the `trackError`-available and `trackError`-unavailable branches — `packages/lists/package.json`'s jest config requires 100% statement/function/line and 85% branch coverage

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
