### STORY-11: Headers page format

#### What and why
A developer reading about headers expects guidance on using heading hierarchy so screen reader users can navigate page structure efficiently. The current `headers.md` page predates the format standard and lacks the structured AT expectations and consistent section layout present in `accessibility-label.md`. This story updates the page to match that format.

#### Done when
- [ ] `website/guidelines/headers.md` includes the frontmatter fields: `ama_severity`, `ama_category`, `ama_affected_users`, `ama_success_criterion`, and `displayed_sidebar: guidelines`
- [ ] The page includes an Expectations section structured by Assistive Technology, using the `<ScreenReader>` and `<VoiceControl>` component blocks as modelled in `accessibility-label.md`
- [ ] The introductory content uses plain language: technical terms are either avoided or given a plain-English definition the first time they appear
- [ ] A Best Practices section is included if one or more implementation best practices apply; omitted if none apply
- [ ] The page loads from the site sidebar and displays its updated content without error

#### Not this story
- Changes to any other guidelines page
- Changes to `accessibility-label.md`
- Docusaurus config or sidebar wiring changes

#### Implementation Reference
- **Files:** `website/guidelines/headers.md` (target); `website/guidelines/accessibility-label.md` (read-only format model)
- **Do not:** modify `accessibility-label.md`; change any other guidelines file; edit `docusaurus.config.ts` or `sidebars.ts`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
