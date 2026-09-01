### STORY-1: `trackError` on AMA context

#### What and why

A developer building a form with `@react-native-ama/forms` needs JS-side accessibility errors (like focus-trap detection) to surface through the same dev-mode error pipeline as native-detected issues — overlay entry, field highlight, console output. Right now there is no path for JS-originated errors in the AMA 2.0 context; this story adds `trackError` as that path.

#### Done when

- [ ] `AMADevContextValue` has `trackError(rule: AmaRule, ref?: React.RefObject<any>): void` replacing the old `trackError(id: string)` and `removeError(id: string)` signatures
- [ ] `useAMADev` returns a `trackError` function alongside `issues`
- [ ] `AMAProvider` wires `trackError` from `useAMADev` into the dev context value
- [ ] Calling `trackError('NO_KEYBOARD_TRAP')` in dev mode adds an entry to the issues overlay with the correct rule
- [ ] Calling `trackError('NO_KEYBOARD_TRAP', ref)` where `ref.current` has a `_nativeTag` highlights the referenced field using the same colour and path as native-detected errors
- [ ] Calling `trackError('NO_KEYBOARD_TRAP', ref)` where `_nativeTag` is unavailable adds the overlay entry with `viewId: -1` and no field highlight (no crash)
- [ ] `trackError` is a no-op outside `__DEV__` (production build does not include the implementation)
- [ ] Test: calling `trackError` with a valid rule adds that rule to the issues list
- [ ] Test: calling `trackError` with a ref whose `_nativeTag` is undefined does not throw

#### Not this story

- `checkFocusTrap` utility — that is story 2
- Wiring into `useFormField` / `focusNextFormField` — that is story 3
- Removing old callers of `removeError` if any exist outside the type signature — clean those up as encountered; they are not the focus here

#### Notes

The old `AMADevContextValue` type declared `trackError(id: string)` and `removeError(id: string)`. Both are replaced. If any code in `core` called these with the old signature, update it in this story.

`getRuleAction` and `highlightComponent` are already internal to `useAMADev` — `trackError` calls them directly from within the same hook; no new exports from `core` are needed.

#### Implementation Reference

- **Files:** type changes in `packages/core/src/components/AMAProvider.tsx`; implementation in `packages/core/src/internals/useAMADev.ts`
- **Contract:** `trackError(rule: AmaRule, ref?: React.RefObject<any>): void` — per tech-spec §JS-side error reporting
- **Field highlight:** resolve `viewId` from `ref.current?._nativeTag`; fall back to `viewId: -1` when unavailable; call `highlightComponent(viewId, color, 1)` using `getHighestSeverityColor` with the single-issue array
- **Rule lookup:** call `getRuleAction(rule)` (already inside `useAMADev`) to get severity; use `getHighestSeverityColor([{ rule, viewId }])` for the highlight colour
- **Issue entry:** push `{ rule, viewId }` into the issues state via `setIssues` — same shape as `AmaError`
- **`__DEV__` guard:** `trackError` is returned from the `__DEV__` branch of `useAMADev`; `AMAProvider` passes it only in the dev render branch
- **Do not:** do not export `getRuleAction` or `highlightComponent` from `core`; do not add `removeError` back; do not touch the production context value path

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
