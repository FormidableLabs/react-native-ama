### [STORY-4]: Accessibility states cleanup

#### What and why
A developer reading the accessibility states guideline finds accurate content without stale package references and can identify which AMA rule fires when no accessibility state is set.

#### Done when
- [ ] `website/guidelines/accessibility-states.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] An AMA errors section lists `NO_ACCESSIBILITY_STATE_SET`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`
- Format changes to the page

#### Implementation Reference
- **Files:** `website/guidelines/accessibility-states.md`
- **AMA errors:** `NO_ACCESSIBILITY_STATE_SET`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
