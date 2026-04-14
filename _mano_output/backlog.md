# Backlog

### Missing alt text check for accessible images
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Add a runtime rule that flags images missing alt text when the image is accessible (not `accessible={false}`).
  Native iOS (Swift) and Android (Kotlin) must include accessible image nodes in the payload sent to JS checks.
  Include JS-side rule integration and tests validating native->JS detection behavior.
  Add playground/Images.screen.tsx and wire it into playground navigation for manual end-to-end verification.
- **Status:** in-phase-1

### Remove @react-native-ama/internal and inline required code
- **Type:** tech-debt
- **Source:** User idea
- **Context:**
  Remove the internal package and move required code to owning packages.
  Update imports/dependency graph so active packages do not depend on `@react-native-ama/internal`.
  Delete package and references once migration is complete.
- **Status:** backlog

### Review package documentation coverage and accuracy
- **Type:** refinement
- **Source:** User idea
- **Context:**
  Review docs for each active package and verify examples, API names, and behavior match v2 direction.
  Fix stale package names and references related to deferred/removed packages.
  Ensure migration notes are clear for consumers.
- **Status:** backlog

### Root-level test execution reliability
- **Type:** test
- **Source:** User idea
- **Context:**
  Ensure all package tests can be executed from repository root with consistent commands.
  Fix workspace-level test orchestration, script wiring, and failing test assumptions.
  Confirm CI-friendly behavior.
- **Status:** backlog

### Bump all active packages to 2.0.0
- **Type:** tech-debt
- **Source:** User idea
- **Context:**
  Align versions for all active packages to 2.0.0.
  Update peer dependency ranges and inter-package references to the 2.0 line.
  Keep deferred-for-deletion package out of active migration targets.
- **Status:** backlog
