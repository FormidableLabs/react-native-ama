### [STORY-12]: Guidelines index cleanup

#### What and why
A developer landing on the guidelines index page finds accurate content without stale package references.

#### Done when
- [ ] `website/guidelines/index.md` contains no "Related AMA components & hooks" section referencing removed packages

#### Not this story
- Individual guideline content pages
- `website/guidelines/accessibility-label.md`
- Adding an AMA errors section — this is an index/overview page, not a specific guideline

#### Implementation Reference
- **Files:** `website/guidelines/index.md`
- **AMA errors:** none — do not add an errors section to an index page
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
