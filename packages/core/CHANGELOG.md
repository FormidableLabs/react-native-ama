# @react-native-ama/core

## 2.0.0-beta.2

### Patch Changes

- fix: packaging bugs breaking real external installs (all pre-date this fix, invisible in the monorepo since the source files are always present on disk there regardless of npm's `files` allowlist): ([#339](https://github.com/FormidableLabs/react-native-ama/pull/339))

  - **Critical**: the native module didn't work at all for any external consumer — `ios/`, `android/`, and `expo-module.config.json` were never listed in `package.json`'s `files` array, so no native source and no Expo autolinking manifest were ever published. Consumers hit `Error: Cannot find native module 'ReactNativeAma'` at runtime, since there was nothing for Expo's autolinking to discover or compile in. Added all three to `files` (excluding local `android/build` Gradle artifacts via a `!android/build` negation).
  - **Critical**: once the native module could be found, calling `AMAProvider`/`start()` crashed the app on iOS with a JSI assertion failure (`Assertion failed: (runtime.isArray(*this))`). iOS's `Function("start")` declared its parameter as `[Any]` (array), but JS calls `start({...})` with a single object — Android's equivalent already correctly declared `Map<String, Any?>?`. Fixed iOS to declare `[String: Any]?`, matching both Android and the rest of iOS's own functions (e.g. `highlight`'s explicit typed params).
  - Metro bundling failed with `Unable to resolve "./../../ama.config.json"` for any consumer, since `ama.config.json` (the package's own bundled default config, required directly from `src/internals/config.ts`) was never listed in `files` either.
  - Editor autocomplete for imports from `@react-native-ama/core` didn't work in consuming projects, since the package relied entirely on the conditional `exports` map for type resolution with no top-level `types` field as a fallback — editors/tsconfigs that don't fully resolve conditional exports types couldn't find any type info at all. Added a top-level `"types": "./dist/index.d.ts"`.

## 2.0.0-beta.1

### Patch Changes

- fix: postinstall script crashed on every external install with `Cannot find module './../dist/scripts/create-config.js'`. `create-config.ts` lived outside `src/`, so `tsconfig.build.json` (which only compiles `src/**/*`) never built it into `dist/scripts/create-config.js`. Moved the script into `src/scripts/` so it's included in the normal build. Only reproduces for real external installs — the monorepo's own dev loop skips this code path via `postinstall.js`'s `isMonorepo` guard, which is why it wasn't caught before publishing `2.0.0-beta.0`. ([#337](https://github.com/FormidableLabs/react-native-ama/pull/337))

## 2.0.0-beta.0

### Major Changes

- v2.0 release: removes `@react-native-ama/internal` (inlined into each consuming package) and retires `@react-native-ama/react-native`. Restructures `ama.config.json` — `highlight` becomes a nested object (`mode`, `borderWidth`, `gap`); `log` is removed as a standalone key; `checks` scopes feature gates and `delay`. Adds the new `@react-native-ama/bottom-sheet` package. ([#327](https://github.com/FormidableLabs/react-native-ama/pull/327))

### Patch Changes

- fix: export for repack ([#328](https://github.com/FormidableLabs/react-native-ama/pull/328))

## 1.2.1

### Patch Changes

- Updated dependencies []:
  - @react-native-ama/internal@1.2.1

## 1.2.0

### Patch Changes

- add export for `AutofocusContainerProps` type from `core` package ([#272](https://github.com/FormidableLabs/react-native-ama/pull/272))

- Updated dependencies []:
  - @react-native-ama/internal@1.2.0

## 1.1.4

### Patch Changes

- Added `touchableContainerAccessibilityProps` prop to `AutofocusContainer` to fix issue with accessible view on container ([#300](https://github.com/FormidableLabs/react-native-ama/pull/300))

- Updated dependencies [[`d35a59475facdf70f5ea2e400f877fd5b62fb0c0`](https://github.com/FormidableLabs/react-native-ama/commit/d35a59475facdf70f5ea2e400f877fd5b62fb0c0)]:
  - @react-native-ama/internal@1.1.4

## 1.1.3

### Patch Changes

- Updated dependencies [[`460e339cdd68ab243daf5e8f197dec9bd4d6a8d0`](https://github.com/FormidableLabs/react-native-ama/commit/460e339cdd68ab243daf5e8f197dec9bd4d6a8d0)]:
  - @react-native-ama/internal@1.1.3

## 1.1.2

### Patch Changes

- fix config/rules file generation ([#289](https://github.com/FormidableLabs/react-native-ama/pull/289))

- Updated dependencies [[`4fb505181840a0ab5914f7abbd08009a4c0909ea`](https://github.com/FormidableLabs/react-native-ama/commit/4fb505181840a0ab5914f7abbd08009a4c0909ea)]:
  - @react-native-ama/internal@1.1.2

## 1.1.1

### Patch Changes

- Added `suppressError` to `forms` package Form provider ([#274](https://github.com/FormidableLabs/react-native-ama/pull/274))

- Updated dependencies [[`4c437e9529bb414c79e8b3227121098a39a5fa78`](https://github.com/FormidableLabs/react-native-ama/commit/4c437e9529bb414c79e8b3227121098a39a5fa78)]:
  - @react-native-ama/internal@1.1.1

## 1.1.0

### Minor Changes

- Added Carousel and useCarousel to extras package ([#259](https://github.com/FormidableLabs/react-native-ama/pull/259))

- Removed ListWrapper and corresponding native module allowing `lists` package to be used in expo apps ([#269](https://github.com/FormidableLabs/react-native-ama/pull/269))

### Patch Changes

- Removed babel.config ([#253](https://github.com/FormidableLabs/react-native-ama/pull/253))

- Updated dependencies [[`fce6630cb65b02ffa27453dd5ed4eaf7faf3dcc5`](https://github.com/FormidableLabs/react-native-ama/commit/fce6630cb65b02ffa27453dd5ed4eaf7faf3dcc5), [`71cb3128eb5bc6efc41804e5dbe23441fb3cd84e`](https://github.com/FormidableLabs/react-native-ama/commit/71cb3128eb5bc6efc41804e5dbe23441fb3cd84e)]:
  - @react-native-ama/internal@1.1.0

## 1.0.1

### Patch Changes

- Changeset changes for release ([#249](https://github.com/FormidableLabs/react-native-ama/pull/249))

- Updated dependencies [[`399cd815d9ea5339cb9e722aa9a1b66cdba1ab80`](https://github.com/FormidableLabs/react-native-ama/commit/399cd815d9ea5339cb9e722aa9a1b66cdba1ab80)]:
  - @react-native-ama/internal@1.0.1

## 1.0.0

### Major Changes

- Convert to monorepo ([`7ee436a`](https://github.com/FormidableLabs/react-native-ama/commit/7ee436a6c6cce5b68ed265d434890e9c854b24e3))

### Patch Changes

- Updated dependencies [[`7ee436a`](https://github.com/FormidableLabs/react-native-ama/commit/7ee436a6c6cce5b68ed265d434890e9c854b24e3)]:
  - @react-native-ama/internal@1.0.0
