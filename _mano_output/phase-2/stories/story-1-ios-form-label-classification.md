### STORY-1: iOS form label classification

#### What and why
A developer using AMA on iOS sees "missing accessibility label" reported for a form field whose label is a visible, accessible `Text` node — the same scenario Android correctly identifies as `Label is focusable`. The iOS native payload is likely not providing `Text` node content or accessibility state, causing the lookup to fail. This story fixes the payload gap and the JS classification so iOS matches Android behaviour.

#### Done when
- [ ] On iOS: a form input whose label is a visible, accessible `Text` node with text matching the field's `aria-label` (minus trailing `:`) reports `Label is focusable` — not missing-label.
- [ ] On iOS: a form input with `aria-label` set but no matching accessible `Text` node in the tree does not report `Label is focusable`.
- [ ] On iOS: a form input genuinely missing any label continues to report the missing-label finding.
- [ ] Android behaviour is unchanged across all three scenarios above.
- [ ] Test: JS form-rule unit test covers the lookup for a matched `Text` node, a non-matched case, and a missing-label case.

#### Not this story
- No changes to form-rule behaviour for any finding other than `Label is focusable` and missing-label.
- No changes to Android native payload.
- No new playground screens — verification uses the existing Form screen.

#### Notes
The lookup logic: given a field's `aria-label` (e.g. `"Email:"`), strip the trailing `:` to get `"Email"`, then search `AmaNode` entries of type `Text` for a node whose `content` matches and whose `isAccessible` is not `false`. If found, report `Label is focusable`. If `Text` nodes on iOS are missing `content` or `isAccessible`, the fix requires Swift changes to populate those fields in the `onAmaNodes` payload.

Verify on a real iOS device or simulator — playground Form screen must expose the labeled-input scenario.

#### Implementation Reference
- **Files:** JS form rule — `packages/forms/src/` (locate the checker that evaluates label findings); Swift node builder — `packages/core/ios/` (locate where `Text` nodes are built and emitted for `onAmaNodes`)
- **Contract:** `AmaNode` fields relevant to this story: `type: 'Text'`, `content: string`, `isAccessible: boolean`, `ariaLabel: string` — defined in `packages/core/src/ReactNativeAma.types.ts`. Any iOS payload change must keep parity with the Android emitter and update the TypeScript contract (project rule 13).
- **A11y:** `isAccessible` field on `Text` nodes must reflect whether the node is exposed to assistive technology — a `Text` with `accessible={false}` must not be matched as a valid label.
- **Boundaries:** Native changes are debug-only (iOS `#if DEBUG` guards, per project rule 14). Do not add release-build code paths.
- **Do not:** Do not change the `AmaNode` contract shape without updating both iOS emitter and `ReactNativeAma.types.ts` together (project rule 13). Do not modify Android node collection.

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
