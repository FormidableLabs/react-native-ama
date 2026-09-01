### STORY-4: Root-level yarn test

#### What and why
A developer or CI runner trying to verify the whole repo has no single command to run all package tests — each package must be invoked separately and in the right order. After this story, running `yarn test` at the repo root runs every package's test suite in dependency order and surfaces any failure.

#### Done when
- [ ] Running `yarn test` at the repo root executes tests for `core`, `animations`, `forms`, and `lists` packages in that order.
- [ ] A test failure in any package causes the root `yarn test` command to exit with a non-zero code.
- [ ] Packages that do not have a `test` script are skipped without causing the root command to fail.
- [ ] All existing per-package tests pass when invoked via the root command.

#### Not this story
- No changes to any package's Jest config or test files.
- No new test files.
- `bottom-sheet` is not included — it has no test script.
- No CI pipeline changes.

#### Notes
The root script chains `yarn workspace @react-native-ama/core test && yarn workspace @react-native-ama/animations test && yarn workspace @react-native-ama/forms test && yarn workspace @react-native-ama/lists test`. If `lists` has no `test` script, the chain still must not fail on skip — check before finalising the command. Story 3 (internal package removal) should complete before this story is verified, since it affects whether package tests pass cleanly.

#### Implementation Reference
- **Files:** root `package.json` — add or update the `"test"` script key only
- **Contract:** chain order must be `core → animations → forms → lists`; use `yarn workspace <name> test` per package; chain with `&&` so a failure stops the run
- **Do not:** do not modify any package's `jest.config.*` or `package.json` other than the root; do not add a shared Jest root config; do not introduce a test runner tool (Turborepo, Nx, etc.)

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
