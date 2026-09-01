# Phase 8 — Package Documentation Coverage & Accuracy

## Why this phase

The per-package docs that feed the docusaurus website have drifted from the v2 API. Some exported components and hooks have no doc page at all, and some existing pages document removed or renamed APIs (e.g. `core`'s `AMAProvider.md` still shows the pre-Phase-7 `trackError(id)` / `removeError` signatures). This phase makes the documentation a faithful, complete reference for the five active packages.

## Phase goal

Every exported component and hook in the five active packages has an accurate doc page that matches the current v2 source.

## Phase scope

Documentation lives inside each package folder (e.g. `packages/core/docs`) and is surfaced through the docusaurus website. This phase covers all five active packages: `animations`, `bottom-sheet`, `core`, `forms`, `lists`.

For each package:

- **Coverage** — every component and hook exported from the package's public entry point has its own doc page. Where a page is missing, create it.
- **Accuracy** — each page is verified against the actual exported API in source. Props, methods, and signatures on the page must match what the code currently exports. Remove or correct anything that documents a renamed, removed, or restructured API.

Each component/hook page must contain:

- **Usage** — a working code example showing how to use the export.
- **Dev mode only!** banner — present when, and only when, the export (or the documented behaviour) is dev-mode-only.
- **Properties** — the list of props / options the export accepts.
- **Methods** — the list of methods the export exposes.

The accuracy bar is *verified against source*: a page is correct only when its documented surface matches the current export, not merely when the four sections are present.

## Not this phase

- The **website guidelines** (`website/guidelines`) — that is a separate deferred backlog item with its own a11y-focused format (Expectations / Best Practices). Do not touch guidelines content here.
- Re-auditing already-removed packages (`@react-native-ama/react-native`, `@react-native-ama/internal`). Phase 5/6 already stripped those references. Only fix a stale reference if it is still present in an active package's docs and falls out of the accuracy pass naturally.
- Changing source code to match the docs. This phase aligns *docs to code*, never code to docs. If the source itself looks wrong, flag it — do not fix it here.

## Exit criteria

1. Coverage
   - For each of the five packages, list its public exports and its doc pages: every exported component and hook has a corresponding page.
2. Accuracy
   - Open a page whose API recently changed (e.g. `core` `AMAProvider`): its documented signature matches the current source export, with no removed/renamed members shown.
   - Each page has Usage with a code example, Properties, Methods, and a Dev-mode banner where applicable.
3. Site builds
   - The docusaurus website builds with the updated/added pages, with no broken internal links or missing-page references introduced by this phase.

## Assumption log

| Assumption | Risk if wrong |
|-----------|---------------|
| The `exports` field in each package's `package.json` is the authoritative list of what must be documented (tree-shaking removed the single `src/index` barrel). Each named export key (e.g. `"./AnimatedContainer"`) corresponds to one doc page. | An export surfaced through another path is missed, leaving a real coverage gap unrecorded. |
| "Methods" applies per export only where the export actually exposes callable methods; a pure component/hook with none can legitimately have an empty/omitted Methods section. | A reviewer reads an omitted Methods section as an oversight rather than an accurate "none." |

## Acknowledged risks

- Verifying every page against source across five packages is broad; if a story bundles too many packages it becomes hard to review. Decompose per package.
- Some exports are types rather than runtime components/hooks; deciding which deserve their own page (vs. being documented inline on the owning component) needs a consistent call at story time.
- An export whose source itself contradicts its intended behaviour will surface during the accuracy pass; the correct action is to flag it for a follow-up, not to edit source in this phase.
