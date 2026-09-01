### STORY-3: Contrast finding in Popup

#### What and why
A developer opening the Popup in the AMA playground sees a contrast finding flagged on content inside the Popup. It is unclear whether this is a genuine contrast failure or a misclassification — for example, the checker may be reading colour values from the wrong node or snapshot. This story investigates, determines the root cause, and fixes the check if it is a misclassification.

#### Done when
- [ ] Opening the Popup in the playground: any contrast finding reported for content inside the Popup reflects the actual foreground/background colour pair of that content — not colours from a different node or snapshot.
- [ ] If the Popup content genuinely fails the applicable contrast tier: the finding remains and this story is closed with a note that the finding is correct (no code change needed).
- [ ] If the finding is a misclassification: it no longer appears after the fix, and content that genuinely passes contrast shows no finding.
- [ ] Test: unit test for the contrast checker covers the case where `fg` and `bg` are read from the correct node (not a parent or unrelated node).

#### Not this story
- No changes to Popup visual design or colours.
- No changes to contrast thresholds or tiers.
- No new playground screens — verification uses the existing Popup screen.

#### Notes
Depends on story 2 being implemented first — the AAA gate fix may affect which findings surface for Popup content. Investigate after story 2 is in place to avoid chasing a finding that disappears once the gate is correctly wired.

Likely investigation path: compare `fg` and `bg` values on the flagged `AmaNode` against the actual rendered colours of the Popup content. If the node is inheriting colours from a parent container rather than its own render, the snapshot or node-collection logic needs adjustment.

#### Implementation Reference
- **Files:** Investigation starts at the JS contrast check consumer — likely `packages/core/src/internals/checks/checkContrast.ts` and the node collection point that reads `fg`/`bg` from `AmaNode`. If the issue is in node colour collection, also check the relevant Swift/Kotlin node builder.
- **Contract:** `AmaNode` fields: `fg: string`, `bg: string` — these must reflect the node's own rendered colours, not inherited or parent values. Defined in `packages/core/src/ReactNativeAma.types.ts`.
- **Boundaries:** Any native fix is debug-only (project rule 14). Playground verification required for any native node-collection change (project rule 17).
- **Do not:** Do not change Popup colours or layout. Do not change contrast thresholds. Do not close this story as "no fix needed" without confirming the `fg`/`bg` values are correct for the flagged node.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
