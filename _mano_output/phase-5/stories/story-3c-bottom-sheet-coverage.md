### STORY-3c: bottom-sheet coverage threshold

#### What and why
A contributor changing bottom-sheet components has no automated safety net — `packages/bottom-sheet` has no coverage threshold, so regressions in important paths go undetected. After this story, the bottom-sheet package enforces a minimum coverage floor and `yarn workspace @react-native-ama/bottom-sheet test --coverage` passes without threshold failures.

#### Done when
- [ ] Running `yarn workspace @react-native-ama/bottom-sheet test --coverage` reports current coverage numbers for statements, branches, functions, and lines
- [ ] At least one new test is added for an important path in the bottom-sheet package that is currently uncovered (identified from the coverage report's uncovered-line markers)
- [ ] `packages/bottom-sheet/package.json` has a `coverageThreshold` block in its Jest config with values at or above the actual post-test coverage, with a minimum floor of 70% for each metric
- [ ] `packages/bottom-sheet/package.json` has `collectCoverageFrom: ["src/**/*.{ts,tsx}"]` in its Jest config (add it if not present)
- [ ] `yarn workspace @react-native-ama/bottom-sheet test --coverage` passes with no threshold failures

#### Not this story
- Coverage thresholds for animations or lists (story-3a, story-3b)
- Peer dep changes (story-1), tree-shaking (story-2), dead package cleanup (story-4)
- 100% coverage — meaningful floor on important paths only

#### Notes
Set threshold values to match actual post-test coverage (not copied from core). Do not set thresholds above actual coverage. If current coverage already exceeds 70%, use the current baseline as the floor.

#### Implementation Reference
- **Build:** `yarn workspace @react-native-ama/bottom-sheet test --coverage`; inspect uncovered lines; add test(s); set threshold
- **Files:**
  - `packages/bottom-sheet/package.json` — add `collectCoverageFrom: ["src/**/*.{ts,tsx}"]` if not present; add `coverageThreshold` to `jest` config block
  - New test file co-located with the source being tested (e.g. `packages/bottom-sheet/src/hooks/useKeyboard.test.ts` if that path is uncovered)
- **Threshold format:**
  ```json
  "coverageThreshold": {
    "global": { "statements": 70, "branches": 70, "functions": 70, "lines": 70 }
  }
  ```
  Replace 70 values with actual post-test numbers — these are the minimum floor, not the target values
- **Do not:** do not set thresholds above actual coverage; do not mock the hook under test in its own test file; do not add tests for `src/internals/` if they are already indirectly covered

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
