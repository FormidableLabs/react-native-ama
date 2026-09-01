# Phase 4 Brief

## Why this phase
The codebase has a working root test chain but individual package tests are failing, and there is no coverage visibility. This phase fixes the test suite, adds coverage reporting, and bumps all active packages to 2.0.0-beta.1 — making the release testable before a stable cut.

## Phase goal
Fix all failing package tests, add root and per-package coverage reporting, and align all active packages to version 2.0.0-beta.1.

## Phase scope
- Investigate and fix all failing tests across active packages (`core`, `animations`, `forms`, `lists`, `bottom-sheet`).
- Add Jest coverage reporting at both per-package and root level, integrated with the existing `yarn test` chain.
- Bump all active packages to `2.0.0-beta.1`, including `bottom-sheet`. Update inter-package peer dependency ranges to accept the `~2.0.0` line. `react-native-delete-me` is excluded.

## Exit criteria

1. Test suite
   - `yarn test` at repo root completes with all tests passing and no failures.

2. Coverage
   - Running `yarn test` at root produces a coverage report covering all active packages.
   - Per-package `yarn test` also produces a coverage report for that package.

3. Version bump
   - All active packages (`core`, `animations`, `forms`, `lists`, `bottom-sheet`) are at `2.0.0-beta.1`.
   - Inter-package peer dependency ranges reference `~2.0.0`.
   - `react-native-delete-me` version is unchanged.

## Assumption log
- Failing tests are pre-existing failures, not regressions introduced by Phase 3 changes — fixes belong to the test files or source, not to the root orchestration wiring.
- `bottom-sheet` is included in the beta bump even though it was previously at `2.0.0`; it will revert to a pre-release label for consistency with the rest of the package set.

## Acknowledged risks
- Fixing failing tests may surface additional failures that were previously masked — full suite may grow before it shrinks.
- Coverage thresholds are not enforced this phase; reporting only. Enforcement is a separate decision.
- Downgrading `bottom-sheet` from `2.0.0` to `2.0.0-beta.1` is a semver regression in the published tag — consumers pinning `^2.0.0` will not pick it up automatically, but consumers already on `2.0.0` will need to explicitly opt into the beta.
