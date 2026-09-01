### STORY-3: core coverage threshold

#### What and why
`packages/core` already has a coverage threshold (90% statements, 82% branches, 83% functions, 91% lines) but it is unknown whether the threshold currently passes without failures. After this story, `yarn workspace @react-native-ama/core test --coverage` passes cleanly with the existing thresholds, and any important uncovered paths that cause failures have new tests covering them.

#### Done when
- [ ] Running `yarn workspace @react-native-ama/core test --coverage` passes with no threshold failures
- [ ] If any threshold was failing before this story, at least one new test is added for each path that caused the failure (identified from the coverage report's uncovered-line markers)

#### Not this story
- Coverage thresholds for animations, lists, or bottom-sheet (story-3a, story-3b, story-3c)
- Changing the existing threshold values in core — they stay at 90/82/83/91 unless the new tests push coverage above them, in which case raise to match actual
- Peer dep changes (story-1), tree-shaking (story-2), dead package cleanup (story-4)

#### Notes
`packages/core/package.json` already has `coverageThreshold` and `collectCoverageFrom: ["src/**/*.{ts,tsx}"]` — do not change them unless raising to match improved coverage.

#### Implementation Reference
- **Build:** `yarn workspace @react-native-ama/core test --coverage`; if threshold failures appear, inspect uncovered lines and add tests; re-run until passing
- **Files:**
  - `packages/core/package.json` — existing thresholds: `{ statements: 90, branches: 82, functions: 83, lines: 91 }`; raise values only if new tests push coverage above current floor
  - New test files co-located with the source being tested (e.g. `packages/core/src/internals/checks/checkFoo.test.ts`)
- **Do not:** do not lower the existing thresholds; do not mock the module under test in its own test file; do not add tests for `src/__mocks__/`

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
