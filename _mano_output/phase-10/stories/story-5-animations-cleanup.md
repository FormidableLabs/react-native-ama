### [STORY-5]: Animations guideline cleanup

#### What and why
A developer reading the animations guideline finds accurate content without stale package references, and can see whether any AMA rule enforces animation accessibility at runtime.

#### Done when
- [ ] `website/guidelines/animations.md` contains no "Related AMA components & hooks" section referencing removed packages (e.g. `@react-native-ama/internal`, `@react-native-ama/react-native`)
- [ ] If any AMA runtime rule enforces animation accessibility behaviour, an AMA errors section lists those error codes; if no applicable rule exists in the current rule set, the section is omitted

#### Not this story
- Other guideline pages
- `website/guidelines/accessibility-label.md`
- Package docs under `packages/animations/docs/` — those are story 19

#### Implementation Reference
- **Files:** `website/guidelines/animations.md`
- **AMA errors:** no animation-specific error code exists in the current rule set; add a section only if an applicable rule is found when checking AMA rule constants
- **Do not:** do not modify `packages/animations/docs/` — those pages are handled in story 19

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
