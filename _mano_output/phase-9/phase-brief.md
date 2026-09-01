# Phase Brief — react-native-ama — Phase 9

<!-- Self-contained. Everything needed to understand this phase is here. -->

## Why This Phase

The guidelines section has doc pages that predate the format standard established in Phase 8. This phase brings every page up to that standard and confirms the site can serve them without errors.

## Phase Goal

Every page under `website/guidelines/` matches the `accessibility-label.md` format and is reachable from the live site.

## Phase Scope

- All guidelines pages updated to the `accessibility-label.md` format: beginner-friendly language, an Expectations section (per Assistive Technology), and Best Practices where applicable.
- Docusaurus site wiring verified: plugin registration and sidebar entries confirmed so every guidelines page is reachable.

## Not This Phase

- New guidelines pages for features not currently documented.
- Changes to doc pages outside `website/guidelines/`.
- Content changes to `accessibility-label.md` itself — it is the format model, not a target for this phase.

## Exit Criteria

1. Guidelines page content
   - Each page under `website/guidelines/` has: beginner-friendly language, an Expectations section, and Best Practices (where applicable)
   - Format matches the `accessibility-label.md` model visually and structurally

2. Site reachability
   - Every guidelines page opens without a 404 or build error
   - All guidelines pages appear in the sidebar

3. Config check
   - `docusaurus.config.ts` plugin registration includes the guidelines section
   - `sidebars.ts` sidebar entries match all guidelines pages with no stale or missing entries

## Assumption Log

| Assumption | Risk if wrong |
|---|---|
| `accessibility-label.md` is the stable format model for this phase; its content does not change during this phase. | If the model itself is being revised, the format target is a moving reference and pages may need re-updating. |
| "Best Practices where applicable" is implementer judgment on a page-by-page basis. | If there is an undocumented rule for which pages require it, pages without it may fail review. |

## Acknowledged Risks

- Some guidelines pages may require substantial content rewriting to meet "beginner-friendly language" — the work may be heavier than a structural format pass.
- The wiring audit may surface more plugin registration or sidebar gaps than the single known case from Phase 8.

<!-- Future work, deferred items, and ideas live in _mano_output/backlog.md — not here. -->
