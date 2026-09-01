### STORY-2: `checkFocusTrap` utility in forms

#### What and why

A developer using `focusNextFormField` in a form should have focus-trap conditions detected and reported in dev mode. The `checkFocusTrap` function that provided this was deleted during the AMA 2.0 refactor. This story restores it as a standalone async utility in `@react-native-ama/forms`, adapted to the 2.0 context.

#### Done when

- [ ] `checkFocusTrap({ ref, shouldHaveFocus })` exists in `@react-native-ama/forms` as a `__DEV__`-only async function
- [ ] 100 ms after being called, it checks whether the field ref holds focus as expected
- [ ] When a trap is detected and `trackError` is available on the AMA context, `trackError('NO_KEYBOARD_TRAP', ref)` is called
- [ ] When a trap is detected and `@react-native-ama/core` is absent (no context available), `console.error` fires with the message `'The component did trap the focus'`
- [ ] When `shouldHaveFocus` is `true` and the component did not receive focus, `trackError('NO_KEYBOARD_TRAP', ref)` is called (or `console.error` fallback)
- [ ] When no trap is detected, neither `trackError` nor `console.error` is called
- [ ] `isFocused` is available inside `forms` as an inline utility (not imported from any removed package)
- [ ] Test: when ref is focused and `shouldHaveFocus` is `false`, `trackError` is called with `'NO_KEYBOARD_TRAP'`
- [ ] Test: when ref is not focused and `shouldHaveFocus` is `true`, `trackError` is called with `'NO_KEYBOARD_TRAP'`
- [ ] Test: when no trap condition exists, `trackError` is not called
- [ ] Test: when `trackError` is unavailable, `console.error` is called on trap detection

#### Not this story

- Wiring `checkFocusTrap` into `useFormField` / `focusNextFormField` — that is story 3
- Any changes to the native highlight pipeline — `trackError` (story 1) handles that

#### Notes

Depends on: story 1 (`trackError` must exist on the context before this utility can call it).

`isFocused` was previously in `@react-native-ama/internal`. Inline it directly into `forms` — it checks whether a React Native component ref currently has focus. The original implementation: `ref?.isFocused?.()` or equivalent `TextInput` focus check.

`useAMAContext` from `@react-native-ama/core` is an optional peer. Wrap the import in a try/catch or use a conditional require so the forms package does not crash when core is absent.

The 100 ms delay constant must be defined as a named constant — no magic literal at the call site.

#### Implementation Reference

- **Files:** new file `packages/forms/src/utils/checkFocusTrap.ts`; inline `isFocused` helper in same file or `packages/forms/src/utils/isFocused.ts`
- **Contract:** `checkFocusTrap({ ref: React.RefObject<TextInput>, shouldHaveFocus: boolean }): Promise<void>` — `__DEV__`-only; returns `Promise<void>` (no return value consumed by caller)
- **Delay constant:** define `CHECK_FOCUS_TRAP_DELAY_MS = 100` in `checkFocusTrap.ts`; no inline literal at call site
- **Core optional import:** try to call `useAMAContext()` from `@react-native-ama/core/AMAProvider`; if the import throws or context is null, fall back to `console.error`
- **Rule:** `'NO_KEYBOARD_TRAP'` — this exact string; no other rule key
- **`__DEV__` guard:** export `checkFocusTrap` only behind `__DEV__` per project rule 10 (checker functions are `__DEV__`-only exports)
- **Do not:** do not import from `@react-native-ama/internal`; do not return `LogParams`; do not call `useChecks`; do not add a removal/cleanup path — `trackError` handles lifetime in the overlay

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
