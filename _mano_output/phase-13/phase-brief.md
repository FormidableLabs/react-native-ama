# Phase Brief — react-native-ama — Phase 13

<!-- Self-contained. Everything needed to understand this phase is here. -->

## Why This Phase

Two pre-existing regressions surfaced during Phase 12 need fixing: a real accessibility-detection bug and a test suite that can't run at all. Alongside them, this phase tackles a longstanding annoyance — AMA's own runtime checks flag React Native's LogBox/YellowBox overlay as an accessibility violation, since LogBox itself wasn't built with AMA's standards in mind and no app developer can fix it. Today the only workaround is disabling LogBox globally, which isn't something AMA can responsibly recommend to every consumer.

## Phase Goal

Both regressions are fixed, and the LogBox limitation is documented so consumers understand it's expected, not a bug in their code.

## Phase Scope

- `useAMADev.ts`'s `itemsWithNoStateUpdated` restores per-parent indexing so `NO_ACCESSIBILITY_STATE_SET` detection works correctly again.
- `forms/useFormField.test.tsx`'s suite loads and runs, fixing the underlying jest/transform config issue, matching the rest of the forms suite.
- The README documents that AMA may report accessibility issues originating from React Native's own LogBox/YellowBox overlay, and that these are expected and safe to dismiss. `mano spec` investigated a code-level exclusion and found no reliable way to detect LogBox without risking silent coverage gaps elsewhere — see `tech-spec.md` § "React Native LogBox is not excluded from checks". This phase ships the documentation, not a code fix.

## Not This Phase

- Redesigning AMA's node-scanning or check architecture to exclude LogBox — investigated and rejected, not being revisited this phase
- Removing the playground's existing LogBox-disabling workaround — left as-is
- Any other stale references, docs, or website content (Phase 12 already closed that out)

## Exit Criteria

1. Regression fixes
   - Run `useAMADev.test.ts`: the `NO_ACCESSIBILITY_STATE_SET` assertions pass
   - Run the forms package's full test suite: `useFormField.test.tsx` loads and its tests run (no "Test suite failed to run")
2. LogBox documentation
   - The README documents the LogBox limitation and that affected findings can be dismissed

## Acknowledged Risks

- Both regressions were identified via a `git stash` comparison during Phase 12, not a full root-cause investigation — the actual fix for each may surface additional related issues once implementation starts.

<!-- Future work, deferred items, and ideas live in _mano_output/backlog.md — not here. -->
