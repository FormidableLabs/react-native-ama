### STORY-18: Types of accessibility issues page format

#### What and why
A developer reading about types of accessibility issues expects a plain-language overview of how different impairments interact with mobile apps, giving them a mental model before diving into specific guidelines. The current `type-of-accessibility-issues.md` page predates the format standard. This story updates the page to match the `accessibility-label.md` format where applicable to an overview page.

#### Done when
- [ ] `website/guidelines/type-of-accessibility-issues.md` includes the frontmatter fields present in `accessibility-label.md` that apply: at minimum `displayed_sidebar: guidelines`; remaining fields (`ama_severity`, `ama_category`, `ama_affected_users`, `ama_success_criterion`) added where the page has specific AT applicability
- [ ] The page uses plain language throughout: impairment categories and AT types are defined in plain English before being referenced
- [ ] If any issue type has specific AT-observable expectations, those are presented using the `<ScreenReader>` and `<VoiceControl>` component blocks; if the page is a conceptual taxonomy with no AT-specific expectations, an Expectations section may be omitted
- [ ] A Best Practices section is included if one or more implementation best practices apply; omitted if none apply
- [ ] The page loads from the site sidebar and displays its updated content without error

#### Not this story
- Changes to any other guidelines page
- Changes to `accessibility-label.md`
- Docusaurus config or sidebar wiring changes

#### Notes
- This is a conceptual taxonomy page; whether a full Expectations section applies is implementer judgment.

#### Implementation Reference
- **Files:** `website/guidelines/type-of-accessibility-issues.md` (target); `website/guidelines/accessibility-label.md` (read-only format model)
- **Do not:** modify `accessibility-label.md`; change any other guidelines file; edit `docusaurus.config.ts` or `sidebars.ts`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
