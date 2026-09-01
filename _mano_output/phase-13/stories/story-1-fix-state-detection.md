### STORY-1: Fix accessibility state-change detection

#### What and why

A screen reader user relies on AMA to catch components whose accessibility state (checked, expanded, selected, etc.) doesn't update after they interact with it — a real, easy-to-miss accessibility bug. Right now that detection is broken: it compares state across the wrong scope, so it can miss real issues or flag the wrong component. This story restores it to the previously-working behaviour.

#### Done when

- [ ] Running `useAMADev.test.ts`: both existing `NO_ACCESSIBILITY_STATE_SET` assertions pass — "flags `NO_ACCESSIBILITY_STATE_SET` when state did not change after tap" and "clears `NO_ACCESSIBILITY_STATE_SET` when state did change"
- [ ] Test: with two sibling components present, a state change on one after interaction does not affect whether the other sibling's `NO_ACCESSIBILITY_STATE_SET` issue is flagged or cleared — each is evaluated against its own parent's before/after snapshot, not a flattened comparison across all components
- [ ] Manually verified in playground: tapping a component whose accessibility state does not update after the tap surfaces a `NO_ACCESSIBILITY_STATE_SET` issue in AMA's dev overlay (per project-rules.md rule 17 — checker-flow changes require playground verification)

#### Not this story

- The forms `useFormField.test.tsx` suite failing to load — story 2
- Any LogBox-related work — story 3

#### Implementation Reference

- **Files:** `packages/core/src/internals/useAMADev.ts` — `itemsWithNoStateUpdated` function
- **Contract:** per `tech-spec.md`'s `onUIInteraction` payload — `before`/`after`/`afterSettled` are each `Record<number, AmaUiSnapshot>` keyed by view id; every `AmaUiSnapshot` carries its own `parentId`. Before/after state comparisons must be scoped per parent (grouped or indexed by `parentId`), not compared as a flat lookup across all view ids — that flattening is the regression.
- **Do not:** change the `onUIInteraction` payload shape (`AmaUiSnapshotsData` / `AmaUiSnapshot` fields) — this is a JS-side comparison-logic fix only, not a native payload change.

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
