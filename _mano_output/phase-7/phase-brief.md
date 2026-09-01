# Phase 7 Brief — react-native-ama

## Why this phase

The AMA 2.0 refactor moved all checks to the native side and removed `useChecks`, `track`, and `untrack` from the context. This silently dropped `checkFocusTrap` — a JS-side-only focus-trap detection check in `focusNextFormField` that cannot be moved to native. This phase restores it and introduces `trackError` as a minimal JS-side error-reporting path on the context.

## Phase goal

`focusNextFormField` detects focus traps in dev mode and surfaces them through the same error-highlighting pipeline as native-detected errors.

## Phase scope

1. Add `trackError(ruleKey, ref?)` to the AMA context — looks up the rule action internally, highlights the offending field via the same path as native-detected errors, uses `ref` to identify the field where possible.
2. Restore `checkFocusTrap` in `@react-native-ama/forms` — adapted to the 2.0 context (no `LogParams`, no `useChecks`); calls `trackError` when core is available, falls back to `console.error` when core is absent.
3. Wire `checkFocusTrap` back into `focusNextFormField` in `packages/forms/src/hooks/useFormField.ts`.

## Exit criteria

1. Dev mode — focus trap detected
   - Render a form with `focusNextFormField` wired up
   - Trigger a focus-trap condition (field does not release focus as expected)
   - `trackError` called: offending field highlighted in the same style as native-detected errors
   - Error reported via the AMA error pipeline (overlay / console output matching native behaviour)

2. Dev mode — no false positive
   - Trigger a normal focus advance (no trap)
   - No error reported, no field highlighted

3. Core absent
   - Install `@react-native-ama/forms` without `@react-native-ama/core`
   - Trigger a focus-trap condition
   - `console.error` fires with the `NO_KEYBOARD_TRAP` rule message; no crash

## Assumption log

| # | Assumption | Risk if wrong |
|---|-----------|---------------|
| 1 | A field ID can be retrieved from the native ref to identify the offending field in the error pipeline. | If the ref does not expose a usable field ID, the highlight path falls back to highlighting without field identification — same visual path, no field-level targeting. |
| 2 | `getRuleAction` is accessible internally within `@react-native-ama/core` and does not need to be exported for this phase. | If the `trackError` implementation cannot reach `getRuleAction` without a public export, a minimal export will be needed — surfaced during implementation. |

## Acknowledged risks

- The field-highlight path for native errors may have assumptions about how a field is identified that a JS-supplied ref cannot satisfy; the fallback (highlight without ID) is the safe path.
- `trackError` is a new context surface — its signature should be kept minimal now; broader JS error-reporting can be extended in a later phase if needed.
