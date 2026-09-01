### [STORY-17]: Timed actions guideline cleanup

#### What and why
A developer reading the timed actions guideline finds accurate content without stale package references, and can see whether any AMA rule enforces timed action accessibility at runtime.

#### Done when
- [ ] `website/guidelines/timed-actions.md` contains no "Related AMA components & hooks" section referencing removed packages
- [ ] If any AMA runtime rule enforces timed action behaviour, an AMA errors section lists those error codes; if no applicable rule exists in the current rule set, the section is omitted

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`

#### Implementation Reference
- **Files:** `website/guidelines/timed-actions.md`
- **AMA errors:** no timed-action-specific error code exists in the current rule set; check AMA rule constants and add a section only if an applicable rule is found
- **Do not:** do not modify `website/guidelines/accessibility-label.md`

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
