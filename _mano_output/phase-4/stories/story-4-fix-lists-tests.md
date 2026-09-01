### STORY-4: Fix lists package tests

#### What and why
The `@react-native-ama/lists` package has no Jest config and may have failing or non-runnable tests. After this story, any existing tests in `lists` pass and the package has a working `yarn test` script.

#### Done when
- [ ] `yarn workspace @react-native-ama/lists test` completes with no failures.
- [ ] If no tests exist in the package, this story is complete once confirmed — no tests to fix means no failures to resolve.
- [ ] No test is skipped or commented out to achieve a pass.

#### Not this story
- No new test coverage added (beyond fixing existing failures).
- No coverage config changes (covered in story 5).
- No changes to other packages.

#### Notes
`lists` currently has no `jest` config block and no `test` script in `package.json`. If the package has no test files at all, verify this explicitly and mark done. If test files exist but no runner is configured, adding a minimal Jest config is in scope for this story. `lists` accepts Expo as an optional peer — if a Jest preset is needed, prefer `jest-expo` to match `forms`, since lists depends on Expo.

#### Implementation Reference
- **Files:** `packages/lists/src/**/*.test.{ts,tsx}` — fix failing tests; `packages/lists/package.json` — add `test` script and minimal Jest config if missing
- **Commands:**
  ```bash
  yarn workspace @react-native-ama/lists test
  ```
- **Rules:** if adding a Jest config and the package uses Expo APIs, use `jest-expo` preset to match `forms`; otherwise use `react-native` preset; mock pattern follows project-rules §16b
- **Do not:** do not add new test files; do not add coverage config here (story 5 owns that)

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
