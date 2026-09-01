### STORY-15: POUR page format

#### What and why
A developer reading about POUR principles expects a plain-language introduction to the four core accessibility principles — Perceivable, Operable, Understandable, Robust — as a foundation for the rest of the guidelines. The current `pour.md` page predates the format standard. This story updates the page to match the `accessibility-label.md` format where applicable to a conceptual overview page.

#### Done when
- [ ] `website/guidelines/pour.md` includes the frontmatter fields present in `accessibility-label.md` that apply: at minimum `displayed_sidebar: guidelines`; remaining fields (`ama_severity`, `ama_category`, `ama_affected_users`, `ama_success_criterion`) added where the page has specific AT applicability
- [ ] The page uses plain language throughout: POUR acronym is spelled out and each principle is defined in plain English before being used
- [ ] If any POUR principle has specific AT-observable expectations, those are presented using the `<ScreenReader>` and `<VoiceControl>` component blocks; if the page is a conceptual overview with no AT-specific expectations, an Expectations section may be omitted
- [ ] A Best Practices section is included if one or more implementation best practices apply; omitted if none apply
- [ ] The page loads from the site sidebar and displays its updated content without error

#### Not this story
- Changes to any other guidelines page
- Changes to `accessibility-label.md`
- Docusaurus config or sidebar wiring changes

#### Notes
- POUR is a conceptual overview; whether a full Expectations section applies is implementer judgment. The page should still be beginner-friendly and consistent in structure with the rest of the guidelines.

#### Implementation Reference
- **Files:** `website/guidelines/pour.md` (target); `website/guidelines/accessibility-label.md` (read-only format model)
- **Do not:** modify `accessibility-label.md`; change any other guidelines file; edit `docusaurus.config.ts` or `sidebars.ts`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
