### [STORY-3]: Accessibility role cleanup

#### What and why
A developer reading the accessibility role guideline finds accurate content without stale package references and can identify which AMA rule enforces correct role usage at runtime.

#### Done when
- [ ] `website/guidelines/accessibility-role.md` contains no "Related AMA components & hooks" section that references removed packages
- [ ] An AMA errors section lists `NO_ACCESSIBILITY_ROLE`

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`
- Format changes to the page

#### Implementation Reference
- **Files:** `website/guidelines/accessibility-role.md`
- **AMA errors:** `NO_ACCESSIBILITY_ROLE`
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
