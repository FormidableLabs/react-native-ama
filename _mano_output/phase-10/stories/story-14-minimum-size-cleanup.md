### [STORY-14]: Minimum size guideline cleanup

#### What and why
A developer reading the minimum size guideline finds accurate content without stale package references and can identify the AMA rule that fires when a touch target is below the minimum size.

#### Done when
- [ ] `website/guidelines/minimum-size.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `MINIMUM_SIZE`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/minimum-size.md`
- **AMA errors:** `MINIMUM_SIZE`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
