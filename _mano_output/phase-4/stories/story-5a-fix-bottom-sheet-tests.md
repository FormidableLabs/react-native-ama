### STORY-5a: Fix bottom-sheet package tests

#### What and why
The `@react-native-ama/bottom-sheet` package has two test files but no jest configuration, so running tests there fails before any assertion executes. Adding the same jest infrastructure pattern established in stories 1–4 lets the existing tests run and pass, completing the phase goal of fixing all active package tests.

#### Done when
- [ ] Running `yarn workspace @react-native-ama/bottom-sheet test` exits with code 0 and all tests pass.
- [ ] `BottomSheet.test.tsx` and `useBottomSheetGestureHandler.test.ts` both run and report their results (no skipped or errored suites).
- [ ] The root `yarn test` script includes the bottom-sheet workspace so its results appear in the root coverage run.

#### Not this story
- No new tests are added — only the infrastructure to run the existing ones.
- Coverage thresholds are not enforced; reporting only (consistent with story 5).
- No source changes to `BottomSheet.tsx`, `useBottomSheetGestureHandler.ts`, or `useKeyboard.ts`.

#### Notes
Depends on: story-5 (coverage reporting pattern established).

The package currently has no `test` script in `packages/bottom-sheet/package.json` and no `jest` config block, no `jest.setup.js`, and no `babel.config.js`. The same infrastructure pattern used for `forms`, `animations`, and `lists` applies here:
- `react-native` preset (not `jest-expo`)
- `moduleDirectories` pointing to `../../playground/node_modules`
- `moduleNameMapper` for `@react-native-ama/core` → `jest-mocks/ama-core.js`, and for `ReactNativeAmaView`
- A `jest.setup.js` with the full react-native mock and RNTL configure call
- A `babel.config.js` with TypeScript/React presets

The `bottom-sheet` package peer-depends on `react-native-gesture-handler` and `react-native-reanimated`. The existing tests may mock or import from those; check the test files and add stubs to `jest.setup.js` or `moduleNameMapper` as needed.

#### Implementation Reference
- **Files:** `packages/bottom-sheet/package.json` — add `test` script and `jest` config block; `packages/bottom-sheet/jest.setup.js` — create; `packages/bottom-sheet/babel.config.js` — create
- **Build:** mirror the jest config structure from `packages/lists/package.json` exactly — preset `react-native`, `setupFilesAfterEnv`, `moduleDirectories: ["node_modules", "../../playground/node_modules"]`, `transform` with babel-jest, `moduleNameMapper`
- **Files:** `package.json` (root) — extend the `test` script to include `(yarn workspace @react-native-ama/bottom-sheet test --coverage || true)` alongside the existing four workspaces
- **Do not:** do not add or rewrite test assertions; do not change source files; do not enforce coverage thresholds

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
