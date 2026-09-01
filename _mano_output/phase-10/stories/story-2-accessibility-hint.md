### [STORY-2]: Accessibility hint cleanup

#### What and why
A developer reading the accessibility hint guideline finds accurate content without stale references to removed AMA packages, and can see whether any AMA runtime rules enforce accessibility hint usage.

#### Done when
- [ ] `website/guidelines/accessibility-hint.md` contains no "Related AMA components & hooks" section that references removed packages (e.g. `@react-native-ama/internal`, `@react-native-ama/react-native`)
- [ ] If any AMA runtime rule enforces accessibility hint usage, an AMA errors section lists those error codes; if no applicable rule exists in the current rule set, the section is omitted

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md` — do not touch; it is the format model
- Format changes to the page (covered by Phase 9)

#### Implementation Reference
- **Files:** `website/guidelines/accessibility-hint.md`
- **AMA errors:** no `NO_ACCESSIBILITY_HINT` rule exists in the current rule set; check AMA rule constants before adding a section — add it only if an applicable rule is found
- **Do not:** do not modify `website/guidelines/accessibility-label.md`; do not change page structure

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
