### STORY-1: Fix core package tests

#### What and why
The `@react-native-ama/core` package has failing tests that block the root `yarn test` chain from completing. After this story, all tests in `core` pass and the package can be included in the root chain without errors.

#### Done when
- [ ] `yarn workspace @react-native-ama/core test` completes with no failures.
- [ ] No test is skipped or commented out to achieve a pass — every existing test either passes or is replaced with a corrected version that covers the same behaviour.

#### Not this story
- No new tests added beyond what is needed to fix existing failures.
- No changes to other packages.
- No coverage config changes (covered in story 5).

#### Notes
The failures are pre-existing and unrelated to Phase 3 changes. Run the suite first, read the output, then fix. If a failure reveals a genuine source bug, fix the source — do not adjust the test to pass around a real defect.

#### Implementation Reference
- **Files:** `packages/core/src/**/*.test.{ts,tsx}` — fix failing tests here; fix source files where a test exposes a real bug
- **Commands:**
  ```bash
  yarn workspace @react-native-ama/core test
  ```
- **Rules:** mock `react-native` at module level using a named factory function (see project-rules §16b); test structure follows success → edge → failure pattern (§16a)
- **Do not:** do not delete or skip failing tests to achieve a green run; do not add new test coverage beyond what is needed to fix failures

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
