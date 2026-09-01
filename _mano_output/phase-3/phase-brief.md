# Phase 3 Brief

## Why this phase
Phase 2 closed the iOS rule-engine gaps. Phase 3 completes the cross-platform parity gap on Android form checks, restructures the config for clarity, removes the internal package that blocks v2.0.0, and makes the test suite runnable from root — all prerequisite work before a release.

## Phase goal
Bring the Android form-check pipeline to parity with iOS, clean up the config structure and internal package debt, and make all package tests runnable from repo root with a single `yarn test`.

## Phase scope
- Fix the Android Kotlin node collector so TextInput nodes include the `returnType` field in the `onAmaNodes` payload, matching the iOS contract.
- Introduce organised sections (e.g. `ui`) for new v2.0 keys in the default `ama.config.json`. Existing flat keys remain unchanged and continue to work — no migration required for consumers on existing configs. Specific keys to organise are defined in `mano spec`.
- Remove `@react-native-ama/internal`: migrate all code it owns into the consuming packages, update every import, and delete the package entirely.
- Wire a root-level `yarn test` script that runs each sub-package's own `yarn test` in the correct dependency order.

## Exit criteria

1. Android TextInput return type
   - A TextInput that is not the last field in a form and has no explicit `returnType` set: AMA reports `INPUT_INVALID_RETURN_KEY` on Android.
   - The same scenario on iOS continues to behave as before.
   - `returnType` is present in the Android `onAmaNodes` payload for TextInput nodes.

2. ama.config.json structure
   - New v2.0 keys are grouped under named sections in the default config.
   - All existing flat keys continue to be read and honoured at runtime without changes to consumer config files.

3. Remove @react-native-ama/internal
   - No package in the active graph imports from `@react-native-ama/internal`.
   - The `packages/internal` folder and its `package.json` are deleted.
   - Root `package.json` workspace list no longer references the internal package.
   - Build completes without the internal package in the chain.

4. Root-level yarn test
   - `yarn test` at repo root runs each sub-package's own `yarn test` in dependency order.
   - All existing tests pass.
   - Adding a new package test does not require changes to the root script — each package's own `yarn test` is the extension point.

## Assumption log
- Android `returnType` gap is in the Kotlin node collector, not in the JS-side `checkTextInputs`; the JS logic already handles the value once it arrives.
- `ama.config.json` restructure applies only to new v2.0 keys; existing flat keys are preserved as-is. No runtime config-reading code changes are needed for existing keys.
- All code currently in `@react-native-ama/internal` is consumed by exactly the packages in the active graph; no external consumers depend on it directly.

## Acknowledged risks
- Removing `@react-native-ama/internal` may reveal hidden cross-package dependencies not visible in `package.json` (e.g. type re-exports, barrel imports) — a full build verify is required after deletion.
- Root `yarn test` ordering must respect the package build graph or tests that depend on compiled output from peer packages will fail.
