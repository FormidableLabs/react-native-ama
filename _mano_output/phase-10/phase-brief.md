# Phase Brief — react-native-ama — Phase 10

<!-- Self-contained. Everything needed to understand this phase is here. -->

## Why This Phase

Phase 9 reformatted every guidelines page. This phase does the accuracy pass: removes stale AMA references, adds AMA error codes where applicable, and fixes all broken anchors in current-version pages. It also wires the Docusaurus build into the root build so broken links are caught at build time going forward.

## Phase Goal

The documentation site builds cleanly with no broken anchors in current-version pages, and all guidelines are accurate and complete.

## Phase Scope

- Root `npm run build` runs the Docusaurus site build; the build fails on broken anchors in current-version pages; old-version pages (0.7.x) are excluded from the check.
- Each guidelines page: stale "Related AMA components & hooks" content removed; AMA error codes added where applicable (e.g. `NO_ACCESSIBILITY_LABEL`, `NO_UPPERCASE_ACCESSIBILITY_LABEL`); any broken anchors fixed.
- Broken anchors on current-version non-guideline pages fixed: `AnimatedContainer`, `useReanimatedAnimationBuilder`, `BottomSheet` component page, and `core/`.

**Decomposition note for `mano stories`:** Create one story per guideline page for the cleanup work. Do not bundle multiple guidelines into a single story.

## Not This Phase

- Broken anchors on old-version pages (0.7.x and earlier) — excluded from the check and not fixed.
- New guidelines pages.
- Content changes outside `website/`.

## Exit Criteria

1. Build
   - `npm run build` at the root builds the Docusaurus site
   - Docusaurus build fails if any current-version page has a broken anchor
   - Old-version pages (0.7.x) are excluded from the check
2. Guidelines
   - No guideline page contains a stale "Related AMA components & hooks" section
   - Each relevant guideline has an AMA errors section with the correct error codes
   - No broken anchors on any current-version guideline page
3. Non-guideline fixes
   - Broken anchors resolved on `AnimatedContainer`, `useReanimatedAnimationBuilder`, `BottomSheet` component page, and `core/`

## Assumption Log

| Assumption | Risk if wrong |
|---|---|
| Old-version pages (0.7.x) can be excluded from the Docusaurus broken-anchor check without disabling the check globally. | If Docusaurus does not support per-version exclusion, the global config may need tuning, weakening current-version validation. |
| The broken anchors on the BottomSheet component page (linking to `#2-can-be-dismissed` and `#3-the-focus-stays-inside-it` on the bottomsheet guideline) can be resolved by updating either the outgoing link or the target anchor — the fix is in scope either way. | If both files require coordinated changes, the relevant stories should be sequenced so the guideline story runs before the component-page story. |
| The broken-anchor list from the known build run is representative; no large additional set surfaces once the build check is enforced. | If many more broken anchors exist, the phase scope (and story count) will grow. |

## Acknowledged Risks

- The guidelines cleanup spans 17 pages; the stale content and error-codes work varies page by page and may be heavier than expected for pages with significant outdated material.
- The broken-anchor list was captured from one build run; enforcing the check may surface additional anchors not yet known.

<!-- Future work, deferred items, and ideas live in _mano_output/backlog.md — not here. -->
