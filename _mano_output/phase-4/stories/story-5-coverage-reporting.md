### STORY-5: Coverage reporting — per-package and root

#### What and why
There is currently no way to see which parts of the codebase are untested in a single command. After this story, running `yarn test --coverage` at the repo root produces a consolidated coverage report, and running `yarn test --coverage` in any individual package produces a report scoped to that package.

#### Done when
- [ ] `yarn workspace @react-native-ama/core test --coverage` produces a coverage report for `core`.
- [ ] `yarn workspace @react-native-ama/forms test --coverage` produces a coverage report for `forms`.
- [ ] Any other package with a `test` script and test files also produces a coverage report when run with `--coverage`.
- [ ] Running `yarn test --coverage` at repo root produces coverage output covering all packages in the chain.
- [ ] Coverage thresholds are present in `core` and `forms` Jest configs (already exist — verify they are not accidentally removed).

#### Not this story
- No coverage enforcement in CI — reporting only.
- No new tests written.
- No coverage threshold changes.

#### Notes
Depends on stories 1–4 being complete first — coverage numbers are meaningless against a failing suite. `core` and `forms` already have `collectCoverageFrom` and `coverageThreshold` in their Jest configs; verify these are intact. `animations` and `lists` need `collectCoverageFrom` added if they gain a Jest config in stories 3–4. The root `yarn test` script passes `--coverage` down to each workspace command.

#### Implementation Reference
- **Files:** `packages/core/package.json`, `packages/forms/package.json` — verify `collectCoverageFrom` is present; `packages/animations/package.json`, `packages/lists/package.json` — add `collectCoverageFrom: ["src/**/*.{ts,tsx}"]` if a Jest config was added in stories 3–4; root `package.json` — update `test` script to pass `--coverage` flag
- **Contract:** `collectCoverageFrom` must target `src/**/*.{ts,tsx}` per project-rules §16c; threshold targets are `{ statements: 90, branches: 82, functions: 83, lines: 91 }` — apply to any package that gains a Jest config
- **Do not:** do not add coverage thresholds to `animations` or `lists` unless they have enough tests to meet them — add `collectCoverageFrom` only, and leave thresholds for a follow-up once coverage is visible

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
