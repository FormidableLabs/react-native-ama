### STORY-7: Fix remaining broken links in current and 1.x.x docs

#### What and why

Once 0.7.x is excluded from the build (story 6), a developer building the website still hits 18 pages' worth of broken links: current-version guideline and package pages linking to component/hook docs with the wrong path or casing, a couple of stale references to the removed `react-native-ama/react-native` package, and one guideline link with no matching page. This story fixes all of them so the website build passes cleanly end to end.

#### Done when

- [ ] Running the full website build completes with zero broken-link errors
- [ ] No page anywhere on the site links to the removed `/react-native-ama/react-native/` or `/react-native-ama/extras/` paths

#### Not this story

- Excluding or restoring the 0.7.x version — story 6 handles that
- Creating new guideline or component doc pages to satisfy a broken link — either correct the link to an existing page, or remove the link if no correct target exists
- Redesigning site navigation or information architecture beyond fixing the specific broken links found

#### Notes

Depends on: story 6 (so the build's remaining errors are only this story's 18 pages, not mixed with 0.7.x noise).

The breaks fall into a few patterns, but each link still needs its own correct target verified against the actual generated page:
- Wrong casing in package doc links (e.g. a guideline page linking to `animations/components/animatedcontainer` when the real page is cased differently)
- Guideline pages linking to package component/hook pages with the wrong path shape (e.g. `guidelines/forms` linking to several `forms/components/*` and `forms/hooks/*` paths that don't resolve)
- Stale references to the removed `react-native-ama/react-native` and `extras` packages/pages (1.x.x docs) — per the already-resolved "react-native-ama/react-native — remove stale references" backlog item, these should not exist anywhere in the site
- One guideline link with no matching page at all (`checklist/` → `guidelines/accessibility-state`)

#### Implementation Reference

- **Command:** `yarn build:website` (root) or `yarn build` (inside `website/`) reproduces the full, current list of broken links and their exact source pages — use it to find every remaining break and verify each fix; do not rely on a list transcribed here, since it will drift as fixes land
- **Do not:** invent a new destination page to fix a broken link — if the correct target genuinely doesn't exist, remove the link (or the sentence containing it) instead

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
