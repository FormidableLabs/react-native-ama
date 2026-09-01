# Phase 5 Brief

## Why this phase

The active packages are ready for a beta release but are not yet independently installable, bundle more than consumers need, and contain stale references to removed packages. This phase makes each package self-contained, tree-shakeable, and clean of dead references before the stable cut.

## Phase goal

Each active package is independently installable with safe-default behaviour when siblings are absent, imports are tree-shakeable so consumers only bundle what they use, coverage thresholds reflect tested important paths, and stale references to removed packages are gone from source and documentation.

## Phase scope

- Move sibling package dependencies (`@react-native-ama/core` and any others) to `peerDependencies` with `optional: true` across all active packages; components fall back to safe defaults (e.g. `isReduceMotionEnabled: false`, AMA checks skipped silently) when the peer is absent.
- Restructure package exports so importing a single component or hook does not pull in unrelated code from the same package; add `"sideEffects": false` where appropriate.
- Audit coverage per package against existing thresholds, add tests for important uncovered paths, and raise thresholds to match the improved baseline. Packages without a threshold get a minimum floor of 70%, raised further if current coverage already exceeds it.
- Remove all references to `@react-native-ama/react-native` and `@react-native-ama/internal` from package source, config files, and documentation; new API documentation for current packages stays deferred.

## Exit criteria

1. Independent install
   - Installing any single active package without its sibling peers: no install error, no runtime throw
   - A component from that package renders with safe defaults when `@react-native-ama/core` is not present

2. Tree-shaking
   - Importing a single named export (e.g. `Form` from `@react-native-ama/forms`): only that module's code appears in a production bundle, not the full package barrel

3. Coverage
   - `yarn test:coverage` passes with no threshold failures across all active packages
   - Important paths identified during audit have test coverage

4. Dead package cleanup
   - No reference to `@react-native-ama/react-native` or `@react-native-ama/internal` remains in any active package's source, config, or documentation files

## Assumption log

| Assumption | Risk |
|-----------|------|
| Components that currently call `useAMAContext` or sibling hooks can be made to fall back to safe defaults without changing their public API. | If a component's output type depends on context being present, safe defaults may change observable behaviour in ways consumers don't expect. |
| The current barrel `index.ts` structure is the primary tree-shaking blocker; the build output supports named entry points. | If the bundler config or tsconfig doesn't support granular outputs, restructuring exports alone may not be sufficient. |
| Existing coverage thresholds in `core` and `forms` are the baseline; packages without a threshold get a minimum floor of 70%, raised further if current coverage already exceeds it. | If important paths are deeply untested in packages currently below 70%, the threshold may require significant new test work to meet. |

## Acknowledged risks

- Marking sibling deps `optional` changes the install contract for existing consumers who rely on transitive resolution of `core` — they will need to add it explicitly.
- Tree-shaking changes may require build config updates that affect how packages are consumed in non-bundled environments (e.g. bare Node requires).
