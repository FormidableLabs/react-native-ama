### [STORY-15]: POUR guideline cleanup

#### What and why
A developer reading the POUR guideline finds accurate content without stale package references.

#### Done when
- [ ] `website/guidelines/pour.md` contains no "Related AMA components & hooks" section referencing removed packages

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`
- Adding an AMA errors section — POUR is a conceptual framework page, not tied to specific runtime rules

#### Implementation Reference
- **Files:** `website/guidelines/pour.md`
- **AMA errors:** none — POUR (Perceivable, Operable, Understandable, Robust) is a conceptual framework; do not add an errors section
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
