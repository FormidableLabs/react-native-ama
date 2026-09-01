### [STORY-9]: Focus guideline cleanup

#### What and why
A developer reading the focus guideline finds accurate content without stale package references and can identify the AMA rule that fires when a keyboard trap is detected.

#### Done when
- [ ] `website/guidelines/focus.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `NO_KEYBOARD_TRAP`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/focus.md`
- **AMA errors:** `NO_KEYBOARD_TRAP`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
