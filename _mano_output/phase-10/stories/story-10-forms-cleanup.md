### [STORY-10]: Forms guideline cleanup

#### What and why
A developer reading the forms guideline finds accurate content without stale package references and can identify all AMA rules that fire for form accessibility violations.

#### Done when
- [ ] `website/guidelines/forms.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `INPUT_HAS_FOCUSABLE_LABEL`, `INPUT_HAS_NO_VISIBLE_LABEL`, `INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK`, `INPUT_INVALID_RETURN_KEY`, and `NO_FORM_ERROR`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/forms.md`
- **AMA errors:** `INPUT_HAS_FOCUSABLE_LABEL`, `INPUT_HAS_NO_VISIBLE_LABEL`, `INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK`, `INPUT_INVALID_RETURN_KEY`, `NO_FORM_ERROR`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
