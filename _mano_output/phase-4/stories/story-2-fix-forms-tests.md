### STORY-2: Fix forms package tests

#### What and why
The `@react-native-ama/forms` package has failing tests that block the root `yarn test` chain. After this story, all tests in `forms` pass and the package contributes a clean result to the root chain.

#### Done when
- [ ] `yarn workspace @react-native-ama/forms test` completes with no failures.
- [ ] No test is skipped or commented out to achieve a pass — every existing test either passes or is replaced with a corrected version that covers the same behaviour.

#### Not this story
- No new tests added beyond what is needed to fix existing failures.
- No changes to other packages.
- No coverage config changes (covered in story 5).

#### Notes
`forms` uses the `jest-expo` preset and `babel-jest` transform (already configured in `package.json`). If failures relate to transform or preset mismatches, check the Jest config before touching test logic. If a failure reveals a genuine source bug, fix the source — do not adjust the test to pass around a real defect.

#### Implementation Reference
- **Files:** `packages/forms/src/**/*.test.{ts,tsx}` — fix failing tests here; fix source files where a test exposes a real bug
- **Commands:**
  ```bash
  yarn workspace @react-native-ama/forms test
  ```
- **Rules:** mock `react-native` and external modules at module level using a named factory function (project-rules §16b); test structure follows success → edge → failure pattern (§16a)
- **Do not:** do not delete or skip failing tests to achieve a green run; do not change the Jest preset or transform config unless that is the confirmed root cause of a failure

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
