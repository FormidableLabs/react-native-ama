---
'@react-native-ama/core': patch
---

fix: packaging bugs breaking real external installs (all pre-date this fix, invisible in the monorepo since the source files are always present on disk there regardless of npm's `files` allowlist):

- **Critical**: the native module didn't work at all for any external consumer — `ios/`, `android/`, and `expo-module.config.json` were never listed in `package.json`'s `files` array, so no native source and no Expo autolinking manifest were ever published. Consumers hit `Error: Cannot find native module 'ReactNativeAma'` at runtime, since there was nothing for Expo's autolinking to discover or compile in. Added all three to `files` (excluding local `android/build` Gradle artifacts via a `!android/build` negation).
- **Critical**: once the native module could be found, calling `AMAProvider`/`start()` crashed the app on iOS with a JSI assertion failure (`Assertion failed: (runtime.isArray(*this))`). iOS's `Function("start")` declared its parameter as `[Any]` (array), but JS calls `start({...})` with a single object — Android's equivalent already correctly declared `Map<String, Any?>?`. Fixed iOS to declare `[String: Any]?`, matching both Android and the rest of iOS's own functions (e.g. `highlight`'s explicit typed params).
- Metro bundling failed with `Unable to resolve "./../../ama.config.json"` for any consumer, since `ama.config.json` (the package's own bundled default config, required directly from `src/internals/config.ts`) was never listed in `files` either.
- Editor autocomplete for imports from `@react-native-ama/core` didn't work in consuming projects, since the package relied entirely on the conditional `exports` map for type resolution with no top-level `types` field as a fallback — editors/tsconfigs that don't fully resolve conditional exports types couldn't find any type info at all. Added a top-level `"types": "./dist/index.d.ts"`.
