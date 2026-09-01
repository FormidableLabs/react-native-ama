### STORY-1: Guidelines wiring audit

#### What and why
A contributor following the react-native-ama site into the guidelines section expects every listed page to load without error. When the Docusaurus plugin registration or sidebar entries are missing or stale, those pages return 404 errors or never appear in navigation — the same failure mode that caused a post-implementation 404 in Phase 8. This story audits and repairs both config files so the guidelines section is fully wired and reachable.

#### Done when
- [ ] `website/docusaurus.config.ts` lists a plugin entry for the guidelines section; no guidelines-related plugin entry is absent from the config
- [ ] `website/sidebars.ts` contains a sidebar entry for each file currently present under `website/guidelines/`; no entry references a file that does not exist in that directory
- [ ] Every page under `website/guidelines/` returns a successful response (no 404) when the Docusaurus dev server is running and each guidelines URL is visited

#### Not this story
- Content changes to any guidelines `.md` file
- Wiring for doc sections outside `website/guidelines/`
- Adding new guidelines pages

#### Implementation Reference
- **Files:** `website/docusaurus.config.ts` (plugin registration block), `website/sidebars.ts` (sidebar entries); enumerate `website/guidelines/` to verify all present pages have a matching entry
- **Build:** run `cd website && yarn start` to verify all guidelines URLs are reachable after changes; check browser for 404s on each guidelines path
- **Do not:** modify the content of any `.md` file under `website/guidelines/`; this story is config and sidebar wiring only

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
