### STORY-3: Migration doc — @react-native-ama/internal

#### What and why
A developer who previously depended on `@react-native-ama/internal` — directly or indirectly — upgrades to v2 and finds the package is gone. A migration page tells them where each symbol moved (into `core`, `animations`, or `forms`) so they can update their own code without reading through the monorepo history.

#### Done when
- [ ] A new documentation page for `@react-native-ama/internal` exists in the website
- [ ] The page explains that the package has been removed in v2 and its code inlined into the consuming packages
- [ ] The page lists where each major symbol (utilities, logger, config path) landed — `@react-native-ama/core`, `@react-native-ama/animations`, or `@react-native-ama/forms` — with the updated import path
- [ ] The page is reachable from the website (wired into the sidebar or the relevant docs section)

#### Not this story
- Documenting `@react-native-ama/react-native` (that is story 2)
- Fixing stale references in other docs (that is story 1)
- Updating any source code

#### Notes
Phase 3 inlined all `@react-native-ama/internal` symbols into `core`, `animations`, and `forms`. The migration map is: logger utilities → `core`; animation helpers → `animations`; form utilities → `forms`; `ama.config.json` now lives in `node_modules/@react-native-ama/core` (or the project root copy). Verify exact export names from the current package source before writing the migration table.

#### Implementation Reference
- **Files:** new doc page under `website/docs/` or the appropriate package-docs folder; update the relevant sidebar config to include the new page
- **Do not:** invent symbol destinations — base the page only on what is verifiable from the current package sources

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
