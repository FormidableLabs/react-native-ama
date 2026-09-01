### [STORY-1]: Build integration and anchor checks

#### What and why
A developer building the project gets immediate feedback when any current-version documentation page contains a broken anchor, so errors are caught at build time rather than discovered on the live site. Wiring the Docusaurus build into the root build makes this check part of the standard development cycle.

#### Done when
- [ ] `npm run build` at the project root runs the Docusaurus site build as part of its sequence
- [ ] When any current-version Docusaurus page has a broken anchor, `npm run build` exits with a non-zero status
- [ ] `npm run build` does not fail due to broken anchors on 0.7.x versioned docs pages

#### Not this story
- Fixing the existing broken anchors — those are handled in stories 2–20
- Changes to Docusaurus content
- Excluding any version other than 0.7.x from the check

#### Notes
The "builds cleanly" criterion from the phase goal is fully verified only after all other phase stories are complete and this build gate passes with zero anchor errors.

#### Implementation Reference
- **Files:** root `package.json` — extend the `build` script to run the Docusaurus build from the `website/` directory; `website/docusaurus.config.ts` — set `onBrokenAnchors: 'throw'` (or `onBrokenLinks: 'throw'` if covering all link types) for current-version docs; configure 0.7.x versioned docs to use `'ignore'` or `'warn'` so they do not fail the build
- **Build:** verify by running `npm run build` from the project root — the build should include the Docusaurus build step and exit non-zero if broken anchors are found in current-version pages
- **Do not:** do not disable anchor checking globally; the `'throw'` setting must apply to all current-version pages

---
<!-- ⚠️ When this story is implemented, mark it done via `stories.js set-status` (AGENTS.md step 11) — don't hand-edit the index. -->
