### STORY-12: Guidelines index page format

#### What and why
A developer landing on the guidelines section index page expects a clear, beginner-friendly introduction to what the guidelines cover and how to use them. The current `index.md` page predates the format standard. This story updates the page to match the `accessibility-label.md` format where applicable to a section landing page.

#### Done when
- [ ] `website/guidelines/index.md` includes the frontmatter fields present in `accessibility-label.md` that apply to a section index page: at minimum `displayed_sidebar: guidelines`; remaining fields (`ama_severity`, `ama_category`, `ama_affected_users`, `ama_success_criterion`) added only where the page has specific AT applicability
- [ ] The page uses plain language throughout: technical terms are either avoided or given a plain-English definition the first time they appear
- [ ] If the page describes any specific AT behaviour, it uses the `<ScreenReader>` and `<VoiceControl>` component blocks; if it is a pure overview with no AT-specific expectations, an Expectations section may be omitted
- [ ] The page loads from the site sidebar and displays its content without error

#### Not this story
- Changes to any other guidelines page
- Changes to `accessibility-label.md`
- Docusaurus config or sidebar wiring changes

#### Notes
- `index.md` is a section landing page, not a specific guideline — the Expectations section format may not apply. Implementer judgment applies here.

#### Implementation Reference
- **Files:** `website/guidelines/index.md` (target); `website/guidelines/accessibility-label.md` (read-only format model)
- **Do not:** modify `accessibility-label.md`; change any other guidelines file; edit `docusaurus.config.ts` or `sidebars.ts`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
