# Backlog

### Missing alt text check for accessible images
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Add a runtime rule that flags images missing alt text when the image is accessible (not `accessible={false}`).
  Native iOS (Swift) and Android (Kotlin) must include accessible image nodes in the payload sent to JS checks.
  Include JS-side rule integration and tests validating native->JS detection behavior.
  Add playground/Images.screen.tsx and wire it into playground navigation for manual end-to-end verification.
- **Status:** resolved

### Remove @react-native-ama/internal and inline required code
- **Type:** tech-debt
- **Source:** User idea
- **Context:**
  Remove the internal package and move required code to owning packages.
  Update imports/dependency graph so active packages do not depend on `@react-native-ama/internal`.
  Delete package and references once migration is complete.
- **Status:** resolved

### Review package documentation coverage and accuracy
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Review docs for each active package and verify examples, API names, and behavior match v2 direction.
  Fix stale package names and references related to deferred/removed packages.
  Ensure migration notes are clear for consumers.
  The documentation sits inside a docusaurus website (./website), but the package documentation
  live inside each package folder, i.e: packages/core/docs.
  For each package we need to ensure that the doc for each exported component and hook exists.
  Each component/hook page must have:
    - Usage with code example
    - Dev mode only! banner (if applicable)
    - list of properties
    - list of methods
- **Status:** resolved

### Website guidelines format alignment
- **Type:** refinement
- **Source:** Phase 8 deferral
- **Context:**
  Review and update every page under `website/guidelines/` to match the format modeled by `accessibility-label.md`.
  Each page must have: beginner-friendly language, an Expectations section (per Assistive Technology), and Best Practices where applicable.
  Verify docusaurus site wiring (plugin registration, sidebar entries) so all pages are reachable.
- **Status:** resolved


### Root-level test execution reliability
- **Type:** test
- **Source:** User idea
- **Context:**
  Ensure all package tests can be executed from repository root with consistent commands.
  Fix workspace-level test orchestration, script wiring, and failing test assumptions.
  Confirm CI-friendly behavior.
- **Status:** resolved

### Bump all active packages to 2.0.0-beta.1
- **Type:** tech-debt
- **Source:** User idea
- **Context:**
  Align versions for all active packages to 2.0.0-beta.1, including bottom-sheet.
  Update peer dependency ranges and inter-package references to the ~2.0.0 line.
  Keep react-native-delete-me out of the bump.
- **Status:** resolved


### Check contrast should check if AAA check is turned off
- **Type:** defect
- **Source:** User idea
- **Context:**
  At the moment [checkContrast.ts](../packages/core/src/internals/checks/checkContrast.ts) does not check if it should perform an AA or AAA contrast check. I've disabled on the short term if (!passesAAA && false)
- **Status:** resolved

### Review and update the structure of ama.config.json file
- **Type:** tech-debt
- **Source:** User idea
- **Context:**
  Introduce organised sections (e.g. `ui`) for new v2.0 keys in the default ama.config.json. Existing flat keys remain unchanged for backwards compatibility. Specific keys to organise defined via mano spec.
- **Status:** resolved


### Check if rules can be disabled
- **Type:** defect
- **Source:** User idea
- **Context:**
  Check if any of the rule specified in the ama config files can be turned off or changed
- **Status:** resolved

### Contrast misclassification inside Popup
- **Type:** defect
- **Source:** User idea
- **Context:**
  Check why contrast information inside the Popup is highlighted as failing a11y check in the playground.
  Determine whether this is a genuine rule failure or a misclassification; fix if misclassification.
- **Status:** resolved

### iOS form check misclassifies focusable labels
- **Type:** defect
- **Source:** Phase 1 review
- **Context:**
  On iOS, a field with `aria-label` should trigger a lookup for a visible, accessible `Text` node whose text matches the label (minus trailing `:`). If found, the finding is `Label is focusable`. Instead, iOS reports missing-label — likely because `Text` node text content or accessibility state is absent from the native payload.
  Android handles this correctly. Fix should align iOS behaviour to match.
- **Status:** resolved

### Android - TextInput return type not detected/handled
- **Type:** defect
- **Source:** User idea
- **Context:**
  On Android the check fails to report missing "returnType" for TextInput fields.
  Fix is expected in the Kotlin node collector — JS-side checkTextInputs already handles the value once present.
- **Status:** resolved

### Package tests failing
- **Type:** bug
- **Source:** Phase 3 review
- **Context:**
  Tests in individual packages are failing. Cause is unrelated to the root `yarn test` wiring added in Phase 3.
  Investigate and fix failing tests across packages before next release.
- **Status:** resolved

### Coverage reporting — root and per-package
- **Type:** refinement
- **Source:** Phase 3 review
- **Context:**
  Add coverage reporting at both root level and per-package level so untested areas are visible.
  Should work alongside the root `yarn test` chain introduced in Phase 3.
- **Status:** resolved

### Package no dependency
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Make sure that each of the packages can be installed as they are with no dependencies to core or any other one.
  Move sibling deps to `peerDependencies` with `optional: true`; components fall back to safe defaults when the peer is absent.
- **Status:** resolved

### Export: allow tree-shaking
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Allow tree-shaking by removing a global index.ts export.
  Importing a single named export should not pull in unrelated code from the same package. Add `"sideEffects": false` where appropriate.
- **Status:** resolved

### Test coverage: Make sure the minimum is hit
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Make sure the minimum is hit, plus all the important path are covered. We don't need 100% coverage, but cover important parts of the code.
  Packages without a threshold get a minimum floor of 70%, raised further if current coverage already exceeds it.
- **Status:** resolved

### react-native-ama/react-native — remove stale references
- **Type:** refinement
- **Source:** User idea
- **Context:**
  This package has been removed; remove all references to it from active package source, config files, and documentation.
  New API documentation for replacement packages stays deferred.
- **Status:** resolved

### react-native-ama/react-native — update documentation
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Extends the Phase 5 stale-reference removal. Write new documentation covering what replaced this package and how consumers should migrate.
  Also fix stale references in `website/docs/ama/getting-started.md` and `website/docs/ama/config-file.md`.
- **Status:** resolved

### react-native-ama/internal — remove stale references
- **Type:** refinement
- **Source:** User idea
- **Context:**
  This package has been removed; remove all references to it from active package source, config files, and documentation.
  New API documentation for replacement packages stays deferred.
- **Status:** resolved

### react-native-ama/internal — update documentation
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Extends the Phase 5 stale-reference removal. Write new documentation covering what replaced this package and how consumers should migrate.
- **Status:** resolved

### Playground: Add @react-native-ama/lists
- **Type:** refinement
- **Source:** User idea
- **Context:**
  This package & its demo is missing from the playground app.
  Demo: DynamicFlatList with a search field filtering a dummy food-items list in real time; screen reader announces item count changes via AMA components.
- **Status:** resolved

### Playground: Complete @react-native-ama/core
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Complete the core screen (UseAMAContext.screen.tsx): add isHighTextContrastEnabled and isDarkerSystemColorsEnabled to the existing 6 is* values.
  Add explanatory text that AMA checks can be toggled on/off via the dev menu under "Toggle React Native AMA".
- **Status:** resolved

### Playground: Remove stale screens and components
- **Type:** tech-debt
- **Source:** User idea
- **Context:**
  The playground contains screens and components from the previous version of AMA that are no longer referenced.
  Audit all screens and components; remove anything unreferenced or tied to the old AMA API.
  Audit navigation config to ensure no dangling route registrations remain after removal.
- **Status:** resolved

### Restore checkFocusTrap in focusNextFormField
- **Type:** bug
- **Source:** Phase 6 review
- **Context:**
  `focusNextFormField` had a `checkFocusTrap` call that was deleted during the AMA 2.0 refactor. This check is JS-side only (cannot be moved to native) and must be restored and adapted to work without `useChecks` (which no longer exists) and without the `track`/`untrack` context methods that the old AMA context exported. A new mechanism is needed to surface JS-side errors through the same error-reporting pipeline.
- **Status:** resolved

### Guidelines: Clean up
- **Type:** feature
- **Context:**
  Make sure that each guideline has no stale React Native AMA info inside (Related AMA components & hooks).
  Also, we need to add errors that AMA can capture for each relevant guideline, i.e: AccessibilityLabel -> NO_ACCESSIBILITY_LABEL, NO_UPPERCASE_ACCESSIBILITY_LABEL.
  Check that all references in Related AMA hooks point to the correct page
- **Status:** resolved

### Docusaurus
- **Type:** feature
- **Context:**
  Check that docusaurus has no 404 links (can this be automated via script?)
- **Status:** resolved

### Dynamic List
- **Type:** feature
- **Context:**
  I just noticed that useDynamicList uses console.error to flag:
   - FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE
   - FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE
  it should use the newly exposed trackError like done by useFormField.ts file and checkFocusTrap
- **Status:** resolved

### Playground: Restore yellow box
- **Type:** feature
- **Context:**
  Can we make AMA avoid triggering errors/warning for the RN yellow box (as is not accessible?)
- **Status:** resolved

### Fix all linting errors
- **Type:** tech-debt
- **Context:**
  VSCode shows 17 typescript config errors (tsconfig.json files failing). We need to fix all of them
- **Status:** resolved

## Items

### Website build has broken links
- **Type:** bug
- **Source:** Phase 11 review
- **Context:**
  Building the website surfaces broken links that need to be fixed.
- **Status:** resolved

### NO_ACCESSIBILITY_STATE_SET detection broken in checkResultUiInteraction
- **Type:** bug
- **Source:** Phase 12 implementation
- **Context:**
  An uncommitted change to useAMADev.ts's itemsWithNoStateUpdated dropped [parentId] indexing (now reads before[key] instead of before[parentId][key]), breaking NO_ACCESSIBILITY_STATE_SET detection. Confirmed via git stash: the useAMADev.test.ts assertion for this rule fails with the change present and passes without it. Pre-existing, not caused by any Phase 12 story.
- **Status:** resolved

### forms useFormField.test.tsx suite fails to load
- **Type:** bug
- **Source:** Phase 12 implementation
- **Context:**
  The whole suite fails with SyntaxError: Unexpected token 'export' from an Expo native module (getBundleUrl.native.ts), a jest/transform config issue, not a code or type error. Confirmed pre-existing via git stash against the last commit -- same failure with no local changes present.
- **Status:** resolved

### Long numeric string accessibility check
- **Type:** feature
- **Source:** User idea
- **Context:**
  A text field containing a long, non-phone-number digit string (e.g. a card or account number) gets read by screen readers as one large number instead of digit-by-digit. Known workaround: an aria-label with spaces between digits. Detect this in AMA and flag it; make the digit-count threshold that triggers the check configurable.
- **Status:** resolved

### Detect UI change and missing focus shift after Pressable interaction
- **Type:** feature
- **Source:** User idea
- **Context:**
  When a Pressable interaction reveals or changes UI (e.g. an accordion opening a container), focus should move into the newly-shown content per accessibility best practice. Detect whether a press caused a UI change and whether focus correctly moved into new content. Provide a config flag to disable the check if it produces too many false positives.
- **Status:** resolved

### Document long-number check in guidelines and checklist
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Once the long numeric string check (Phase 14) ships, add a guideline entry and a checklist entry covering long/unformatted digit strings: the problem, the configurable threshold, and how to fix it (e.g. spaced aria-label). Depends on Phase 14 landing and the check's exact rule name/behavior.
- **Status:** resolved

### Reduced motion: support Reanimated layout animation presets
- **Type:** feature
- **Source:** GitHub issue #139
- **Context:**
  Issue #139 asks whether to adopt Reanimated v3.5+'s native reduceMotion API (ReduceMotion.System/Always/Never on withTiming/withSpring, plus .reduceMotion() on layout-animation presets like FadeIn/BounceIn).
  AMA's animations package already has finer-grained handling via its own motion-vs-non-motion property classification (isMotionAnimation) - keep that, it's more accessibility-correct than Reanimated's all-or-nothing option.
  Real gap: AMA doesn't wrap Reanimated's layout-animation presets at all today, so consumers using them directly get zero reduced-motion handling.
  Recommended: keep AMA's own classification as the decision-maker, but delegate the actual skip-to-end mechanics to Reanimated's native reduceMotion config instead of manually zeroing duration; add support for layout-animation presets specifically.
- **Status:** backlog
