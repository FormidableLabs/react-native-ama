### [STORY-13]: Lists and grids cleanup

#### What and why
A developer reading the lists and grids guideline finds accurate content without stale package references and can identify the AMA rules that fire when list item count messaging is missing or malformed.

#### Done when
- [ ] `website/guidelines/lists-grids.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE` and `FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/lists-grids.md`
- **AMA errors:** `FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE`, `FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
