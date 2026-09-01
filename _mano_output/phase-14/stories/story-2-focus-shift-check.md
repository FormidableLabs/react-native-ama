### STORY-2: Flag missing focus shift on UI change — REJECTED

> Implemented, then reverted. "Did focus move" has no reliable direct query on either
> platform without VoiceOver/TalkBack actually running: iOS's `elementFocusedNotification`
> only fires when VoiceOver is on, and the equivalent Android `TYPE_VIEW_ACCESSIBILITY_FOCUSED`
> listener never fired in testing (`beforeFocusedViewId`/`afterFocusedViewId` stuck at `-1`).
> Manual testing with the assistive tech off — the common case for a sighted developer
> running the app — can never produce a reliable signal. Removed entirely: native
> `beforeFocusedViewId`/`afterFocusedViewId` tracking (iOS `elementFocusedNotification`
> observer, Android `TYPE_VIEW_ACCESSIBILITY_FOCUSED` delegate), the JS
> `itemsWithMissingFocusShift` check, the `MISSING_FOCUS_ON_UI_CHANGE` rule, and its
> config-file.md row. Story 4 (docs for this check) is rejected alongside it — see that
> story file.

#### What and why

A screen reader user taps a component that reveals new content — an accordion opening a panel, for example — and hears nothing change, because focus stayed where it was instead of moving into the new content. Right now AMA doesn't catch this. This story adds a check that flags a `Pressable` interaction which reveals new UI without moving accessibility focus into it.

#### Done when

- [ ] A `Pressable` interaction that reveals new UI (a view not present before the tap) with focus not moved into any of the new views is flagged with `MISSING_FOCUS_ON_UI_CHANGE`
- [ ] A `Pressable` interaction that reveals new UI where focus does move into one of the new views is not flagged
- [ ] The check can be disabled via the existing per-rule `rules` config override (e.g. `rules: { "MISSING_FOCUS_ON_UI_CHANGE": "off" }`) — no new config key
- [ ] Test: an interaction that changes existing UI (no new view ids appear) without a focus shift is not flagged — only newly-appeared UI triggers this check
- [ ] Manually verified in playground: an accordion-style interaction that reveals new content without moving focus surfaces the issue in AMA's dev overlay (project-rules.md rule 17 — native payload and checker-flow changes require playground verification)

#### Not this story

- Any change to the Focus guideline or checklist pages — story 4
- The long-number check — story 1
- Deciding which categories of newly-appeared UI "deserve" focus (toast vs. modal vs. panel) — the check flags any new UI with no focus shift; the per-rule override is the mitigation for false positives, per `tech-spec.md` § "Focus shift on UI change"

#### Implementation Reference

- **Files (native, both required — symmetric change):**
  - iOS: `packages/core/ios/ReactNativeAmaModule.swift` — add `isFocused: Bool` to `struct Snapshot`, set via `view.accessibilityElementIsFocused()` in `takeSnapshotOfTappedView`; include in `convertSnapshotToDict`
  - Android: `packages/core/android/src/debug/java/expo/modules/ama/ReactNativeAmaModule.kt` — add `isFocused: Boolean` to `data class Snapshot`, set via `view.isAccessibilityFocused()` in `takeSnapshotOfTappedView`; include in `convertSnapshotToBundle`
- **Files (types):** `packages/core/src/ReactNativeAma.types.ts` — add `isFocused: boolean` (required) to `AmaUiSnapshot`
- **Files (JS detection):** `packages/core/src/internals/useAMADev.ts` — new function `itemsWithMissingFocusShift(data: AmaUiSnapshotsData)`, sibling to the existing `itemsWithNoStateUpdated`; wire its result into `checkResultUiInteraction` alongside the existing state-check result
- **Contract:** "new UI" = view ids present in `data.after` (or `data.afterSettled` when present) that are absent from `data.before`. If that set is non-empty and none of those view ids has `isFocused: true` in the after/settled snapshot, flag `MISSING_FOCUS_ON_UI_CHANGE` on the tapped view (`data.rootTag`)
- **Rule:** `MISSING_FOCUS_ON_UI_CHANGE`, default severity `warn` — confirmed decision per `tech-spec.md` § "Focus shift on UI change" (same heuristic/false-positive reasoning as `LONG_NUMBER_NOT_FORMATTED`)
- **Do not:** change the cross-platform "update together" contract for `AmaUiSnapshot` — iOS emitter, Android emitter, and `ReactNativeAma.types.ts` all move together per `tech-spec.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
