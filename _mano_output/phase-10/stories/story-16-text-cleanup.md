### [STORY-16]: Text guideline cleanup

#### What and why
A developer reading the text guideline finds accurate content without stale package references and can identify the AMA rules that fire for uppercase text accessibility violations.

#### Done when
- [ ] `website/guidelines/text.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `NO_UPPERCASE_TEXT`, `UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL`, and `NO_UPPERCASE_ACCESSIBILITY_LABEL`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/text.md`
- **AMA errors:** `NO_UPPERCASE_TEXT`, `UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL`, `NO_UPPERCASE_ACCESSIBILITY_LABEL`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
