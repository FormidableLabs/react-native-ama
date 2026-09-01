### STORY-6: Exclude the 0.7.x docs version from the website build

#### What and why

A developer building the website currently hits 32 broken-link failures that all come from the 0.7.x version of the docs, which links to guideline pages that only exist in the current, unversioned docs. Since 0.7.x is no longer a priority, this story removes it from what gets built and published, clearing those 32 failures without touching current or 1.x.x content.

#### Done when

- [ ] Running the website build no longer generates any 0.7.x pages, and none of the previously-reported 0.7.x broken-link errors appear in the build output
- [ ] The version dropdown and the "All versions" page no longer offer 0.7.x as a selectable version

#### Not this story

- Fixing or correcting 0.7.x content — it's being excluded from the build, not repaired
- Deleting `website/versioned_docs/version-0.7.x` or `website/versioned_sidebars/version-0.7.x-sidebars.json` from disk — the content stays; only build/publish inclusion is turned off
- Fixing the remaining broken links in current and 1.x.x docs — that's story 7

#### Notes

Chose build-level exclusion (`onlyIncludeVersions`) over deleting the versioned docs files — reversible, and the underlying 0.7.x content is preserved on disk in case it's needed later. Phase 10 previously found that Docusaurus 3.4.0 has no per-version `onBrokenLinks`/`onBrokenAnchors` exclusion field — this is a different mechanism (excluding the version from the build entirely, not exempting it from the link check while still publishing it).

#### Implementation Reference

- **Files:** `website/docusaurus.config.ts` — the `@docusaurus/preset-classic` → `docs` options object (currently has `path`, `includeCurrentVersion`, `lastVersion`, `versions`, etc.)
- **Build:** add `onlyIncludeVersions: ['current', '1.x.x']` to that same `docs` options object — this is the standard Docusaurus classic-preset option that restricts which versions listed in `website/versions.json` (currently `["1.x.x", "0.7.x"]`) actually get built and exposed in the version dropdown, without deleting anything
- **Command:** `yarn build:website` (root) or `yarn build` (inside `website/`) reproduces the current failures and verifies the fix

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
