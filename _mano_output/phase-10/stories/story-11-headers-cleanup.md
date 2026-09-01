### [STORY-11]: Headers guideline cleanup

#### What and why
A developer reading the headers guideline finds accurate content without stale package references and can identify the AMA rule that fires when no heading is found on a screen.

#### Done when
- [ ] `website/guidelines/headers.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `NO_HEADER_FOUND`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/headers.md`
- **AMA errors:** `NO_HEADER_FOUND`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
