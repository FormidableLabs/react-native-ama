### STORY-4: Document the focus-shift check — REJECTED

> Depended on story 2, which was rejected — the check it would document no longer
> exists. See story-2-focus-shift-check.md for why.

#### What and why

A developer reading the Focus guideline has no way to learn AMA can flag a missing focus shift after UI changes, or how to disable it if it's too noisy. A QA tester following the Focus checklist has no manual-test step to verify it. This story adds both.

#### Done when

- [ ] `website/guidelines/focus.md`'s "AMA dev runtime errors" section includes a `MISSING_FOCUS_ON_UI_CHANGE` entry describing what triggers it and that it can be disabled per-rule, matching the format of the existing `NO_KEYBOARD_TRAP` entry in that section
- [ ] `website/checklist/focus.md` includes a manual-test step for focus moving into newly-revealed content (e.g. an accordion panel), describing what to verify

#### Not this story

- Implementing the check itself — story 2 (this story depends on it being implemented, but only documents the resulting behaviour)
- Any long-number documentation — story 3

#### Notes

Depends on: story 2 (documents its actual behaviour and rule name).

#### Implementation Reference

- **Files:** `website/guidelines/focus.md` — add a new `### MISSING_FOCUS_ON_UI_CHANGE <ShouldNot />` subsection immediately after the existing `### NO_KEYBOARD_TRAP <MustNot />` subsection (and its `:::note`), before `## Related AMA components`. Match the existing subsection's format: heading with severity tag, one paragraph describing the trigger and why it matters.
- **Content:** "This is raised when a `Pressable` interaction reveals new UI (e.g. an accordion opening a panel) without moving accessibility focus into it — screen reader users are left on stale content with no signal that something changed. Unlike `NO_KEYBOARD_TRAP`, this rule can be turned off per-rule via `ama.config.json` if it produces too many false positives for content that isn't meant to receive focus (e.g. toasts, loading indicators)."
- **Files:** `website/checklist/focus.md` — extend the existing "Outcome" checklist (after "Ensure the focus progresses in a logical sequence.") with one additional bullet, and add a corresponding step to "Procedures".
- **Content:**
  - Procedures addition: "Trigger an interaction that reveals new content (e.g. open an accordion or expand a section)."
  - Outcome addition: "When an interaction reveals new content, focus moves into that new content."

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
