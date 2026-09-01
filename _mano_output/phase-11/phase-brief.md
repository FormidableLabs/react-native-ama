# Phase Brief — react-native-ama — Phase 11

<!-- Self-contained. Everything needed to understand this phase is here. -->

## Why This Phase

`useDynamicList` is the only hook that still routes AMA error codes directly to `console.error` rather than through `trackError`, inconsistent with the pattern already established in `useFormField` and `checkFocusTrap`.

## Phase Goal

`useDynamicList` routes its two FLATLIST error codes through `trackError` instead of `console.error`, matching the established hook pattern.

## Phase Scope

- Replace the `console.error` call sites for `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE` and `FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE` in `useDynamicList` with `trackError`.

## Not This Phase

- Any other hooks or files that may still use `console.error` for AMA error codes.
- Behaviour changes to when or why the errors are raised.
- Changes to error severity or suppression logic.

## Exit Criteria

1. Error routing
   - Trigger `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE`: error routed via `trackError`, not `console.error`
   - Trigger `FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE`: error routed via `trackError`, not `console.error`
2. Regression
   - Existing test suite passes with no changes to expected behaviour

## Assumption Log

| Assumption | Risk if wrong |
|---|---|
| `trackError` is already accessible in `useDynamicList`'s scope without new wiring | If not yet importable there, additional plumbing is needed beyond the intent of this phase |

## Acknowledged Risks

- `trackError` call signature may differ from the current `console.error` call sites, requiring minor adjustments.

<!-- Future work, deferred items, and ideas live in _mano_output/backlog.md — not here. -->
