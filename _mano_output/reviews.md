# Phase Review - react-native-ama

---

## Phase 1 Review - 2026-04-21

### What worked

- Image detection worked as expected in review.
- The phase goal of shipping end-to-end missing-alt-text detection for accessible images was met in manual validation.

### What didn't

- iOS form checks misclassify some cases as missing an accessibility label.
- Components that should surface `Label is focusable` are not distinguished correctly on iOS.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| Native image accessibility data can be routed to JS checks without blocking debug-mode validation. | iOS and Android would provide enough metadata for JS image rules. | Image detection worked in review, which supports the payload assumption for this phase goal. | confirmed |
| Playground-based manual verification would be sufficient to validate the scoped image scenarios. | The review would confirm labeled, unlabeled, and decorative image behavior clearly enough to close the phase. | The image path reviewed cleanly, but the pass also exposed an unrelated iOS form-check classification defect. | confirmed |

### Feedback that changes future scope

- Add follow-up work for the iOS form-check classification bug so `Label is focusable` cases are not collapsed into missing-label findings.

### What we learned

- The new image-check path is working, but review still needs to cover adjacent rule families because unrelated regressions can surface during phase validation.
- Native payload changes and JS rule additions should be checked against existing iOS form semantics before closing future phases.

---

## Phase 2 Review — 2026-06-16

### What worked

- iOS form-label classification fixed: the Swift node collector now reads `accessibilityLabel` from the TextInput itself (not just the superview), and the `Label is focusable` finding is now reported correctly on iOS to match Android behaviour.
- AAA contrast check gate wired to config: the hardcoded `&& false` short-circuit removed; the check now reads the `CONTRAST_FAILED_AAA` rule action from `getRuleAction` before evaluating.
- Rule disable validated and patched: `checkTextInputs` was missing the `isRuleDisabled` filter that `performChecks` already had; both paths now consistently suppress disabled rules.

### What didn't

- Contrast-in-Popup was discarded — the issue was a pre-existing resolved problem, not a Phase 2 defect. No fix needed.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| Rule-disable mechanism already exists in the config path. | Validate and fix, not build from scratch. | Mechanism existed in `performChecks` but was absent from `checkTextInputs`; gap patched. | confirmed |
| Contrast-in-Popup reproducible via existing playground without new additions. | Pre-existing misclassification to investigate. | Issue was already resolved; discarded as stale backlog item. | invalidated — pre-resolved |
| iOS payload for Text nodes may be missing content or accessibility state. | Fix may require Swift changes. | Root cause was `ariaLabel` read from superview instead of the TextInput itself; Swift fix applied. | confirmed |

### Feedback that changes future scope

- No new scope items emerged from this phase.

### What we learned

- When the Swift node collector reads from `superview` instead of the node itself, the accessibility label is silently lost — worth checking other node types for the same pattern in future native payload work.
- `checkTextInputs` and `performChecks` had diverged on rule-disable behaviour; a shared filter helper would prevent this class of gap.

---

## Phase 3 Review — 2026-06-16

### What worked

- Android `returnType` parity: the Kotlin node collector now sends `returnType` in the `onAmaNodes` payload; `INPUT_INVALID_RETURN_KEY` fires on Android matching iOS behaviour.
- `ama.config.json` restructured: `highlight` is now a nested object (`mode`, `borderWidth`, `gap`); `checks` scoped to feature gates and `delay`; breaking change accepted cleanly for v2.0.
- `@react-native-ama/internal` removed: all symbols inlined into consuming packages (`core`, `animations`, `forms`); dependency removed from all active `package.json` files.
- Root `yarn test` wired: chains `core → animations → forms → lists` in dependency order; failure in any package exits non-zero.

### What didn't

- Individual package tests are failing — cause unrelated to the root `yarn test` wiring. Needs investigation and fixes before release.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| Android `returnType` gap is in the Kotlin node collector, not in JS-side `checkTextInputs`. | JS logic handles the value once it arrives; only Kotlin needed changing. | Confirmed — Kotlin fix was sufficient; no JS changes required. | confirmed |
| `ama.config.json` restructure applies only to new v2.0 keys; no runtime config-reading code changes needed for existing keys. | Existing flat keys load unchanged via `Object.assign`. | Confirmed — existing key handling untouched. | confirmed |
| All code in `@react-native-ama/internal` is consumed by exactly the packages in the active graph; no external consumers. | Migration scope is bounded to `core`, `animations`, `forms`. | Confirmed — no hidden consumers discovered. | confirmed |

### Feedback that changes future scope

- Package test failures need to be fixed before the v2.0 release can ship; tracked as a bug in the backlog.
- Coverage reporting (root + per-package) will make test gaps visible; tracked as a refinement in the backlog.

### What we learned

- Shipping a root test orchestrator without first verifying all package tests pass individually surfaced pre-existing failures that were previously invisible.
- Coverage reporting should be added alongside the test chain, not as a follow-up — gaps are easiest to act on when they're first visible.

---

## Phase 4 Review — 2026-06-17

### What worked

- All five active packages (`core`, `animations`, `forms`, `lists`, `bottom-sheet`) now have passing test suites running under a consistent jest infrastructure (react-native preset, shared mocks, babel config).
- `bottom-sheet` was previously missing jest configuration entirely; tests were added mid-phase and all passed.
- Coverage reporting wired at both root (`yarn test:coverage`) and per-package level.
- All active packages bumped to `2.0.0-beta.1`; `yarn install` completes cleanly.
- Root test script refactored to named per-package scripts (`test:core`, `test:animations`, etc.) so packages can be tested individually without repeating workspace invocations.

### What didn't

- Nothing broken; no regressions reported.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| Failing tests are pre-existing failures, not regressions from Phase 3. | Fixes belong to test files or source, not root wiring. | Confirmed — all failures were stale test expectations or missing jest infrastructure, not new regressions. | confirmed |
| `bottom-sheet` can revert to `2.0.0-beta.1` for consistency with the rest of the package set. | Consumers pinning `^2.0.0` won't auto-pick it up. | Confirmed — bump applied; semver pre-release range `~2.0.0-beta.1` used in sibling dependencies to satisfy workspace resolution. | confirmed |

### Feedback that changes future scope

- No feedback logged.

### What we learned

- `~2.0.0` in npm semver excludes pre-release tags like `2.0.0-beta.1`; sibling dependencies in a monorepo must use `~2.0.0-beta.1` (or `workspace:`) to resolve local pre-release packages correctly.
- The `Gesture.Pan()` API from react-native-gesture-handler replaces the legacy `useAnimatedGestureHandler` from reanimated — test mocks must stub the builder pattern (`.onStart(cb).onUpdate(cb).onEnd(cb)`) and expose stored callbacks for direct invocation.

---

## Phase 5 Review — 2026-06-18

### What worked

- Peer deps made optional across all active packages (`core`, `animations`, `forms`, `lists`, `bottom-sheet`); safe defaults applied when siblings are absent — no API surface change required.
- Barrel `index.ts` removed from public API across all packages; named subpath exports added with `"sideEffects": false`; tree-shaking now possible for all packages.
- Coverage thresholds met across all five packages; stories were split per-package to keep each job small and focused. `forms` threshold was pre-existing but not met — gap found and fixed mid-phase.
- All stale references to `@react-native-ama/react-native` and `@react-native-ama/internal` removed from source, config, and documentation. Grep returns zero hits across active packages.
- 490 tests passing across all packages at phase close.

### What didn't

- Nothing broken; no regressions reported.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| Components using `useAMAContext` can fall back to safe defaults without changing their public API. | Safe defaults would not alter observable behaviour for consumers. | Confirmed — fallback pattern worked cleanly across all packages. | confirmed |
| Barrel `index.ts` is the primary tree-shaking blocker; build output supports named entry points. | Restructuring exports alone would be sufficient. | Confirmed — named subpath exports resolved the blocker without bundler config changes. | confirmed |
| Existing thresholds in `core` and `forms` are the baseline; others get a 70% floor raised to actual coverage. | Significant new test work may be needed in undertested packages. | Confirmed with nuance — stories were split per-package which kept each job manageable; `forms` threshold was already set but not met and required fixes. | confirmed |

### Feedback that changes future scope

- No new scope items emerged from this phase.

### What we learned

- Splitting coverage stories per-package rather than doing all packages in one story kept the work focused and made it easier to track progress.
- A pre-existing coverage threshold that isn't enforced in CI is invisible until someone runs coverage explicitly — thresholds are only useful if the CI gate runs them.
- `SHELL_COLORS` used as an implicit global in `useFocus.ts` is not defined in the Jest environment; test files targeting that code must define it as a global.

---

## Phase 6 Review — 2026-06-19

### What worked

- Migration docs written for both `@react-native-ama/react-native` and `@react-native-ama/internal`; stale references in `getting-started.md` and `config-file.md` removed.
- Playground core screen completed: all 8 `is*` values displayed and the dev-menu toggle explanation added.
- `DynamicFlatList` food-search demo wired into `PackagesTab`; real-time filtering and screen-reader item-count announcements working.
- Stale playground screens and components from the previous AMA version removed; no dangling route registrations remain.

### What didn't

- `checkFocusTrap` in `focusNextFormField` was deleted during the AMA 2.0 refactor and was not restored in this phase. This is a JS-side-only check that cannot be moved to native and needs a new error-reporting path since `useChecks` and the `track`/`untrack` context methods no longer exist.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| `@react-native-ama/react-native` had no replacement package — components/hooks were dropped or moved to other AMA packages. | Migration doc describes what moved where. | Confirmed. | confirmed |
| `UseAMAContext.screen.tsx` is the target for core screen completion and is already wired into navigation. | Only missing properties and text needed to be added. | Confirmed. | confirmed |

### Feedback that changes future scope

- `checkFocusTrap` must be restored in `focusNextFormField` with a JS-side error-reporting mechanism that works without `useChecks` and without `track`/`untrack` on the context.

### What we learned

- JS-side checks that depend on focus lifecycle (like focus-trap detection) cannot be moved to native and must retain their own reporting path — the AMA 2.0 context refactor silently dropped this capability.

---

## Phase 7 Review — 2026-06-24

### What worked

- `trackError(rule, ref?)` added to the AMA context via `useAMADev`; looks up rule action via `logError` internally; highlights the offending field using the same `highlightComponent` path as native-detected errors.
- `checkFocusTrap` restored in `@react-native-ama/forms` as a `__DEV__`-only async utility; `trackError` passed as a parameter to avoid calling hooks inside `setTimeout`; falls back to `console.error` when core is absent.
- `focusNextFormField` wired up: calls `checkFocusTrap` after focus advance when `hasFocusCallback` is true.
- Module instance mismatch fixed: `require('@react-native-ama/core/AMAProvider')` in `useFormField` was resolving to a different Metro module instance; changed to `require('@react-native-ama/core')` so the same context instance is used.
- `jsFailedChecks` ref introduced to merge JS-side errors into the native issue count per view; `issueHighlighted` changed from `Array<number>` to `Record<number, number>` to gate re-highlights by count change, avoiding unnecessary native re-renders and double Android check triggers.

### What didn't

- Nothing broken; no regressions reported.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| A field ID can be retrieved from the native ref to identify the offending field in the error pipeline. | If not available, fallback to `viewId: -1` with no field-level targeting. | `__nativeTag` accessible on `ref.current`; field targeting works when ref is provided. | confirmed |
| `getRuleAction` does not need to be exported; accessible internally. | If not reachable, a minimal export would be needed. | `logError` (which calls `getRuleAction` internally) was sufficient; no new export needed. | confirmed |

### Feedback that changes future scope

- No feedback logged.

### What we learned

- Metro's `extraNodeModules` maps package names to directories; subpath imports like `@pkg/core/AMAProvider` resolve through a different path than the root `@pkg/core` import, creating separate module instances and breaking React context sharing. Always use the root import when sharing context across packages in a Metro monorepo.
- Storing `issueHighlighted` as `Record<number, number>` (viewId → count) rather than a flat array makes count-change gating trivial and eliminates the need to scan the array on every highlight decision.

---

## Phase 8 Review — 2026-06-29

### What worked

- Per-package story decomposition (one story per package + two for cross-cutting docs) kept each unit reviewable and independently completable.
- Using the `exports` field in each `package.json` as the authoritative coverage list was the right call — it surfaced orphan pages (`isMotionAnimation`, `Carousel`, `Loading`, `useCarousel`) that a `src/index` scan would have missed.
- Missing pages (`HideChildrenFromAccessibilityTree`, `useBottomSheetGestureHandler`, `useFormSubmit`, `useDynamicList`) were identified cleanly by the coverage check against export keys.
- Stale API signatures (`trackError(id)`, `removeError`, old import paths) were corrected across all five packages.

### What didn't

- The bottom-sheet package plugin was missing from `docusaurus.config.ts` entirely, causing `/bottom-sheet/` to 404. This was outside story scope as written and only caught post-implementation.
- The main `sidebars.ts` packages list still referenced removed packages (`@react-native-ama/react-native`, `@react-native-ama/extras`) and was missing `BottomSheet` — also outside story scope.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| The `exports` field in each `package.json` is the authoritative list of what must be documented. | Would correctly scope coverage and surface orphan pages. | Confirmed — caught all orphan pages and missing entries accurately. | confirmed |
| "Methods: None" is an accurate and sufficient doc section for exports with no imperative API. | Reviewers would accept explicit "None" sections without ambiguity. | Confirmed — no pushback on any explicit "None" sections. | confirmed |

### Feedback that changes future scope

- Site wiring (docusaurus plugin registration, sidebar link lists) should be an explicit acceptance criterion in any future doc-coverage story, not treated as implicit.

### What we learned

- Orphan doc pages are a real drift risk after API refactors; diffing `docs/` files against `exports` keys takes seconds and catches them immediately.
- The Docusaurus plugin registry in `docusaurus.config.ts` is a separate concern from the doc content — both must be in scope for a docs coverage pass to be complete.

---

## Phase 9 Review — 2026-07-01

### What worked

- All 18 stories completed: site wiring audit (story 1) plus all 17 guidelines pages reformatted to the `accessibility-label.md` standard.
- Scope was clean and well-bounded — one format model, one target directory, no ambiguity about what "done" looked like.

### What didn't

- No feedback logged.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| `accessibility-label.md` is the stable format model; its content does not change during this phase. | Format target would remain fixed throughout the phase. | Not verified during review — no issues reported. | inconclusive |
| "Best Practices where applicable" is implementer judgment on a page-by-page basis. | Reasonable per-page discretion would be sufficient. | Not verified during review — no issues reported. | inconclusive |

### Feedback that changes future scope

- No feedback logged.

### What we learned

- No feedback logged.

---

## Phase 10 Review — 2026-07-01

### What worked

- One-story-per-guideline decomposition kept each change small and independently verifiable; fast-close on stories where content was already correct avoided unnecessary churn.
- Build integration (story 1) gave an immediate gate — the `onBrokenAnchors: 'throw'` config caught real regressions on every subsequent story.
- Discovering the `checks.ui` / `checks.forms` distinction during implementation led to a concrete project rule (rule 20) that will prevent wrong config notes in future docs work.

### What didn't

- Docusaurus 3.4.0 does not support per-version `onBrokenAnchors` exclusion — the assumption that 0.7.x could be excluded via config was wrong. The 0.7.x broken anchors had to be fixed directly in story 1, expanding its scope slightly.
- Existing AMA errors sections in some pages (e.g. `forms.md`, `text.md`) had inconsistent heading formats and missing severity tags, requiring light normalisation alongside the AC work.

### Assumption results

| Assumption | Predicted | Actual | Action |
|---|---|---|---|
| 0.7.x pages can be excluded from the broken-anchor check without disabling it globally | Docusaurus supports per-version config | Docusaurus 3.4.0 `VersionOptionsSchema` has no `onBrokenAnchors` field — per-version exclusion is not available | Invalidated — fixed 0.7.x anchors directly in story 1 |
| BottomSheet component page broken anchors can be resolved by updating either the outgoing link or the target anchor | Either file can be edited | Resolved by updating the outgoing links in the component page after the guideline story (6) stabilised the anchor IDs | Confirmed |
| The known broken-anchor list is representative; no large additional set surfaces | Build check surfaces a manageable set | No additional anchors beyond the known list surfaced after enabling `onBrokenAnchors: 'throw'` | Confirmed |

### Feedback that changes future scope

- No feedback logged.

### What we learned

- `checks.ui` and `checks.forms` are independent gates in `ama.config.json`; most other rules are individually overridable via `rules.*`. This distinction is now captured in project-rules.md rule 20.
- Rules in `NON_OVERRIDABLE_RULES` (e.g. `NO_KEYBOARD_TRAP`, `NO_ACCESSIBILITY_ROLE`) cannot have their severity changed via config — the "cannot be turned off" note is accurate only for those.

---

## Phase 11 Review — 2026-07-03

### What worked

- `useDynamicList` now routes `FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE`/`FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE` through `trackError`, matching the contract already used by `forms`.
- Implementation surfaced a real Rules-of-Hooks bug before it shipped: `useAMAContext` was initially read inside a `useEffect` callback instead of the hook's render body — invisible in tests because `@react-native-ama/core` is fully mocked there, but invalid against the real hook. Fixed to match `useFormField.ts`'s render-body pattern.
- `packages/lists` coverage thresholds (100% statements/functions/lines, 85% branches) held after the change with no threshold adjustments needed.

### What didn't

- `useDynamicList.checks.test.ts` was stale going in — two of its three tests mocked a `useChecks`/`logResult` API that `useDynamicList.ts` never actually called, so they were already failing on `main` before this phase. Rewritten to test the real `trackError`/`console.error` contract.
- `packages/lists/src/components/DynamicFlatList.test.tsx` has one pre-existing failing test unrelated to this phase (confirmed via `git stash` to predate it); left unfixed as out of scope.

### Assumption results

| Assumption | Predicted | Actual | Action |
|-----------|-----------|--------|--------|
| `trackError` is already accessible in `useDynamicList`'s scope without new wiring | No new plumbing needed | `packages/lists` had no existing wiring to `@react-native-ama/core`; a require/try-catch accessor mirroring `forms`'s `getTrackError` had to be added. The added wiring was straightforward and caused no implementation problems — the risk named in the brief ("additional plumbing beyond the intent of this phase") did not materialize in practice. | Invalidated (low-impact) |

### Feedback that changes future scope

- Website build surfaces broken links that need fixing — logged to backlog as a bug.

### What we learned

- A hook that reads `useAMAContext` must be called from the render body, not from inside a `useEffect` — `React.useContext` inside an effect callback violates the Rules of Hooks even though core-mocked tests won't catch it.
- The `trackError` optional-peer wiring is not shared automatically across packages; each consuming package needs its own accessor, even when another package in the monorepo already implements the same pattern.

---

## Phase 12 Review — 2026-07-03

### What worked

- All 49 TypeScript diagnostics across `core`, `forms`, `animations`, `bottom-sheet`, and `playground` traced back mostly to one shared root cause — the monorepo's base tsconfig restricted global types to `["jest", "jest-require"]`, excluding `@types/node`. One root-tsconfig fix resolved the `global`/`fs`/`path` errors across three packages at once; the remaining diagnostics were small, independent, per-file type-only fixes.
- The 0.7.x docs version was cleanly excluded from the website build via Docusaurus's `onlyIncludeVersions` (reversible, content preserved on disk), removing 32 of 50 broken-link source pages in one config change.
- The remaining 18 broken-link pages were fixed individually against verified real targets (casing mismatches, wrong path shapes, stale references to the removed `react-native-ama/react-native` package, a stale sidebar entry generating broken pagination links on every 1.x.x page).
- `yarn ts:check` and `yarn build` (website) both now exit clean (0 errors).

### What didn't

- Fixing every broken *link* surfaced a second, previously-hidden error class: 9 broken *anchors* across 5 pages. Docusaurus checks links before anchors and aborts on the first failure, so these existed the whole time but were invisible until link errors hit zero. Fixed as part of story 7 since they blocked the story's and phase's stated goal, but this was outside the story's literally-worded scope.
- Two pre-existing bugs were discovered during implementation, unrelated to any Phase 12 story (confirmed via `git stash` against the last commit): a broken `NO_ACCESSIBILITY_STATE_SET` detection in `useAMADev.ts` (dropped `[parentId]` indexing), and `forms/useFormField.test.tsx`'s suite failing to load entirely (Expo/jest transform config issue). Both logged to the backlog during implementation, not fixed in this phase.

### Assumption results

| Assumption | Predicted | Actual | Action |
|---|---|---|---|
| The website build's current errors are all broken-link related. | No unrelated build errors | Broken *anchors* were a second, hidden error class behind the broken links — invalidated once links were fixed | Invalidated — fixed as part of story 7, expanding it slightly |
| Fixing the 17 known tsconfig errors does not surface a large additional set of type errors previously masked by broken configs. | Known-count fix, no big surprise | Total was 49 (not just 17), but no large *additional* surprise beyond that — a single shared tsconfig fix explained most of the gap | Confirmed |

### Feedback that changes future scope

- No feedback logged.

### What we learned

- Docusaurus's broken-link and broken-anchor checks are sequential, not simultaneous — a clean link check does not mean a clean build; anchors must be checked separately after links are fixed.
- A cluster of TypeScript diagnostics that looks like it needs N per-package fixes is worth checking for a shared root cause (e.g. a restrictive `types` array in a shared base tsconfig) before writing N separate stories.

---

## Phase 13 Review — 2026-07-06

### What worked

- Both regressions fixed and verified: `useAMADev.test.ts`'s `NO_ACCESSIBILITY_STATE_SET` assertions pass, full `core` suite (33/33) green; `forms/useFormField.test.tsx` loads and runs, full `forms` suite (8/8) green.
- The LogBox investigation was grounded in real source inspection (native node collectors, RN's `AppContainer`, `react-native-screens`' iOS source) rather than guesswork — confirmed a real coverage risk (native-stack modal screens) before rejecting the ancestry-based exclusion, avoiding a fix that would have silently dropped accessibility checks for a large share of consumers.
- README now documents the LogBox limitation with a concrete recommended action (`LogBox.ignoreAllLogs()`), decided after weighing the tradeoff explicitly rather than defaulting to "just dismiss it."
- A pre-existing, unrelated issue was caught before it caused harm: packages had been manually bumped to `2.0.0-beta.1` outside of Changesets, which would have published under the `latest` npm dist-tag instead of `beta` had it gone out as-is. Corrected by resetting to the last real released version and re-doing the bump through Changesets' prerelease mode.

### What didn't

- Both stories' `Implementation Reference` were written from an incomplete diagnosis and turned out to be wrong once implementation dug deeper: story 1 assumed dropped `parentId` indexing (actual bug, found via `git log`/`git show`: `before !== settled` compared snapshot objects by reference instead of per-key); story 2 assumed a single `transformIgnorePatterns` gap (actual: two further issues — a stale nested `@babel/core` copy, and `forms`' jest config borrowing a newer, incompatible `react-native` version through `playground/node_modules`).
- Manual playground verification (project-rules rule 17, required for checker-flow changes) could not be performed for story 1 in this shell-only environment — flagged as a gap, not silently skipped or falsely claimed.

### Assumption results

No assumptions were logged in this phase's brief — the original LogBox assumption was resolved during `mano spec`, before implementation started, and the brief was updated to drop it.

### Feedback that changes future scope

- No feedback logged.

### What we learned

- When a bug-fix story's `Implementation Reference` reasons from an incomplete `git diff`, checking full history (`git log -- <file>` + `git show <commit>`) before implementing can reveal the actual root cause differs from what the story assumed — worth doing before writing the story, not just discovering it mid-implementation.
- A jest config that borrows a sibling app's `node_modules` (via `moduleDirectories`) can silently pull in a different, incompatible version of a shared dependency than the one the project is actually pinned to; `moduleNameMapper` can force resolution back to the pinned copy.
- Manually setting a package version to a prerelease format outside the release tool (Changesets) that's supposed to own versioning silently breaks that tool's assumptions — npm dist-tag, changelog generation, future bump numbering — until the next release attempt surfaces it.

---

## Phase 14 Review — 2026-07-08

### What worked

- The long-number check shipped and works as intended — flags unformatted long digit runs, configurable via `longNumberMinLength`, documented in the Text guideline and checklist.

### What didn't

- The focus-shift check (`MISSING_FOCUS_ON_UI_CHANGE`) was implemented, then rejected: there is no reliable way to detect current accessibility focus on either platform without VoiceOver (iOS) or TalkBack (Android) actually running. iOS's `elementFocusedNotification` and Android's `TYPE_VIEW_ACCESSIBILITY_FOCUSED` event never fire otherwise, so a sighted developer testing with the screen reader off gets no signal at all. Fully removed: native focus tracking on both platforms, the JS `itemsWithMissingFocusShift` check, the `MISSING_FOCUS_ON_UI_CHANGE` rule, and its docs. Stories 2 and 4 rejected accordingly.

### Assumption results

No Assumption Log was recorded in this phase's brief. The brief's Acknowledged Risks entry (false-positive risk on the focus-shift check) was superseded by the check's outright rejection — the risk never got the chance to materialise.

### Feedback that changes future scope

- No feedback logged.

### What we learned

- Neither iOS nor Android exposes a "what currently has accessibility focus" query independent of an active screen reader session — any future check depending on real-time focus state hits the same wall. Recorded as a platform constraint in `tech-spec.md` so it isn't rediscovered the hard way again.

---
