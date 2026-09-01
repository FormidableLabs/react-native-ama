### [STORY-18]: Accessibility issues overview cleanup

#### What and why
A developer reading the types of accessibility issues overview finds accurate content without stale package references.

#### Done when
- [ ] `website/guidelines/type-of-accessibility-issues.md` contains no "Related AMA components & hooks" section referencing removed packages

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`
- Adding an AMA errors section — this is an informational overview page, not tied to specific runtime rules

#### Implementation Reference
- **Files:** `website/guidelines/type-of-accessibility-issues.md`
- **AMA errors:** none — informational overview; do not add an errors section
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
