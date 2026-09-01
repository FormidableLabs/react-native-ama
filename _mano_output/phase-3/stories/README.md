# Stories — react-native-ama — Phase 3

| # | Story | Description | File | Status |
|---|-------|-------------|------|--------|
| 1 | Android TextInput return type | Add `returnType` field to Android Kotlin node collector so `INPUT_INVALID_RETURN_KEY` fires on Android | story-1-android-return-type.md | done |
| 2 | Config structure v2.0 | Restructure `ama.config.json`: `highlight` becomes a nested object; `checks` scoped to feature gates and delay | story-2-config-restructure.md | done |
| 3 | Remove @react-native-ama/internal | Inline all symbols into consuming packages; remove the dependency from all active `package.json` files | story-3-remove-internal-package.md | done |
| 4 | Root-level yarn test | Add root `yarn test` script that chains per-package test suites in dependency order | story-4-root-yarn-test.md | done |
