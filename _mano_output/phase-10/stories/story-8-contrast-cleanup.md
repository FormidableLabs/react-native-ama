### [STORY-8]: Contrast guideline cleanup

#### What and why
A developer reading the contrast guideline finds accurate content without stale package references and can identify the AMA rules that fire when colour contrast requirements are not met.

#### Done when
- [ ] `website/guidelines/contrast.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `CONTRAST_FAILED` and `CONTRAST_FAILED_AAA`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/contrast.md`
- **AMA errors:** `CONTRAST_FAILED`, `CONTRAST_FAILED_AAA`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
