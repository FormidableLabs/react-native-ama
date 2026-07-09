---
'@react-native-ama/core': patch
---

fix: postinstall script crashed on every external install with `Cannot find module './../dist/scripts/create-config.js'`. `create-config.ts` lived outside `src/`, so `tsconfig.build.json` (which only compiles `src/**/*`) never built it into `dist/scripts/create-config.js`. Moved the script into `src/scripts/` so it's included in the normal build. Only reproduces for real external installs — the monorepo's own dev loop skips this code path via `postinstall.js`'s `isMonorepo` guard, which is why it wasn't caught before publishing `2.0.0-beta.0`.
